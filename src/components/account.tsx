import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Button } from "@/src/components/ui/button";
import { Loader2, Package, User, LogOut } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import { Auth } from "./auth";

export function Account() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setOrders(orders || []);
      }
      setLoading(false);
    }

    fetchUserAndOrders();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading account details...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.email}</h1>
            <p className="text-sm text-muted-foreground">Customer since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="space-y-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 border rounded-2xl bg-secondary/10">
            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-2xl p-6 bg-background shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
                  <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
