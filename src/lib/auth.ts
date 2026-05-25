import { betterAuth, ENV } from 'better-auth';
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb, schema } from "../db/index";

export type CloudflareEnv = {
  DB: D1Database;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
};

export const getAuth = (env: CloudflareEnv) => betterAuth({
  database: drizzleAdapter(getDb(env), {
    provider: 'sqlite', // Cloudflare D1 runs on SQLite syntax
    schema: schema,
  }),
  trustedOrigins: ['http://localhost:5173'],
  emailAndPassword: { enabled: true },
  advanced: {
    useStrictCookies: true, // Crucial for serverless edge runtimes
  }
});