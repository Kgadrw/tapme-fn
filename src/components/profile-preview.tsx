import { Camera, MapPin, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { PaymentPayButton } from "@/components/payment-links-grid";
import { SocialPlatformLogo } from "@/components/social-platform-select";
import { recordProfileEvent } from "@/lib/analytics-api";
import { type UserProfile } from "@/lib/profile";
import type { BusinessOffer } from "@/lib/business";
import { encodeSocialLogoPath } from "@/lib/social-platforms";
import { openSocialLink } from "@/lib/open-link";
import { saveContactToDevice } from "@/lib/vcard";
import { cn } from "@/lib/utils";

const contactIcons = {
  save: "/icons/contact.png",
  email: "/icons/mail.jpg",
  phone: "/icons/call.png",
  website: "/icons/website.png",
} as const;

const DEFAULT_PROFILE_IMAGE = "/profile-image.svg";

type ProfileLink = {
  key: string;
  label: string;
  href: string;
  value: string;
  logo?: string;
};

const profileActionButtonClass =
  "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background shadow-none transition-colors hover:bg-foreground/90";

const profileActionButtonOutlineClass =
  "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground shadow-none transition-colors hover:bg-secondary";

function trackProfileEvent(
  slug: string | undefined,
  input: { type: "contact_save" | "link_click"; linkLabel?: string },
) {
  if (!slug) return;
  recordProfileEvent(slug, input).catch(() => undefined);
}

function SaveContactButton({
  profile,
  compact,
  analyticsSlug,
}: {
  profile: UserProfile;
  compact?: boolean;
  analyticsSlug?: string;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSaveContact() {
    if (saving) return;
    setSaving(true);
    trackProfileEvent(analyticsSlug, { type: "contact_save" });
    try {
      await saveContactToDevice(profile);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleSaveContact();
      }}
      disabled={saving}
      className={cn(profileActionButtonClass, compact && "h-9 text-xs")}
    >
      <img
        src={encodeSocialLogoPath(contactIcons.save)}
        alt=""
        className={cn(
          "rounded-[2px] object-contain shadow-none drop-shadow-none",
          compact ? "h-4 w-4" : "h-5 w-5",
        )}
      />
      {saving ? "Saving…" : "Contact"}
    </button>
  );
}

function CallButton({
  phone,
  compact,
  analyticsSlug,
}: {
  phone: string;
  compact?: boolean;
  analyticsSlug?: string;
}) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, "")}`}
      aria-label="Call"
      onClick={() => trackProfileEvent(analyticsSlug, { type: "link_click", linkLabel: "Call" })}
      className="inline-flex shrink-0 items-center justify-center transition-opacity hover:opacity-70"
    >
      <img
        src={encodeSocialLogoPath(contactIcons.phone)}
        alt=""
        className={cn("rounded-sm object-contain", compact ? "h-9 w-9" : "h-11 w-11")}
      />
    </a>
  );
}

function ProfileActionButtons({
  profile,
  compact,
  analyticsSlug,
}: {
  profile: UserProfile;
  compact?: boolean;
  analyticsSlug?: string;
}) {
  const showContact = Boolean(profile.phone || profile.email);
  const showPay = profile.paymentLinks.length > 0;
  const showCall = Boolean(profile.phone);

  if (!showContact && !showPay && !showCall) return null;

  return (
    <div className={cn("flex items-center", compact ? "gap-2" : "gap-2.5")}>
      {showCall ? <CallButton phone={profile.phone} compact={compact} analyticsSlug={analyticsSlug} /> : null}
      {showContact ? <SaveContactButton profile={profile} compact={compact} analyticsSlug={analyticsSlug} /> : null}
      {showPay ? (
        <PaymentPayButton
          paymentLinks={profile.paymentLinks}
          compact={compact}
          className={cn(profileActionButtonOutlineClass, compact && "h-9 text-xs")}
          onPaymentLinkClick={(label) =>
            trackProfileEvent(analyticsSlug, { type: "link_click", linkLabel: label })
          }
        />
      ) : null}
    </div>
  );
}

type ProfilePreviewProps = {
  profile: UserProfile;
  compact?: boolean;
  onAvatarClick?: () => void;
  onAvatarRemove?: () => void;
  onEditIdentity?: () => void;
  businessOffer?: BusinessOffer | null;
  businessCompanyName?: string;
  analyticsSlug?: string;
};

function formatWebsite(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function buildLinks(profile: UserProfile): ProfileLink[] {
  return [
    profile.email && {
      key: "email",
      label: "Email",
      href: `mailto:${profile.email}`,
      value: profile.email,
      logo: contactIcons.email,
    },
    profile.phone && {
      key: "phone",
      label: "Call",
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
      value: profile.phone,
      logo: contactIcons.phone,
    },
    profile.website && {
      key: "website",
      label: "Website",
      href: profile.website.startsWith("http") ? profile.website : `https://${profile.website}`,
      value: formatWebsite(profile.website),
      logo: contactIcons.website,
    },
  ].filter(Boolean) as ProfileLink[];
}

function ContactIconButton({
  label,
  href,
  logo,
  compact,
  external,
  analyticsSlug,
}: {
  label: string;
  href: string;
  logo: string;
  compact?: boolean;
  external?: boolean;
  analyticsSlug?: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={label}
      onClick={() => trackProfileEvent(analyticsSlug, { type: "link_click", linkLabel: label })}
      className="inline-flex shrink-0 items-center justify-center transition-opacity hover:opacity-70"
    >
      <img
        src={encodeSocialLogoPath(logo)}
        alt=""
        className={cn("rounded-sm object-contain", compact ? "h-9 w-9" : "h-11 w-11")}
      />
    </a>
  );
}

function SocialLinkButton({
  label,
  href,
  platformId,
  compact,
  analyticsSlug,
}: {
  label: string;
  href: string;
  platformId: string;
  compact?: boolean;
  analyticsSlug?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        trackProfileEvent(analyticsSlug, { type: "link_click", linkLabel: label });
        openSocialLink(platformId, href);
      }}
      className="inline-flex shrink-0 items-center justify-center transition-opacity hover:opacity-70"
    >
      <SocialPlatformLogo
        platformId={platformId}
        label={label}
        className={cn("rounded-sm object-contain", compact ? "h-9 w-9" : "h-11 w-11")}
      />
    </a>
  );
}

function ProfileIconLinks({
  contactLinks,
  socialLinks,
  compact,
  analyticsSlug,
}: {
  contactLinks: ProfileLink[];
  socialLinks: UserProfile["socialLinks"];
  compact?: boolean;
  analyticsSlug?: string;
}) {
  const links = contactLinks.filter((link) => link.key !== "phone" && link.logo);
  if (links.length === 0 && socialLinks.length === 0) return null;

  const cellClass = cn(
    "flex items-center justify-center bg-background",
    compact ? "py-3" : "py-4",
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="grid grid-cols-4 gap-px bg-border">
        {links.map((link) => (
          <div key={link.key} className={cellClass}>
            <ContactIconButton
              label={link.label}
              href={link.href}
              logo={link.logo!}
              compact={compact}
              external={link.key === "website"}
              analyticsSlug={analyticsSlug}
            />
          </div>
        ))}
        {socialLinks.map((social) => (
          <div key={social.id} className={cellClass}>
            <SocialLinkButton
              label={social.label}
              href={social.url}
              platformId={social.platformId}
              compact={compact}
              analyticsSlug={analyticsSlug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePreview({
  profile,
  compact = false,
  onAvatarClick,
  onAvatarRemove,
  onEditIdentity,
  businessOffer,
  businessCompanyName,
  analyticsSlug,
}: ProfilePreviewProps) {
  const contactLinks = buildLinks(profile);

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden bg-background text-foreground",
        compact ? "h-full" : "h-dvh md:h-[680px]",
      )}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden bg-secondary",
          compact ? "h-1/2 min-h-36" : "h-[50vh] min-h-48 md:h-64",
        )}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={DEFAULT_PROFILE_IMAGE}
            alt="Profile image"
            className="h-full w-full object-cover"
          />
        )}
        {onAvatarClick ? (
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onAvatarClick}
              aria-label="Change photo"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
            >
              <Camera className="h-4 w-4" />
            </button>
            {onAvatarRemove ? (
              <button
                type="button"
                onClick={onAvatarRemove}
                disabled={!profile.avatarUrl}
                aria-label="Remove photo"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-red-400 backdrop-blur transition-colors hover:bg-black/70 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "relative z-10 -mt-6 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-3xl bg-background",
          compact ? "px-4 pb-4 pt-5" : "px-5 pb-6 pt-6 sm:px-6",
        )}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="text-left">
            <div className="flex items-start justify-between gap-2">
              <h1
                className={cn(
                  "flex min-w-0 items-center gap-1.5 font-semibold tracking-tight text-foreground",
                  compact ? "text-lg" : "text-xl sm:text-2xl",
                )}
              >
                <span className="truncate">{profile.fullName}</span>
                <img
                  src="/verified.webp"
                  alt="Verified"
                  className={cn("shrink-0 object-contain", compact ? "h-4 w-4" : "h-5 w-5")}
                />
              </h1>
              {onEditIdentity ? (
                <button
                  type="button"
                  onClick={onEditIdentity}
                  aria-label="Edit details"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Pencil className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
                </button>
              ) : null}
            </div>
            {(profile.jobTitle || profile.company) ? (
              <p
                className={cn(
                  "mt-1 font-normal text-foreground",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {[profile.jobTitle, profile.company].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            {profile.location ? (
              <p
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-muted-foreground",
                  compact ? "text-[11px]" : "text-xs",
                )}
              >
                <MapPin className="h-3 w-3 shrink-0" />
                {profile.location}
              </p>
            ) : null}
          </div>

          {profile.bio ? (
            <p
              className={cn(
                "mt-3 text-left font-normal text-foreground",
                compact ? "text-[11px] leading-relaxed" : "text-xs leading-relaxed sm:text-sm",
              )}
            >
              {profile.bio}
            </p>
          ) : null}

          <div className={cn(compact ? "mt-3" : "mt-5")}>
            <ProfileActionButtons profile={profile} compact={compact} analyticsSlug={analyticsSlug} />
          </div>

          <div className={cn(compact ? "mt-6" : "mt-8")}>
            <ProfileIconLinks
              contactLinks={contactLinks}
              socialLinks={profile.socialLinks}
              compact={compact}
              analyticsSlug={analyticsSlug}
            />
          </div>

          {businessOffer?.enabled ? (
            <div className={cn("overflow-hidden rounded-2xl border border-border", compact ? "mt-6" : "mt-8")}>
              <div
                className="px-4 py-2 text-xs font-medium text-white"
                style={{ backgroundColor: businessOffer.brandColor || "#111111" }}
              >
                {businessOffer.badgeText || businessCompanyName || "Business offer"}
              </div>
              <div className="space-y-3 p-4">
                <div className="text-sm font-medium text-foreground">{businessOffer.headline}</div>
                <p className="text-xs text-muted-foreground">{businessOffer.description}</p>
                {businessOffer.ctaLabel && businessOffer.ctaUrl ? (
                  <a
                    href={businessOffer.ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackProfileEvent(analyticsSlug, {
                        type: "link_click",
                        linkLabel: businessOffer.ctaLabel || "Business offer",
                      })
                    }
                    className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-xs font-medium text-background"
                  >
                    {businessOffer.ctaLabel}
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
