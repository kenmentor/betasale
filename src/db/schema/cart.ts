import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { products } from "./products";

export const cartItems = sqliteTable(
  "cart_items",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    // WHY nullable: We don't have a variants table yet, but reserving this
    // column now prevents a painful migration later when vendors need
    // size/color/SKU support. Nullable means existing cart rows are
    // unaffected — zero breaking change.
    variantId: text("variant_id"),

    quantity: integer("quantity").notNull().default(1),

    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => ({
    // WHY this index: Without it, the same user can have 5 rows for the
    // same product. onConflictDoUpdate() on POST /cart/add REQUIRES this
    // index to know which row to target. Non-negotiable for upsert safety.
    userProductUnique: uniqueIndex("cart_items_user_product_unique").on(
      table.userId,
      table.productId,
      table.variantId
    ),
  })
);