import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ProfilePreview } from "@/components/profile-preview";
import { Spinner } from "@/components/spinner";
import type { BusinessOffer } from "@/lib/business";
import { getPublicBusinessOffer } from "@/lib/business-api";
import { recordProfileEvent } from "@/lib/analytics-api";
import {
  normalizeProfileSlug,
  RESERVED_PROFILE_SLUGS,
} from "@/lib/domains";
import { getPublicProfile } from "@/lib/profile-api";
import type { UserProfile } from "@/lib/profile";

export function PublicProfilePage() {
  const params = useParams<{ slug: string }>();
  const slug = normalizeProfileSlug(params.slug ?? "");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [businessOffer, setBusinessOffer] = useState<BusinessOffer | null>(null);
  const [businessCompanyName, setBusinessCompanyName] = useState<string>();

  useEffect(() => {
    if (!slug || RESERVED_PROFILE_SLUGS.has(slug)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getPublicProfile(slug)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(null);
        setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!profile || !slug) return;

    recordProfileEvent(slug, { type: "view" }).catch(() => undefined);

    const search = new URLSearchParams(window.location.search);
    if (search.get("tap") === "1") {
      recordProfileEvent(slug, { type: "tap" }).catch(() => undefined);
    }
  }, [slug, profile]);

  useEffect(() => {
    if (!slug || RESERVED_PROFILE_SLUGS.has(slug)) return;

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

  if (notFound || !profile) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-background px-6 text-center">
        <h1 className="text-2xl font-medium text-foreground">Profile not found</h1>
        <p className="text-sm text-muted-foreground">
          This TapMe profile does not exist or is unavailable.
        </p>
      </div>
    );
  }

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
