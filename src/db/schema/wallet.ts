import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const wallets = sqliteTable("wallets", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  balance: real("balance").notNull().default(0),
  pinHash: text("pin_hash"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const walletTransactions = sqliteTable("wallet_transactions", {
  id: text("id").primaryKey(),
  walletId: text("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["deposit", "withdrawal", "escrow_hold", "escrow_release", "refund", "transfer"],
  }).notNull(),
  amount: real("amount").notNull(),
  reference: text("reference"),
  status: text("status", {
    enum: ["pending", "successful", "failed"],
  })
    .notNull()
    .default("pending"),
  description: text("description"),
  createdAt: text("created_at").notNull(),
});
