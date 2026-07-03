import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="w-full px-4 pb-4 md:px-6">
      <div className="mx-auto max-w-7xl rounded-t-full border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10 lg:px-16">
          <div>
            <div className="text-base font-semibold tracking-tight text-foreground">tapme</div>
            <p className="mt-1 text-base font-medium text-muted-foreground">
              © 2026 tapme. All rights reserved.
            </p>
          </div>
          <nav className="flex items-center gap-6 text-base font-medium text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <Link to="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
