import { useEffect, useState, type FormEvent } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";
import { resetPassword } from "@/lib/auth-api";
import { goToDashboard } from "@/lib/navigation";

type SignInModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

function AuthField({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
      />
    </label>
  );
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const { signInWithEmail, signInWithGoogle, openRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "reset">("signin");

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setMode("signin");
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success("Welcome back!");
      goToDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(response: CredentialResponse) {
    if (!response.credential) {
      toast.error("Google sign-in failed");
      return;
    }

    setLoading(true);
    try {
      await signInWithGoogle(response.credential);
      toast.success("Welcome back!");
      goToDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
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
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(email, newPassword);
      toast.success(result.message);
      setMode("signin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  function handleRegisterClick() {
    onOpenChange(false);
    openRegister();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-8">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-center text-xl font-medium tracking-tight">
            {mode === "signin" ? "Sign in" : "Reset password"}
          </DialogTitle>
          {mode === "reset" ? (
            <DialogDescription className="text-center">
              Enter your email and choose a new password.
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {mode === "signin" ? (
          <>
            <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
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
                    onClick={() => setMode("reset")}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm text-background transition-transform hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? <Spinner className="h-4 w-4" /> : null}
                Sign In
              </button>
            </form>

            {googleClientId ? (
              <>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <div className="flex justify-center [&>div]:w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google sign-in failed")}
                    theme="outline"
                    size="large"
                    width={320}
                    text="continue_with"
                    shape="pill"
                  />
                </div>
              </>
            ) : null}

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={handleRegisterClick}
                className="text-foreground hover:underline"
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <form className="mt-2 space-y-4" onSubmit={handleReset}>
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
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm text-background transition-transform hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? <Spinner className="h-4 w-4" /> : null}
                Reset password
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-foreground hover:underline"
              >
                Back to sign in
              </button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
