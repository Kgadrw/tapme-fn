import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeIn, fadeUp, stagger } from "./motion";

export function HomeHero() {
  return (
    <section className="mt-5 px-0 sm:mt-6 sm:px-1.5 md:mt-8 md:px-2">
      <div className="mx-auto max-w-[1560px] overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px]">
        <motion.div
          className="px-5 pt-9 text-center sm:px-8 sm:pt-11 md:pt-12"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={fadeUp}
            className="text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-tap-fg sm:text-[56px] md:text-[80px]"
          >
            Tap your phone.
            <br />
            Pay simply.
          </motion.h1>

          <motion.div variants={fadeUp} className="mt-4 sm:mt-5">
            <Link
              to="/contact"
              className="text-[17px] text-tap-link transition-colors hover:text-tap-link-hover sm:text-[19px]"
            >
              Order a stand →
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mt-5 px-3 pb-4 sm:mt-6 sm:px-5 sm:pb-5 md:mt-7 md:px-8 md:pb-6"
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
        >
          <motion.img
            src="/tapme-stand.png"
            alt="TapMe NFC stand on a counter, phone tapping to start a mobile-money payment"
            className="mx-auto block w-full max-w-[1100px] rounded-[24px] object-cover object-center sm:rounded-[32px] md:rounded-[40px]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
