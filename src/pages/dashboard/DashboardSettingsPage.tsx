import {
  AlertTriangle,
  AtSign,
  Eye,
  EyeOff,
  HelpCircle,
  Link2,
  Lock,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sun,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useCurrentProfile } from "@/context/profile-context";
import { useTheme, type Theme } from "@/context/theme-context";
import { getMarketingUrl } from "@/lib/domains";
import { getProfileUrl, slugify } from "@/lib/profile";
import { isSlugAvailable } from "@/lib/profile-api";
import { changePassword } from "@/lib/auth-api";
import { cn } from "@/lib/utils";

const themeOptions: {
  value: Theme;
  label: string;
  hint: string;
  icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", hint: "Bright console for daytime use", icon: Sun },
  { value: "dark", label: "Dark", hint: "Lower glare in low light", icon: Moon },
  { value: "system", label: "System", hint: "Match your device setting", icon: Monitor },
];

export function DashboardSettingsPage() {
  const { user } = useAuth();
  const { profile } = useCurrentProfile();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="g-page-title">Settings</h1>
        <p className="g-page-subtitle">
          Manage your username, security, appearance, and account.
        </p>
      </div>

      <section className="g-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--g-blue-soft)] text-[var(--g-blue-text)]">
            <Shield className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-base font-medium text-[var(--g-text)]">Account settings</div>
            <p className="mt-1 text-sm text-[var(--g-muted)]">
              Signed in as{" "}
              <span className="font-medium text-[var(--g-text)]">
                {user?.email ?? "your TapMe account"}
              </span>
              . Your public link is{" "}
              <a
                href={getProfileUrl(profile.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--g-blue-text)] underline-offset-2 hover:underline"
              >
                {getProfileUrl(profile.slug)}
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <UsernameSection />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ChangePasswordSection />
        <ThemeSection />
      </div>

      <DangerZoneSection />

      <section className="g-card p-5 md:p-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
          <h2 className="text-sm font-medium text-[var(--g-text)]">Common questions</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <FaqItem
            question="Will changing my username break my NFC card?"
            answer="Yes, it can. NFC cards usually open your old profile link. Update the card or keep the same username if the card is already programmed."
          />
          <FaqItem
            question="How strong should my password be?"
            answer="Use at least 8 characters, and prefer a unique password you do not reuse on other sites."
          />
          <FaqItem
            question="Need help with your account?"
            answer={
              <>
                Contact the TapMe team from the{" "}
                <a
                  href={getMarketingUrl("/contact")}
                  className="font-medium text-[var(--g-blue-text)] underline-offset-2 hover:underline"
                >
                  contact page
                </a>
                .
              </>
            }
          />
        </div>
      </section>
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
      <section className="g-card p-5 md:p-6">
        <div className="flex items-center gap-2">
          <AtSign className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
          <h2 className="text-sm font-medium text-[var(--g-text)]">Username and profile link</h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-[var(--g-muted)]">
          Your username builds your public TapMe URL and QR code. Change it carefully if your NFC
          card already uses the current link.
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <form className="max-w-xl space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-[var(--g-muted)]">
                Username
              </span>
              <input
                ref={usernameInputRef}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onFocus={handleUsernameFocus}
                onBlur={() => setCanEditUsername(false)}
                readOnly={!canEditUsername}
                placeholder="john-carter"
                autoComplete="username"
                className="h-10 w-full rounded-[8px] border border-[var(--g-border)] bg-white px-3.5 text-sm text-[var(--g-text)] outline-none transition-colors placeholder:text-[#80868b] focus:border-[var(--g-blue)] focus:shadow-[0_0_0_2px_rgba(26,115,232,0.2)] read-only:cursor-pointer read-only:bg-[#f8f9fa]"
              />
            </label>

            <div className="rounded-[8px] border border-[var(--g-border)] bg-[#f8f9fa] px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--g-muted)]">
                <Link2 className="h-3.5 w-3.5" />
                Public profile link
              </div>
              <p className="mt-1.5 break-all text-sm text-[var(--g-text)]">
                {normalizedUsername ? (
                  <a
                    href={getProfileUrl(normalizedUsername)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--g-blue-text)] underline-offset-2 hover:underline"
                  >
                    {getProfileUrl(normalizedUsername)}
                  </a>
                ) : (
                  <span className="font-medium">-</span>
                )}
              </p>
              {checkingAvailability ? (
                <p className="mt-2 text-xs text-[var(--g-muted)]">Checking availability…</p>
              ) : null}
              {!isAvailable && normalizedUsername ? (
                <p className="mt-2 text-xs text-[var(--g-danger)]">This username is already taken.</p>
              ) : null}
              {hasChanged && isAvailable && normalizedUsername ? (
                <p className="mt-2 text-xs text-[#137333]">This username is available.</p>
              ) : null}
            </div>

            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <DetailRow label="Current username" value={profile.slug} />
              <DetailRow
                label="Status"
                value={hasChanged ? "Pending save" : "Saved"}
              />
            </dl>

            <button type="submit" disabled={!canSave} className="g-btn-primary disabled:opacity-45">
              Save username
            </button>
          </form>

          <div className="flex flex-col items-start gap-3">
            <div className="text-xs font-medium text-[var(--g-muted)]">Profile QR code</div>
            <ProfileQrCode slug={profile.slug} />
            <p className="max-w-[220px] text-xs leading-relaxed text-[var(--g-muted)]">
              Share or download this QR so people can open your public profile quickly.
            </p>
          </div>
        </div>
      </section>

      <AlertDialog open={usernameAlertOpen} onOpenChange={handleUsernameAlertOpenChange}>
        <AlertDialogContent
          overlayClassName="g-modal-overlay"
          className="g-modal max-w-md gap-0 p-0 sm:rounded-[12px]"
        >
          <div className="g-modal-body space-y-5">
            <AlertDialogHeader className="space-y-0 text-left sm:text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#f9ab00]" />
                <div>
                  <AlertDialogTitle className="g-modal-title">Change username?</AlertDialogTitle>
                  <AlertDialogDescription className="g-modal-desc mt-2 text-left">
                    Changing your username updates your public profile link. If your NFC card is
                    programmed with your old link, you may lose access to the account linked to that
                    card because your profile preview is rendered from your username.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:space-x-0">
              <AlertDialogCancel
                className="g-modal-btn-secondary mt-0 h-9 border shadow-none"
                onClick={handleUsernameAlertLeave}
              >
                Leave
              </AlertDialogCancel>
              <AlertDialogAction
                className="h-9 rounded-full bg-[var(--g-blue)] px-5 text-sm font-medium text-white hover:bg-[var(--g-blue-hover)]"
                onClick={handleUsernameAlertOk}
              >
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
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
      <section className="g-card p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
          <h2 className="text-sm font-medium text-[var(--g-text)]">Password and security</h2>
        </div>
        <p className="mt-2 text-sm text-[var(--g-muted)]">
          Keep your TapMe account safe with a strong password. You will need your current password
          to set a new one.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-[var(--g-muted)]">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--g-blue)]" />
            Minimum 8 characters
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--g-blue)]" />
            Prefer a unique password you do not reuse elsewhere
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--g-blue)]" />
            Change it if you think someone else may know it
          </li>
        </ul>

        <button type="button" onClick={() => setOpen(true)} className="g-btn-primary mt-6">
          Change password
        </button>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          overlayClassName="g-modal-overlay"
          className="g-modal max-w-[440px] sm:rounded-[12px]"
        >
          <div className="g-modal-body">
            <DialogHeader className="space-y-0 text-left sm:text-left">
              <DialogTitle className="g-modal-title">Change password</DialogTitle>
              <p className="g-modal-desc">Use a strong password with at least 8 characters.</p>
            </DialogHeader>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              <button type="submit" className="g-modal-btn">
                Update password
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="g-card p-5 md:p-6">
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
        <h2 className="text-sm font-medium text-[var(--g-text)]">Appearance</h2>
      </div>
      <p className="mt-2 text-sm text-[var(--g-muted)]">
        Choose how the TapMe console looks on this device. This does not change your public
        profile.
      </p>

      <div className="mt-5 space-y-2">
        {themeOptions.map(({ value, label, hint, icon: Icon }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={active}
              className={cn(
                "flex w-full items-start gap-3 rounded-[8px] border px-3.5 py-3 text-left transition-colors",
                active
                  ? "border-transparent bg-[var(--g-blue-soft)]"
                  : "border-[var(--g-border)] hover:bg-[#f8f9fa]",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  active
                    ? "bg-white text-[var(--g-blue-text)]"
                    : "bg-[#f1f3f4] text-[var(--g-muted)]",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span
                  className={cn(
                    "block text-sm font-medium",
                    active ? "text-[var(--g-blue-text)]" : "text-[var(--g-text)]",
                  )}
                >
                  {label}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--g-muted)]">{hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DangerZoneSection() {
  return (
    <section className="g-card border-[#f6aea9] p-5 md:p-6">
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-[var(--g-danger)]" strokeWidth={1.75} />
        <h2 className="text-sm font-medium text-[var(--g-text)]">Danger zone</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-[var(--g-muted)]">
        Deleting your account permanently removes your TapMe profile, links, and dashboard access.
        This cannot be undone.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border border-[var(--g-border)] px-5 text-sm font-medium text-[var(--g-danger)] transition-colors hover:bg-[#fce8e6]"
        >
          Delete account
        </button>
        <span className="text-xs text-[var(--g-muted)]">
          Export anything you need before you continue.
        </span>
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-[8px] border border-[var(--g-border)] px-3 py-2.5">
      <dt className="text-[var(--g-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[var(--g-text)]">{value}</dd>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-[var(--g-text)]">{question}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">{answer}</p>
    </div>
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
    <div>
      <Label htmlFor={id} className="g-modal-label">
        {label}
      </Label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={id === "current-password" ? "current-password" : "new-password"}
          className="g-modal-input pr-11"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--g-muted)] transition-colors hover:bg-[var(--g-canvas)] hover:text-[var(--g-text)]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
