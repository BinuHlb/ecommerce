import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isCheckoutOpen: false,
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
}));
