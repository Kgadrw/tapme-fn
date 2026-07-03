import { useEffect, useState, type FormEvent } from "react";
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
import { registerAccount } from "@/lib/auth-api";
import { goToDashboard } from "@/lib/navigation";

type RegisterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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

export function RegisterModal({ open, onOpenChange }: RegisterModalProps) {
  const { completeSignIn, openSignIn } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await registerAccount(fullName, email, password);
      completeSignIn(response);
      toast.success("Account created! Welcome to tapme.");
      goToDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function handleSignInClick() {
    onOpenChange(false);
    openSignIn();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-8">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-center text-xl font-medium tracking-tight">
            Create account
          </DialogTitle>
          <DialogDescription className="text-center">
            Start your digital profile.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
          <AuthField
            label="Full Name"
            name="fullName"
            placeholder="John Carter"
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
            label="Confirm Password"
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
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button type="button" onClick={handleSignInClick} className="text-foreground hover:underline">
            Sign In
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
