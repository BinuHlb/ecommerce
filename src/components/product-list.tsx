import { useEffect, useState } from "react";
import { medusa } from "@/src/lib/medusa";
import { ProductCard } from "./product-card";
import { Loader2 } from "lucide-react";

export function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { products } = await medusa.products.list();
        setProducts(products);
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error) {
    const isTableMissing = error.includes("relation \"products\" does not exist");
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-destructive font-medium">Error: {error}</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {isTableMissing 
            ? "The 'products' table hasn't been created in your Supabase database yet. You need to run the SQL setup script in the Supabase SQL Editor."
            : "There was an error fetching products. Please check your Supabase connection and table structure."}
        </p>
        {isTableMissing && (
          <div className="bg-secondary p-4 rounded-lg text-left max-w-lg mx-auto overflow-x-auto">
            <pre className="text-xs font-mono">
{`CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`}
            </pre>
          </div>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-muted-foreground">No products found.</p>
        <button 
          onClick={async () => {
            try {
              const res = await fetch("/api/seed", { method: "POST" });
              if (res.ok) window.location.reload();
              else throw new Error("Seed failed");
            } catch (err) {
              alert("Failed to seed products. Make sure the 'products' table exists in Supabase.");
            }
          }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Seed Sample Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {products.map((product) => (
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
  );
}
