import { drizzle } from "drizzle-orm/d1";
import * as usersSchema from "./schema/users";
import * as productsSchema from "./schema/products";
import * as cartSchema from "./schema/cart";
import * as ordersSchema from "./schema/orders";
import * as walletSchema from "./schema/wallet";
import * as disputesSchema from "./schema/disputes";
import * as messagesSchema from "./schema/messages";
import * as notificationsSchema from "./schema/notifications";

export const schema = {
  ...usersSchema,
  ...productsSchema,
  ...cartSchema,
  ...ordersSchema,
  ...walletSchema,
  ...disputesSchema,
  ...messagesSchema,
  ...notificationsSchema,
};

// 1. Explicitly type the only thing Drizzle cares about: your D1 binding
export type DbBindings = {
  DB: D1Database;
};

// 2. Pass it in ONCE cleanly without conflicting parameter names
export function getDb(env: DbBindings) {
  return drizzle(env.DB, { schema });
}

export type Db = ReturnType<typeof getDb>;