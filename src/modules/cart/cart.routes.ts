// WHY these import choices:
// - `and` from drizzle-orm: required to combine multiple WHERE conditions
//   (userId AND itemId). Without it, BOLA protection on PUT/DELETE is impossible.
// - `sql` from drizzle-orm: imported but reserved for future use if we need
//   raw SQL expressions in upserts (e.g., MIN(col + val, cap)).
// - `z` from zod: runtime type validation. TypeScript types are erased at
//   runtime — Zod is the ONLY thing standing between user input and your DB.
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { Env } from "../../config/env";
import type { AuthenticatedUser } from "../../middleware/auth";
import { requireAuth } from "../../middleware/auth";
import { getDb } from "../../db/index";
import { cartItems } from "../../db/schema/cart";
import { products } from "../../db/schema/products";

// WHY declare Variables locally (not inherit from parent app):
// Hono sub-routers are independent Hono instances — they do NOT inherit
// the parent app's generic type parameters. Without this, c.get("user")
// returns `unknown` inside every handler in this file.
type Variables = {
  user: AuthenticatedUser;
};

const cartRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// WHY apply auth middleware at the router level (not per-handler):
// All cart operations are user-specific and financially sensitive.
// One missed auth guard on a single handler = security hole.
// Applying it once here protects every current and future route
// in this file automatically.
cartRoutes.use("*", requireAuth());

// ─────────────────────────────────────────────────────────────────────────────
// Zod Schemas — defined once at module level, reused per route
// WHY Zod (not TypeScript types alone): TypeScript is erased at runtime.
// A malicious client can send `{ quantity: -999 }` and TypeScript won't
// stop it. Zod validates and rejects the request BEFORE it touches the DB.
// ─────────────────────────────────────────────────────────────────────────────

const addToCartSchema = z.object({
  productId: z.string().min(1, "productId is required"),

  // WHY int().min(1).max(99):
  // - int(): rejects 1.5, 2.7 — fractional quantities make no sense here
  // - min(1): quantity 0 has no meaning at add-time; use DELETE to remove
  // - max(99): hard cap per item — prevents a single user from hoarding
  //   an entire vendor's inventory in their cart before checkout
  quantity: z.number().int().min(1).max(99),

  // WHY optional (not required): Variant support is nullable in the DB.
  // variantId is reserved for future variant support — no variants table yet.
  variantId: z.string().min(1).optional(),
});

const updateQuantitySchema = z.object({
  // WHY min(1) (not min(0)):
  // Quantity 0 is semantically "remove this item." Allowing 0 here creates
  // API ambiguity. Force callers to use DELETE /items/:id for removal.
  // Separate intents should have separate endpoints — clean REST design.
  quantity: z.number().int().min(1).max(99),
});











// ─────────────────────────────────────────────────────────────────────────────
// GET /cart — Retrieve authenticated user's cart
// ─────────────────────────────────────────────────────────────────────────────
cartRoutes.get("/", async (c) => {
  // WHY from context only (BOLA prevention):
  // userId is derived from the cryptographically validated session token.
  // Accepting userId from query params or body = any user reads any cart.
  const user   = c.get("user");
  const userId = user.id;

  const db = getDb(c.env);

  try {
    // WHY LEFT JOIN (not INNER JOIN):
    // If a product was deleted after being added to cart, INNER JOIN silently
    // drops that row. The user has no idea their item disappeared.
    // LEFT JOIN returns null product columns — lets us flag "unavailable."
    const rows = await db
      .select({
        cartItemId:    cartItems.id,
        quantity:      cartItems.quantity,
        variantId:     cartItems.variantId,
        productId:     products.id,
        title:         products.title,
        price:         products.price,
        stockQuantity: products.stockQuantity,
        images:        products.images,
        status:        products.status,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    // WHY derive types from query result (not write manually):
    // `typeof rows[number]` auto-updates if columns change — no drift.
    type CartRow = (typeof rows)[number];

    const items = rows.map((row: CartRow) => {
      const productExists = row.productId !== null;
      const isAvailable   = productExists && row.status === "active";

      // WHY Math.round(x * 100) / 100:
      // SQLite `real` is IEEE 754 float. 1500.10 * 3 = 4500.299999...
      // This gives clean 2dp precision for NGN display.
      const lineTotal = isAvailable
        ? Math.round(row.quantity * (row.price ?? 0) * 100) / 100
        : 0;

      // WHY first image only: cart thumbnail vs full gallery — bandwidth savings
      // for Nigerian users on slow mobile connections.
      const primaryImage =
        Array.isArray(row.images) && row.images.length > 0
          ? row.images[0]
          : null;

      // WHY three statuses (not a boolean):
      // "out_of_stock" → "Notify me" UI
      // "unavailable"  → "Remove from cart" UI
      // A boolean collapses these into one undifferentiated state.
      let stockStatus: "in_stock" | "out_of_stock" | "unavailable";
      if (!productExists || row.status === "inactive") {
        stockStatus = "unavailable";
      } else if (row.status === "out_of_stock" || row.stockQuantity === 0) {
        stockStatus = "out_of_stock";
      } else {
        stockStatus = "in_stock";
      }

      return {
        cartItemId:  row.cartItemId,
        productId:   row.productId,
        variantId:   row.variantId ?? null,
        title:       row.title ?? "Product no longer available",
        primaryImage,
        unitPrice:   row.price ?? 0,
        quantity:    row.quantity,
        lineTotal,
        stockStatus,
      };
    });

    type CartItem = (typeof items)[number];

    // WHY subtotal excludes unavailable items:
    // Subtotal including items that can't be purchased misleads the user.
    const availableItems = items.filter(
      (i: CartItem) => i.stockStatus === "in_stock"
    );

    const subtotal =
      Math.round(
        availableItems.reduce(
          (sum: number, i: CartItem) => sum + i.lineTotal,
          0
        ) * 100
      ) / 100;

    // WHY 200 for empty cart (not 404):
    // An empty cart is valid. 404 = "resource does not exist" — wrong semantics.
    return c.json({
      success: true,
      data: {
        cart: {
          items,
          summary: {
            itemCount: items.reduce(
              (sum: number, i: CartItem) => sum + i.quantity,
              0
            ),
            subtotal,
            currency: "NGN",
            hasUnavailableItems: items.some(
              (i: CartItem) => i.stockStatus !== "in_stock"
            ),
          },
        },
      },
    });
  } catch (error) {
    console.error(`[GET /cart] userId=${userId} error:`, error);
    return c.json(
      { success: false, error: "INTERNAL_ERROR", message: "Failed to retrieve cart" },
      500
    );
  }
});
















// ─────────────────────────────────────────────────────────────────────────────
// POST /cart/items — Add item to cart (upsert: insert or increment quantity)
// ─────────────────────────────────────────────────────────────────────────────
cartRoutes.post("/items", async (c) => {
  const user   = c.get("user");
  const userId = user.id;

  // WHY parse body separately (not c.req.json() directly inline):
  // c.req.json() throws unhandled if body is malformed JSON. Wrapping it
  // gives us a controlled 400 response instead of an unhandled 500.
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, error: "BAD_REQUEST", message: "Request body must be valid JSON" },
      400
    );
  }

  const parsed = addToCartSchema.safeParse(body);
  if (!parsed.success) {
    // WHY return Zod field errors (not a generic message):
    // Frontend needs to know WHICH field failed and WHY to show the right UI.
    return c.json(
      {
        success: false,
        error:   "VALIDATION_ERROR",
        message: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      },
      422
    );
  }

  const { productId, quantity, variantId } = parsed.data;
  const db = getDb(c.env);

  try {
    // ── Step 1: Verify product exists, is active, and has sufficient stock ──
    // WHY check before upsert (not just upsert blindly):
    // We must never add inactive/deleted products to a cart. This is a soft
    // check — the authoritative stock enforcement is at POST /validate
    // and at order creation. But failing early here gives faster feedback.
    const product = await db
      .select({
        id:            products.id,
        status:        products.status,
        stockQuantity: products.stockQuantity,
      })
      .from(products)
      .where(eq(products.id, productId))
      .get(); // WHY .get() not .all(): we need exactly one row by primary key

    if (!product) {
      return c.json(
        { success: false, error: "NOT_FOUND", message: "Product not found" },
        404
      );
    }

    if (product.status !== "active") {
      return c.json(
        { success: false, error: "PRODUCT_UNAVAILABLE", message: "This product is not currently available" },
        422
      );
    }

    if (product.stockQuantity < quantity) {
      return c.json(
        {
          success:   false,
          error:     "INSUFFICIENT_STOCK",
          message:   `Only ${product.stockQuantity} unit(s) available`,
          available: product.stockQuantity,
        },
        422
      );
    }

    // ── Step 2: Check existing cart quantity for cap enforcement ────────────
    // WHY read before write (not just SQL MIN expression in onConflictDoUpdate):
    // Reading first lets us return a meaningful, specific response:
    // "Quantity adjusted to 99 (maximum per item)" vs silently capping.
    // Better UX, especially on slow mobile connections where users add
    // items incrementally.
    const existingItem = await db
      .select({ quantity: cartItems.quantity })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId,    userId),
          eq(cartItems.productId, productId)
        )
      )
      .get();

    const existingQty        = existingItem?.quantity ?? 0;
    const requestedTotal     = existingQty + quantity;
    const MAX_QTY_PER_ITEM   = 99;
    const wasCapped          = requestedTotal > MAX_QTY_PER_ITEM;
    const finalQty           = Math.min(requestedTotal, MAX_QTY_PER_ITEM);
    const now                = new Date().toISOString();

    // ── Step 3: Upsert ──────────────────────────────────────────────────────
    // WHY onConflictDoUpdate (not separate INSERT then UPDATE):
    // Atomic single operation — no race condition between existence check
    // and insert. REQUIRES the composite unique index on (user_id, product_id)
    // we added to the schema. Without that index, the conflict is never
    // detected and duplicate rows are created silently.
    await db
      .insert(cartItems)
      .values({
        // WHY crypto.randomUUID(): native to Cloudflare Workers — no
        // extra package needed. UUIDv4 is unpredictable, suitable for IDs
        // that will appear in URLs (DELETE /items/:id).
        id:        crypto.randomUUID(),
        userId,
        productId,
        variantId: variantId ?? null,
        quantity:  finalQty,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        // WHY target both columns (not just one):
        // Must match the composite unique index exactly.
        // If only userId were listed, Drizzle looks for a unique index
        // on userId alone — which doesn't exist — and throws.
        target: [cartItems.userId, cartItems.productId],
        set: {
          // WHY set finalQty directly (not sql additive expression):
          // We already computed and capped finalQty in application code.
          // Setting it directly is explicit and easy to reason about.
          quantity:  finalQty,
          updatedAt: now,
        },
      });

    return c.json(
      {
        success: true,
        message: wasCapped
          ? `Quantity adjusted to maximum allowed (${MAX_QTY_PER_ITEM})`
          : "Item added to cart",
        data: {
          productId,
          variantId: variantId ?? null,
          quantity:  finalQty,
          wasCapped,
        },
      },
      201
    );
  } catch (error) {
    console.error(`[POST /cart/items] userId=${userId} productId=${productId} error:`, error);
    return c.json(
      { success: false, error: "INTERNAL_ERROR", message: "Failed to add item to cart" },
      500
    );
  }
});















// ─────────────────────────────────────────────────────────────────────────────
// PUT /cart/items/:id — Update quantity of a specific cart item
// ─────────────────────────────────────────────────────────────────────────────
cartRoutes.put("/items/:id", async (c) => {
  const user   = c.get("user");
  const userId = user.id;
  const itemId = c.req.param("id");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, error: "BAD_REQUEST", message: "Request body must be valid JSON" },
      400
    );
  }

  const parsed = updateQuantitySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error:   "VALIDATION_ERROR",
        message: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      },
      422
    );
  }

  const { quantity } = parsed.data;
  const db = getDb(c.env);

  try {
    // ── BOLA ownership check — runs BEFORE any data mutation ───────────────
    // WHY check first, then act (never act then check):
    // If we updated the row first and THEN checked ownership, we'd have
    // already mutated data that doesn't belong to this user.
    // WHY and(itemId, userId) — not just itemId:
    // Filtering only by itemId lets any authenticated user modify any cart
    // item in the database by guessing a UUID. The userId condition is the
    // BOLA lock — it ensures this row belongs to the requester.
    const cartItem = await db
      .select({ id: cartItems.id, productId: cartItems.productId })
      .from(cartItems)
      .where(
        and(
          eq(cartItems.id,     itemId),
          eq(cartItems.userId, userId)
        )
      )
      .get();

    if (!cartItem) {
      // WHY 404 (not 403):
      // Returning 403 confirms to an attacker that the item exists but
      // belongs to someone else. 404 reveals nothing — not found,
      // regardless of whether it exists or belongs to another user.
      return c.json(
        { success: false, error: "NOT_FOUND", message: "Cart item not found" },
        404
      );
    }

    // WHY re-check stock against the FULL new quantity (not just the delta):
    // User may be increasing from 1 to 50. If stock is only 10, reject —
    // don't allow a cart quantity that can never be fulfilled at checkout.
    const product = await db
      .select({ stockQuantity: products.stockQuantity, status: products.status })
      .from(products)
      .where(eq(products.id, cartItem.productId))
      .get();

    if (!product || product.status !== "active") {
      return c.json(
        { success: false, error: "PRODUCT_UNAVAILABLE", message: "Product is no longer available" },
        422
      );
    }

    if (product.stockQuantity < quantity) {
      return c.json(
        {
          success:   false,
          error:     "INSUFFICIENT_STOCK",
          message:   `Only ${product.stockQuantity} unit(s) available`,
          available: product.stockQuantity,
        },
        422
      );
    }

    // WHY userId in the UPDATE WHERE clause (not just itemId):
    // Belt-and-suspenders. We already verified ownership above. But the
    // DB query itself also enforces it — if the ownership check was somehow
    // bypassed, the UPDATE still affects zero rows for the wrong user.
    // Defense in depth at the DB layer.
    await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date().toISOString() })
      .where(
        and(
          eq(cartItems.id,     itemId),
          eq(cartItems.userId, userId) // BOLA lock in the query itself
        )
      );

    return c.json({
      success: true,
      message: "Cart item updated",
      data:    { cartItemId: itemId, quantity },
    });
  } catch (error) {
    console.error(`[PUT /cart/items/${itemId}] userId=${userId} error:`, error);
    return c.json(
      { success: false, error: "INTERNAL_ERROR", message: "Failed to update cart item" },
      500
    );
  }
});



















// ─────────────────────────────────────────────────────────────────────────────
// DELETE /cart/items/:id — Remove a specific item from cart
// ─────────────────────────────────────────────────────────────────────────────
cartRoutes.delete("/items/:id", async (c) => {
  const user   = c.get("user");
  const userId = user.id;
  const itemId = c.req.param("id");

  const db = getDb(c.env);

  try {
    // WHY delete with both conditions in a single query (no pre-check SELECT):
    // Unlike PUT, there's no business logic to run before deletion.
    // We DELETE directly with the double-key BOLA condition.
    // If the item doesn't exist OR belongs to someone else → zero rows
    // affected → we return 404. Saves one DB round-trip vs SELECT then DELETE.
    const result = await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id,     itemId),
          eq(cartItems.userId, userId) // BOLA lock — same user must own this item
        )
      )
      .returning({ deletedId: cartItems.id });
      // WHY .returning(): tells us if a row was actually deleted
      // without needing a second SELECT query.

    if (result.length === 0) {
      // WHY 404 (not 403): same reasoning as PUT — reveal nothing.
      return c.json(
        { success: false, error: "NOT_FOUND", message: "Cart item not found" },
        404
      );
    }

    // WHY 200 (not 204 No Content):
    // RFC 7231 allows 204 for DELETE. However, many Android HTTP clients
    // (dominant in Nigerian mobile-first context) mishandle 204 — some
    // treat a missing body as a network error. 200 with minimal JSON is safer.
    return c.json({
      success: true,
      message: "Item removed from cart",
      data:    { cartItemId: itemId },
    });
  } catch (error) {
    console.error(`[DELETE /cart/items/${itemId}] userId=${userId} error:`, error);
    return c.json(
      { success: false, error: "INTERNAL_ERROR", message: "Failed to remove cart item" },
      500
    );
  }
});





















// ─────────────────────────────────────────────────────────────────────────────
// POST /cart/validate — Pre-checkout stock and availability validation
//
// ⚠️  D1 REPLICA LAG — KNOWN ARCHITECTURAL LIMITATION:
// Cloudflare D1 does not expose an API to force reads from the primary node.
// If a user modifies their cart and immediately calls /validate, this read
// MAY hit a stale edge replica (~50–200ms lag window).
//
// MITIGATION: /validate is a UX helper — it gives the user early feedback.
// The AUTHORITATIVE stock check happens at order creation (POST /orders),
// where we run an atomic db.batch() for cart + order + stock deduction.
// Never rely on /validate alone as the final enforcement layer.
// ─────────────────────────────────────────────────────────────────────────────
cartRoutes.post("/validate", async (c) => {
  const user   = c.get("user");
  const userId = user.id;

  const db = getDb(c.env);

  try {
    // WHY direct query (not calling GET /cart handler internally):
    // We want the freshest possible read. Calling the GET handler internally
    // would add an unnecessary abstraction layer and extra response mapping.
    // Direct query keeps the critical pre-checkout path lean.
    const rows = await db
      .select({
        cartItemId:    cartItems.id,
        quantity:      cartItems.quantity,
        variantId:     cartItems.variantId,
        productId:     products.id,
        title:         products.title,
        price:         products.price,
        stockQuantity: products.stockQuantity,
        status:        products.status,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));

    // WHY return 422 for empty cart (not 200 with isValid: false):
    // An empty cart is a structural problem — not a validation failure.
    // The HTTP status should tell the frontend what kind of problem this
    // is so it can navigate the user to the shop, not show a validation UI.
    if (rows.length === 0) {
      return c.json(
        { success: false, error: "EMPTY_CART", message: "Your cart is empty" },
        422
      );
    }

    type ValidateRow = (typeof rows)[number];

    // WHY per-item validation (not just a single isValid boolean):
    // The frontend needs to know EXACTLY which items failed and WHY —
    // to render targeted messages per line item:
    // "Ankara Fabric: only 2 left in stock (you have 5 in cart)"
    // A single flag gives the frontend nothing to act on.
    const validatedItems = rows.map((row: ValidateRow) => {
      const issues: string[] = [];

      // WHY check all conditions independently (not short-circuit with if-else):
      // A product can simultaneously be inactive AND have zero stock.
      // Collecting ALL issues lets the frontend show everything wrong at once,
      // instead of the user fixing one problem only to hit another.
      if (row.productId === null) {
        issues.push("Product no longer exists — please remove from cart");
      } else {
        if (row.status === "inactive") {
          issues.push("Product is no longer available");
        }
        if (row.status === "out_of_stock") {
          issues.push("Product is out of stock");
        }
        // WHY compare against LIVE stockQuantity from products table:
        // We JOIN from products on every validate call — always current stock,
        // never a value cached at cart-add time. Price changes and stock
        // changes are automatically reflected here.
        if (row.stockQuantity !== null && row.stockQuantity < row.quantity) {
          issues.push(
            row.stockQuantity === 0
              ? "No stock remaining"
              : `Only ${row.stockQuantity} unit(s) left (you have ${row.quantity} in cart)`
          );
        }
      }

      const isItemValid = issues.length === 0;
      const unitPrice   = row.price ?? 0;

      // WHY lineTotal is 0 for invalid items:
      // An invalid item cannot be purchased — including its price in any
      // total would produce a misleading subtotal.
      const lineTotal = isItemValid
        ? Math.round(row.quantity * unitPrice * 100) / 100
        : 0;

      return {
        cartItemId: row.cartItemId,
        productId:  row.productId,
        variantId:  row.variantId ?? null,
        title:      row.title ?? "Product no longer available",
        quantity:   row.quantity,
        unitPrice,
        lineTotal,
        isValid:    isItemValid,
        issues, // Empty array [] when item is valid — no extra null checks needed
      };
    });

    type ValidatedItem = (typeof validatedItems)[number];

    const validItems   = validatedItems.filter((i: ValidatedItem) =>  i.isValid);
    const invalidItems = validatedItems.filter((i: ValidatedItem) => !i.isValid);

    // WHY overall isValid = ALL items valid (not just majority):
    // Checkout cannot proceed if ANY item is invalid.
    // Partial checkout (valid items only) is a product decision —
    // it requires explicit design and user confirmation, not implicit behaviour.
    const isValid = invalidItems.length === 0;

    const subtotal =
      Math.round(
        validItems.reduce(
          (sum: number, i: ValidatedItem) => sum + i.lineTotal,
          0
        ) * 100
      ) / 100;

    return c.json({
      success: true,
      data: {
        // WHY isValid at the top level (not buried in summary):
        // This is the first thing checkout logic reads to decide
        // whether to enable the "Pay Now" button. Keep it accessible.
        isValid,
        summary: {
          totalItems:   validatedItems.length,
          validItems:   validItems.length,
          invalidItems: invalidItems.length,
          subtotal,
          currency:     "NGN",
          // WHY include a price disclaimer in the API response:
          // Subtotal can change between /validate and order creation if a
          // seller updates their price in that window. This disclaimer
          // protects against user disputes and is surfaced in the checkout UI.
          priceDisclaimer:
            "Prices confirmed at order creation. Subtotal may change if items are modified.",
        },
        items: validatedItems,
      },
    });
  } catch (error) {
    console.error(`[POST /cart/validate] userId=${userId} error:`, error);
    return c.json(
      { success: false, error: "INTERNAL_ERROR", message: "Failed to validate cart" },
      500
    );
  }
});

export { cartRoutes };