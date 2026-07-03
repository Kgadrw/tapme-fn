import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, User, Wallet, Settings, LogOut, Menu, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarBrand } from "@/components/sidebar-brand";
import { useAuth } from "@/context/auth-context";
import { getMarketingUrl } from "@/lib/domains";
import { goToMarketing } from "@/lib/navigation";

const items = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, exact: true },
  { label: "My Profile", to: "/profile", icon: User },
  { label: "Billing", to: "/billing", icon: Wallet },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const nav = (
    <nav className="flex h-full flex-col gap-2.5 p-4">
      <a
        href={getMarketingUrl("/")}
        className="mb-6 block px-3 py-2"
      >
        <SidebarBrand />
      </a>
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to, "exact" in item ? item.exact : undefined);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      <div className="mt-auto flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            signOut();
            goToMarketing("/");
          }}
          className="flex flex-1 items-center gap-3 rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <a href={getMarketingUrl("/")} className="px-1">
          <SidebarBrand />
        </a>
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      <aside className="fixed inset-y-4 left-4 z-30 hidden w-60 overflow-y-auto rounded-3xl border border-border bg-background md:block">
        {nav}
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 bg-background md:hidden" style={{ top: 56 }}>
          {nav}
        </div>
      )}
    </>
  );
}