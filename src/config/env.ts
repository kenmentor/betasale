export interface Env {
  DB: D1Database;
  PAYSTACK_SECRET_KEY: string;
  PAYSTACK_PUBLIC_KEY: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  SMS_API_KEY: string;
  SMS_SENDER_ID: string;
  FCM_SERVER_KEY: string;
  APP_URL: string;
}

export function getEnv(c: { env: Env }): Env {
  return c.env;
}
