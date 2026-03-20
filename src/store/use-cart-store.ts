import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { medusa } from '@/src/lib/medusa';

export interface CartItem {
  id: string; // This will be the line item ID from Medusa
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface CartState {
  cartId: string | null;
  items: CartItem[];
  initCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      initCart: async () => {
        let currentCartId = get().cartId;
        
        if (!currentCartId) {
          try {
            const { cart } = await medusa.carts.create();
            set({ cartId: cart.id, items: [] });
          } catch (err) {
            console.error("Failed to create cart:", err);
          }
        } else {
          try {
            const { cart } = await medusa.carts.retrieve(currentCartId);
            set({ items: cart.items as any[] });
          } catch (err) {
            console.error("Failed to retrieve cart, creating new one:", err);
            const { cart } = await medusa.carts.create();
            set({ cartId: cart.id, items: [] });
          }
        }
      },
      addItem: async (productId, quantity) => {
        let currentCartId = get().cartId;
        if (!currentCartId) {
          await get().initCart();
          currentCartId = get().cartId;
        }

        if (currentCartId) {
          try {
            const { cart } = await medusa.carts.lineItems.create(currentCartId, {
              variant_id: productId, // Using product_id as variant_id for this simplified proxy
              quantity
            });
            set({ items: cart.items as any[] });
          } catch (err) {
            console.error("Failed to add item:", err);
          }
        }
      },
      removeItem: async (lineItemId) => {
        const currentCartId = get().cartId;
        if (currentCartId) {
          try {
            const { cart } = await medusa.carts.lineItems.delete(currentCartId, lineItemId);
            set({ items: cart.items as any[] });
          } catch (err) {
            console.error("Failed to remove item:", err);
          }
        }
      },
      updateQuantity: async (lineItemId, quantity) => {
        const currentCartId = get().cartId;
        if (currentCartId) {
          if (quantity <= 0) {
            await get().removeItem(lineItemId);
            return;
          }
          try {
            const { cart } = await medusa.carts.lineItems.update(currentCartId, lineItemId, {
              quantity
            });
            set({ items: cart.items as any[] });
          } catch (err) {
            console.error("Failed to update quantity:", err);
          }
        }
      },
      clearCart: () => set({ items: [], cartId: null }),
      total: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    { name: 'cart-storage' }
  )
);
