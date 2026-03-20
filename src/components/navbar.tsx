import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCartStore } from "@/src/store/use-cart-store";
import { useUIStore } from "@/src/store/use-ui-store";
import { SupabaseConnectionCheck } from "./supabase-connection-check";
import { Link } from "react-router-dom";

export function Navbar() {
  const items = useCartStore((state) => state.items);
  const toggleCart = useUIStore((state) => state.toggleCart);
  
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter">
            LUXE
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/shop" className="transition-colors hover:text-foreground">Shop</Link>
            <Link to="/new" className="transition-colors hover:text-foreground">New Arrivals</Link>
            <Link to="/about" className="transition-colors hover:text-foreground">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block mr-4">
            <SupabaseConnectionCheck />
          </div>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/account">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={toggleCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
