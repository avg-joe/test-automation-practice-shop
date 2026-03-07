import { atom, computed } from 'nanostores';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export const cartItems = atom<CartItem[]>([]);

export const cartCount = computed(cartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const current = cartItems.get();
  const existing = current.find((i) => i.id === item.id);

  if (existing) {
    cartItems.set(
      current.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  } else {
    cartItems.set([...current, { ...item, quantity: 1 }]);
  }
}
