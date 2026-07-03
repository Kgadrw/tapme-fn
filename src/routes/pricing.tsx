import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RegisterButton } from "@/components/register-button";
import { Spinner } from "@/components/spinner";
import { formatPrice } from "@/lib/billing";
import { useSubscriptionPlan } from "@/lib/use-subscription-plan";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — tapme" },
      {
        name: "description",
        content: "Simple, transparent pricing for tapme. One plan with everything you need.",
      },
    ],
  }),
  component: PricingPage,
});

const faqs = [
  {
    q: "Do I need to buy the NFC card separately?",
    a: "You can create and share your profile for free with your link and QR code. The physical NFC card is an optional add-on you can order anytime.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription whenever you want from the billing page — no long-term commitment.",
  },
  {
    q: "How do I pay?",
    a: "Payments are handled securely via mobile money (MTN MoMo and Airtel Money).",
  },
];

function PricingPage() {
  const { plan, loading } = useSubscriptionPlan();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-6 pt-20 pb-12 text-center md:px-10 md:pt-28 lg:px-16">
        <h1 className="mx-auto max-w-3xl text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl">
          Simple pricing, everything included.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          One plan with all the tools to build, share, and grow your digital profile.
        </p>
      </section>

      <section className="mx-auto max-w-lg px-6 pb-20 md:pb-28">
        <div className="rounded-3xl border border-border p-8 md:p-10">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" label="Loading plan" />
            </div>
          ) : (
            <>
              <div className="text-lg font-medium text-foreground">{plan.name}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                  {formatPrice(plan.price, plan.currency)}
                </span>
                <span className="text-base text-muted-foreground">/ {plan.interval}</span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-base text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <RegisterButton className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-transform hover:scale-[1.01]">
                Get Started
              </RegisterButton>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 md:pb-32">
        <h2 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-border">
          {faqs.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-6">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="text-lg font-medium text-foreground">{question}</span>
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      {open ? <p className="mt-3 pr-12 text-base text-muted-foreground">{answer}</p> : null}
    </div>
  );
}
