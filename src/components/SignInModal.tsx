import {
  useEffect,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/auth-context";
import { resetPassword } from "@/lib/auth-api";
import { goToDashboard } from "@/lib/navigation";

type SignInModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const { signInWithEmail, signInWithGoogle, openRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "reset">("signin");

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError(null);
      setMode("signin");
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
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      onOpenChange(false);
      goToDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      setError("Google sign-in failed.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle(response.credential);
      onOpenChange(false);
      goToDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const newPassword = String(form.get("newPassword") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!email || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPassword(email, newPassword);
      setMode("signin");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed.");
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
            aria-label="Close sign in"
            className="absolute inset-0 bg-black/40"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-title"
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
              id="signin-title"
              className="text-center text-[22px] font-semibold tracking-tight text-tap-fg"
            >
              {mode === "signin" ? "Sign in" : "Reset password"}
            </h2>
            {mode === "reset" ? (
              <p className="mt-2 text-center text-[14px] text-tap-muted">
                Enter your email and choose a new password.
              </p>
            ) : (
              <p className="mt-2 text-center text-[14px] text-tap-muted">
                Access your TapMe dashboard.
              </p>
            )}

            {mode === "signin" ? (
              <>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <AuthField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                  <div>
                    <AuthField
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      disabled={loading}
                    />
                    <div className="mt-1.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setMode("reset");
                        }}
                        className="text-[12px] text-tap-muted transition-colors hover:text-tap-fg"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-tap-fg px-6 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {loading ? "Signing in…" : "Sign in"}
                  </button>
                </form>

                {googleClientId ? (
                  <>
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-black/10" />
                      </div>
                      <div className="relative flex justify-center text-[12px] uppercase tracking-wide">
                        <span className="bg-white px-3 text-tap-muted">or</span>
                      </div>
                    </div>

                    <div className="flex justify-center [&>div]:w-full [&_iframe]:!w-full">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google sign-in failed.")}
                        theme="outline"
                        size="large"
                        width="336"
                        text="continue_with"
                        shape="pill"
                      />
                    </div>
                  </>
                ) : null}

                {error ? (
                  <p className="mt-4 text-center text-[13px] text-red-600">{error}</p>
                ) : null}

                <p className="mt-5 text-center text-[14px] text-tap-muted">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      openRegister();
                    }}
                    className="font-medium text-tap-link hover:text-tap-link-hover"
                  >
                    Register
                  </button>
                </p>
              </>
            ) : (
              <>
                <form className="mt-6 space-y-4" onSubmit={handleReset}>
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
                    label="New password"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={loading}
                  />
                  <AuthField
                    label="Confirm new password"
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
                    {loading ? "Saving…" : "Reset password"}
                  </button>
                </form>

                {error ? (
                  <p className="mt-4 text-center text-[13px] text-red-600">{error}</p>
                ) : null}

                <p className="mt-5 text-center text-[14px] text-tap-muted">
                  Remembered it?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setMode("signin");
                    }}
                    className="font-medium text-tap-link hover:text-tap-link-hover"
                  >
                    Back to sign in
                  </button>
                </p>
              </>
            )}
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
