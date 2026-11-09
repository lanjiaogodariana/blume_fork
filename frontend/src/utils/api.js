// frontend/src/utils/api.js
// Single source of truth for the backend URL and common fetch helpers.
// Import from here instead of hardcoding http://localhost:5000 in every page.

// Read from .env (VITE_API_URL). Falls back to localhost for dev.
// Trailing slashes are stripped so "/api/products" + "http://host/" doesn't double up.
export const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// Resolves a product image_url to a usable URL.
//   null / undefined / ""        → null (callers should render a placeholder)
//   "http://..." or "https://"   → unchanged
//   "/assets/..."                → unchanged (root-relative)
//   "assets/..."                 → prefixed with "/"
//   " assets/x.webp " (spaces)   → trimmed before returning
export function getImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

// --- internal: turn a fetch Response into JSON or throw a useful Error ---
async function handleResponse(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null; // non-JSON (HTML error page, empty body, etc.)
  }
  if (!res.ok) {
    const message = (body && body.error) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return body;
}

export async function apiGet(path, { headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, { method: "GET", headers });
  return handleResponse(res);
}

export async function apiPost(path, body, { headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}
