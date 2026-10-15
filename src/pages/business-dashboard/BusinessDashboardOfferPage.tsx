import { Eye, Gift, HelpCircle } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import type { BusinessDashboardData, BusinessOffer } from "@/lib/business";
import { getMyBusiness, updateBusinessOffer } from "@/lib/business-api";
import { cn } from "@/lib/utils";

export function BusinessDashboardOfferPage() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [offer, setOffer] = useState<BusinessOffer>({
    headline: "",
    description: "",
    ctaLabel: "",
    ctaUrl: "",
    badgeText: "",
    brandColor: "#1a73e8",
    enabled: true,
  });

  useEffect(() => {
    getMyBusiness()
      .then((result) => {
        setData(result);
        if (result.account?.offer) setOffer(result.account.offer);
      })
      .catch(() => setData({ account: null, requests: [], team: [] }))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const next = await updateBusinessOffer(offer);
      setData(next);
      if (next.account?.offer) setOffer(next.account.offer);
      toast.success("Business offer updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update offer");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="g-card flex justify-center py-16">
        <Spinner className="h-8 w-8" label="Loading offer" />
      </div>
    );
  }

  const account = data?.account;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="g-page-title">Business offer</h1>
        <p className="g-page-subtitle">
          Customize the offer card shown on linked team profiles.
        </p>
      </div>

      <section
        className={cn(
          "g-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6",
          offer.enabled ? "border-[#ceead6] bg-[#e6f4ea]/20" : "border-[var(--g-border)]",
        )}
      >
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              offer.enabled
                ? "bg-[#e6f4ea] text-[#137333]"
                : "bg-[#f1f3f4] text-[var(--g-muted)]",
            )}
          >
            <Gift className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-base font-medium text-[var(--g-text)]">
              {offer.enabled ? "Offer is visible on team profiles" : "Offer is currently hidden"}
            </div>
            <p className="mt-1 text-sm text-[var(--g-muted)]">
              {account
                ? `Shown for ${account.companyName} when a team member profile is linked.`
                : "Link a business account to publish this offer on team profiles."}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium",
            offer.enabled
              ? "bg-[#e6f4ea] text-[#137333]"
              : "bg-[#f1f3f4] text-[var(--g-muted)]",
          )}
        >
          {offer.enabled ? "Enabled" : "Disabled"}
        </span>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form className="g-card space-y-4 p-5 md:p-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-sm font-medium text-[var(--g-text)]">Offer content</h2>
            <p className="mt-1 text-sm text-[var(--g-muted)]">
              Keep the headline short and the call to action clear.
            </p>
          </div>

          <Field
            label="Headline"
            value={offer.headline}
            onChange={(value) => setOffer((current) => ({ ...current, headline: value }))}
            placeholder="Work with our team"
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[var(--g-muted)]">
              Description
            </span>
            <textarea
              value={offer.description}
              onChange={(event) =>
                setOffer((current) => ({ ...current, description: event.target.value }))
              }
              rows={4}
              placeholder="Tell visitors what you offer and why they should reach out."
              className="w-full rounded-[8px] border border-[var(--g-border)] bg-white px-3.5 py-3 text-sm text-[var(--g-text)] outline-none transition-colors placeholder:text-[#80868b] focus:border-[var(--g-blue)] focus:shadow-[0_0_0_2px_rgba(26,115,232,0.2)]"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Badge text"
              value={offer.badgeText ?? ""}
              onChange={(value) => setOffer((current) => ({ ...current, badgeText: value }))}
              placeholder="Partner with us"
            />
            <Field
              label="Brand color"
              value={offer.brandColor ?? "#1a73e8"}
              onChange={(value) => setOffer((current) => ({ ...current, brandColor: value }))}
              placeholder="#1a73e8"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Button label"
              value={offer.ctaLabel}
              onChange={(value) => setOffer((current) => ({ ...current, ctaLabel: value }))}
              placeholder="Get in touch"
            />
            <Field
              label="Button URL"
              value={offer.ctaUrl}
              onChange={(value) => setOffer((current) => ({ ...current, ctaUrl: value }))}
              placeholder="https://example.com/contact"
            />
          </div>

          <label className="flex items-center gap-3 rounded-[8px] border border-[var(--g-border)] px-3.5 py-3 text-sm text-[var(--g-text)]">
            <input
              type="checkbox"
              checked={offer.enabled}
              onChange={(event) =>
                setOffer((current) => ({ ...current, enabled: event.target.checked }))
              }
              className="h-4 w-4 rounded border-[var(--g-border)]"
            />
            Show offer on team profiles
          </label>

          <button type="submit" disabled={saving} className="g-btn-primary disabled:opacity-60">
            {saving ? <Spinner className="h-4 w-4" /> : null}
            Save offer
          </button>
        </form>

        <div className="space-y-6">
          <section className="g-card p-5 md:p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
              <h2 className="text-sm font-medium text-[var(--g-text)]">Live preview</h2>
            </div>
            <div className="mt-4 overflow-hidden rounded-[12px] border border-[var(--g-border)]">
              <div
                className="px-4 py-2 text-xs font-medium text-white"
                style={{ backgroundColor: offer.brandColor || "#1a73e8" }}
              >
                {offer.badgeText || "Business offer"}
              </div>
              <div className="space-y-3 bg-white p-4">
                <div className="text-base font-medium text-[var(--g-text)]">
                  {offer.headline || "Your headline"}
                </div>
                <p className="text-sm text-[var(--g-muted)]">
                  {offer.description || "Your offer description will appear here."}
                </p>
                {offer.ctaLabel ? (
                  <span className="inline-flex h-9 items-center rounded-full bg-[var(--g-text)] px-4 text-xs font-medium text-white">
                    {offer.ctaLabel}
                  </span>
                ) : (
                  <span className="text-xs text-[var(--g-muted)]">Add a button label to preview CTA</span>
                )}
              </div>
            </div>
            {account ? (
              <p className="mt-3 text-xs text-[var(--g-muted)]">
                Preview for {account.companyName}.
              </p>
            ) : null}
          </section>

          <section className="g-card p-5 md:p-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[var(--g-blue-text)]" strokeWidth={1.75} />
              <h2 className="text-sm font-medium text-[var(--g-text)]">Tips</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--g-muted)]">
              <Tip>Use one clear benefit in the headline.</Tip>
              <Tip>Make the button lead to a booking, WhatsApp, or contact page.</Tip>
              <Tip>Turn the offer off anytime without deleting your copy.</Tip>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--g-blue)]" />
      <span>{children}</span>
    </li>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--g-muted)]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[8px] border border-[var(--g-border)] bg-white px-3.5 text-sm text-[var(--g-text)] outline-none transition-colors placeholder:text-[#80868b] focus:border-[var(--g-blue)] focus:shadow-[0_0_0_2px_rgba(26,115,232,0.2)]"
      />
    </label>
  );
}
