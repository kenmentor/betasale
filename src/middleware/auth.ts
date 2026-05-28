// import type { Context, MiddlewareHandler } from "hono";

// export interface AuthenticatedUser {
//   id: string;
//   email: string;
//   role: "buyer" | "seller" | "admin";
// }

// export function requireAuth(): MiddlewareHandler {
//   return async (c, next) => {
//     const user = c.get("user") as AuthenticatedUser;
//     const userId = user.id; // Never from query params. Never from body.
//     if (!user) {
//       return c.json({ error: "Unauthorized" }, 401);
//     }
//     await next();
//   };
// }

// export function requireRole(...roles: string[]): MiddlewareHandler {
//   return async (c, next) => {
//     const user = c.get("user") as AuthenticatedUser;
//     if (!user || !roles.includes(user.role)) {
//       return c.json({ error: "Forbidden" }, 403);
//     }
//     await next();
//   };
// }




// lumyn injection
// Here is exactly what changed between your old code and your new code:
// Fixed a Runtime Crash: The old code accessed user.id before checking if the user was logged in. T
// his caused a server crash for unauthenticated guests. 
// The new code correctly checks if (!user) first.
// Tightened Type Safety: Changed the allowed roles parameter from a loose string[] to a strict list of exact roles ("buyer" | "seller" | "admin"). 
// This blocks developer typos at compile time.Corrected API Security Statuses:
//  The old code returned a 403 Forbidden if a logged-out guest hit a role check. 
//  The new code fixes this by correctly returning a 401 Unauthorized.
//  Standardized JSON Outputs: Upgraded error messages to follow a clean, consistent production format: { success: false, error: "...", message: "..." }.
//  Optimized Developer Workflow: Added c.set("userId", user.id) to pass the user ID forward, 
//  saving you from writing repetitive lookup code inside your actual route logic.

















import type { Context, MiddlewareHandler } from "hono";

// WHY this interface: TypeScript needs to know the shape of what
// Better Auth returns in session.user after we added additionalFields.
// This MUST match the fields Better Auth actually returns — no more,
// no less. If it doesn't match, you get false type safety (as-cast lies).
export interface AuthenticatedUser {
  id: string;
  email: string;
  // WHY role is here now: We added role to Better Auth's additionalFields
  // in lib/auth.ts. Without that config change, this field would be
  // undefined at runtime even though TypeScript thinks it exists.
  role: "buyer" | "seller" | "admin";
}

// FIX: Define the variables Hono keeps inside c.set() and c.get()
export type HonoEnv = {
  Variables: {
    user: AuthenticatedUser;
    userId: string;
  };
};

export function requireAuth(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    // WHY we check BEFORE accessing properties:
    // c.get("user") returns undefined if the session middleware didn't
    // run or if the session is invalid/expired. Accessing .id on
    // undefined throws a runtime crash — not a clean 401.
    // Always null-check first, then access properties.
    const user = c.get("user") as AuthenticatedUser | undefined;

    if (!user) {
      // WHY 401 not 403: 401 = "I don't know who you are."
      // 403 = "I know who you are, but you're not allowed."
      // No session = unknown identity = 401.
      return c.json(
        { success: false, error: "UNAUTHORIZED", message: "Authentication required" },
        401
      );
    }

    // WHY we set userId separately on context: Routes need userId frequently
    // for WHERE clauses. This avoids repetitive c.get("user").id in every
    // handler and makes the intent explicit.
    c.set("userId", user.id);

    await next();
  };
}

export function requireRole(...roles: Array<"buyer" | "seller" | "admin">): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    // WHY we re-read user here (not rely on requireAuth setting it):
    // requireRole can theoretically be used on routes without requireAuth
    // stacked before it. Defensive programming — always re-validate.
    const user = c.get("user") as AuthenticatedUser | undefined;

    if (!user) {
      return c.json(
        { success: false, error: "UNAUTHORIZED", message: "Authentication required" },
        401
      );
    }

    if (!roles.includes(user.role)) {
      // WHY 403 here: We know who the user is (session is valid),
      // but their role isn't in the allowed list. That's Forbidden, not Unauthorized.
      return c.json(
        { success: false, error: "FORBIDDEN", message: "Insufficient permissions" },
        403
      );
    }

    await next();
  };
}