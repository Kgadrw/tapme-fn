import { ExternalLink, HelpCircle, Trash2, UserPlus, Users } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import type { BusinessDashboardData } from "@/lib/business";
import { addBusinessTeamMember, getMyBusiness, removeBusinessTeamMember } from "@/lib/business-api";
import { getMarketingUrl } from "@/lib/domains";
import { getProfileUrl } from "@/lib/profile";
import { cn } from "@/lib/utils";

export function BusinessDashboardTeamPage() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyBusiness()
      .then(setData)
      .catch(() => setData({ account: null, requests: [], team: [] }))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const profileSlug = String(form.get("profileSlug") ?? "").trim().toLowerCase();

    if (!profileSlug) {
      toast.error("Each team member needs their own TapMe username");
      return;
    }

    setSaving(true);
    try {
      const next = await addBusinessTeamMember({
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? "") || undefined,
        jobTitle: String(form.get("jobTitle") ?? "") || undefined,
        profileSlug,
      });
      setData(next);
      event.currentTarget.reset();
      toast.success("Individual profile linked to your team");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add team profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      const next = await removeBusinessTeamMember(id);
      setData(next);
      toast.success("Team profile removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove team profile");
    }
  }

  if (loading) {
    return (
      <div className="g-card flex justify-center py-16">
        <Spinner className="h-8 w-8" label="Loading team profiles" />
      </div>
    );
  }

  const team = data?.team ?? [];
  const account = data?.account;
  const linkedCount = team.filter((member) => Boolean(member.profileSlug)).length;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="g-page-title">Team profiles</h1>
        <p className="g-page-subtitle">
          Every team member keeps their own individual TapMe profile. You link those profiles to
          your business so they share your company offer.
        </p>
      </div>

      <section className="g-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--g-blue-soft)] text-[var(--g-blue-text)]">
            <Users className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-base font-medium text-[var(--g-text)]">
              {account ? `${account.companyName} profiles` : "Individual team profiles"}
            </div>
            <p className="mt-1 text-sm text-[var(--g-muted)]">
              {linkedCount} individual profile{linkedCount === 1 ? "" : "s"} linked
              {account ? `, team goal ${account.teamSizeGoal}` : ""}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatChip label="Profiles" value={String(team.length)} />
          <StatChip label="Linked" value={String(linkedCount)} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="g-card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
            <h2 className="text-sm font-medium text-[var(--g-text)]">Add an individual profile</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--g-muted)]">
            Enter the person’s TapMe username. That username is their own public profile, separate
            from yours, and it will show your business offer when linked.
          </p>

          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleAdd}>
            <Field label="Full name" name="fullName" required placeholder="Jane Uwase" />
            <Field
              label="TapMe username"
              name="profileSlug"
              required
              placeholder="jane-uwase"
              hint="Required. This is their individual public profile."
            />
            <Field label="Job title" name="jobTitle" placeholder="Account manager" />
            <Field label="Work email" name="email" type="email" placeholder="jane@company.com" />
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="g-btn-primary disabled:opacity-60">
                {saving ? <Spinner className="h-4 w-4" /> : null}
                Link profile to team
              </button>
            </div>
          </form>
        </section>

        <section className="g-card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
            <h2 className="text-sm font-medium text-[var(--g-text)]">How individual profiles work</h2>
          </div>
          <ol className="mt-4 space-y-3 text-sm text-[var(--g-muted)]">
            <Step n={1}>
              Each person creates or already has their own TapMe profile with a unique username.
            </Step>
            <Step n={2}>
              You link that username here so it belongs to your business team.
            </Step>
            <Step n={3}>
              Visitors still open that person’s individual profile, and can also see your business
              offer on it.
            </Step>
          </ol>
          <p className="mt-4 text-xs text-[var(--g-muted)]">
            Need help onboarding the team?{" "}
            <a
              href={getMarketingUrl("/contact")}
              className="font-medium text-[var(--g-blue-text)] underline-offset-2 hover:underline"
            >
              Contact TapMe
            </a>
            .
          </p>
        </section>
      </div>

      <section className="g-card p-5 md:p-6">
        <div>
          <h2 className="text-sm font-medium text-[var(--g-text)]">Linked individual profiles</h2>
          <p className="mt-1 text-sm text-[var(--g-muted)]">
            {team.length === 0
              ? "No individual profiles linked yet. Add the first team member above."
              : "Each card is one person’s own TapMe profile inside your business."}
          </p>
        </div>

        {team.length === 0 ? (
          <div className="mt-5 rounded-[8px] border border-dashed border-[var(--g-border)] bg-[#f8f9fa] px-4 py-8 text-center text-sm text-[var(--g-muted)]">
            Link the first individual TapMe profile to get started.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {team.map((member) => {
              const profileUrl = member.profileSlug
                ? getProfileUrl(member.profileSlug)
                : null;

              return (
                <div
                  key={member.id}
                  className="flex flex-col rounded-[12px] border border-[var(--g-border)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[var(--g-text)]">
                        {member.fullName}
                      </div>
                      <div className="mt-1 text-sm text-[var(--g-muted)]">
                        {[member.jobTitle, member.email].filter(Boolean).join(", ") ||
                          "Individual TapMe profile"}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-medium capitalize",
                        member.profileSlug
                          ? "bg-[#e6f4ea] text-[#137333]"
                          : "bg-[#fef7e0] text-[#b06000]",
                      )}
                    >
                      {member.profileSlug ? "Individual profile" : "Missing username"}
                    </span>
                  </div>

                  {profileUrl ? (
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 break-all text-sm font-medium text-[var(--g-blue-text)] underline-offset-2 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      {profileUrl}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-[var(--g-muted)]">
                      Add a TapMe username so this person has a public individual profile.
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--g-border)] pt-3">
                    {profileUrl ? (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="g-btn-secondary h-8 px-3 text-xs"
                      >
                        Open individual profile
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleRemove(member.id)}
                      aria-label={`Remove ${member.fullName}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-[var(--g-danger)] transition-colors hover:bg-[#fce8e6]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--g-blue-soft)] text-xs font-medium text-[var(--g-blue-text)]">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--g-muted)]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-10 w-full rounded-[8px] border border-[var(--g-border)] bg-white px-3.5 text-sm text-[var(--g-text)] outline-none transition-colors placeholder:text-[#80868b] focus:border-[var(--g-blue)] focus:shadow-[0_0_0_2px_rgba(26,115,232,0.2)]"
      />
      {hint ? <span className="mt-1.5 block text-[11px] text-[var(--g-muted)]">{hint}</span> : null}
    </label>
  );
}
