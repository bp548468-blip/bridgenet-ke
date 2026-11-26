import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Network } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in | BridgeNet" },
      { name: "description", content: "Log in or create your BridgeNet account to manage your talent profile." },
      { property: "og:title", content: "Log in | BridgeNet" },
      { property: "og:description", content: "Log in or create your BridgeNet account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const input =
  "mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/profile" },
      });
      setMessage(error ? error.message : "Check your email to confirm your account, then log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else void navigate({ to: "/profile" });
    }
    setBusy(false);
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/profile" });
    if ("error" in res && res.error) setMessage(res.error.message);
    else if (!("redirected" in res && res.redirected)) void navigate({ to: "/profile" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Network className="size-5" />
          </span>
          <span className="font-display text-2xl font-semibold text-primary">BridgeNet</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <button
          type="button"
          onClick={google}
          className="mt-6 h-12 w-full cursor-pointer rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted"
        >
          Continue with Google
        </button>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="h-12 w-full cursor-pointer rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-secondary-dark" role="status">{message}</p>}
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-5 w-full cursor-pointer text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}
