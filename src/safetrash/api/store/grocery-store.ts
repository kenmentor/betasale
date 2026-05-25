import { create } from "zustand";

export type GroceryCategory = "Produce" | "Dairy" | "Bakery" | "Pantry" | "Snacks";
export type GroceryPriority = "low" | "medium" | "high";

export type GroceryItem = {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  purchased: boolean;
  priority: GroceryPriority;
};

export type CreateItemInput = {
  name: string;
  category: GroceryCategory;
  quantity: number;
  priority: GroceryPriority;
};

type GroceryStore = {
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
  loadItems: () => void;
  addItem: (input: CreateItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  togglePurchased: (id: string) => void;
  removeItem: (id: string) => void;
  clearPurchased: () => void;
};

let nextId = 1;
const genId = () => String(nextId++);

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  loadItems: () => {
    set({ isLoading: false, error: null });
  },

  addItem: (input) => {
    const item: GroceryItem = {
      id: genId(),
      name: input.name,
      category: input.category,
      quantity: Math.max(1, input.quantity),
      purchased: false,
      priority: input.priority,
    };
    set((state) => ({ items: [item, ...state.items], error: null }));
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    }));
  },

  togglePurchased: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item,
      ),
    }));
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },

  clearPurchased: () => {
    set((state) => ({ items: state.items.filter((item) => !item.purchased) }));
  },
}));
