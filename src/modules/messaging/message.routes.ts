import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth } from "../../middleware/auth";

const messageRoutes = new Hono<{ Bindings: Env }>();

messageRoutes.use("*", requireAuth());

messageRoutes.get("/conversations", async (c) => {
  // TODO: List conversations for the current user
  return c.json({ message: "List conversations endpoint" });
});

messageRoutes.get("/conversations/:orderId", async (c) => {
  // TODO: Get conversation for a specific order
  return c.json({ message: "Get conversation endpoint" });
});

messageRoutes.post("/conversations/:orderId/messages", async (c) => {
  // TODO: Send a message in an order conversation
  return c.json({ message: "Send message endpoint" });
});

messageRoutes.get("/conversations/:orderId/messages", async (c) => {
  // TODO: Get messages for a conversation
  return c.json({ message: "Get messages endpoint" });
});

export { messageRoutes };
