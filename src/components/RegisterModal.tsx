import {
  useEffect,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { goToDashboard } from "@/lib/navigation";

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const { register, openSignIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onOpenChange]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!fullName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register(fullName, email, password);
      onOpenChange(false);
      goToDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close register"
            className="absolute inset-0 bg-black/40"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[400px] rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-8"
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-tap-muted transition-colors hover:bg-black/[0.04] hover:text-tap-fg"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h2
              id="register-title"
              className="text-center text-[22px] font-semibold tracking-tight text-tap-fg"
            >
              Create account
            </h2>
            <p className="mt-2 text-center text-[14px] text-tap-muted">
              Set up TapMe and open your dashboard.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <AuthField
                label="Full name"
                name="fullName"
                placeholder="Your name"
                autoComplete="name"
                required
                disabled={loading}
              />
              <AuthField
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
              <AuthField
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <AuthField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-tap-fg px-6 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {loading ? "Creating…" : "Create account"}
              </button>
            </form>

            {error ? (
              <p className="mt-4 text-center text-[13px] text-red-600">{error}</p>
            ) : null}

            <p className="mt-5 text-center text-[14px] text-tap-muted">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  openSignIn();
                }}
                className="font-medium text-tap-link hover:text-tap-link-hover"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AuthField({
  label,
  ...rest
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = rest.name ?? label;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[13px] text-tap-muted">{label}</span>
      <input
        id={id}
        {...rest}
        className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-[15px] text-tap-fg outline-none transition placeholder:text-tap-muted/70 focus:border-tap-link disabled:opacity-60"
      />
    </label>
  );
}
