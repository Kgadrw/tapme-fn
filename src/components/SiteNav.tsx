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
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/72 backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label="Global"
        className="relative mx-auto flex h-12 max-w-[1200px] items-center justify-between gap-4 px-5 text-[12px] text-tap-fg/80 sm:h-12 sm:px-6 md:h-14 md:px-8 md:text-[14px]"
      >
        <Link
          to="/"
          aria-label="TapMe home"
          className="relative z-20 shrink-0"
          onClick={() => setOpen(false)}
        >
          <TapMeLogo size="md" />
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

        <div className="relative z-20 flex shrink-0 items-center gap-3">
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
            className="relative inline-flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <span
              className={`absolute block h-px w-[17px] bg-tap-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-y-0 rotate-45" : "-translate-y-[3.5px]"
              }`}
            />
            <span
              className={`absolute block h-px w-[17px] bg-tap-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-y-0 -rotate-45" : "translate-y-[3.5px]"
              }`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-12 z-40 bg-white md:hidden"
          >
            <motion.ul
              className="flex h-full flex-col gap-0 overflow-y-auto px-8 pb-10 pt-6"
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
                      `block py-4 text-[28px] font-semibold tracking-tight transition-opacity ${
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
                  className="inline-flex h-11 items-center justify-center rounded-full bg-tap-link px-6 text-[15px] font-medium text-white transition-colors hover:bg-tap-link-hover"
                >
                  Order
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
