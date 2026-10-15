import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/spinner";
import type { BusinessDashboardData, BusinessOffer } from "@/lib/business";
import { getMyBusiness, updateBusinessOffer } from "@/lib/business-api";

export const Route = createFileRoute("/business/dashboard/offer")({
  component: BusinessOfferPage,
});

function BusinessOfferPage() {
  const [data, setData] = useState<BusinessDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [offer, setOffer] = useState<BusinessOffer>({
    headline: "",
    description: "",
    ctaLabel: "",
    ctaUrl: "",
    badgeText: "",
    brandColor: "#111111",
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
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-8 w-8" label="Loading offer" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">Business offer</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Customize the offer card shown on linked team profiles.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form className="space-y-4 rounded-2xl border border-border p-6 md:p-8" onSubmit={handleSubmit}>
          <Field
            label="Headline"
            value={offer.headline}
            onChange={(value) => setOffer((current) => ({ ...current, headline: value }))}
          />
          <label className="block">
            <span className="mb-1.5 block text-xs text-muted-foreground">Description</span>
            <textarea
              value={offer.description}
              onChange={(event) =>
                setOffer((current) => ({ ...current, description: event.target.value }))
              }
              rows={4}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-foreground"
            />
          </label>
          <Field
            label="Badge text"
            value={offer.badgeText ?? ""}
            onChange={(value) => setOffer((current) => ({ ...current, badgeText: value }))}
          />
          <Field
            label="Button label"
            value={offer.ctaLabel}
            onChange={(value) => setOffer((current) => ({ ...current, ctaLabel: value }))}
          />
          <Field
            label="Button URL"
            value={offer.ctaUrl}
            onChange={(value) => setOffer((current) => ({ ...current, ctaUrl: value }))}
          />
          <Field
            label="Brand color"
            value={offer.brandColor ?? "#111111"}
            onChange={(value) => setOffer((current) => ({ ...current, brandColor: value }))}
          />
          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={offer.enabled}
              onChange={(event) =>
                setOffer((current) => ({ ...current, enabled: event.target.checked }))
              }
              className="h-4 w-4 rounded border-border"
            />
            Show offer on team profiles
          </label>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60"
          >
            {saving ? <Spinner className="h-4 w-4" /> : null}
            Save offer
          </button>
        </form>

        <div className="rounded-2xl border border-border p-6">
          <div className="text-sm text-muted-foreground">Preview</div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <div
              className="px-4 py-2 text-xs font-medium text-white"
              style={{ backgroundColor: offer.brandColor || "#111111" }}
            >
              {offer.badgeText || "Business offer"}
            </div>
            <div className="space-y-3 p-4">
              <div className="text-base font-medium text-foreground">
                {offer.headline || "Your headline"}
              </div>
              <p className="text-sm text-muted-foreground">
                {offer.description || "Your offer description will appear here."}
              </p>
              {offer.ctaLabel ? (
                <span className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-xs font-medium text-background">
                  {offer.ctaLabel}
                </span>
              ) : null}
            </div>
          </div>
          {data?.account ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Shown on active team profiles for {data.account.companyName}.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-foreground"
      />
    </label>
  );
}
