import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Medusa-compatible Store API ---

  // Products
  app.get("/store/products", async (req, res) => {
    try {
      if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
        console.error("Supabase credentials missing on server");
        return res.status(500).json({ 
          message: "Supabase credentials missing on server. Please check your environment variables." 
        });
      }

      const { data, error } = await supabase
        .from("products")
        .select("*");
      
      if (error) {
        console.error("Supabase Products Error:", error.message, error.code);
        return res.status(500).json({ 
          message: `Supabase Error: ${error.message} (Code: ${error.code})` 
        });
      }
      
      res.json({ products: data || [] });
    } catch (err: any) {
      console.error("Unexpected Server Error:", err);
      res.status(500).json({ message: err.message || "An unexpected server error occurred" });
    }
  });

  // Carts
  app.post("/store/carts", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("carts")
        .insert([{ status: "active" }])
        .select()
        .single();
      
      if (error) throw error;
      res.json({ cart: { ...data, items: [] } });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/store/carts/:id", async (req, res) => {
    try {
      const { data: cart, error: cartError } = await supabase
        .from("carts")
        .select("*")
        .eq("id", req.params.id)
        .single();
      
      if (cartError) throw cartError;

      const { data: items, error: itemsError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", req.params.id);
      
      if (itemsError) throw itemsError;

      res.json({ cart: { ...cart, items: items || [] } });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/store/carts/:id/line-items", async (req, res) => {
    try {
      const { variant_id, quantity } = req.body;
      
      // Fetch product to get details (mocking variant_id as product_id for simplicity)
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", variant_id)
        .single();
      
      if (productError) throw productError;

      const { data, error } = await supabase
        .from("cart_items")
        .insert([{
          cart_id: req.params.id,
          product_id: variant_id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        }])
        .select()
        .single();
      
      if (error) throw error;

      // Return the updated cart
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", req.params.id);

      res.json({ cart: { id: req.params.id, items: cartItems || [] } });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/store/carts/:id/line-items/:line_id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", req.params.line_id);
      
      if (error) throw error;

      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", req.params.id);

      res.json({ cart: { id: req.params.id, items: cartItems || [] } });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/store/carts/:id/line-items/:line_id", async (req, res) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", req.params.line_id);
      
      if (error) throw error;

      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", req.params.id);

      res.json({ cart: { id: req.params.id, items: cartItems || [] } });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Stripe Payment Intent
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    const { amount, currency = "usd" } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Seed
  app.post("/api/seed", async (req, res) => {
    try {
      const products = [
        { name: 'Classic White Tee', price: 4500, image: 'https://picsum.photos/seed/tee/800/1000', category: 'Apparel' },
        { name: 'Minimalist Watch', price: 12500, image: 'https://picsum.photos/seed/watch/800/1000', category: 'Accessories' },
        { name: 'Leather Tote Bag', price: 18500, image: 'https://picsum.photos/seed/bag/800/1000', category: 'Accessories' },
        { name: 'Wool Blend Sweater', price: 9500, image: 'https://picsum.photos/seed/sweater/800/1000', category: 'Apparel' },
        { name: 'Canvas Sneakers', price: 7500, image: 'https://picsum.photos/seed/sneakers/800/1000', category: 'Footwear' },
        { name: 'Denim Jacket', price: 11500, image: 'https://picsum.photos/seed/jacket/800/1000', category: 'Apparel' }
      ];
      
      const { error } = await supabase.from("products").insert(products);
      if (error) throw error;
      
      res.json({ message: "Seeded successfully" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
