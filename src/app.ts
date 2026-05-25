import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { errorHandler } from "./middleware/error";
import type { Env } from "./config/env";

import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";
import { walletRoutes } from "./modules/wallet/wallet.routes";
import { productRoutes } from "./modules/products/product.routes";
import { cartRoutes } from "./modules/cart/cart.routes";
import { orderRoutes } from "./modules/orders/order.routes";
import { escrowRoutes } from "./modules/escrow/escrow.routes";
import { disputeRoutes } from "./modules/disputes/dispute.routes";
import { messageRoutes } from "./modules/messaging/message.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";
import { notificationRoutes } from "./modules/notifications/notification.routes";
import { adminRoutes } from "./modules/admin/admin.routes";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());
app.use("*", logger());
// app.onError(errorHandler);

app.get("/health", (c) => c.json({ status: "ok", service: "vendora-backend" }));

app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/wallet", walletRoutes);
app.route("/products", productRoutes);
app.route("/cart", cartRoutes);
app.route("/orders", orderRoutes);
app.route("/escrow", escrowRoutes);
app.route("/disputes", disputeRoutes);
app.route("/messages", messageRoutes);
app.route("/payments", paymentRoutes);
app.route("/notifications", notificationRoutes);
app.route("/admin", adminRoutes);

export default app;
