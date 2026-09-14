import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FadeUp, fadeUp, stagger } from "../components/motion";
import { PageHero } from "../components/PageHero";

const reasons = [
  "Faster payment at the counter",
  "No phone numbers to type",
  "Works with MTN and Airtel Money",
  "Money goes to your existing account",
  "Professional counter presence",
  "Simple setup, no new wallet",
] as const;

const audiences = [
  {
    title: "Shops and markets",
    body: "Speed up everyday sales without asking customers to copy your number.",
  },
  {
    title: "Restaurants and cafés",
    body: "Let diners pay at the table or counter with a quick tap.",
  },
  {
    title: "Hotels and salons",
    body: "Present a modern checkout that matches a premium guest experience.",
  },
  {
    title: "Service providers",
    body: "Moto, taxis, and field teams can take payments on the go with a TapMe card or stand.",
  },
] as const;

export function BusinessPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="For businesses"
        subtitle="Built for shops, restaurants, hotels, and teams that already take mobile money."
      />

      <section className="mx-auto max-w-[980px] px-5 pb-16 sm:px-8 sm:pb-20 md:pb-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 md:items-start">
          <FadeUp>
            <h2 className="text-[28px] font-semibold tracking-tight text-tap-fg sm:text-[36px]">
              Take payments.
              <br />
              Anytime, anywhere.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-tap-muted sm:text-[17px]">
              Stop asking customers to type phone numbers. TapMe is a simpler
              way to start a mobile-money payment, not a bank, wallet, or
              processor. Money goes straight to your existing account.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-block text-[17px] text-tap-link transition-colors hover:text-tap-link-hover"
            >
              Request an order →
            </Link>
          </FadeUp>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {reasons.map((reason) => (
              <motion.li
                key={reason}
                variants={fadeUp}
                className="border-t border-black/10 py-4 text-[16px] text-tap-fg first:border-t-0 first:pt-0 sm:text-[17px]"
              >
                {reason}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <section className="border-t border-black/8 bg-tap-bg">
        <div className="mx-auto max-w-[980px] px-5 py-16 sm:px-8 sm:py-20 md:py-24">
          <FadeUp>
            <h2 className="text-center text-[28px] font-semibold tracking-tight text-tap-fg sm:text-[36px]">
              Made for real counters
            </h2>
          </FadeUp>
          <motion.ul
            className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {audiences.map((item) => (
              <motion.li key={item.title} variants={fadeUp}>
                <h3 className="text-[20px] font-semibold tracking-tight text-tap-fg sm:text-[22px]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-tap-muted">
                  {item.body}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-center sm:px-8 sm:py-20">
        <FadeUp>
          <h2 className="text-[28px] font-semibold tracking-tight text-tap-fg sm:text-[36px]">
            Start with one stand
          </h2>
          <p className="mx-auto mt-3 max-w-[36ch] text-[16px] text-tap-muted">
            Tell us your business and payment receiving number. We configure,
            produce, and deliver.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block text-[18px] text-tap-link transition-colors hover:text-tap-link-hover"
          >
            Contact sales →
          </Link>
        </FadeUp>
      </section>
    </div>
  );
}
