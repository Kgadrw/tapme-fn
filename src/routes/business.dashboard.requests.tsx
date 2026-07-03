import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/spinner";
import type { BusinessDashboardData } from "@/lib/business";
import { getMyBusiness } from "@/lib/business-api";

export const Route = createFileRoute("/business/dashboard/requests")({
  component: BusinessRequestsPage,
});

const statusStyles: Record<string, string> = {
  pending: "text-amber-600",
  reviewing: "text-blue-600",
  approved: "text-green-600",
  rejected: "text-red-600",
};

function BusinessRequestsPage() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBusiness()
      .then(setData)
      .catch(() => setData({ account: null, requests: [], team: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8" label="Loading requests" />
      </div>
    );
  }

  const requests = data?.requests ?? [];

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">Requests</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Track your team profile requests and their status.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 text-base text-muted-foreground">
          No requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-border p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-medium text-foreground">{request.companyName}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.contactName} · {request.contactEmail}
                  </p>
                </div>
                <span
                  className={`rounded-full border border-border px-3 py-1 text-xs font-medium capitalize ${statusStyles[request.status] ?? "text-muted-foreground"}`}
                >
                  {request.status}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                <div>Team size: {request.teamSize}</div>
                <div>Submitted: {new Date(request.createdAt).toLocaleDateString()}</div>
                {request.contactPhone ? <div>Phone: {request.contactPhone}</div> : null}
              </div>
              {request.message ? (
                <p className="mt-4 rounded-2xl bg-secondary/40 p-4 text-sm text-foreground">
                  {request.message}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
