import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  displayName: text("display_name"),
  profilePhoto: text("profile_photo"),
  role: text("role", { enum: ["buyer", "seller", "admin"] })
    .notNull()
    .default("buyer"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  phoneVerified: integer("phone_verified", { mode: "boolean" }).default(false),
  bankName: text("bank_name"),
  bankAccountNumber: text("bank_account_number"),
  bankAccountName: text("bank_account_name"),
  communicationEmail: integer("communication_email", { mode: "boolean" }).default(true),
  communicationSms: integer("communication_sms", { mode: "boolean" }).default(true),
  communicationPush: integer("communication_push", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const shippingAddresses = sqliteTable("shipping_addresses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: text("label"),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull().default("Nigeria"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
