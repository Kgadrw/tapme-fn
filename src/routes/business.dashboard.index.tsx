import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import type { BusinessDashboardData } from "@/lib/business";
import { activateBusinessAccount, getMyBusiness } from "@/lib/business-api";

export const Route = createFileRoute("/business/dashboard/")({
  component: BusinessDashboardHome,
});

function BusinessDashboardHome() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    getMyBusiness()
      .then(setData)
      .catch(() => setData({ account: null, requests: [], team: [] }))
      .finally(() => setLoading(false));
  }, []);

  async function handleActivate() {
    setActivating(true);
    try {
      const next = await activateBusinessAccount();
      setData(next);
      toast.success("Business dashboard activated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Activation failed");
    } finally {
      setActivating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8" label="Loading business dashboard" />
      </div>
    );
  }

  const account = data?.account;
  const teamCount = data?.team.length ?? 0;
  const pendingRequests = data?.requests.filter((r) => r.status === "pending").length ?? 0;

  if (!account) {
    return (
      <div className="animate-fade-in mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          Business dashboard
        </h1>
        <div className="rounded-2xl border border-border p-8">
          <p className="text-base text-muted-foreground">
            No business account is linked to your email yet.{" "}
            <Link to="/contact" className="text-foreground underline">
              Contact us
            </Link>{" "}
            to set up team profiles for your company, then return here to manage your team.
          </p>
          <Link
            to="/business"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-base font-medium text-background"
          >
            Back to business page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
            {account.companyName}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage team profiles and your customized business offer.
          </p>
        </div>
        {account.status === "pending" ? (
          <button
            type="button"
            onClick={handleActivate}
            disabled={activating}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60"
          >
            {activating ? <Spinner className="h-4 w-4" /> : null}
            Activate dashboard
          </button>
        ) : (
          <span className="inline-flex h-9 items-center rounded-full border border-border px-4 text-sm font-medium capitalize text-foreground">
            {account.status}
          </span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Team profiles" value={String(teamCount)} />
        <StatCard label="Team size goal" value={String(account.teamSizeGoal)} />
        <StatCard label="Pending requests" value={String(pendingRequests)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/business/dashboard/team"
          className="rounded-2xl border border-border p-6 transition-colors hover:bg-secondary"
        >
          <div className="text-lg font-medium text-foreground">Manage team profiles</div>
          <p className="mt-2 text-base text-muted-foreground">
            Add employees, link their tapme profiles, and keep your roster up to date.
          </p>
        </Link>
        <Link
          to="/business/dashboard/offer"
          className="rounded-2xl border border-border p-6 transition-colors hover:bg-secondary"
        >
          <div className="text-lg font-medium text-foreground">Customize business offer</div>
          <p className="mt-2 text-base text-muted-foreground">
            Set the headline, description, and call-to-action shown on team profiles.
          </p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-6">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-medium text-foreground">{value}</div>
    </div>
  );
}
