export const ESCROW_AUTO_RELEASE_HOURS = 72;

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  ESCROW_HOLD: "escrow_hold",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  ESCROW_RELEASED: "escrow_released",
  COMPLETED: "completed",
  DISPUTED: "disputed",
  REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const DISPUTE_REASONS = {
  NOT_RECEIVED: "not_received",
  WRONG_ITEM: "wrong_item",
  DAMAGED_ITEM: "damaged_item",
} as const;

export const DISPUTE_RESOLUTIONS = {
  FULL_REFUND: "full_refund",
  FULL_RELEASE: "full_release",
  PARTIAL_SPLIT: "partial_split",
} as const;

export const MAX_PRODUCT_IMAGES = 5;
