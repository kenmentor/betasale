import { Hono } from "hono";
import type { Env } from "../../config/env";

const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.post("/signup", async (c) => {
  // TODO: Email + password registration with email verification
  return c.json({ message: "Signup endpoint" });
});

authRoutes.post("/login", async (c) => {
  // TODO: Login via Better Auth
  return c.json({ message: "Login endpoint" });
});

authRoutes.post("/otp/send", async (c) => {
  // TODO: Send OTP to phone number via SMS
  return c.json({ message: "Send OTP endpoint" });
});

authRoutes.post("/otp/verify", async (c) => {
  // TODO: Verify phone OTP
  return c.json({ message: "Verify OTP endpoint" });
});

authRoutes.post("/oauth/google", async (c) => {
  // TODO: Google OAuth
  return c.json({ message: "Google OAuth endpoint" });
});

authRoutes.post("/oauth/apple", async (c) => {
  // TODO: Apple OAuth
  return c.json({ message: "Apple OAuth endpoint" });
});

export { authRoutes };
