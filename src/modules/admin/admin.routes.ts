import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth, requireRole } from "../../middleware/auth";

const adminRoutes = new Hono<{ Bindings: Env }>();

adminRoutes.use("*", requireAuth(), requireRole("admin"));

adminRoutes.get("/users", async (c) => {
  // TODO: List all users with filters
  return c.json({ message: "List users endpoint" });
});

adminRoutes.patch("/users/:id/role", async (c) => {
  // TODO: Change user role
  return c.json({ message: "Update user role endpoint" });
});

adminRoutes.get("/orders", async (c) => {
  // TODO: List all orders with filters
  return c.json({ message: "List all orders endpoint" });
});

adminRoutes.get("/disputes", async (c) => {
  // TODO: List all disputes (open/under_review)
  return c.json({ message: "List disputes endpoint" });
});

adminRoutes.get("/payouts", async (c) => {
  // TODO: View payout oversight dashboard
  return c.json({ message: "Payout oversight endpoint" });
});

adminRoutes.post("/payouts/:transactionId/approve", async (c) => {
  // TODO: Approve pending payout
  return c.json({ message: "Approve payout endpoint" });
});

adminRoutes.post("/payouts/:transactionId/block", async (c) => {
  // TODO: Block suspicious payout
  return c.json({ message: "Block payout endpoint" });
});

export { adminRoutes };
