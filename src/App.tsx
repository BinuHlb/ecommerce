import { Navbar } from "@/src/components/navbar";
import { Hero } from "@/src/components/hero";
import { ProductCard } from "@/src/components/product-card";
import { CartDrawer } from "@/src/components/cart-drawer";

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Minimalist Leather Watch",
    price: 12900,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1999",
  },
  {
    id: "2",
    name: "Premium Cotton Tee",
    price: 4500,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1974",
  },
  {
    id: "3",
    name: "Ceramic Coffee Set",
    price: 8500,
    category: "Home",
    image: "https://images.unsplash.com/photo-1517256011251-ad211ac17322?auto=format&fit=crop&q=80&w=1974",
  },
  {
    id: "4",
    name: "Leather Weekend Bag",
    price: 21000,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "5",
    name: "Wool Blend Coat",
    price: 35000,
    category: "Apparel",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=1974",
  },
  {
    id: "6",
    name: "Wireless Headphones",
    price: 29900,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2070",
  },
];

export default function App() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
        <section className="container mx-auto px-4 py-24">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground">Our most popular items this season.</p>
            </div>
            <a href="/shop" className="text-sm font-semibold underline underline-offset-4 hover:text-primary/80">
              View All
            </a>
          </div>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
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
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">All Products</a></li>
                <li><a href="#" className="hover:text-foreground">New Arrivals</a></li>
                <li><a href="#" className="hover:text-foreground">Best Sellers</a></li>
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
