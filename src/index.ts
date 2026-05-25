import { Hono } from "hono";
import { getAuth, type CloudflareEnv } from "./lib/auth";

const app = new Hono<{ Bindings: CloudflareEnv }>();

// Catch-all route for any authentication actions (sign-in, sign-out, session checks)
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  // 1. Build the auth instance dynamically using this specific request's env
  const authInstance = getAuth(c.env);
  
  // 2. Hand control completely over to Better Auth
  return authInstance.handler(c.req.raw);
});

app.get("/", (c) => c.text("server is runnnig live"));

export default app;