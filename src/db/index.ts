import { drizzle } from "drizzle-orm/d1";
import type { Env } from "../config/env";

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

export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}

export type Db = ReturnType<typeof getDb>;
