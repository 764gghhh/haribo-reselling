"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  key: string;
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  hydrated: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "key" | "qty">, openDrawer?: boolean) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "hr-cart-v1";
const MAX_QTY = 10;

function makeKey(productId: string, variantId: string) {
  return `${productId}__${variantId}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Persistenz laden
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignorieren */
    }
    setHydrated(true);
  }, []);

  // Persistenz speichern
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignorieren */
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartItem, "key" | "qty">, openDrawer = true) => {
      const key = makeKey(item.productId, item.variantId);
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i,
          );
        }
        return [...prev, { ...item, key, qty: 1 }];
      });
      if (openDrawer) setOpen(true);
    },
    [],
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback(
    (key: string, qty: number) => {
      if (qty <= 0) {
        removeItem(key);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)),
      );
    },
    [removeItem],
  );

  const clear = useCallback(() => setItems([]), []);

  const { count, total } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        count: acc.count + item.qty,
        total: acc.total + item.price * item.qty,
      }),
      { count: 0, total: 0 },
    );
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      isOpen,
      hydrated,
      setOpen,
      addItem,
      removeItem,
      setQty,
      clear,
    }),
    [items, count, total, isOpen, hydrated, addItem, removeItem, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart muss innerhalb von CartProvider verwendet werden.");
  return ctx;
}
