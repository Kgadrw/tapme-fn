import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Eye, EyeOff, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ProfileQrCode } from "@/components/profile-qr-code";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCurrentProfile } from "@/context/profile-context";
import { useTheme, type Theme } from "@/context/theme-context";
import { getProfileUrl, slugify } from "@/lib/profile";
import { isSlugAvailable } from "@/lib/profile-api";
import { changePassword } from "@/lib/auth-api";

export const Route = createFileRoute("/_dashboard/settings")({
  component: SettingsPage,
});

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function SettingsPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">Settings</h1>
      </div>

      <UsernameSection />

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <ChangePasswordSection />

        <ThemeSection />

        <section className="rounded-2xl border border-border p-6 md:p-8">
          <div className="text-base font-medium text-foreground">Delete Account</div>
          <div className="mt-6">
            <button className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm text-foreground transition-colors hover:bg-secondary">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function UsernameSection() {
  const { profile, updateUsername } = useCurrentProfile();
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const usernameAckRef = useRef(false);
  const [username, setUsername] = useState(profile.slug);
  const [usernameAlertOpen, setUsernameAlertOpen] = useState(false);
  const [canEditUsername, setCanEditUsername] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    setUsername(profile.slug);
    setCanEditUsername(false);
  }, [profile.slug]);

  const normalizedUsername = slugify(username);
  const hasChanged = normalizedUsername !== profile.slug;
  const canSave = Boolean(normalizedUsername) && isAvailable && hasChanged && !checkingAvailability;

  useEffect(() => {
    if (!normalizedUsername || !hasChanged) {
      setIsAvailable(true);
      return;
    }

    let cancelled = false;
    setCheckingAvailability(true);

    isSlugAvailable(normalizedUsername, profile.slug)
      .then((available) => {
        if (!cancelled) setIsAvailable(available);
      })
      .finally(() => {
        if (!cancelled) setCheckingAvailability(false);
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedUsername, hasChanged, profile.slug]);

  function handleUsernameFocus() {
    if (canEditUsername) return;

    usernameInputRef.current?.blur();
    setUsernameAlertOpen(true);
  }

  function handleUsernameAlertOk() {
    usernameAckRef.current = true;
    setCanEditUsername(true);
    setUsernameAlertOpen(false);
    window.requestAnimationFrame(() => usernameInputRef.current?.focus());
  }

  function handleUsernameAlertLeave() {
    setUsername(profile.slug);
    setCanEditUsername(false);
    setUsernameAlertOpen(false);
    usernameInputRef.current?.blur();
  }

  function handleUsernameAlertOpenChange(open: boolean) {
    if (open) {
      setUsernameAlertOpen(true);
      return;
    }

    if (usernameAckRef.current) {
      usernameAckRef.current = false;
      setUsernameAlertOpen(false);
      return;
    }

    handleUsernameAlertLeave();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSave) return;

    const success = await updateUsername(normalizedUsername);
    if (!success) {
      toast.error("That username is already taken");
      return;
    }

    toast.success("Username updated");
    setCanEditUsername(false);
  }

  return (
    <>
      <section className="rounded-2xl border border-border p-6 md:p-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="text-base font-medium text-foreground">Username</div>

            <form className="mt-6 max-w-md space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted-foreground">Username</span>
                <input
                  ref={usernameInputRef}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  onFocus={handleUsernameFocus}
                  onBlur={() => setCanEditUsername(false)}
                  readOnly={!canEditUsername}
                  placeholder="john-carter"
                  autoComplete="username"
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground read-only:cursor-pointer read-only:opacity-90"
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Profile link:{" "}
                <span className="font-medium text-foreground">
                  {normalizedUsername ? getProfileUrl(normalizedUsername) : "—"}
                </span>
              </p>

              {!isAvailable && normalizedUsername ? (
                <p className="text-xs text-red-600 dark:text-red-400">This username is already taken.</p>
              ) : null}

              <button
                type="submit"
                disabled={!canSave}
                className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm text-background transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save username
              </button>
            </form>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProfileQrCode slug={profile.slug} />
          </div>
        </div>
      </section>

      <AlertDialog open={usernameAlertOpen} onOpenChange={handleUsernameAlertOpenChange}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <AlertDialogTitle>Change username?</AlertDialogTitle>
                <AlertDialogDescription className="mt-2 text-left">
                  Changing your username updates your public profile link. If your NFC card is
                  programmed with your old link, you may lose access to the account linked to that
                  card because your profile preview is rendered from your username.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full shadow-none" onClick={handleUsernameAlertLeave}>
              Leave
            </AlertDialogCancel>
            <AlertDialogAction className="rounded-full" onClick={handleUsernameAlertOk}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ChangePasswordSection() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  }, [open]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-border p-6 md:p-8">
        <div className="text-base font-medium text-foreground">Change Password</div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm text-background transition-transform hover:scale-[1.01]"
          >
            Change password
          </button>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <PasswordField
              id="current-password"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showCurrentPassword}
              onToggleVisible={() => setShowCurrentPassword((value) => !value)}
            />
            <PasswordField
              id="new-password"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              visible={showNewPassword}
              onToggleVisible={() => setShowNewPassword((value) => !value)}
            />
            <Button type="submit" className="h-11 w-full rounded-full">
              Update password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="rounded-2xl border border-border p-6 md:p-8">
      <div className="text-base font-medium text-foreground">Theme</div>
      <div className="mt-6 flex flex-wrap gap-2">
        {themeOptions.map(({ value, label, icon: Icon }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={active}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={id === "current-password" ? "current-password" : "new-password"}
          className="h-11 w-full rounded-full border border-border bg-background px-4 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
