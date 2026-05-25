import { Hono } from "hono";
import type { Env } from "../../config/env";

const paymentRoutes = new Hono<{ Bindings: Env }>();

// Paystack webhook (no auth - Paystack signature verification)
paymentRoutes.post("/webhook", async (c) => {
  // TODO: Handle Paystack webhook events:
  //   - charge.success -> move order to PAID -> ESCROW_HOLD
  //   - transfer.success -> move order to COMPLETED
  //   - transfer.failed -> handle retry logic
  return c.json({ message: "Paystack webhook endpoint" });
});

paymentRoutes.post("/initialize", async (c) => {
  // TODO: Initialize Paystack payment for an order
  return c.json({ message: "Initialize payment endpoint" });
});

paymentRoutes.get("/verify/:reference", async (c) => {
  // TODO: Verify payment by Paystack reference
  return c.json({ message: "Verify payment endpoint" });
});

export { paymentRoutes };
