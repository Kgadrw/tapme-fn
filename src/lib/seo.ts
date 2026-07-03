import type { UserProfile } from "@/lib/profile";
import { domains, getMarketingUrl, getProfileUrl } from "@/lib/domains";

export const SEO = {
  siteName: "tapme",
  tagline: "Share your profile with one tap",
  locale: "en_RW",
  twitterHandle: "@tapme",
  defaultDescription:
    "tapme is an NFC digital business card platform. Create a smart profile, share contact details, social links, and payments with a single tap — no app required.",
  keywords:
    "tapme, NFC business card, digital business card, digital profile, smart card, contact sharing, Rwanda, Kigali, vCard, QR code profile, mobile business card",
} as const;

function siteOrigin(): string {
  return getMarketingUrl("/").replace(/\/$/, "");
}

function absoluteAsset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${normalized}`;
}

export type PageSeoOptions = {
  title: string;
  description: string;
  path?: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  keywords?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function buildPageHead(options: PageSeoOptions) {
  const canonical = options.canonical ?? getMarketingUrl(options.path ?? "/");
  const image = options.image ?? absoluteAsset("/logo.png");
  const imageAlt = options.imageAlt ?? `${SEO.siteName} — ${SEO.tagline}`;
  const title = options.title;
  const robots = options.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const meta: Array<{ title?: string; name?: string; content?: string; property?: string; "script:ld+json"?: unknown }> = [
    { title },
    { name: "description", content: options.description },
    { name: "keywords", content: options.keywords ?? SEO.keywords },
    { name: "author", content: SEO.siteName },
    { name: "robots", content: robots },
    { name: "googlebot", content: robots },
    { name: "application-name", content: SEO.siteName },
    { property: "og:site_name", content: SEO.siteName },
    { property: "og:title", content: title },
    { property: "og:description", content: options.description },
    { property: "og:url", content: canonical },
    { property: "og:type", content: options.type ?? "website" },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:locale", content: SEO.locale },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SEO.twitterHandle },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: options.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  const schemas = options.jsonLd
    ? Array.isArray(options.jsonLd)
      ? options.jsonLd
      : [options.jsonLd]
    : [];

  for (const schema of schemas) {
    meta.push({ "script:ld+json": schema });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO.siteName,
    alternateName: ["tap me", "TapMe"],
    url: siteOrigin(),
    logo: absoluteAsset("/logo.png"),
    description: SEO.defaultDescription,
    foundingLocation: {
      "@type": "Place",
      name: "Kigali, Rwanda",
    },
    areaServed: {
      "@type": "Country",
      name: "Rwanda",
    },
    sameAs: [],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO.siteName,
    alternateName: "tap me",
    url: siteOrigin(),
    description: SEO.defaultDescription,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: SEO.siteName,
      logo: absoluteAsset("/logo.png"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${getProfileUrl("{search_term_string}")}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SEO.siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    url: siteOrigin(),
    description: SEO.defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RWF",
      description: "Free to create your digital profile",
    },
    featureList: [
      "NFC digital business card",
      "QR code profile sharing",
      "Social and payment links",
      "Profile analytics",
      "Contact download (vCard)",
    ],
  };
}

export function buildFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getMarketingUrl(item.path),
    })),
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO.siteName,
    url: siteOrigin(),
    email: "hello@tapme.rw",
    telephone: "+250788000000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@tapme.rw",
      availableLanguage: ["English"],
    },
  };
}

export function buildProfileHead(profile: UserProfile, slug: string) {
  const canonical = getProfileUrl(slug);
  const title = `${profile.fullName} | ${SEO.siteName}`;
  const description =
    profile.bio?.trim() ||
    [profile.jobTitle, profile.company].filter(Boolean).join(" at ") ||
    `View ${profile.fullName}'s digital profile on tapme — contact details, social links, and more.`;
  const image = profile.avatarUrl || absoluteAsset("/profile-image.svg");

  const personSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: title,
    url: canonical,
    description,
    mainEntity: {
      "@type": "Person",
      name: profile.fullName,
      url: canonical,
      image,
      jobTitle: profile.jobTitle || undefined,
      worksFor: profile.company
        ? {
            "@type": "Organization",
            name: profile.company,
          }
        : undefined,
      email: profile.email || undefined,
      telephone: profile.phone || undefined,
      address: profile.location
        ? {
            "@type": "PostalAddress",
            addressLocality: profile.location,
          }
        : undefined,
      sameAs: profile.socialLinks.map((link) => link.url).filter(Boolean),
    },
  };

  const meta: Array<{ title?: string; name?: string; content?: string; property?: string; "script:ld+json"?: unknown }> = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:site_name", content: SEO.siteName },
    { property: "og:title", content: profile.fullName },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:type", content: "profile" },
    { property: "og:image", content: image },
    { property: "profile:username", content: slug },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: profile.fullName },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { "script:ld+json": personSchema },
  ];

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function marketingSeo(
  options: Omit<PageSeoOptions, "jsonLd"> & {
    breadcrumbs?: Array<{ name: string; path: string }>;
    extraSchemas?: Array<Record<string, unknown>>;
    faqs?: Array<{ question: string; answer: string }>;
  },
) {
  const jsonLd: Array<Record<string, unknown>> = [...(options.extraSchemas ?? [])];

  if (options.faqs?.length) {
    jsonLd.push(buildFaqSchema(options.faqs));
  }

  if (options.breadcrumbs?.length) {
    jsonLd.push(buildBreadcrumbSchema(options.breadcrumbs));
  }

  const title = options.title.includes(SEO.siteName)
    ? options.title
    : `${options.title} | ${SEO.siteName}`;

  return buildPageHead({
    ...options,
    title,
    jsonLd: jsonLd.length > 0 ? jsonLd : undefined,
  });
}

export function noIndexHead(title: string) {
  return buildPageHead({
    title: `${title} | ${SEO.siteName}`,
    description: SEO.defaultDescription,
    noindex: true,
  });
}

/** Production marketing URLs for sitemap generation reference */
export const MARKETING_SITEMAP_PATHS = [
  "/",
  "/features",
  "/how-it-works",
  "/pricing",
  "/business",
  "/contact",
] as const;

export function getPublicProfileHostLabel(): string {
  return domains.publicProfile;
}
