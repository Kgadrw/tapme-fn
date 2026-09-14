const productLinks = [
  { label: "TapMe Stand", href: "#products" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For businesses", href: "#businesses" },
  { label: "About", href: "#about" },
] as const;

const contactLinks = [
  { label: "hello@tapme.rw", href: "mailto:hello@tapme.rw" },
  { label: "WhatsApp", href: "#contact" },
  { label: "tapme.rw", href: "https://tapme.rw" },
] as const;

export function SiteFooter() {
  return (
    <footer id="contact" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16 md:px-10 md:py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[20px] font-semibold tracking-tight text-tap-fg"
            >
              <span
                className="material-symbols-outlined text-[26px] leading-none"
                aria-hidden
              >
                contactless
              </span>
              TapMe
            </a>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-tap-muted">
              NFC technology for everyday payments. Simple. Modern. Fast.
              Practical.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-semibold tracking-wide text-tap-fg">
              Product
            </p>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[15px] text-tap-muted transition-colors hover:text-tap-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[13px] font-semibold tracking-wide text-tap-fg">
              Contact
            </p>
            <ul className="mt-4 space-y-3">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[15px] text-tap-muted transition-colors hover:text-tap-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@tapme.rw"
              className="mt-6 inline-block text-[15px] text-tap-link transition-colors hover:text-tap-link-hover"
            >
              Order a stand →
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-black/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-tap-muted">
            © {new Date().getFullYear()} TapMe. Kigali, Rwanda.
          </p>
          <p className="text-[13px] text-tap-muted">
            Mobile money payments. No wallet required.
          </p>
        </div>
      </div>
    </footer>
  );
}
