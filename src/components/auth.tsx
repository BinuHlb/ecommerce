import React, { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { Button } from "@/src/components/ui/button";

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("Check your email for the login link!");
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-xl bg-background shadow-sm max-w-sm mx-auto my-12">
      <h2 className="text-xl font-bold">Sign In</h2>
      <p className="text-sm text-muted-foreground">Enter your email to receive a magic link.</p>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 rounded-md border px-3 text-sm"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Send Magic Link"}
        </Button>
      </form>
    </div>
  );
}
