// import { Hono } from "hono";
// import { getAuth, type CloudflareEnv } from "./lib/auth";

// const app = new Hono<{ Bindings: CloudflareEnv }>();

// // Catch-all route for any authentication actions (sign-in, sign-out, session checks)
// app.on(["POST", "GET"], "/api/auth/*", (c) => {
//   // 1. Build the auth instance dynamically using this specific request's env
//   const authInstance = getAuth(c.env);
  
//   // 2. Hand control completely over to Better Auth
//   return authInstance.handler(c.req.raw);
// });

// app.get("/", (c) => c.text("server is runnnig live"));

// export default app;





















// lumyn injection


// WHY Hono: Lightweight router that runs natively on Cloudflare Workers.
// Zero cold start overhead. Handles routing before passing to sub-apps.
import { Hono } from "hono";
import { getAuth } from "./lib/auth";

// WHY we import the main app: app.ts holds all business routes
// (/cart, /products, /orders, etc.). By importing and mounting it here,
// index.ts becomes the single entry point the Worker exports, and
// app.ts becomes the business logic layer underneath it.
import businessApp from "./app";

// WHY we import Env (not CloudflareEnv): Env is now the unified type
// for all environment bindings after we cleaned up lib/auth.ts.
// One type, one source of truth.
import type { Env } from "./config/env";

// WHY we also import AuthenticatedUser: The session middleware sets
// c.set("user", ...) — Hono needs to know the type of that value
// at the app level to avoid TypeScript errors downstream.
import type { AuthenticatedUser } from "./middleware/auth";

// WHY Variables type: Hono uses this to type-check what's stored on
// the context with c.set() and c.get(). Without it, TypeScript doesn't
// know "user" and "userId" exist on the context — you'd get 'any' types
// everywhere, which defeats the purpose of TypeScript.
type Variables = {
  user: AuthenticatedUser;
  userId: string;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ─────────────────────────────────────────────
// SESSION MIDDLEWARE — Must run BEFORE all routes
// ─────────────────────────────────────────────
// WHY this middleware exists: Better Auth doesn't automatically inject
// session data into Hono's context. We have to call getSession() on
// every request ourselves, then store the result with c.set("user").
// Without this, c.get("user") is ALWAYS undefined in every route,
// and every requireAuth() call returns 401 forever.
app.use("*", async (c, next) => {
  const auth = getAuth(c.env);

  // WHY we call api.getSession(): This validates the session cookie
  // (or Authorization header) against the sessions table in D1.
  // It returns null if the session is missing, expired, or tampered with.
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (session?.user) {
    // WHY we cast to AuthenticatedUser: Better Auth returns a generic
    // user object. We cast to our interface which includes `role`
    // (now included because we added additionalFields in lib/auth.ts).
    // This cast is now safe — the DB and Better Auth config both have role.
    c.set("user", session.user as AuthenticatedUser);
    c.set("userId", session.user.id);
  }

  // WHY we always call next(): This middleware doesn't block — it just
  // enriches the context. Route-level middlewares (requireAuth,
  // requireRole) are the ones that reject unauthorized requests.
  // Blocking here would break public routes like /health and /auth/*.
  await next();
});

// ─────────────────────────────────────────────
// BETTER AUTH HANDLER — /api/auth/* routes
// ─────────────────────────────────────────────
// WHY /api/auth/* prefix: Better Auth's client SDK expects auth
// endpoints at this path by default (sign-in, sign-out, get-session).
// This must be registered AFTER the session middleware so that
// the auth routes also benefit from the session context if needed.
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const authInstance = getAuth(c.env);
  return authInstance.handler(c.req.raw);
});

// ─────────────────────────────────────────────
// BUSINESS ROUTES — All application logic
// ─────────────────────────────────────────────
// WHY app.route("/"): This mounts the entire businessApp (from app.ts)
// at the root. All routes defined in app.ts (/cart, /products, /orders,
// etc.) are now reachable. Before this line, those routes were completely
// orphaned — unreachable from the internet.
app.route("/", businessApp);

// WHY this export: Cloudflare Workers requires a default export with
// a fetch handler. Hono's app satisfies this interface automatically.
export default app;