import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function SupabaseConnectionCheck() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Try to fetch the current session as a simple connection test
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
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
