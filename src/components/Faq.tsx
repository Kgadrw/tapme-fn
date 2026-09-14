import { useState } from "react";

const faqs = [
  {
    q: "What is TapMe?",
    a: "TapMe is an NFC technology company. Our payment stand helps customers start a mobile-money payment with a tap, without typing phone numbers.",
  },
  {
    q: "Does TapMe hold my money?",
    a: "No. TapMe does not hold money, act as a wallet, or process payments. Funds go directly to your existing MTN MoMo or Airtel Money account.",
  },
  {
    q: "Which phones can customers use?",
    a: "Any NFC-enabled smartphone can tap the stand. Customers without NFC can scan the QR code on the stand instead.",
  },
  {
    q: "Which payment methods work?",
    a: "TapMe works with the mobile-money provider you already use, such as MTN MoMo. You provide your receiving number when you order.",
  },
  {
    q: "How do customers pay?",
    a: "They tap their phone on the stand, confirm the amount, and approve the payment with their mobile-money PIN. You receive the money as usual.",
  },
  {
    q: "What do I need to order a stand?",
    a: "Your business details, preferred product, and the payment receiving number or code you want programmed on the NFC stand.",
  },
  {
    q: "Where can I get more information?",
    a: "Contact us at hello@tapme.rw or reach out on WhatsApp. We’re based in Kigali, Rwanda.",
  },
] as const;

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[820px] px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        <h2 className="text-center text-[36px] font-semibold tracking-tight text-tap-fg sm:text-[44px] md:text-[48px]">
          Questions? Answers.
        </h2>

        <ul className="mt-12 border-t border-black/10 sm:mt-14">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <li key={item.q} className="border-b border-black/10">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
                >
                  <span className="text-[17px] font-medium text-tap-fg sm:text-[19px] md:text-[21px]">
                    {item.q}
                  </span>
                  <span
                    className={`material-symbols-outlined shrink-0 text-[22px] text-tap-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 text-[15px] leading-relaxed text-tap-muted sm:pb-6 sm:text-[16px]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
