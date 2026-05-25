import { create } from "zustand";

export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  seller: string;
  imageUri: string;
  description: string;
  category: string;
  badge?: string;
};

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUri: string;
  seller: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: "pending" | "shipped" | "delivered";
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Wireless Headset 3000mph",
    price: 200,
    originalPrice: 280,
    rating: 4.5,
    reviewsCount: 185,
    seller: "Mentor",
    imageUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Premium wireless headset with noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for work and play.",
    category: "Electronics",
    badge: "-29%",
  },
  {
    id: "2",
    title: "Mechanical Keyboard RGB",
    price: 120,
    originalPrice: 160,
    rating: 4.3,
    reviewsCount: 92,
    seller: "KeyTech",
    imageUri: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
    description: "Full-size mechanical keyboard with customizable RGB lighting, hot-swappable switches, and aluminum frame.",
    category: "Electronics",
    badge: "-25%",
  },
  {
    id: "3",
    title: "Ergonomic Desk Mouse",
    price: 45,
    originalPrice: 65,
    rating: 4.1,
    reviewsCount: 210,
    seller: "Mentor",
    imageUri: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    description: "Ergonomically designed wireless mouse with 6 programmable buttons and smooth tracking.",
    category: "Electronics",
  },
  {
    id: "4",
    title: "UltraWide Monitor 4K",
    price: 450,
    originalPrice: 600,
    rating: 4.7,
    reviewsCount: 64,
    seller: "ScreenMaster",
    imageUri: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    description: "34-inch ultrawide 4K monitor with HDR support, 144Hz refresh rate, and built-in speakers.",
    category: "Electronics",
    badge: "-25%",
  },
  {
    id: "5",
    title: "Smart Watch Pro",
    price: 250,
    originalPrice: 320,
    rating: 4.6,
    reviewsCount: 158,
    seller: "TechWear",
    imageUri: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery life.",
    category: "Wearables",
    badge: "-22%",
  },
  {
    id: "6",
    title: "Bluetooth Speaker",
    price: 80,
    originalPrice: 110,
    rating: 4.2,
    reviewsCount: 327,
    seller: "SoundWave",
    imageUri: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    description: "Portable waterproof bluetooth speaker with 360-degree sound and 20-hour playtime.",
    category: "Electronics",
  },
  {
    id: "7",
    title: "Leather Laptop Bag",
    price: 90,
    originalPrice: 130,
    rating: 4.4,
    reviewsCount: 73,
    seller: "Mentor",
    imageUri: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    description: "Handcrafted genuine leather laptop bag fits up to 15.6-inch devices with multiple compartments.",
    category: "Accessories",
    badge: "-31%",
  },
  {
    id: "8",
    title: "USB-C Hub 7-in-1",
    price: 35,
    originalPrice: 50,
    rating: 4.0,
    reviewsCount: 412,
    seller: "KeyTech",
    imageUri: "https://images.unsplash.com/photo-1625723044793-44de16cc9d71?w=400&h=400&fit=crop",
    description: "Compact 7-in-1 USB-C hub with HDMI, SD card, USB 3.0, and PD charging pass-through.",
    category: "Electronics",
    badge: "-30%",
  },
];

const initialCart: CartItem[] = [
  {
    productId: "1",
    title: "Wireless Headset 3000mph",
    price: 200,
    quantity: 1,
    imageUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    seller: "Mentor",
  },
  {
    productId: "3",
    title: "Ergonomic Desk Mouse",
    price: 45,
    quantity: 2,
    imageUri: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    seller: "Mentor",
  },
  {
    productId: "6",
    title: "Bluetooth Speaker",
    price: 80,
    quantity: 1,
    imageUri: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    seller: "SoundWave",
  },
];

const sampleOrder: Order = {
  id: "ORD-A3F8K2",
  items: [
    {
      productId: "2",
      title: "Mechanical Keyboard RGB",
      price: 120,
      quantity: 1,
      imageUri: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop",
      seller: "KeyTech",
    },
    {
      productId: "8",
      title: "USB-C Hub 7-in-1",
      price: 35,
      quantity: 2,
      imageUri: "https://images.unsplash.com/photo-1625723044793-44de16cc9d71?w=400&h=400&fit=crop",
      seller: "KeyTech",
    },
  ],
  total: 190,
  date: "May 20, 2026",
  status: "shipped",
};

type MarketplaceStore = {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  cart: CartItem[];
  orders: Order[];

  signIn: (email: string, password: string) => void;
  signOut: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
};

export const useMarketplaceStore = create<MarketplaceStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  cart: initialCart,
  orders: [sampleOrder],

  signIn: (email: string, _password: string) => {
    const name = email.split("@")[0];
    set({
      isAuthenticated: true,
      user: { name: name.charAt(0).toUpperCase() + name.slice(1), email },
    });
  },

  signOut: () => {
    set({ isAuthenticated: false, user: null });
  },

  addToCart: (product: Product) => {
    const { cart } = get();
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      set({
        cart: cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      });
    } else {
      set({
        cart: [
          ...cart,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            imageUri: product.imageUri,
            seller: product.seller,
          },
        ],
      });
    }
  },

  removeFromCart: (productId: string) => {
    set({ cart: get().cart.filter((item) => item.productId !== productId) });
  },

  updateCartQuantity: (productId: string, delta: number) => {
    set({
      cart: get().cart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    });
  },

  clearCart: () => set({ cart: [] }),

  placeOrder: () => {
    const { cart, orders } = get();
    if (cart.length === 0) return;
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: [...cart],
      total,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: "pending",
    };
    set({ orders: [order, ...orders], cart: [] });
  },

  getCartTotal: () => {
    return get().cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  },

  getCartCount: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
