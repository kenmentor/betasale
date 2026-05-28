// NOTE FOR MENTOR
// MENTOR CHECK LINE 86



// import { betterAuth, ENV } from 'better-auth';
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { getDb, schema } from "../db/index";

// export type CloudflareEnv = {
//   DB: D1Database;
//   GITHUB_CLIENT_ID: string;
//   GITHUB_CLIENT_SECRET: string;
// };

// export const getAuth = (env: CloudflareEnv) => betterAuth({
//   database: drizzleAdapter(getDb(env), {
//     provider: 'sqlite', // Cloudflare D1 runs on SQLite syntax
//     schema: schema,
//   }),
//   trustedOrigins: ['http://localhost:5173'],
//   emailAndPassword: { enabled: true },
//   advanced: {
//     useStrictCookies: true, // Crucial for serverless edge runtimes
//   }
// });







// JUDE INJECTION
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb, schema } from "../db/index";
import type { Env } from "../config/env";

// WHY getAuth is a function (not a singleton export):
// Cloudflare Workers are stateless. Each request has its own `env` object
// containing the D1 binding. If we created one global betterAuth instance,
// it would capture the env from the first request and reuse it for all
// subsequent requests — which fails in Cloudflare's edge runtime.
// Calling getAuth(env) per-request is the correct pattern here.
export const getAuth = (env: Env) =>
  betterAuth({
    // WHY secret: Better Auth uses this to cryptographically sign session
    // tokens and cookies. Without it, sessions are unsigned — anyone can
    // forge a session token and authenticate as any user.
    secret: env.BETTER_AUTH_SECRET,

    // WHY baseURL: Better Auth uses this to construct redirect URLs,
    // email verification links, and OAuth callback URLs. Without it,
    // those links are broken or point to localhost in production.
    baseURL: env.BETTER_AUTH_URL,

    // WHY drizzleAdapter with sqlite: Cloudflare D1 is SQLite under the hood.
    // Better Auth uses this adapter to manage its own tables (sessions,
    // accounts, verifications) alongside our application tables.
    database: drizzleAdapter(getDb(env), {
      provider: "sqlite",
      schema:   schema,
    }),

    emailAndPassword: { enabled: true },

    user: {
      additionalFields: {
        // WHY additionalFields for role: Better Auth's default session.user
        // only returns base fields (id, email, name, emailVerified).
        // Without this, session.user.role is undefined at runtime — every
        // requireRole() check becomes a security hole that lets everyone through.
        role: {
          type:         "string",
          required:     false,      // WHY false: role is server-assigned, never
          defaultValue: "buyer",    // user-provided. false + input:false together
          input:        false,      // make this field completely non-writable by clients.
          // WHY input: false is NON-NEGOTIABLE:
          // Without it, any user can POST role:"admin" during sign-up and
          // Better Auth will accept it. input:false tells Better Auth to
          // silently ignore any client-supplied role value and always use
          // the defaultValue or the server-assigned value. This is the
          // privilege escalation prevention gate.
        },
      },
    },

    // WHY both URLs in trustedOrigins:
    // APP_URL covers the production frontend domain.
    // BETTER_AUTH_URL covers the backend/dev URL.
    // filter(Boolean) prevents an accidental empty string entry — some
    // CORS implementations treat "" as a wildcard match, which would
    // defeat the purpose of a trusted origins list entirely.
    trustedOrigins: [env.APP_URL, env.BETTER_AUTH_URL].filter(Boolean),




// 🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩🚩
//     What It Was Supposed to Do
// useStrictCookies was meant to set SameSite=Strict on session cookies. 
// That attribute tells the browser: only send this cookie on same-site requests,
//  never on cross-site ones — which prevents CSRF attacks.

    // advanced: {
    //   // WHY useStrictCookies: Sets SameSite=Strict on session cookies.
    //   // Prevents session cookies from being sent on cross-site requests —
    //   // mitigates CSRF attacks. Safe to enable because we use email/password
    //   // auth only (no OAuth redirects that would break with Strict).
    //   // If GitHub/Google OAuth is added later, revisit this setting.
    //   useStrictCookies: true,
    // },
  });