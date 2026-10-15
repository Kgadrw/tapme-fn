import { ClipboardList, HelpCircle } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Spinner } from "@/components/spinner";
import type { BusinessDashboardData } from "@/lib/business";
import { getMyBusiness } from "@/lib/business-api";
import { getMarketingUrl } from "@/lib/domains";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-[#fef7e0] text-[#b06000]",
  reviewing: "bg-[var(--g-blue-soft)] text-[var(--g-blue-text)]",
  approved: "bg-[#e6f4ea] text-[#137333]",
  rejected: "bg-[#fce8e6] text-[var(--g-danger)]",
};

export function BusinessDashboardRequestsPage() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBusiness()
      .then(setData)
      .catch(() => setData({ account: null, requests: [], team: [] }))
      .finally(() => setLoading(false));
  }, []);

  const requests = data?.requests ?? [];
  const counts = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      reviewing: requests.filter((r) => r.status === "reviewing").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
  }, [requests]);

  if (loading) {
    return (
      <div className="g-card flex justify-center py-16">
        <Spinner className="h-8 w-8" label="Loading requests" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="g-page-title">Requests</h1>
        <p className="g-page-subtitle">
          Track team profile requests and where each one stands.
        </p>
      </div>

      <section className="g-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--g-blue-soft)] text-[var(--g-blue-text)]">
            <ClipboardList className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-base font-medium text-[var(--g-text)]">Request inbox</div>
            <p className="mt-1 text-sm text-[var(--g-muted)]">
              {counts.total === 0
                ? "No requests yet. New submissions will show up here."
                : `${counts.total} request${counts.total === 1 ? "" : "s"} in total, ${counts.pending} pending.`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatChip label="Pending" value={String(counts.pending)} />
          <StatChip label="Reviewing" value={String(counts.reviewing)} />
          <StatChip label="Approved" value={String(counts.approved)} />
        </div>
      </section>

      {requests.length === 0 ? (
        <section className="g-card px-5 py-12 text-center md:px-6">
          <p className="text-sm font-medium text-[var(--g-text)]">No requests yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--g-muted)]">
            When someone requests team profiles for your company, you will see the details and
            status here.
          </p>
          <a
            href={getMarketingUrl("/business")}
            className="g-btn-secondary mt-5 inline-flex"
          >
            Learn about business
          </a>
        </section>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <section key={request.id} className="g-card p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-base font-medium text-[var(--g-text)]">
                    {request.companyName}
                  </div>
                  <p className="mt-1 text-sm text-[var(--g-muted)]">
                    {request.contactName}, {request.contactEmail}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium capitalize",
                    statusStyles[request.status] ?? "bg-[#f1f3f4] text-[var(--g-muted)]",
                  )}
                >
                  {request.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                <Detail label="Team size" value={String(request.teamSize)} />
                <Detail
                  label="Submitted"
                  value={new Date(request.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
                <Detail label="Phone" value={request.contactPhone || "Not provided"} />
              </dl>

              {request.message ? (
                <div className="mt-4 rounded-[8px] bg-[#f8f9fa] px-4 py-3">
                  <div className="text-xs font-medium text-[var(--g-muted)]">Message</div>
                  <p className="mt-1 text-sm text-[var(--g-text)]">{request.message}</p>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}

      <section className="g-card p-5 md:p-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
          <h2 className="text-sm font-medium text-[var(--g-text)]">Status guide</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <FaqItem question="Pending" answer="New request waiting for TapMe review." />
          <FaqItem question="Reviewing" answer="The team is checking details and capacity." />
          <FaqItem question="Approved" answer="Ready to activate and manage team profiles." />
          <FaqItem question="Rejected" answer="Not approved. Contact support if you need help." />
        </div>
      </section>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-[var(--g-border)] bg-white px-3 py-1.5 text-xs">
      <span className="text-[var(--g-muted)]">{label}</span>{" "}
      <span className="font-medium text-[var(--g-text)]">{value}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-[var(--g-border)] px-3 py-2.5">
      <dt className="text-xs text-[var(--g-muted)]">{label}</dt>
      <dd className="mt-1 font-medium text-[var(--g-text)]">{value}</dd>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-[var(--g-text)]">{question}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">{answer}</p>
    </div>
  );
}
