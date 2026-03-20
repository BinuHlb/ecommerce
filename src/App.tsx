import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar } from "@/src/components/navbar";
import { Hero } from "@/src/components/hero";
import { ProductList } from "@/src/components/product-list";
import { CartDrawer } from "@/src/components/cart-drawer";
import { Checkout } from "@/src/components/checkout";
import { Account } from "@/src/components/account";
import { useUIStore } from "@/src/store/use-ui-store";
import { useCartStore } from "@/src/store/use-cart-store";

function Home() {
  return (
    <>
      <Hero />
      <section className="container mx-auto px-4 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground">Our most popular items this season.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold underline underline-offset-4 hover:text-primary/80">
            View All
          </Link>
        </div>
        <ProductList />
      </section>

      <section className="bg-secondary py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">Join the Community</h2>
            <p className="text-lg text-muted-foreground">
              Subscribe to our newsletter to receive updates on new collections, exclusive offers, and more.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-md border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="h-12 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Shop() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mb-12 flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Shop All</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse our complete collection of minimalist essentials, designed for the modern lifestyle.
        </p>
      </div>
      <ProductList />
    </section>
  );
}

export default function App() {
  const isCheckoutOpen = useUIStore((state) => state.isCheckoutOpen);
  const initCart = useCartStore((state) => state.initCart);

  useEffect(() => {
    initCart();
  }, [initCart]);

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main>
        {isCheckoutOpen ? (
          <Checkout />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        )}
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/shop" className="hover:text-foreground">All Products</Link></li>
                <li><Link to="/shop" className="hover:text-foreground">New Arrivals</Link></li>
                <li><Link to="/shop" className="hover:text-foreground">Best Sellers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Shipping</a></li>
                <li><a href="#" className="hover:text-foreground">Returns</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Sustainability</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Social</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground">Pinterest</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-xs text-muted-foreground">
            © 2026 LuxeCommerce. All rights reserved.
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
