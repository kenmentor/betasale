import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { orders } from "./orders";

export const disputes = sqliteTable("disputes", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .unique()
    .references(() => orders.id, { onDelete: "cascade" }),
  raisedBy: text("raised_by")
    .notNull()
    .references(() => users.id),
  reason: text("reason", {
    enum: ["not_received", "wrong_item", "damaged_item"],
  }).notNull(),
  description: text("description").notNull(),
  status: text("status", {
    enum: ["open", "under_review", "resolved"],
  })
    .notNull()
    .default("open"),
  resolution: text("resolution", {
    enum: ["full_refund", "full_release", "partial_split"],
  }),
  resolvedBy: text("resolved_by").references(() => users.id),
  resolvedAt: text("resolved_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const disputeEvidence = sqliteTable("dispute_evidence", {
  id: text("id").primaryKey(),
  disputeId: text("dispute_id")
    .notNull()
    .references(() => disputes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});
