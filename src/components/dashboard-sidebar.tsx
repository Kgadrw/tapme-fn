import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Gift,
  Users,
  ClipboardList,
} from "lucide-react";

import { SidebarBrand } from "@/components/sidebar-brand";
import { useAuth } from "@/context/auth-context";
import { getMarketingUrl } from "@/lib/domains";
import { goToMarketing } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", to: "/", icon: LayoutDashboard, exact: true },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Billing", to: "/billing", icon: Wallet },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

const businessItems = [
  { label: "Team profiles", to: "/business/dashboard/team", icon: Users },
  { label: "Business offer", to: "/business/dashboard/offer", icon: Gift },
  { label: "Requests", to: "/business/dashboard/requests", icon: ClipboardList },
] as const;

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { pathname } = useLocation();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const nav = (
    <nav className="flex h-full flex-col px-3 py-4">
      <a href={getMarketingUrl("/")} className="mb-5 px-3 py-2">
        <SidebarBrand />
      </a>

      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to, "exact" in item ? item.exact : undefined);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn("g-nav-item", active && "is-active")}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[var(--g-border)] pt-4">
        <p className="mb-2 flex items-center gap-2 px-4 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--g-muted)]">
          <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          Business
        </p>
        <div className="space-y-1">
          {businessItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to, "exact" in item ? item.exact : undefined);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn("g-nav-item", active && "is-active")}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-[var(--g-border)] pt-4">
        <div className="px-3">
          <p className="truncate text-sm font-medium text-[var(--g-text)]">
            {user?.email ?? "Account"}
          </p>
          <p className="truncate text-xs text-[var(--g-muted)]">Signed in</p>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut();
            goToMarketing("/");
          }}
          className="g-nav-item w-full"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--g-border)] bg-white px-4 md:hidden">
        <a href={getMarketingUrl("/")} className="px-1">
          <SidebarBrand />
        </a>
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--g-text)] hover:bg-[#f1f3f4]"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto border-r border-[var(--g-border)] bg-white md:block">
        {nav}
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 bg-white md:hidden" style={{ top: 56 }}>
          {nav}
        </div>
      ) : null}
    </>
  );
}
