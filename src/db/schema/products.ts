import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import {
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  categoryId: text("category_id").references(() => categories.id),
  status: text("status", {
    enum: ["active", "inactive", "out_of_stock"],
  })
    .notNull()
    .default("active"),
  location: text("location"),
  images: text("images", { mode: "json" }).$type<string[]>().default([]),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// export const reviews = sqliteTable("reviews", {
// //   id: text("id").primaryKey(),
// //   productId: text("product_id")
// //     .notNull()
// //     .references(() => products.id, { onDelete: "cascade" }),
// //   buyerId: text("buyer_id")
// //     .notNull()
// //     .references(() => users.id, { onDelete: "cascade" }),
// //   orderId: text("order_id").notNull(),
// //   rating: integer("rating").notNull(),
// //   text: text("text"),
// //   createdAt: text("created_at").notNull(),
// // });

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderId: text("order_id").notNull(),
    rating: integer("rating").notNull(),
    text: text("text"),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    uniqueBuyerReview: uniqueIndex(
      "review_product_buyer_unique"
    ).on(table.productId, table.buyerId),
  })
);

// export const wishlist = sqliteTable("wishlist", {
//   id: text("id").primaryKey(),
//   userId: text("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   productId: text("product_id")
//     .notNull()
//     .references(() => products.id, { onDelete: "cascade" }),
//   createdAt: text("created_at").notNull(),
// });

export const wishlist = sqliteTable(
  "wishlist",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: text("created_at").notNull(),
  },
  (table) => ({
    userProductUnique: uniqueIndex(
      "wishlist_user_product_unique"
    ).on(table.userId, table.productId),
  })
);