import { createFileRoute, Link } from "@tanstack/react-router";
import { Smartphone, ScanLine, UserPlus, Share2 } from "lucide-react";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RegisterButton } from "@/components/register-button";
import { marketingSeo } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
  head: () =>
    marketingSeo({
      title: "How it works",
      description:
        "Learn how tapme turns a single NFC tap into an instantly shareable digital profile — no app required for visitors.",
      path: "/how-it-works",
      keywords: "how tapme works, NFC tap, digital business card, share profile, smart card",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "How it works", path: "/how-it-works" },
      ],
    }),
  component: HowItWorksPage,
});

const steps = [
  {
    icon: UserPlus,
    n: "01",
    t: "Create your profile",
    d: "Sign up and build your digital identity — add your name, role, contact details, social links, and payment methods in minutes.",
  },
  {
    icon: Smartphone,
    n: "02",
    t: "Tap your card",
    d: "Hold your tapme NFC card near any compatible smartphone. No app required for most modern devices.",
  },
  {
    icon: ScanLine,
    n: "03",
    t: "Profile opens instantly",
    d: "Your public profile opens right away in the browser — always up to date, no matter when the card was printed.",
  },
  {
    icon: Share2,
    n: "04",
    t: "Connect & share",
    d: "People can save your contact, visit your links, send a payment, or reach you directly with a single action.",
  },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 md:px-10 md:pt-28 lg:px-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl">
            One tap. Everything shared.
          </h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            tapme replaces paper business cards with a single smart card that opens your live
            digital profile. Here&apos;s how it works from start to finish.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28 lg:px-16">
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="rounded-2xl border border-border p-8 transition-colors hover:bg-secondary"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-2xl font-medium text-muted-foreground">{s.n}</span>
                </div>
                <div className="mt-6 text-xl font-medium text-foreground">{s.t}</div>
                <p className="mt-2 text-base text-muted-foreground">{s.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center md:pb-32">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          Ready to try it?
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Create your profile now — you can order your NFC card any time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <RegisterButton className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-transform hover:scale-[1.02]">
            Get Started
          </RegisterButton>
          <Link
            to="/features"
            className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Explore features
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
