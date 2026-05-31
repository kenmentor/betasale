import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../../config/env";
import {
  requireAuth,
  requireRole,
  type AuthenticatedUser,
} from "../../middleware/auth";
import { getDb } from "../../db";
import {
  products,
  categories,
  reviews,
  wishlist,
} from "../../db/schema/products";
import { orders, orderItems } from "../../db/schema/orders";
import { eq, like, gte, lte, and, count } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variables = {
  user: AuthenticatedUser;
};

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

/**
 * Browse products: all query-param types are coerced and bounded so that
 * a bad actor sending ?page=abc or ?minPrice=1e999 never corrupts a DB query.
 */
const BrowseQuerySchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().uuid("category must be a valid UUID").optional(),
  minPrice: z.coerce.number().finite().nonnegative().optional(),
  maxPrice: z.coerce.number().finite().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Enforces fintech-grade field integrity on product creation/update.
 * price and stockQuantity are strict on the Zod layer — never rely on SQLite
 * loose typing to reject garbage values.
 */
const CreateProductSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  price: z
    .number()
    .finite()
    .positive("price must be a positive number")
    .max(100000000, "price exceeds allowed maximum"),
  categoryId: z.string().uuid("categoryId must be a valid UUID"),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("stockQuantity cannot be negative")
    .max(100000, "stock quantity exceeds allowed maximum"),
  location: z.string().max(300).optional(),
});

const UpdateProductSchema = CreateProductSchema.partial();

const StatusSchema = z.object({
  status: z.enum(["active", "inactive", "out_of_stock"]),
});

const WishlistSchema = z.object({
  productId: z.string().uuid("productId must be a valid UUID"),
});

const ReviewSchema = z.object({
  orderId: z.string().uuid("orderId must be a valid UUID"),
  rating: z
    .number()
    .int()
    .min(1, "rating must be between 1 and 5")
    .max(5, "rating must be between 1 and 5"),
  text: z.string().max(2000).optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────

const productRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── GET /categories ────────────────────────────────────────────────────────────
productRoutes.get("/categories", async (c) => {
  const db = getDb(c.env);
  const allCategories = await db.select().from(categories);
  return c.json({ data: allCategories });
});

// ── GET / — browse products with search, filters, and pagination ───────────────
productRoutes.get("/", async (c) => {
  // 1. Parse and validate all query params at the boundary — never trust raw strings.
  const parsed = BrowseQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 422);
  }
  const { search, category, minPrice, maxPrice, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  // 2. Build conditions
  const conditions = [eq(products.status, "active")];
  if (search) conditions.push(like(products.title, `%${search}%`));
  if (category) conditions.push(eq(products.categoryId, category));
  if (minPrice !== undefined) conditions.push(gte(products.price, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(products.price, maxPrice));

  const where = and(...conditions);
  const db = getDb(c.env);

  // 3. Fetch data and total count in a single atomic batch — one round-trip to D1.
  //    This prevents read-after-write lag from affecting the count vs. data mismatch.
  const [rows, [{ total }]] = await db.batch([
    db.select().from(products).where(where).limit(limit).offset(offset),
    db.select({ total: count() }).from(products).where(where),
  ]);

  return c.json({
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ── GET /:id — product detail ──────────────────────────────────────────────────
productRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!z.string().uuid().safeParse(id).success) {
    return c.json({ error: "Invalid product ID" }, 400);
  }
  const db = getDb(c.env);
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.status, "active")),
  });
  if (!product) return c.json({ error: "Product not found" }, 404);
  return c.json({ data: product });
});

// ═══════════════════════════════════════════════════════════════════════════════
// WISHLIST (authenticated buyers)
// ═══════════════════════════════════════════════════════════════════════════════

// ── GET /wishlist ──────────────────────────────────────────────────────────────
productRoutes.get("/wishlist", requireAuth(), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const items = await db.query.wishlist.findMany({
    where: eq(wishlist.userId, user.id),
    with: { product: true },
  });
  return c.json({ data: items });
});

// ── POST /wishlist ─────────────────────────────────────────────────────────────
productRoutes.post("/wishlist", requireAuth(), async (c) => {
  // 1. Validate body
  const body = await c.req.json().catch(() => null);
  const parsed = WishlistSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 422);
  }
  const { productId } = parsed.data;
  const user = c.get("user");
  const db = getDb(c.env);

  // 2. Confirm product exists and is active
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.status, "active")),
  });
  if (!product) return c.json({ error: "Product not found" }, 404);

  // 3. Atomic upsert — requires a UNIQUE(userId, productId) composite index on
  //    the wishlist table in your Drizzle schema. This collapses the previous
  //    check-then-insert TOCTOU race into a single DB round-trip. Under high
  //    concurrency, only one insert wins; the rest silently no-op.
  const [item] = await db
    .insert(wishlist)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      productId,
      createdAt: new Date().toISOString(),
    })
    .onConflictDoNothing() // ← atomic: relies on UNIQUE(userId, productId) index
    .returning();

  // 4. If onConflictDoNothing absorbed the insert, the row already existed.
  if (!item) {
    return c.json({ error: "Product already in wishlist" }, 409);
  }
  return c.json({ data: item }, 201);
});

// ── DELETE /wishlist/:productId ────────────────────────────────────────────────
productRoutes.delete("/wishlist/:productId", requireAuth(), async (c) => {
  const productId = c.req.param("productId");
  if (!z.string().uuid().safeParse(productId).success) {
    return c.json({ error: "Invalid product ID" }, 400);
  }
  const user = c.get("user");
  const db = getDb(c.env);

  // Ownership check before delete — BOLA: userId always comes from JWT, never body.
  const existing = await db.query.wishlist.findFirst({
    where: and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)),
  });
  if (!existing) return c.json({ error: "Item not found in wishlist" }, 404);

  await db
    .delete(wishlist)
    .where(
      and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId))
    );
  return c.json({ message: "Removed from wishlist" });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SELLER ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── POST / — create a product listing ─────────────────────────────────────────
productRoutes.post("/", requireAuth(), requireRole("seller"), async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = CreateProductSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 422);
  }
  const user = c.get("user");
  const db = getDb(c.env);

  // Validate that the category exists before inserting
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, parsed.data.categoryId),
  });
  if (!category) {
    return c.json({ error: "Category not found" }, 404);
  }

  // sellerId is always sourced from the verified JWT — never from the request body.
  // Auto-set status to out_of_stock if stockQuantity is 0 at creation time.
  const [newProduct] = await db
    .insert(products)
    .values({
      id: crypto.randomUUID(),
      sellerId: user.id,
      ...parsed.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: parsed.data.stockQuantity === 0 ? "out_of_stock" : "active",
    })
    .returning();

  return c.json({ data: newProduct }, 201);
});

// ── PUT /:id — update a product listing ───────────────────────────────────────
productRoutes.put("/:id", requireAuth(), requireRole("seller"), async (c) => {
  const id = c.req.param("id");
  if (!z.string().uuid().safeParse(id).success) {
    return c.json({ error: "Invalid product ID" }, 400);
  }

  const body = await c.req.json().catch(() => null);
  const parsed = UpdateProductSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten().fieldErrors }, 422);
  }
  if (Object.keys(parsed.data).length === 0) {
    return c.json({ error: "No fields provided for update" }, 400);
  }

  const user = c.get("user");
  const db = getDb(c.env);

  // Validate category exists if it is being changed
  if (parsed.data.categoryId) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, parsed.data.categoryId),
    });
    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }
  }

  // Ownership check: seller can only edit their own products (BOLA).
  const existing = await db.query.products.findFirst({
    where: and(eq(products.id, id), eq(products.sellerId, user.id)),
  });
  if (!existing) {
    return c.json(
      { error: "Product not found or you do not have permission to edit it" },
      404
    );
  }

  // Auto-sync status when stockQuantity is updated:
  //   0           → out_of_stock
  //   > 0         → active  (never override an intentional "inactive")
  // We only touch status if stockQuantity is explicitly part of this update.
  const updatePayload: Record<string, unknown> = {
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  if (parsed.data.stockQuantity !== undefined) {
    updatePayload.status =
      parsed.data.stockQuantity === 0 ? "out_of_stock" : "active";
  }

  const [updatedProduct] = await db
    .update(products)
    .set(updatePayload)
    .where(and(eq(products.id, id), eq(products.sellerId, user.id)))
    .returning();

  return c.json({ data: updatedProduct });
});

// ── DELETE /:id — delete a product listing ────────────────────────────────────
productRoutes.delete(
  "/:id",
  requireAuth(),
  requireRole("seller"),
  async (c) => {
    const id = c.req.param("id");
    if (!z.string().uuid().safeParse(id).success) {
      return c.json({ error: "Invalid product ID" }, 400);
    }
    const user = c.get("user");
    const db = getDb(c.env);

    // Ownership check before delete (BOLA).
    const existing = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.sellerId, user.id)),
    });
    if (!existing) return c.json({ error: "Product not found" }, 404);

    await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.sellerId, user.id)));

    return c.json({ message: "Product deleted successfully" });
  }
);

// ── PATCH /:id/status — mark product as active / inactive / out_of_stock ──────
productRoutes.patch(
  "/:id/status",
  requireAuth(),
  requireRole("seller"),
  async (c) => {
    const id = c.req.param("id");
    if (!z.string().uuid().safeParse(id).success) {
      return c.json({ error: "Invalid product ID" }, 400);
    }

    const body = await c.req.json().catch(() => null);
    const parsed = StatusSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          error:
            "Invalid status. Must be one of: active, inactive, out_of_stock",
        },
        422
      );
    }

    const user = c.get("user");
    const db = getDb(c.env);

    // Ownership check (BOLA).
    const existing = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.sellerId, user.id)),
    });
    if (!existing) return c.json({ error: "Product not found" }, 404);

    const [updatedProduct] = await db
      .update(products)
      .set({ status: parsed.data.status, updatedAt: new Date().toISOString() })
      .where(and(eq(products.id, id), eq(products.sellerId, user.id)))
      .returning();

    return c.json({ data: updatedProduct });
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── GET /:id/reviews — list reviews for a product ─────────────────────────────
productRoutes.get("/:id/reviews", async (c) => {
  const productId = c.req.param("id");
  if (!z.string().uuid().safeParse(productId).success) {
    return c.json({ error: "Invalid product ID" }, 400);
  }
  const db = getDb(c.env);
  const allReviews = await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    with: { buyer: { columns: { id: true, name: true } } },
  });

  const avgRating =
    allReviews.length > 0
      ? parseFloat(
        (
          allReviews.reduce((sum, r) => sum + r.rating, 0) /
          allReviews.length
        ).toFixed(1)
      )
      : 0;

  return c.json({
    data: {
      reviews: allReviews,
      averageRating: avgRating,
      total: allReviews.length,
    },
  });
});

// ── POST /:id/reviews — submit a review (buyer who purchased only) ─────────────
productRoutes.post(
  "/:id/reviews",
  requireAuth(),
  requireRole("buyer"),
  async (c) => {
    const productId = c.req.param("id");
    if (!z.string().uuid().safeParse(productId).success) {
      return c.json({ error: "Invalid product ID" }, 400);
    }

    const body = await c.req.json().catch(() => null);
    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten().fieldErrors }, 422);
    }
    const { orderId, rating, text } = parsed.data;
    const user = c.get("user");
    const db = getDb(c.env);

    // Purchase verification — two explicit queries, no Drizzle relation config needed.
    //
    // Step 1: confirm this specific product was part of the supplied order.
    //   orders has no productId column — products live on orderItems.
    const purchasedItem = await db.query.orderItems.findFirst({
      where: and(
        eq(orderItems.orderId, orderId),
        eq(orderItems.productId, productId)
      ),
      columns: { id: true }, // we only need existence, not the full row
    });

    if (!purchasedItem) {
      return c.json(
        { error: "You must have purchased this product to leave a review" },
        403
      );
    }

    // Step 2: confirm the order belongs to this authenticated buyer AND is in a
    //   reviewable state. Querying orders directly — fully typed, no relation needed.
    const reviewableStatuses = [
      "delivered",
      "completed",
      "escrow_released",
    ] as const;

    const order = await db.query.orders.findFirst({
      where: and(
        eq(orders.id, orderId),
        eq(orders.buyerId, user.id) // BOLA guard: this order must belong to the caller
      ),
      columns: { id: true, status: true },
    });

    if (!order) {
      return c.json(
        { error: "You must have purchased this product to leave a review" },
        403
      );
    }

    if (!(reviewableStatuses as readonly string[]).includes(order.status)) {
      return c.json(
        { error: "You can only review a delivered or completed order" },
        403
      );
    }

    // Step 3: prevent duplicate reviews from the same buyer on the same product.
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.buyerId, user.id)
      ),
      columns: { id: true },
    });
    if (existingReview) {
      return c.json(
        { error: "You have already reviewed this product" },
        409
      );
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        id: crypto.randomUUID(),
        productId,
        buyerId: user.id,
        orderId,
        rating,
        text: text ?? null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return c.json({ data: newReview }, 201);
  }
);

// ── DELETE /:id/reviews/:reviewId — buyer deletes their own review ─────────────
productRoutes.delete(
  "/:id/reviews/:reviewId",
  requireAuth(),
  requireRole("buyer"),
  async (c) => {
    const productId = c.req.param("id");
    const reviewId = c.req.param("reviewId");

    if (
      !z.string().uuid().safeParse(productId).success ||
      !z.string().uuid().safeParse(reviewId).success
    ) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const user = c.get("user");
    const db = getDb(c.env);

    // Ownership check: all three conditions required (BOLA).
    const existing = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.id, reviewId),
        eq(reviews.productId, productId),
        eq(reviews.buyerId, user.id)
      ),
    });
    if (!existing) {
      return c.json(
        {
          error: "Review not found or you do not have permission to delete it",
        },
        404
      );
    }

    await db
      .delete(reviews)
      .where(
        and(
          eq(reviews.id, reviewId),
          eq(reviews.productId, productId),
          eq(reviews.buyerId, user.id)
        )
      );

    return c.json({ message: "Review deleted successfully" });
  }
);

// ─── Export (must always be the last line) ────────────────────────────────────
export { productRoutes };