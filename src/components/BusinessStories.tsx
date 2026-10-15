import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Info, SmartphoneNfc, Wallet } from "lucide-react";
import { FadeUp, fadeUp, stagger } from "./motion";

type Column = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

const columns: Column[] = [
  {
    id: "products",
    label: "TapMe Stand",
    title: "Your counter. Modern payments.",
    description:
      "A clear acrylic stand for your counter with NFC tap and QR backup. Customers start payment without typing your number. You keep your existing mobile-money account.",
    icon: SmartphoneNfc,
  },
  {
    id: "businesses",
    label: "For businesses",
    title: "Take payments. Anytime, anywhere.",
    description:
      "Built for shops, cafés, hotels, and field teams. Place it once, and customers tap or scan whenever they are ready to pay. No new wallet or processor for you to manage.",
    icon: Building2,
  },
  {
    id: "benefits",
    label: "Mobile money",
    title: "No typing. Just tap and pay.",
    description:
      "Works with MTN MoMo, Airtel Money, and the receiving number you already use. Funds go straight to your account. TapMe never holds your money.",
    icon: Wallet,
  },
  {
    id: "about",
    label: "About TapMe",
    title: "Simple. Modern. Fast. Practical.",
    description:
      "A Rwanda-based NFC company making everyday interactions simpler. Payments first, with a longer vision for near-field products across business life.",
    icon: Info,
  },
];

export function BusinessStories() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="w-full bg-white px-0 py-10 sm:px-1.5 sm:py-12 md:px-2 md:py-14">
      <div className="mx-auto max-w-[1320px] overflow-hidden rounded-[28px] bg-black sm:rounded-[36px] md:rounded-[44px]">
        <div className="relative w-full">
          <motion.img
            src="/tapme-stand.png"
            alt="Customer tapping a phone on a TapMe stand to pay with mobile money"
            className="block h-[48vh] min-h-[320px] w-full object-cover object-[center_45%] sm:h-[52vh] sm:min-h-[380px] md:h-[56vh] md:min-h-[420px]"
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-[10%] z-10 flex justify-center px-6 text-center sm:bottom-[12%] sm:px-10 md:px-12">
            <FadeUp className="w-full">
              <h2 className="mx-auto max-w-[720px] text-center text-[26px] font-semibold leading-[1.12] tracking-tight text-white sm:text-[36px] md:text-[44px]">
                Find out how businesses everywhere use TapMe.
              </h2>
            </FadeUp>
          </div>
        </div>

        <div className="w-full px-6 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-10 md:px-10 md:pb-16 lg:px-12">
          <motion.ul
            className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {columns.map((col) => {
              const isOpen = openId === col.id;
              const Icon = col.icon;

              return (
                <motion.li
                  key={col.id}
                  id={col.id}
                  variants={fadeUp}
                  className="scroll-mt-20 text-left"
                >
                  <div>
                    <p className="flex items-center gap-2 text-[15px] font-semibold text-white sm:text-[16px] md:text-[17px]">
                      <Icon
                        className="h-[18px] w-[18px] shrink-0 text-white sm:h-5 sm:w-5"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      {col.label}
                    </p>

                    <motion.div
                      animate={{ y: isOpen ? -6 : 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-tight text-white sm:text-[20px] md:text-[22px]">
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
                          className="overflow-hidden text-[14px] leading-relaxed text-white/75 sm:text-[15px]"
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
                      className="mt-4 inline-flex cursor-pointer items-center gap-2 text-[16px] text-tap-link transition-colors hover:text-tap-link-hover sm:text-[17px]"
                    >
                      Learn more
                      <motion.span
                        className="material-symbols-outlined text-[20px] leading-none sm:text-[22px]"
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
