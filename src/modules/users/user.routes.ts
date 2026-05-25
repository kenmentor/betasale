import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth } from "../../middleware/auth";

const userRoutes = new Hono<{ Bindings: Env }>();

userRoutes.use("*", requireAuth());

userRoutes.get("/profile", async (c) => {
  // TODO: Get current user profile
  return c.json({ message: "Get profile endpoint" });
});

userRoutes.put("/profile", async (c) => {
  // TODO: Update display name, photo, phone, email, bank details
  return c.json({ message: "Update profile endpoint" });
});

userRoutes.get("/addresses", async (c) => {
  // TODO: List shipping addresses
  return c.json({ message: "List addresses endpoint" });
});

userRoutes.post("/addresses", async (c) => {
  // TODO: Add shipping address
  return c.json({ message: "Add address endpoint" });
});

userRoutes.put("/addresses/:id", async (c) => {
  // TODO: Update shipping address
  return c.json({ message: "Update address endpoint" });
});

userRoutes.delete("/addresses/:id", async (c) => {
  // TODO: Delete shipping address
  return c.json({ message: "Delete address endpoint" });
});

userRoutes.get("/orders", async (c) => {
  // TODO: Get user's order history
  return c.json({ message: "Order history endpoint" });
});

userRoutes.put("/communication-preferences", async (c) => {
  // TODO: Update email/sms/push opt-in/out
  return c.json({ message: "Update communication preferences endpoint" });
});

export { userRoutes };
