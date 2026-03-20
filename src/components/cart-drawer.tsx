import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { useCartStore } from "@/src/store/use-cart-store";
import { useUIStore } from "@/src/store/use-ui-store";
import { formatCurrency } from "@/src/lib/utils";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const { isCartOpen, setCartOpen } = useUIStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full bg-secondary p-4">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setCartOpen(false)}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.variant}</p>
                          </div>
                          <p className="text-sm font-semibold">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex items-center justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total())}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button className="w-full py-6 text-base font-semibold">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
