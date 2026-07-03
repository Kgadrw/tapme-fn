import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IdCard,
  RefreshCw,
  Zap,
  Share2,
  BarChart3,
  QrCode,
  Wallet,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RegisterButton } from "@/components/register-button";
import { marketingSeo } from "@/lib/seo";

export const Route = createFileRoute("/features")({
  head: () =>
    marketingSeo({
      title: "Features",
      description:
        "Everything tapme gives you: a live digital profile, unlimited social and payment links, NFC & QR sharing, analytics, vCard downloads, and more.",
      path: "/features",
      keywords:
        "tapme features, digital profile links, NFC card, QR profile, profile analytics, vCard, payment links",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Features", path: "/features" },
      ],
    }),
  component: FeaturesPage,
});

const features = [
  {
    icon: IdCard,
    t: "Digital Profile",
    d: "Create a polished, professional digital identity that represents you or your business.",
  },
  {
    icon: RefreshCw,
    t: "Always Up To Date",
    d: "Update your information anytime — no need to reprint or replace your NFC card.",
  },
  {
    icon: Zap,
    t: "Works Instantly",
    d: "No app required for most modern smartphones. Just tap and your profile opens.",
  },
  {
    icon: Share2,
    t: "Share Everything",
    d: "Social media, phone, email, website, portfolio, and business information in one place.",
  },
  {
    icon: BarChart3,
    t: "Analytics & Insights",
    d: "See profile views, taps, and which links get the most attention over time.",
  },
  {
    icon: QrCode,
    t: "QR Code",
    d: "Every profile comes with a scannable QR code you can share anywhere, online or in print.",
  },
  {
    icon: Wallet,
    t: "Payment Links",
    d: "Add MTN MoMo, bank accounts, and payment URLs so people can pay you directly.",
  },
  {
    icon: Palette,
    t: "Custom Layouts",
    d: "Choose how your links appear — list, grid, or icons — to match your style.",
  },
  {
    icon: ShieldCheck,
    t: "Secure & Private",
    d: "Your data is protected, and you control exactly what your profile shows.",
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16 md:px-10 md:pt-28 lg:px-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl">
            Everything you need to share yourself.
          </h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            tapme is more than a business card. It&apos;s a living profile with the tools to
            connect, get paid, and grow.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28 lg:px-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.t}
                className="rounded-2xl border border-border p-8 transition-colors hover:bg-secondary"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-6 text-lg font-medium text-foreground">{f.t}</div>
                <p className="mt-2 text-base text-muted-foreground">{f.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center md:pb-32">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          See it in action.
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Set up your profile in minutes and share it with a single tap.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <RegisterButton className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-transform hover:scale-[1.02]">
            Get Started
          </RegisterButton>
          <Link
            to="/pricing"
            className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary"
          >
            View pricing
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
