import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth, requireRole } from "../../middleware/auth";

const escrowRoutes = new Hono<{ Bindings: Env }>();

// Internal/admin escrow management
escrowRoutes.use("*", requireAuth());

escrowRoutes.get("/:orderId", async (c) => {
  // TODO: Get escrow status for an order
  return c.json({ message: "Get escrow status endpoint" });
});

escrowRoutes.post("/:orderId/hold", requireRole("admin"), async (c) => {
  // TODO: Manually trigger escrow hold
  return c.json({ message: "Manual escrow hold endpoint" });
});

escrowRoutes.post("/:orderId/release", requireRole("admin"), async (c) => {
  // TODO: Manually trigger escrow release (Paystack Transfer)
  return c.json({ message: "Manual escrow release endpoint" });
});

escrowRoutes.post("/:orderId/freeze", requireRole("admin"), async (c) => {
  // TODO: Freeze escrow funds (for dispute)
  return c.json({ message: "Freeze escrow endpoint" });
});

export { escrowRoutes };
