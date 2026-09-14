import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FadeUp, fadeUp, stagger } from "./motion";

const columns = [
  {
    id: "products",
    label: "TapMe Stand",
    title: "Your counter. Modern payments.",
    cta: { label: "Learn more", to: "/contact" },
  },
  {
    id: "businesses",
    label: "For businesses",
    title: "Take payments. Anytime, anywhere.",
    cta: { label: "Learn more", to: "/business" },
  },
  {
    id: "benefits",
    label: "Mobile money",
    title: "No typing. Just tap and pay.",
    cta: { label: "Learn more", to: "/how-it-works" },
  },
  {
    id: "about",
    label: "About TapMe",
    title: "Simple. Modern. Fast. Practical.",
    cta: { label: "Learn more", to: "/about" },
  },
] as const;

function LearnMoreIcon() {
  return (
    <span
      className="material-symbols-outlined text-[22px] leading-none sm:text-[24px]"
      aria-hidden
    >
      arrow_circle_right
    </span>
  );
}

export function BusinessStories() {
  return (
    <section className="w-full bg-white pt-16 sm:pt-20 md:pt-24">
      <div className="relative w-full overflow-hidden bg-black [border-top-left-radius:50%_4.5rem] [border-top-right-radius:50%_4.5rem] sm:[border-top-left-radius:50%_6rem] sm:[border-top-right-radius:50%_6rem] md:[border-top-left-radius:50%_7.5rem] md:[border-top-right-radius:50%_7.5rem]">
        <div className="relative w-full">
          <motion.img
            src="/stories-cafe-indoor.png"
            alt="Customer tapping a phone on a TapMe stand at an indoor café counter"
            className="block h-[62vh] min-h-[420px] w-full object-cover object-[center_40%] sm:h-[68vh] md:h-[78vh]"
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-[12%] z-10 px-6 sm:bottom-[14%] sm:px-10 md:bottom-[16%]">
            <FadeUp>
              <h2 className="mx-auto max-w-[820px] text-center text-[28px] font-semibold leading-[1.12] tracking-tight text-white sm:text-[40px] md:text-[48px]">
                Find out how businesses everywhere use TapMe.
              </h2>
            </FadeUp>
          </div>
        </div>

        <div className="w-full px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-10 md:pb-24 lg:px-12">
          <motion.ul
            className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:items-start lg:gap-6 xl:gap-10"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {columns.map((col) => (
              <motion.li
                key={col.id}
                id={col.id}
                variants={fadeUp}
                className="scroll-mt-20"
              >
                <p className="text-[16px] font-semibold text-white sm:text-[17px] md:text-[18px]">
                  {col.label}
                </p>
                <h3 className="mt-4 text-[22px] font-semibold leading-snug tracking-tight text-white sm:text-[24px] md:text-[26px]">
                  {col.title}
                </h3>
                <Link
                  to={col.cta.to}
                  className="mt-5 inline-flex items-center gap-2 text-[17px] text-tap-link transition-colors hover:text-tap-link-hover sm:text-[18px]"
                >
                  {col.cta.label}
                  <LearnMoreIcon />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
