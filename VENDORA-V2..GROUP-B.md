## **Software Requirements Specification (SRS)**

### **Vendora — Escrow E-Commerce Platform**

**Version:** 1.0 **Date:** May 2026 **Status:** Draft

---

### **1\. Introduction**

#### **1.1 Purpose**

Vendora is a mobile(Android and Ios) and web escrow e-commerce platform designed to empower young and independent vendors across Nigeria to reach their target audience through a secure, trust-driven marketplace. The platform addresses the widespread issue of payment fraud and delivery disputes in peer-to-peer commerce by introducing an escrow payment model , where funds from a buyer are securely held by the platform and only released to the vendor upon confirmed delivery of goods. The core aim of Vendora is to foster transactional trust between buyers and sellers, enabling both parties to trade with confidence.

---

#### **1.2 Scope**

**In Scope (Version 1.0):**

* Vendor and buyer registration with phone-based OTP authentication  
* Product listing, search, and cart management  
* Escrow-based checkout using Paystack as the payment gateway  
* Automated fund-holding logic,  funds are released to vendors only after buyer confirms receipt  
* Order lifecycle management: from placement through delivery confirmation  
* Dispute resolution workflow managed by a platform administrator  
* Push notifications and SMS alerts for order status updates  
* Admin dashboard for user management, dispute resolution, and payout oversight

**Out of Scope (Version 1.0):**

* Physical logistics or delivery partner integration  
* Multi-currency support (NGN only at launch)  
* Vendor subscription tiers or premium listings  
* Web-based buyer shopping (mobile-first at launch)

---

#### **1.3 Tech Stack**

| Layer | Technology |
| ----- | ----- |
| **Backend Runtime** | Node.js (TypeScript) |
| **Backend Framework** | Hono |
| **Mobile Frontend** | React Native (Expo Framework) |
| **Web Frontend** | React.js (TypeScript) |
| **Database** | Cloudflare D1 (SQLite-compatible) |
| **ORM** | Drizzle ORM |
| **Hosting & Edge** | Cloudflare Workers / Cloudflare Pages |
| **Payment Gateway** | Paystack (Payments, Transfers, Sub-accounts) |
| **Authentication** | Better Auth  |
|   |  |

---

## **2\. Functional Requirements**

---

### **2.1 User Roles**

Vendora operates with three distinct user roles, each with isolated permissions and access levels:

| Role | Description |
| ----- | ----- |
| **Buyer** | Browses products, places orders, holds escrow authority, confirms delivery |
| **Seller/Vendor** | Lists products, manages inventory, fulfills orders, receives payouts post-confirmation |
| **Admin** | Oversees platform operations, manages disputes, authorizes or blocks payouts, manages users |

---

### **2.2 Authentication & User Account Management**

**Authentication Provider:** Better Auth

**2.2.1 Sign-Up / Login**

* Email and password registration with email verification  
* Phone number registration with OTP verification (SMS-based)  
* Social login: Google and Apple OAuth  
* Session management handled entirely by Better Auth  
* No guest checkout , all purchases require an authenticated account

**2.2.2 Profile Management**

* Users can update: display name, profile photo, phone number, email,bank details  
* Users can create wallet and assign a 4 digit pin to the wallet  
* Merchant can withdraw money  
* Buyers can manage multiple saved shipping addresses  
* Buyers can manage billing information  
* Communication preferences: opt-in/out for email, SMS, and push notifications

**2.2.3 Order History**

* Buyers: view all past and active orders with full status timeline  
* Sellers: view all received orders with payout status per order  
* Downloadable invoice per completed order

---

### **2.3 Product Listing & Discovery**

**2.3.1 Seller — Product Management**

* Sellers can create, edit, and delete product listings  
* Each listing includes: title, description, price, stock quantity, category, and product images (max 5 per product)  
* Sellers can mark products as active, inactive, or out of stock  
* Real-time stock decrement on purchase; system prevents checkout if stock is zero

**2.3.2 Buyer — Product Discovery**

* Browse products by category  
* Keyword search with basic filtering (price range, category, location of seller)  
* Product detail page: images, description, seller info, ratings summary, stock availability  
* Wishlist: buyers can save products for future purchase  
* Ratings & Reviews: verified buyers (completed orders only) can leave star rating (1–5) and text review

---

### **2.4 Cart & Checkout**

**2.4.1 Cart Management**

* Add, update quantity, and remove items  
* Cart persists across sessions (tied to authenticated user)  
* Real-time stock validation before checkout proceeds

**2.4.2 Checkout Flow**

* Buyer reviews cart → confirms shipping address → views order summary with itemized costs  
* Tax calculation applied where applicable  
* Proceeds to Paystack payment

**2.4.3 Payment Methods (Paystack Native Only)**

* Debit/Credit card  
* Paystack's bank transfer option  
* USSD (via Paystack)  
* *(Apple Pay and Google Pay are excluded — not supported natively in Nigeria)*

---

### **2.5 Escrow Payment Logic**

This is the core financial engine of Vendora.

**2.5.1 Order Lifecycle**

PENDING → PAID → ESCROW HOLD → SHIPPED → DELIVERED → ESCROW RELEASED → COMPLETED  
                                                  ↘ DISPUTED

| State | Trigger | Fund Position |
| ----- | ----- | ----- |
| **PENDING** | Order created, awaiting payment | No funds moved |
| **PAID** | Paystack payment confirmed via webhook | Funds received by platform |
| **ESCROW HOLD** | System confirms payment integrity | Funds locked — neither party can access |
| **SHIPPED** | Seller marks order shipped \+ uploads tracking info | Funds remain locked |
| **DELIVERED** | Buyer confirms receipt of goods | Funds unlock, release initiated |
| **ESCROW RELEASED** | Platform initiates Paystack Transfer to seller | Funds transfer to seller sub-account |
| **COMPLETED** | Transfer confirmed by Paystack | Transaction closed |
| **DISPUTED** | Buyer raises dispute before confirming delivery | Funds frozen pending Admin resolution |

**2.5.2 Escrow Trigger Points**

* **Lock trigger:** Paystack webhook confirms successful payment → system moves order to ESCROW HOLD  
* **Release trigger:** Buyer explicitly taps "Confirm Delivery" in-app → system initiates Paystack Transfer  
* **Auto-release trigger:** If buyer takes no action within **72 hours** of order status reaching DELIVERED — funds are automatically released to seller (prevents buyer withholding confirmation indefinitely)  
* **Freeze trigger:** Buyer raises a dispute — auto-release timer is cancelled, funds frozen until Admin resolves

---

### **2.6 Dispute Resolution**

**Preliminary Flow:**

* Buyer can raise a dispute only after order status is SHIPPED and before ESCROW RELEASED  
* Dispute requires: a reason category (Not Received, Wrong Item, Damaged Item) and a text description  
* On dispute raised: escrow auto-release timer is immediately cancelled, funds frozen  
* Admin is notified and reviews both parties' evidence  
* Admin decision options: **Full Refund to Buyer** | **Full Release to Seller** | **Partial Split**  
* Both parties are notified of resolution via push notification and email/SMS

---

### **2.7 Order & Inventory Management**

* Automatic email receipt triggered on PAID status confirmation  
* Order tracking: buyer sees live status updates mapped to the lifecycle above  
* Seller receives push notification at each stage relevant to them (new order, delivery confirmed, payout sent)

---

### **2.8 In-App Messaging**

* Text-only direct messaging between buyer and seller on an active order  
* No voice notes, no file or image uploads  
* Messages are scoped a general inbox  
* Both parties can message only while the order is in an active state (PAID through DELIVERED)  
* Once order reaches COMPLETED or REFUNDED, the message thread is locked (read-only)

---

### **2.9 Notifications**

| Channel | Used For |
| ----- | ----- |
| **Push Notification** | Order updates, escrow events, dispute status, new messages |
| **SMS** | OTP, payment confirmation, critical order status changes |
| **Email** | Registration verification, invoices, dispute outcomes |

