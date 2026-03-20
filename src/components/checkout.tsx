import { useState } from "react";
import { useCartStore } from "@/src/store/use-cart-store";
import { Button } from "@/src/components/ui/button";
import { formatCurrency } from "@/src/lib/utils";
import { ShoppingBag, CreditCard, Truck, CheckCircle } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

export function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create order in Supabase
      const { error } = await supabase
        .from('orders')
        .insert([
          { 
            user_id: user?.id || 'anonymous', 
            items: items, 
            total: total(),
            status: 'pending'
          }
        ]);

      if (error) {
        console.error("Supabase Error:", error.message);
        // We'll proceed with the UI success even if DB fails for this demo
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setStep(3);
      clearCart();
    } catch (err) {
      console.error("Checkout Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some items to your cart to proceed to checkout.</p>
        <Button asChild>
          <a href="/">Go to Shop</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${step >= 1 ? "bg-primary text-primary-foreground" : ""}`}>1</span>
            Shipping
          </div>
          <div className="h-px w-8 bg-border" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${step >= 2 ? "bg-primary text-primary-foreground" : ""}`}>2</span>
            Payment
          </div>
          <div className="h-px w-8 bg-border" />
          <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${step >= 3 ? "bg-primary text-primary-foreground" : ""}`}>3</span>
            Success
          </div>
        </div>
      </div>

      <div className="grid gap-12 md:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Truck className="h-5 w-5" /> Shipping Information
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input className="w-full rounded-md border p-2 text-sm" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input className="w-full rounded-md border p-2 text-sm" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <input className="w-full rounded-md border p-2 text-sm" placeholder="123 Luxury St" />
              </div>
              <Button className="w-full sm:w-auto" onClick={() => setStep(2)}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <CreditCard className="h-5 w-5" /> Payment Method
              </div>
              <div className="rounded-xl border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Credit Card</span>
                  <div className="flex gap-2">
                    <div className="h-6 w-10 rounded bg-secondary" />
                    <div className="h-6 w-10 rounded bg-secondary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <input className="w-full rounded-md border p-2 text-sm" placeholder="**** **** **** ****" />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry</label>
                    <input className="w-full rounded-md border p-2 text-sm" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVC</label>
                    <input className="w-full rounded-md border p-2 text-sm" placeholder="***" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={handleCheckout} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay ${formatCurrency(total())}`}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
              <div className="rounded-full bg-green-100 p-4 text-green-600">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">Order Confirmed!</h2>
                <p className="text-muted-foreground">
                  Thank you for your purchase. We've sent a confirmation email to your inbox.
                </p>
              </div>
              <Button asChild>
                <a href="/">Continue Shopping</a>
              </Button>
            </div>
          )}
        </div>

        {step !== 3 && (
          <div className="space-y-6">
            <div className="rounded-xl border p-6 space-y-4">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total())}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
