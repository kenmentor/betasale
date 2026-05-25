import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: [
      "order_update",
      "escrow_event",
      "dispute_status",
      "new_message",
      "payout",
      "system",
    ],
  }).notNull(),
  channel: text("channel", { enum: ["push", "sms", "email"] }).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  data: text("data", { mode: "json" }).$type<Record<string, unknown>>(),
  readAt: text("read_at"),
  sentAt: text("sent_at"),
  createdAt: text("created_at").notNull(),
});

export const notificationTokens = sqliteTable("notification_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  platform: text("platform", { enum: ["ios", "android", "web"] }).notNull(),
  createdAt: text("created_at").notNull(),
});
