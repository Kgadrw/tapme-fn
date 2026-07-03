import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { DashboardGate } from "@/components/dashboard-gate";
import { DashboardHome } from "@/components/dashboard-home";
import { DashboardPageShell } from "@/components/dashboard-page-shell";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { NfcCard } from "@/components/nfc-card";
import { RegisterButton } from "@/components/register-button";
import { getMarketingUrl, isDashboardHost, isSubdomainRoutingEnabled } from "@/lib/domains";
import { bootstrapAuthFromUrl, isAuthenticated } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    bootstrapAuthFromUrl();
    if (isSubdomainRoutingEnabled() && isDashboardHost() && !isAuthenticated()) {
      throw redirect({ href: getMarketingUrl("/register"), replace: true });
    }
  },
  head: () => ({
    meta: [{ title: "tapme | Share your profile with one tap." }],
  }),
  component: Index,
});

function Index() {
  if (isSubdomainRoutingEnabled() && isDashboardHost()) {
    return (
      <DashboardGate>
        <DashboardPageShell>
          <DashboardHome />
        </DashboardPageShell>
      </DashboardGate>
    );
  }

  return <MarketingHome />;
}

function MarketingHome() {
  return (
    <div className="min-h-screen bg-background text-foreground [scroll-behavior:smooth]">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32 lg:px-16">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl">
              Share your profile with one tap.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
              tapme lets you instantly share your contact details, social links, business
              information, and more using a single NFC card.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <RegisterButton className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-transform hover:scale-[1.02]">
                Get Started
              </RegisterButton>
              <Link
                to="/how-it-works"
                className="inline-flex h-11 items-center rounded-full border border-border bg-background px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="animate-fade-in">
            <NfcCard />
          </div>
        </div>
      </section>

      <section id="how">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-16">
          <h2 className="text-2xl font-medium tracking-tight text-foreground md:text-4xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Tap", d: "Tap your NFC card on a compatible smartphone." },
              { n: "2", t: "Open", d: "Your digital profile opens instantly." },
              { n: "3", t: "Connect", d: "Save contacts, visit links, or contact you immediately." },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-border bg-background p-8 transition-colors hover:bg-secondary"
              >
                <div className="text-base text-muted-foreground">{s.n}</div>
                <div className="mt-3 text-lg font-medium text-foreground">{s.t}</div>
                <p className="mt-2 text-base text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:px-16">
          <h2 className="text-2xl font-medium tracking-tight text-foreground md:text-4xl">
            Features
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { t: "Digital Profile", d: "Create your professional digital identity." },
              { t: "Always Up To Date", d: "Update your information anytime without replacing your card." },
              { t: "Works Instantly", d: "No app required for most modern smartphones." },
              { t: "Share Everything", d: "Social media, phone number, email, website, portfolio, business information." },
            ].map((f) => (
              <div
                key={f.t}
                className="rounded-2xl border border-border p-8 transition-colors hover:bg-secondary"
              >
                <div className="text-lg font-medium text-foreground">{f.t}</div>
                <p className="mt-2 text-base text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-5xl">
            Your business card, reinvented.
          </h2>
          <div className="mt-10">
            <RegisterButton className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-transform hover:scale-[1.02]">
              Create your profile
            </RegisterButton>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
