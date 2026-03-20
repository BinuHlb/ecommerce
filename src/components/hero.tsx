import { ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-secondary">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070"
          alt="Hero background"
          className="h-full w-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>
      
      <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            New Collection 2026
          </span>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
            Elegance in <br /> Every Detail.
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Discover our curated selection of premium essentials designed for the modern lifestyle.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-base font-semibold">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold">
              View Lookbook
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
