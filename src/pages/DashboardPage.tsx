import { useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { getMarketingUrl } from "../lib/domains";
import { goToMarketing } from "../lib/navigation";

export function DashboardPage() {
  const { isBootstrapping, isSignedIn, user, profile, signOut } = useAuth();

  useEffect(() => {
    if (!isBootstrapping && !isSignedIn) {
      goToMarketing("/signin");
    }
  }, [isBootstrapping, isSignedIn]);


  if (isBootstrapping || !isSignedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-tap-bg text-[15px] text-tap-muted">
        Loading dashboard…
      </div>
    );
  }

  const displayName =
    (typeof profile?.displayName === "string" && profile.displayName) ||
    (typeof profile?.fullName === "string" && profile.fullName) ||
    user?.email ||
    "there";

  return (
    <div className="min-h-dvh bg-tap-bg text-tap-fg">
      <header className="border-b border-black/[0.08] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-5 sm:px-8">
          <a href={getMarketingUrl("/")} className="text-[17px] font-semibold tracking-tight">
            TapMe
          </a>
          <button
            type="button"
            onClick={() => {
              signOut();
              goToMarketing("/");
            }}
            className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-tap-muted transition-colors hover:bg-black/[0.04] hover:text-tap-fg"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-[14px] font-medium text-tap-link">Dashboard</p>
        <h1 className="mt-2 text-[32px] font-semibold tracking-tight sm:text-[40px]">
          Welcome, {displayName}.
        </h1>
        <p className="mt-3 max-w-[42ch] text-[16px] leading-relaxed text-tap-muted">
          You are signed in. Manage your TapMe profile, payments setup, and account from here.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <InfoCard label="Email" value={user?.email ?? "—"} />
          <InfoCard label="Profile" value={user?.profileSlug ? `/${user.profileSlug}` : "—"} />
        </div>
      </main>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white px-6 py-5">
      <p className="text-[13px] text-tap-muted">{label}</p>
      <p className="mt-1 text-[17px] font-medium text-tap-fg">{value}</p>
    </div>
  );
}
