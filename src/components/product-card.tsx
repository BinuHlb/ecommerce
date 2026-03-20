import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useCartStore, CartItem } from "@/src/store/use-cart-store";
import { formatCurrency } from "@/src/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  key?: string;
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    await addItem(id, 1);
  };

  return (
    <div className="group relative flex flex-col gap-3">
      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button 
            size="icon" 
            className="h-10 w-10 rounded-full shadow-lg"
            onClick={handleAddToCart}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {category}
        </span>
        <h3 className="text-sm font-medium leading-none">{name}</h3>
        <p className="text-sm font-semibold">{formatCurrency(price)}</p>
      </div>
    </div>
  );
}
