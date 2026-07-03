import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Users, Gift, Layers } from "lucide-react";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BUSINESS_BENEFITS } from "@/lib/business";

export const Route = createFileRoute("/business")({
  head: () => ({
    meta: [
      { title: "For Business — tapme" },
      {
        name: "description",
        content: "Request team profiles and manage your company on tapme with a customized business offer.",
      },
    ],
  }),
  component: BusinessPage,
});

const benefitIcons = [Users, Layers, Gift, Building2];

function BusinessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:px-10 md:pt-28 md:pb-32 lg:px-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl">
            Team profiles for your business.
          </h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            Request tapme profiles for your whole team, manage them from one dashboard, and
            showcase a customized business offer on every profile.
          </p>
          <div className="mt-8">
            <Link
              to="/business/dashboard"
              className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-transform hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUSINESS_BENEFITS.map((benefit, index) => {
            const Icon = benefitIcons[index] ?? Building2;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border p-6 transition-colors hover:bg-secondary"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="mt-4 text-base font-medium text-foreground">{benefit.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
