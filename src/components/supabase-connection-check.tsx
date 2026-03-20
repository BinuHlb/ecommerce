import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function SupabaseConnectionCheck() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // 1. Check Auth connection
        const { error: authError } = await supabase.auth.getSession();
        if (authError) throw authError;
        
        // 2. Check if 'products' table exists and is readable
        const { error: dbError } = await supabase.from("products").select("id").limit(1);
        if (dbError) {
          if (dbError.code === "PGRST116" || dbError.message.includes("relation \"products\" does not exist")) {
            setStatus("error");
            setErrorMessage("Table 'products' does not exist. Please run the SQL setup script.");
            return;
          }
          throw dbError;
        }
        
        setStatus("connected");
      } catch (err: any) {
        console.error("Supabase connection check failed:", err);
        setStatus("error");
        setErrorMessage(err.message || "Unknown error");
      }
    }

    checkConnection();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking Supabase connection...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <XCircle className="h-4 w-4" />
        Supabase Connection Failed: {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-emerald-600">
      <CheckCircle2 className="h-4 w-4" />
      Supabase Connected
    </div>
  );
}
