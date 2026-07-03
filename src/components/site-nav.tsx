import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const links = [
  { label: "How it works", to: "/how-it-works" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "For Business", to: "/business" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { openSignIn, openRegister } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const isActive = (to: string) => pathname === to;
  const navLinkClass = (to: string) =>
    cn(
      "text-base font-medium text-muted-foreground transition-colors hover:text-foreground",
      isActive(to) && "font-bold text-foreground",
    );

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-4 md:px-6">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between rounded-full border border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:h-24 md:px-10">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          tapme
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className={navLinkClass(l.to)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <button
            type="button"
            onClick={openRegister}
            className={navLinkClass("/register")}
          >
            Register
          </button>
          <button
            type="button"
            onClick={openSignIn}
            className="inline-flex h-10 items-center rounded-full border border-border bg-background px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Sign In
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-border bg-background md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className={navLinkClass(l.to)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openRegister();
                }}
                className={navLinkClass("/register")}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openSignIn();
                }}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border px-6 text-base font-medium text-foreground"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
