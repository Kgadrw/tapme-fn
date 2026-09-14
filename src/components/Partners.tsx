import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FadeUp, fadeUp, stagger } from "./motion";

const partners = [
  { name: "NZALENS High Technologies", src: "/partners/nzalens.png" },
  { name: "BLOOMiN Specialty café", src: "/partners/bloomin.png", large: true },
  { name: "Partner", src: "/partners/tree.png" },
  { name: "mucuruzi", src: "/partners/mucuruzi.png" },
  { name: "STAR-HAWK", src: "/partners/starhawk.png" },
  { name: "UZA Solutions", src: "/partners/uza.png" },
  { name: "Partner", src: "/partners/r-logo.png" },
  { name: "TapMe", src: "/tapme-logo.png" },
] as const;

export function Partners() {
  return (
    <section id="partners" className="w-full bg-white">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-14 md:py-24 lg:gap-20">
        {/* Checkerboard logo grid */}
        <motion.ul
          className="grid grid-cols-2 overflow-hidden sm:grid-cols-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {partners.map((partner, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            const isTinted = (row + col) % 2 === 1;

            return (
              <motion.li
                key={`${partner.src}-${index}`}
                variants={fadeUp}
                className={`flex aspect-square items-center justify-center p-5 sm:p-6 ${
                  isTinted ? "bg-[#f5f5f7]" : "bg-white"
                }`}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <img
                  src={partner.src}
                  alt={partner.name}
                  className={`object-contain grayscale ${
                    "large" in partner && partner.large
                      ? "max-h-[92%] max-w-full"
                      : "max-h-[72%] max-w-[88%]"
                  }`}
                />
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Copy */}
        <div className="md:pl-2">
          <FadeUp>
            <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-tap-fg sm:text-[40px] md:text-[44px]">
              Works with the businesses you know.
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="mt-5 text-[16px] leading-relaxed text-tap-muted sm:text-[18px] md:text-[19px]">
              TapMe is already on counters across shops, cafés, and service
              businesses. Place a stand, connect your mobile-money number, and
              start accepting taps. No new wallet required.
            </p>
          </FadeUp>
          <FadeUp delay={0.14}>
            <Link
              to="/contact"
              className="mt-7 inline-block text-[17px] text-tap-link transition-colors hover:text-tap-link-hover sm:text-[18px]"
            >
              Order a stand →
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
