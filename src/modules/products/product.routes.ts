import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth, requireRole, type AuthenticatedUser } from "../../middleware/auth";
import { getDb } from "../../db";
import {categories} from "../../db/schema/products";
import { products } from "../../db/schema/products";
import {eq, like , gte,lte, and} from "drizzle-orm";

// 1. Define that Hono has a custom variable named "user"
type Variables = {
  user: AuthenticatedUser;
};

const productRoutes = new Hono<{ Bindings: Env; Variables: Variables;}>();

// Public endpoints
productRoutes.get("/categories", async (c) => {
  // TODO: List all categories

  //Quering categories from the database and returning them in the response
  const db = getDb(c.env);

  const allCategories = await db.select().from(categories);

  return c.json({ message: "List categories endpoint", categories: allCategories });
});

productRoutes.get("/", async (c) => {
  // TODO: Browse products with search, filters, pagination
  const { search, category, minPrice, maxPrice, page = "1", limit = "20" } = c.req.query();
  // Parse numbers - they come in as strings from the query parameters
  const pageNum = parseInt(page)
  const limitNum = parseInt(limit)
  const offset = (pageNum - 1) * limitNum;

  // Build conditions based on provided filters
  const conditions = [];
  if (search) conditions.push(like(products.title, `%${search}%`));
  if (category) conditions.push(eq(products.categoryId, category));
  if (minPrice) conditions.push(gte(products.price, parseFloat(minPrice)));
  if (maxPrice) conditions.push(lte(products.price, parseFloat(maxPrice)));

  // always show only active products
  conditions.push(eq(products.status, "active"));

  // Run the query with the built conditions and pagination
  const db = getDb(c.env)
  const allProducts = await db.select().from(products).where(and(...conditions)).limit(limitNum).offset(offset);
  return c.json({data : allProducts, page: pageNum, limit:limitNum });
});

productRoutes.get("/:id", async (c) => {
  // TODO: Get product detail
  const db = getDb(c.env);

  const id = c.req.param("id")
  // find active product by id
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.id, id),
      eq(products.status, "active")
    )
  });

  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }
  return c.json({ data: product });
});

// Seller-only endpoints
productRoutes.post("/", requireAuth(), requireRole("seller"), async (c) => {
  // TODO: Create product listing
  const db = getDb(c.env);

  // check who is making this request?
  const user = c.get("user") as AuthenticatedUser;
  // what are they sending
  const body = await c.req.json();

  const {title, description, price, categoryId, stockQuantity, location } = body;

  // validate the required fields
  if(!title || !price || !categoryId || !stockQuantity||!description) {
    return c.json({ error: "title, price ,categoryId, stockQuantity and description are required" }, 400);
  }

  // Insert into DB
  const [newProduct] = await db.insert(products).values({
    id: crypto.randomUUID(),
    sellerId: user.id,
    title,
    description,
    price,
    categoryId,
    stockQuantity,
    location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
  }).returning();

  // Return the created product
  return c.json({ data: newProduct }, 201);
});

productRoutes.put("/:id", requireAuth(), requireRole("seller"), async (c) => {
  // TODO: Update product listing
  const db = getDb(c.env);
  const sellerId = c.get("user") as AuthenticatedUser;
  const id = c.req.param("id")
  const body = await c.req.json();

  // Check if the product exists and belongs to the seller
  const existingProducts = await db.query.products.findFirst({
    where: and(
      eq(products.id, id),
      eq(products.sellerId, sellerId.id)
    )
  })

  if (!existingProducts) {
    return c.json({ error: "Product not found or you don't have permission to edit this product" }, 404);
  }
  // update only the fields that are sent in the request body
  const [updatedProduct] = await db.update(products).set({
    title: body.title ?? existingProducts.title,
    description: body.description ?? existingProducts.description,
    price: body.price ?? existingProducts.price,
    categoryId: body.categoryId ?? existingProducts.categoryId,
    stockQuantity: body.stockQuantity ?? existingProducts.stockQuantity,
    location: body.location ?? existingProducts.location,
    updatedAt: new Date().toISOString(),
  }).where(and(
    eq(products.id, id),
    eq(products.sellerId, sellerId.id)
  )).returning();
  return c.json({ data: updatedProduct });
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
