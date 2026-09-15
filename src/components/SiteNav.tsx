import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { TapMeLogo } from "./TapMeLogo";

const links = [
  { label: "How it works", to: "/how-it-works" },
  { label: "For businesses", to: "/business" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-black/[0.08] pt-[env(safe-area-inset-top)] ${
          open
            ? "bg-white"
            : "bg-white/95 backdrop-blur-xl backdrop-saturate-150 md:bg-white/72"
        }`}
      >
        <nav
          aria-label="Global"
          className="relative mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-4 text-[14px] text-tap-fg sm:px-6 md:h-14 md:gap-4 md:px-8"
        >
          <Link
            to="/"
            aria-label="TapMe home"
            className="relative z-20 flex shrink-0 items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <TapMeLogo size="sm" className="md:size-10" />
          </Link>

          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-x-8 md:flex lg:gap-x-9">
            {links.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `whitespace-nowrap transition-opacity hover:opacity-100 ${
                      isActive ? "text-tap-fg opacity-100" : "opacity-80"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="relative z-20 flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/contact"
              className="hidden items-center justify-center rounded-full bg-tap-link px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-tap-link-hover md:inline-flex"
            >
              Order
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((prev) => !prev)}
              className="relative -mr-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-tap-fg md:hidden"
            >
              <span className="sr-only">{open ? "Close" : "Menu"}</span>
              <span
                className={`absolute block h-[1.5px] w-[18px] rounded-full bg-tap-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "translate-y-0 rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute block h-[1.5px] w-[18px] rounded-full bg-tap-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "translate-y-0 -rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-40 overflow-y-auto bg-white px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-4 md:hidden"
          >
            <motion.ul
              className="flex flex-col"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.04 },
                },
              }}
            >
              {links.map((item) => (
                <motion.li
                  key={item.to}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="border-b border-black/[0.08]"
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-4 text-[28px] font-semibold tracking-tight ${
                        isActive ? "text-tap-fg" : "text-tap-fg/90"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="mt-8"
              >
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-tap-link px-6 text-[16px] font-medium text-white transition-colors hover:bg-tap-link-hover"
                >
                  Order
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
