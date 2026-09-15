import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp, fadeUp, stagger } from "./motion";

const columns = [
  {
    id: "products",
    label: "TapMe Stand",
    title: "Your counter. Modern payments.",
    description:
      "A clear acrylic stand for your counter with NFC tap and QR backup. Customers start payment without typing your number. You keep your existing mobile-money account.",
  },
  {
    id: "businesses",
    label: "For businesses",
    title: "Take payments. Anytime, anywhere.",
    description:
      "Built for shops, cafés, hotels, and field teams. Place it once, and customers tap or scan whenever they are ready to pay. No new wallet or processor for you to manage.",
  },
  {
    id: "benefits",
    label: "Mobile money",
    title: "No typing. Just tap and pay.",
    description:
      "Works with MTN MoMo, Airtel Money, and the receiving number you already use. Funds go straight to your account. TapMe never holds your money.",
  },
  {
    id: "about",
    label: "About TapMe",
    title: "Simple. Modern. Fast. Practical.",
    description:
      "A Rwanda-based NFC company making everyday interactions simpler. Payments first, with a longer vision for near-field products across business life.",
  },
] as const;

export function BusinessStories() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="w-full bg-white pt-16 sm:pt-20 md:pt-24">
      <div className="relative w-full overflow-hidden bg-black">
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
            {columns.map((col) => {
              const isOpen = openId === col.id;

              return (
                <motion.li
                  key={col.id}
                  id={col.id}
                  variants={fadeUp}
                  className="scroll-mt-20"
                >
                  <div>
                    <p className="text-[16px] font-semibold text-white sm:text-[17px] md:text-[18px]">
                      {col.label}
                    </p>

                    <motion.div
                      animate={{ y: isOpen ? -6 : 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="mt-4 text-[22px] font-semibold leading-snug tracking-tight text-white sm:text-[24px] md:text-[26px]">
                        {col.title}
                      </h3>
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.p
                          id={`${col.id}-description`}
                          key="description"
                          initial={{ height: 0, opacity: 0, y: 8 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: 6 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden text-[15px] leading-relaxed text-white/75 sm:text-[16px]"
                        >
                          <span className="mt-3 block">{col.description}</span>
                        </motion.p>
                      ) : null}
                    </AnimatePresence>

                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${col.id}-description`}
                      onClick={() => setOpenId(isOpen ? null : col.id)}
                      className="mt-5 inline-flex cursor-pointer items-center gap-2 text-[17px] text-tap-link transition-colors hover:text-tap-link-hover sm:text-[18px]"
                    >
                      Learn more
                      <motion.span
                        className="material-symbols-outlined text-[22px] leading-none sm:text-[24px]"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        aria-hidden
                      >
                        add
                      </motion.span>
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
