// server.js
// Express backend for Blume. Connects to local XAMPP MySQL (blume_db).
// Security model:
//   - POST /api/orders re-fetches prices from DB; client price is ignored.
//   - GET  /api/orders requires an X-Admin-Key header matching ADMIN_PASSCODE.
//   - CORS is restricted to FRONTEND_URL.
//   - Every successful order appends a line to logs/orders.log (not HTTP-served).

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const rateLimit = require("express-rate-limit");

const app = express();

const fs = require("fs");
const path = require("path");

// --- Middleware ---
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// --- DB Pool ---
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "blume_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- Admin auth ---
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;
if (!ADMIN_PASSCODE) {
  console.warn(
    "⚠️  ADMIN_PASSCODE not set in .env — admin endpoints will reject all requests until configured.",
  );
}

function requireAdmin(req, res, next) {
  if (!ADMIN_PASSCODE) {
    return res
      .status(503)
      .json({ error: "Admin access not configured on server." });
  }
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_PASSCODE) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// --- Rate limiters ---
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 orders per IP per minute
  message: { error: "Too many orders — please wait a moment and try again." },
});

const adminVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 passcode attempts per 5 min (prevents brute force)
  message: { error: "Too many attempts. Try again in a few minutes." },
});

// --- 1. GET /api/products ---
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, price, image_url, image_url_2, image_url_3, description, colors, sizes FROM products ORDER BY id DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// --- 2. GET /api/products/:id ---
app.get("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const [rows] = await db.query(
      "SELECT id, name, price, image_url, image_url_2, image_url_3, description, colors, sizes FROM products WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// --- 3. POST /api/admin/verify ---
// Accepts a passcode. Returns { valid: true } if it matches ADMIN_PASSCODE.
// Client then reuses the same passcode as X-Admin-Key on subsequent requests.
app.post("/api/admin/verify", adminVerifyLimiter, (req, res) => {
  const { passcode } = req.body || {};
  if (!ADMIN_PASSCODE) {
    return res
      .status(503)
      .json({ error: "Admin access not configured on server." });
  }
  if (typeof passcode === "string" && passcode === ADMIN_PASSCODE) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ error: "Invalid passcode" });
});

// --- 4. POST /api/orders ---
// Client sends customer info + items (id, size, color, quantity).
// Server IGNORES price and total from the body and recomputes them from the DB.
app.post("/api/orders", orderLimiter, async (req, res) => {
  const { user_name, user_email, phone, shipping_address, items } =
    req.body || {};

  // --- Customer info validation ---
  if (
    !user_name ||
    typeof user_name !== "string" ||
    user_name.trim().length < 2
  ) {
    return res
      .status(400)
      .json({ error: "Valid user name is required (minimum 2 characters)." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user_email || !emailRegex.test(String(user_email).trim())) {
    return res
      .status(400)
      .json({ error: "A valid email address is required." });
  }

  if (
    !shipping_address ||
    typeof shipping_address !== "string" ||
    shipping_address.trim().length < 10
  ) {
    return res
      .status(400)
      .json({ error: "A complete shipping address is required." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Order must contain at least one product item." });
  }

  // --- Normalize + validate items ---
  // Size / color are truncated to schema limits. Null/undefined → "Standard".
  const cleanItems = items.map((it) => ({
    id: Number(it.id),
    size:
      String(it.size || "Standard")
        .trim()
        .slice(0, 10) || "Standard",
    color:
      String(it.color || "Standard")
        .trim()
        .slice(0, 30) || "Standard",
    quantity: Number(it.quantity),
  }));

  if (cleanItems.some((it) => !Number.isInteger(it.id) || it.id <= 0)) {
    return res.status(400).json({ error: "Invalid product ID in items." });
  }
  if (
    cleanItems.some((it) => !Number.isInteger(it.quantity) || it.quantity <= 0)
  ) {
    return res.status(400).json({
      error: "Invalid quantity in items (must be a positive integer).",
    });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // --- Persistent order log (durable record; replaces PHP's email_logs.txt) ---
    // Written to backend/logs/orders.log, which is never served over HTTP.
    try {
      const logDir = path.join(__dirname, "logs");
      if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
      const logLine =
        `[${new Date().toISOString()}] Order #${orderId} | ` +
        `${String(user_email).trim()} | ` +
        `${itemsWithRealPrice.length} item(s) | ` +
        `Total $${realTotal.toFixed(2)}\n`;
      fs.appendFileSync(path.join(logDir, "orders.log"), logLine);
    } catch (logErr) {
      // Never fail an order because of a logging error
      console.error("Order log write failed:", logErr.message);
    }

    // --- Re-fetch authoritative prices from DB ---
    const uniqueIds = [...new Set(cleanItems.map((it) => it.id))];
    const placeholders = uniqueIds.map(() => "?").join(",");
    const [productRows] = await connection.execute(
      `SELECT id, price FROM products WHERE id IN (${placeholders})`,
      uniqueIds,
    );
    const priceMap = Object.fromEntries(
      productRows.map((r) => [Number(r.id), Number(r.price)]),
    );

    // --- Compute real total from server-side prices ---
    let realTotal = 0;
    const itemsWithRealPrice = cleanItems.map((it) => {
      const realPrice = priceMap[it.id];
      if (realPrice === undefined) {
        throw new Error(`Product ${it.id} does not exist.`);
      }
      realTotal += realPrice * it.quantity;
      return {
        id: it.id,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        price: realPrice,
      };
    });

    if (realTotal <= 0) {
      throw new Error("Order total must be greater than zero.");
    }

    // --- Insert order ---
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_name, user_email, phone, shipping_address, total_amount) VALUES (?, ?, ?, ?, ?)",
      [
        user_name.trim(),
        String(user_email).trim(),
        phone ? String(phone).trim() : "",
        shipping_address.trim(),
        realTotal,
      ],
    );
    const orderId = orderResult.insertId;

    // --- Insert items with size + color persisted ---
    for (const item of itemsWithRealPrice) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, size, color, quantity, price) VALUES (?, ?, ?, ?, ?, ?)",
        [orderId, item.id, item.size, item.color, item.quantity, item.price],
      );
    }

    await connection.commit();
    res.status(201).json({
      message: "Order created successfully",
      orderId,
      total_amount: realTotal,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Order transaction failed:", err.message);
    const knownErrors = ["does not exist", "must be greater than zero"];
    const isKnown = knownErrors.some((msg) => err.message.includes(msg));
    res.status(isKnown ? 400 : 500).json({
      error: isKnown ? err.message : "Database error processing order",
    });
  } finally {
    connection.release();
  }
});

// --- 5. GET /api/orders (admin only) ---
app.get("/api/orders", requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.id AS order_id,
        o.user_name,
        o.user_email,
        o.phone,
        o.shipping_address,
        o.total_amount,
        o.created_at,
        oi.id AS item_id,
        oi.product_id,
        oi.size,
        oi.color,
        oi.quantity,
        oi.price AS item_price,
        p.name AS product_name,
        p.image_url
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.id DESC
    `);

    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          user_name: row.user_name || "Guest",
          user_email: row.user_email || "N/A",
          phone: row.phone || "",
          shipping_address: row.shipping_address || "",
          total_amount: row.total_amount || 0,
          created_at: row.created_at,
          items: [],
        };
      }
      if (row.item_id) {
        ordersMap[row.order_id].items.push({
          id: row.item_id,
          product_id: row.product_id,
          name: row.product_name || "Unknown Product",
          size: row.size || null,
          color: row.color || null,
          quantity: row.quantity,
          price: row.item_price,
          image_url: row.image_url,
        });
      }
    });

    res.json(Object.values(ordersMap));
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders from database" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!ADMIN_PASSCODE) {
    console.warn(
      "   ⚠️  Admin endpoints disabled — set ADMIN_PASSCODE in .env",
    );
  }
});
