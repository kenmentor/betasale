import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth } from "../../middleware/auth";

const notificationRoutes = new Hono<{ Bindings: Env }>();

notificationRoutes.use("*", requireAuth());

notificationRoutes.get("/", async (c) => {
  // TODO: List notifications for current user
  return c.json({ message: "List notifications endpoint" });
});

notificationRoutes.patch("/:id/read", async (c) => {
  // TODO: Mark notification as read
  return c.json({ message: "Mark as read endpoint" });
});

notificationRoutes.post("/register-token", async (c) => {
  // TODO: Register push notification token (FCM)
  return c.json({ message: "Register push token endpoint" });
});

notificationRoutes.delete("/unregister-token", async (c) => {
  // TODO: Unregister push notification token
  return c.json({ message: "Unregister push token endpoint" });
});

export { notificationRoutes };
