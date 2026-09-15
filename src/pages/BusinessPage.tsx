import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FlowingMenu } from "../components/FlowingMenu";
import { FadeUp, fadeUp, stagger } from "../components/motion";
import { PageHero } from "../components/PageHero";

const reasons = [
  { n: "I", text: "Faster payment at the counter" },
  { n: "II", text: "No phone numbers to type" },
  { n: "III", text: "Works with MTN and Airtel Money" },
  { n: "IV", text: "Money goes to your existing account" },
  { n: "V", text: "Professional counter presence" },
  { n: "VI", text: "Simple setup, no new wallet" },
] as const;

const flowingItems = [
  {
    link: "/contact",
    text: "Shops and markets",
    image: "/tapme-stand.png",
  },
  {
    link: "/contact",
    text: "Restaurants and cafés",
    image: "/stories-cafe-indoor.png",
  },
  {
    link: "/contact",
    text: "Hotels and salons",
    image: "/stories-nfc-phones.png",
  },
  {
    link: "/contact",
    text: "Service providers",
    image: "/how-it-works/tap-demo.png",
  },
];

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
              className="mt-6 inline-flex items-center justify-center rounded-full bg-tap-link px-6 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-tap-link-hover"
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
                key={reason.text}
                variants={fadeUp}
                className="grid grid-cols-[3rem_1fr] gap-3 border-t border-black/10 py-4 first:border-t-0 first:pt-0 sm:grid-cols-[3.5rem_1fr] sm:gap-4 sm:text-[17px]"
              >
                <span className="text-[13px] font-medium tracking-wide text-tap-fg sm:pt-0.5">
                  {reason.n}
                </span>
                <span className="text-[16px] text-tap-fg sm:text-[17px]">
                  {reason.text}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <section>
        <div className="bg-white px-5 py-12 text-center sm:px-8 sm:py-14 md:py-16">
          <FadeUp>
            <h2 className="text-[28px] font-semibold tracking-tight text-tap-fg sm:text-[36px] md:text-[44px]">
              Made for real counters
            </h2>
          </FadeUp>
        </div>
        <div className="relative h-[560px] bg-black sm:h-[600px] md:h-[640px]">
          <FlowingMenu
            items={flowingItems}
            speed={15}
            textColor="#ffffff"
            bgColor="#000000"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#1d1d1f"
            borderColor="rgba(255,255,255,0.2)"
          />
        </div>
      </section>
    </div>
  );
}
