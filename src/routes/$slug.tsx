import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ProfilePreview } from "@/components/profile-preview";
import { Spinner } from "@/components/spinner";
import { usePublicProfile } from "@/context/profile-context";
import type { BusinessOffer } from "@/lib/business";
import { getPublicBusinessOffer } from "@/lib/business-api";
import { recordProfileEvent } from "@/lib/analytics-api";
import {
  getProfileUrl,
  isPublicProfileHost,
  isSubdomainRoutingEnabled,
  RESERVED_PROFILE_SLUGS,
} from "@/lib/domains";

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (RESERVED_PROFILE_SLUGS.has(params.slug)) {
      throw notFound();
    }

    if (isSubdomainRoutingEnabled() && !isPublicProfileHost()) {
      throw redirect({ href: getProfileUrl(params.slug), replace: true });
    }
  },
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { slug } = Route.useParams();
  const { profile, loading } = usePublicProfile(slug);
  const [businessOffer, setBusinessOffer] = useState<BusinessOffer | null>(null);
  const [businessCompanyName, setBusinessCompanyName] = useState<string>();

  useEffect(() => {
    if (!profile) return;

    recordProfileEvent(slug, { type: "view" }).catch(() => undefined);

    const params = new URLSearchParams(window.location.search);
    if (params.get("tap") === "1") {
      recordProfileEvent(slug, { type: "tap" }).catch(() => undefined);
    }
  }, [slug, profile]);

  useEffect(() => {
    getPublicBusinessOffer(slug)
      .then((result) => {
        setBusinessOffer(result.offer);
        setBusinessCompanyName(result.companyName);
      })
      .catch(() => {
        setBusinessOffer(null);
        setBusinessCompanyName(undefined);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="h-8 w-8" label="Loading profile" />
      </div>
    );
  }

  if (!profile) throw notFound();

  return (
    <div className="min-h-dvh bg-background md:flex md:items-center md:justify-center md:bg-secondary/30 md:p-8">
      <div className="w-full overflow-hidden bg-background md:max-w-sm md:rounded-[2rem] md:border md:border-border md:shadow-xl">
        <ProfilePreview
          profile={profile}
          businessOffer={businessOffer}
          businessCompanyName={businessCompanyName}
          analyticsSlug={slug}
        />
      </div>
    </div>
  );
}
