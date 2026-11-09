// server.js / routes.js
// basic express routing - GET requests to load products, POST for login and checkout.
// express.json() middleware - need this so we can actually read the JSON data sent from the frontend fetch().
// mongoDB connection - swapped out the old local XAMPP MySQL for MongoDB Atlas. Way easier to just dump flexible fashion data (like different sizes/colors) into documents instead of strict SQL tables.

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Default XAMPP MySQL password is empty
  database: "blume_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 1. GET /api/products - Fetch all products
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 2. GET /api/products/:id - Fetch a single product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// 3. POST /api/orders - Submit a new order (Transaction + Validation)
app.post("/api/orders", async (req, res) => {
  const {
    user_name,
    user_email,
    phone,
    shipping_address,
    total_amount,
    items,
  } = req.body;

  // Validation Guards
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
  if (!user_email || !emailRegex.test(user_email.trim())) {
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

  if (!total_amount || isNaN(total_amount) || Number(total_amount) <= 0) {
    return res.status(400).json({ error: "Invalid order total amount." });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_name, user_email, phone, shipping_address, total_amount) VALUES (?, ?, ?, ?, ?)",
      [
        user_name.trim(),
        user_email.trim(),
        phone ? phone.trim() : "",
        shipping_address.trim(),
        total_amount,
      ],
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      if (!item.id || !item.quantity || !item.price) {
        throw new Error("Invalid item data payload.");
      }

      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price],
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (err) {
    await connection.rollback();
    console.error("Error executing transaction:", err);
    res.status(500).json({ error: "Database error processing order" });
  } finally {
    connection.release();
  }
});

// 4. GET /api/orders - Fetch all orders for Admin Dashboard
app.get("/api/orders", async (req, res) => {
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
