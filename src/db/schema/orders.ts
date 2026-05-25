import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status", {
    enum: [
      "pending",
      "paid",
      "escrow_hold",
      "shipped",
      "delivered",
      "escrow_released",
      "completed",
      "disputed",
      "refunded",
    ],
  })
    .notNull()
    .default("pending"),
  totalAmount: real("total_amount").notNull(),
  escrowAmount: real("escrow_amount"),
  taxAmount: real("tax_amount").default(0),
  shippingAddressSnapshot: text("shipping_address_snapshot", { mode: "json" }).$type<{
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
  }>(),
  trackingInfo: text("tracking_info"),
  autoReleaseAt: text("auto_release_at"),
  paidAt: text("paid_at"),
  escrowHoldAt: text("escrow_hold_at"),
  shippedAt: text("shipped_at"),
  deliveredAt: text("delivered_at"),
  escrowReleasedAt: text("escrow_released_at"),
  completedAt: text("completed_at"),
  disputedAt: text("disputed_at"),
  refundedAt: text("refunded_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  productTitle: text("product_title").notNull(),
  productPrice: real("product_price").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: real("total_price").notNull(),
  productImage: text("product_image"),
});
