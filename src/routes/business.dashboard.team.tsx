import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import type { BusinessDashboardData } from "@/lib/business";
import { addBusinessTeamMember, getMyBusiness, removeBusinessTeamMember } from "@/lib/business-api";
import { getProfileUrl } from "@/lib/profile";

export const Route = createFileRoute("/business/dashboard/team")({
  component: BusinessTeamPage,
});

function BusinessTeamPage() {
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

    setSaving(true);
    try {
      const next = await addBusinessTeamMember({
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? "") || undefined,
        jobTitle: String(form.get("jobTitle") ?? "") || undefined,
        profileSlug: String(form.get("profileSlug") ?? "") || undefined,
      });
      setData(next);
      event.currentTarget.reset();
      toast.success("Team member added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add team member");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      const next = await removeBusinessTeamMember(id);
      setData(next);
      toast.success("Team member removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove team member");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8" label="Loading team" />
      </div>
    );
  }

  const team = data?.team ?? [];

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">Team profiles</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Add team members and link their tapme profile usernames.
        </p>
      </div>

      <section className="rounded-2xl border border-border p-6 md:p-8">
        <div className="text-base font-medium text-foreground">Add team member</div>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleAdd}>
          <Field label="Full name" name="fullName" required />
          <Field label="Email" name="email" type="email" />
          <Field label="Job title" name="jobTitle" />
          <Field label="Profile username" name="profileSlug" placeholder="john-carter" />
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60"
            >
              {saving ? <Spinner className="h-4 w-4" /> : null}
              Add to team
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="text-base font-medium text-foreground">Your team ({team.length})</div>
        {team.length === 0 ? (
          <p className="text-base text-muted-foreground">No team members yet.</p>
        ) : (
          team.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border px-5 py-4"
            >
              <div>
                <div className="text-base font-medium text-foreground">{member.fullName}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {[member.jobTitle, member.email].filter(Boolean).join(" · ") || "No details yet"}
                </div>
                {member.profileSlug ? (
                  <a
                    href={getProfileUrl(member.profileSlug)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-foreground underline"
                  >
                    {getProfileUrl(member.profileSlug)}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">Profile not linked yet</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
                  {member.status}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(member.id)}
                  aria-label={`Remove ${member.fullName}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
      />
    </label>
  );
}
