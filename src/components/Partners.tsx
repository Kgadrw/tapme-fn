import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FadeUp, fadeUp, stagger } from "./motion";

const partners = [
  { name: "NZALENS High Technologies", src: "/partners/nzalens.png" },
  { name: "BLOOMiN Specialty café", src: "/partners/bloomin.png", large: true },
  { name: "Partner", src: "/partners/tree.png" },
  { name: "mucuruzi", src: "/partners/mucuruzi.png" },
  { name: "STAR-HAWK", src: "/partners/starhawk.png" },
  { name: "Partner", src: "/partners/r-logo.png" },
] as const;

const mobilePartners = [...partners, ...partners];

export function Partners() {
  return (
    <section id="partners" className="w-full bg-white">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 md:gap-14 md:py-24">
        {/* Copy */}
        <div className="w-full text-center">
          <FadeUp>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-tap-fg sm:text-[40px] md:text-[44px]">
              Works with the businesses you know.
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="mx-auto mt-5 max-w-[42ch] text-[16px] leading-relaxed text-tap-muted sm:text-[18px] md:text-[19px]">
              TapMe is already on counters across shops, cafés, and service
              businesses. Place a stand, connect your mobile-money number, and
              start accepting taps. No new wallet required.
            </p>
          </FadeUp>
          <FadeUp delay={0.14}>
            <Link
              to="/contact"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-tap-link px-6 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-tap-link-hover sm:text-[16px]"
            >
              Customize yours
            </Link>
          </FadeUp>
        </div>

        {/* Mobile: one-line horizontal slide */}
        <div className="relative w-[100vw] overflow-hidden md:hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent"
          />
          <motion.ul
            className="flex w-max items-center gap-3 py-1"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 22,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {mobilePartners.map((partner, index) => (
              <li
                key={`${partner.src}-mobile-${index}`}
                className="flex size-[112px] shrink-0 items-center justify-center rounded-2xl bg-white p-4 sm:size-[120px]"
              >
                <img
                  src={partner.src}
                  alt={partner.name}
                  className={`object-contain grayscale ${
                    "large" in partner && partner.large
                      ? "max-h-full max-w-full"
                      : "max-h-[82%] max-w-[90%]"
                  }`}
                />
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Desktop: logo row below copy */}
        <div className="hidden w-full justify-center md:flex">
          <motion.ul
            className="mx-auto flex w-fit flex-wrap items-center justify-center gap-4 lg:gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            {partners.map((partner, index) => (
              <motion.li
                key={`${partner.src}-${index}`}
                variants={fadeUp}
                className="flex size-[130px] shrink-0 items-center justify-center bg-white p-3 lg:size-[150px] lg:p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <img
                  src={partner.src}
                  alt={partner.name}
                  className={`mx-auto object-contain object-center grayscale ${
                    "large" in partner && partner.large
                      ? "max-h-[95%] max-w-full"
                      : "max-h-[82%] max-w-[92%]"
                  }`}
                />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
