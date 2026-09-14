import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FadeUp, fadeUp, stagger } from "../components/motion";
import { PageHero } from "../components/PageHero";

const setupSteps = [
  {
    n: "I",
    title: "Share your receiving number",
    body: "Tell us your business details and the mobile-money number or code that should receive payments. MTN MoMo, Airtel Money, or another supported identifier.",
  },
  {
    n: "II",
    title: "Customize your product",
    body: "Choose TapMe Stand or Card, quantity, and branding. We prepare the print and layout so your counter looks clear: Tap to Pay, tap zone, and QR backup.",
  },
  {
    n: "III",
    title: "NFC is programmed securely",
    body: "Each product gets a unique TapMe ID. We write only the payment action onto the NFC chip. We never store your PIN, password, or mobile-money credentials.",
  },
  {
    n: "IV",
    title: "Delivered and ready",
    body: "Place it on your counter. Customers tap or scan. Money goes straight to your existing account. TapMe does not hold funds.",
  },
] as const;

export function HowItWorksPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="How it works"
        subtitle="From your receiving number to a programmed NFC stand. Then customers just tap."
      />

      {/* Setup journey + demo video */}
      <section className="mx-auto max-w-[1200px] px-5 pb-16 sm:px-8 sm:pb-20 md:pb-24">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-16">
          <div>
            <FadeUp>
              <h2 className="text-[28px] font-semibold tracking-tight text-tap-fg sm:text-[36px]">
                How we set up your TapMe
              </h2>
              <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-tap-muted sm:text-[17px]">
                Ordering is simple. You provide payment details once. We
                customize the product and program the NFC chip before delivery.
              </p>
            </FadeUp>

            <motion.ol
              className="mt-10 space-y-0 sm:mt-12"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {setupSteps.map((step) => (
                <motion.li
                  key={step.n}
                  variants={fadeUp}
                  className="grid gap-3 border-t border-black/10 py-7 first:border-t-0 first:pt-0 sm:grid-cols-[4.5rem_1fr] sm:gap-6 sm:py-8"
                >
                  <p className="text-[13px] font-medium tracking-wide text-tap-fg sm:pt-1">
                    {step.n}
                  </p>
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-tight text-tap-fg sm:text-[22px]">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-tap-muted sm:text-[16px]">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>

          <FadeUp className="min-h-[420px] bg-black lg:sticky lg:top-24 lg:min-h-0 lg:self-start lg:h-[calc(100vh-7rem)]">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/how-it-works/tap-demo.png"
            >
              <source src="/how-it-works/demo.mp4" type="video/mp4" />
            </video>
          </FadeUp>
        </div>
      </section>

      {/* NFC note */}
      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <FadeUp>
            <h2 className="text-[28px] font-semibold tracking-tight text-tap-fg sm:text-[36px]">
              About NFC on TapMe
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-tap-muted sm:text-[17px]">
              The chip carries a secure payment action linked to your receiving
              number. The factory NFC UID identifies the physical product. Your
              PIN stays on the customer’s phone with their mobile-money app.
              TapMe never asks for it.
            </p>
            <img
              src="/how-it-works/nfc-chip-antenna.png"
              alt="NFC tag diagram showing the chip at the center and the antenna coil around it, in round and square layouts"
              className="mx-auto mt-10 w-full max-w-[560px]"
            />
          </FadeUp>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-center sm:px-8 sm:py-20">
        <FadeUp>
          <h2 className="text-[28px] font-semibold tracking-tight text-tap-fg sm:text-[36px]">
            Ready for your counter?
          </h2>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-tap-link px-6 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-tap-link-hover"
          >
            Order a stand →
          </Link>
        </FadeUp>
      </section>
    </div>
  );
}
