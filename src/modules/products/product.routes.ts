import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth, requireRole } from "../../middleware/auth";

const productRoutes = new Hono<{ Bindings: Env }>();

// Public endpoints
productRoutes.get("/categories", async (c) => {
  // TODO: List all categories
  return c.json({ message: "List categories endpoint" });
});

productRoutes.get("/", async (c) => {
  // TODO: Browse products with search, filters, pagination
  const { search, category, minPrice, maxPrice, page = "1", limit = "20" } = c.req.query();
  
  return c.json({ message: "Browse products endpoint" });
});

productRoutes.get("/:id", async (c) => {
  // TODO: Get product detail
  return c.json({ message: "Get product detail endpoint" });
});

// Seller-only endpoints
productRoutes.post("/", requireAuth(), requireRole("seller"), async (c) => {
  // TODO: Create product listing
  return c.json({ message: "Create product endpoint" });
});

productRoutes.put("/:id", requireAuth(), requireRole("seller"), async (c) => {
  // TODO: Update product listing
  return c.json({ message: "Update product endpoint" });
});

productRoutes.delete("/:id", requireAuth(), requireRole("seller"), async (c) => {
  // TODO: Delete product listing
  return c.json({ message: "Delete product endpoint" });
});

productRoutes.patch("/:id/status", requireAuth(), requireRole("seller"), async (c) => {
  // TODO: Mark product as active/inactive/out_of_stock
  return c.json({ message: "Update product status endpoint" });
});

// Reviews
productRoutes.get("/:id/reviews", async (c) => {
  // TODO: Get product reviews
  return c.json({ message: "Get reviews endpoint" });
});

// Wishlist
productRoutes.get("/wishlist", requireAuth(), async (c) => {
  // TODO: Get user's wishlist
  return c.json({ message: "Get wishlist endpoint" });
});

productRoutes.post("/wishlist", requireAuth(), async (c) => {
  // TODO: Add product to wishlist
  return c.json({ message: "Add to wishlist endpoint" });
});

productRoutes.delete("/wishlist/:productId", requireAuth(), async (c) => {
  // TODO: Remove from wishlist
  return c.json({ message: "Remove from wishlist endpoint" });
});

export { productRoutes };
