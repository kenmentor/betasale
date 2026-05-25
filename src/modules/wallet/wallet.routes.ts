import { Hono } from "hono";
import type { Env } from "../../config/env";
import { requireAuth } from "../../middleware/auth";

const walletRoutes = new Hono<{ Bindings: Env }>();

walletRoutes.use("*", requireAuth());

walletRoutes.post("/create", async (c) => {
  // TODO: Create wallet with 4-digit pin
  return c.json({ message: "Create wallet endpoint" });
});

walletRoutes.get("/balance", async (c) => {
  // TODO: Get wallet balance
  return c.json({ message: "Get balance endpoint" });
});

walletRoutes.get("/transactions", async (c) => {
  // TODO: List wallet transactions
  return c.json({ message: "List transactions endpoint" });
});

walletRoutes.post("/withdraw", async (c) => {
  // TODO: Withdraw funds (merchant only)
  return c.json({ message: "Withdraw endpoint" });
});

export { walletRoutes };
