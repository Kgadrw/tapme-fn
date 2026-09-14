const links = [
  { label: "Products", href: "#products" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For businesses", href: "#businesses" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

function NfcLogo() {
  return (
    <span
      className="material-symbols-outlined text-[24px] leading-none text-tap-fg sm:text-[26px]"
      aria-hidden
    >
      contactless
    </span>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-4 px-4 text-[13px] text-tap-fg/80"
      >
        <a href="/" aria-label="TapMe home" className="shrink-0">
          <NfcLogo />
        </a>

        <ul className="hidden min-w-0 flex-1 items-center justify-center gap-x-8 md:flex">
          {links.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="whitespace-nowrap transition-colors hover:text-tap-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-4">
          <a
            href="#contact"
            className="hidden text-[14px] font-medium text-tap-fg transition-opacity hover:opacity-70 sm:inline"
          >
            Order
          </a>
          <button
            type="button"
            aria-label="Menu"
            className="inline-flex flex-col justify-center gap-[3px] md:hidden"
          >
            <span className="block h-px w-[17px] bg-current" />
            <span className="block h-px w-[17px] bg-current" />
          </button>
        </div>
      </nav>
    </header>
  );
}
