import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";
import { useApp } from "@/context/AppState";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim() || form.email.split("@")[0] || "Foodie";
    login({ name, email: form.email || "demo@yumly.app" });
    onClose();
  }

  function google() {
    login({ name: "Alex Morgan", email: "alex@gmail.com" });
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="relative w-full max-w-md card-soft p-7"
          >
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "login" ? "Sign in to order from your favorites" : "Join Yumly to get exclusive deals"}
              </p>
            </div>

            <button
              type="button" onClick={google}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-2.5 text-sm font-medium hover:bg-muted transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.3h5.9c-.3 1.4-1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.4-5 3.4-8.3z"/><path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.3 1.1-3.9 1.1-3 0-5.6-2-6.5-4.8H1.7v3C3.6 20.7 7.5 23 12 23z"/><path fill="#FBBC05" d="M5.5 13.8c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2v-3H1.7C.9 7.9.5 9.9.5 12s.4 4.1 1.2 5.9l3.8-2.9z"/><path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.9 15.1 1 12 1 7.5 1 3.6 3.3 1.7 6.7l3.8 3c.9-2.7 3.5-4.7 6.5-4.7z"/></svg>
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <Field icon={<UserIcon className="h-4 w-4" />} placeholder="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              )}
              <Field icon={<Mail className="h-4 w-4" />} placeholder="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field icon={<Lock className="h-4 w-4" />} placeholder="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />

              <button type="submit" className="btn-cta w-full rounded-xl py-3 font-semibold text-base mt-2">
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {mode === "login" ? "New to Yumly? " : "Already have an account? "}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-primary hover:underline">
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement> & { onChange: (v: string) => void; value: string }) {
  const { onChange, ...rest } = props;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-input bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring/40">
      <span className="text-muted-foreground">{icon}</span>
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
