import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth, requireRole } from "../../middleware/auth";

const orderRoutes = new Hono<{ Bindings: Env }>();

orderRoutes.use("*", requireAuth());

orderRoutes.post("/", async (c) => {
  // TODO: Create order from cart -> initiate checkout
  return c.json({ message: "Create order endpoint" });
});

orderRoutes.get("/", async (c) => {
  // TODO: List orders for current user (buyer or seller)
  return c.json({ message: "List orders endpoint" });
});

orderRoutes.get("/:id", async (c) => {
  // TODO: Get order detail with status timeline
  return c.json({ message: "Get order detail endpoint" });
});

orderRoutes.patch("/:id/cancel", async (c) => {
  // TODO: Cancel order (only if PENDING)
  return c.json({ message: "Cancel order endpoint" });
});

orderRoutes.patch("/:id/confirm-delivery", async (c) => {
  // TODO: Buyer confirms delivery -> triggers escrow release
  return c.json({ message: "Confirm delivery endpoint" });
});

orderRoutes.get("/:id/invoice", async (c) => {
  // TODO: Download invoice for completed order
  return c.json({ message: "Download invoice endpoint" });
});

// Seller-specific
orderRoutes.patch("/:id/ship", requireRole("seller"), async (c) => {
  // TODO: Seller marks order as shipped + uploads tracking
  return c.json({ message: "Mark as shipped endpoint" });
});

export { orderRoutes };
