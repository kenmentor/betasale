import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth, requireRole } from "../../middleware/auth";

const disputeRoutes = new Hono<{ Bindings: Env }>();

disputeRoutes.use("*", requireAuth());

disputeRoutes.post("/", async (c) => {
  // TODO: Raise a dispute (buyer only, order must be SHIPPED and before ESCROW_RELEASED)
  return c.json({ message: "Raise dispute endpoint" });
});

disputeRoutes.get("/", async (c) => {
  // TODO: List disputes for current user
  return c.json({ message: "List disputes endpoint" });
});

disputeRoutes.get("/:id", async (c) => {
  // TODO: Get dispute detail
  return c.json({ message: "Get dispute detail endpoint" });
});

disputeRoutes.post("/:id/evidence", async (c) => {
  // TODO: Submit evidence for a dispute
  return c.json({ message: "Submit evidence endpoint" });
});

// Admin endpoints
disputeRoutes.patch("/:id/resolve", requireRole("admin"), async (c) => {
  // TODO: Admin resolves dispute (full_refund | full_release | partial_split)
  return c.json({ message: "Resolve dispute endpoint" });
});

export { disputeRoutes };
