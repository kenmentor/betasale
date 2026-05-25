import type { Context, MiddlewareHandler } from "hono";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
  }
}

export function errorHandler(c: Context) {
  return async (err: Error) => {
    if (err instanceof AppError) {
      return c.json(
        { error: err.message, status: err.statusCode },
        err.statusCode as any,
      );
    }
    console.error("Unhandled error:", err);
    return c.json({ error: "Internal server error", status: 500 }, 500);
  };
}
