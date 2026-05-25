import type { Context, MiddlewareHandler } from "hono";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

export function requireAuth(): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get("user") as AuthenticatedUser | undefined;
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    await next();
  };
}

export function requireRole(...roles: string[]): MiddlewareHandler {
  return async (c, next) => {
    const user = c.get("user") as AuthenticatedUser;
    if (!user || !roles.includes(user.role)) {
      return c.json({ error: "Forbidden" }, 403);
    }
    await next();
  };
}
