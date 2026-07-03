import * as simpleIcons from "simple-icons";

export type SocialPlatform = {
  id: string;
  name: string;
  hex: string;
  logo: string;
  usesLocalIcon: boolean;
  baseUrl?: string;
  urlPlaceholder: string;
};

type SimpleIconData = {
  title: string;
  slug: string;
  hex: string;
  source: string;
};

const LOCAL_SOCIAL_ICONS: Record<string, string> = {
  instagram: "/icons/instagram.jpg",
  linkedin: "/icons/linkedin.jpg",
  github: "/icons/github.png",
  whatsapp: "/icons/whatsapp.png",
  x: "/icons/twiter.jpg",
  twitter: "/icons/twiter.jpg",
};

const LEGACY_SLUG_ALIASES: Record<string, string> = {
  twitter: "x",
};

const PROFILE_BASE_URLS: Record<string, string> = {
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/in/",
  x: "https://x.com/",
  twitter: "https://twitter.com/",
  github: "https://github.com/",
  whatsapp: "https://wa.me/",
  youtube: "https://youtube.com/@",
  tiktok: "https://tiktok.com/@",
  facebook: "https://facebook.com/",
  threads: "https://threads.net/@",
  snapchat: "https://snapchat.com/add/",
  telegram: "https://t.me/",
  discord: "https://discord.gg/",
  pinterest: "https://pinterest.com/",
  spotify: "https://open.spotify.com/user/",
  twitch: "https://twitch.tv/",
  reddit: "https://reddit.com/user/",
  medium: "https://medium.com/@",
  behance: "https://behance.net/",
  dribbble: "https://dribbble.com/",
};

export const POPULAR_PLATFORM_SLUGS = [
  "instagram",
  "linkedin",
  "x",
  "github",
  "facebook",
  "youtube",
  "tiktok",
  "whatsapp",
  "telegram",
  "discord",
  "threads",
  "snapchat",
  "pinterest",
  "spotify",
  "twitch",
  "reddit",
  "medium",
  "behance",
  "dribbble",
];

export function getSimpleIconCdnUrl(slug: string, hex?: string) {
  const color = hex?.replace("#", "");
  return color
    ? `https://cdn.simpleicons.org/${slug}/${color}`
    : `https://cdn.simpleicons.org/${slug}`;
}

function getPlatformLogo(slug: string, hex: string) {
  const localPath = LOCAL_SOCIAL_ICONS[slug];
  if (localPath) {
    return encodeSocialLogoPath(localPath);
  }

  return getSimpleIconCdnUrl(slug, hex);
}

function toPlatform(icon: SimpleIconData): SocialPlatform {
  const baseUrl = PROFILE_BASE_URLS[icon.slug];
  const localPath = LOCAL_SOCIAL_ICONS[icon.slug];

  return {
    id: icon.slug,
    name: icon.title,
    hex: `#${icon.hex}`,
    logo: getPlatformLogo(icon.slug, icon.hex),
    usesLocalIcon: Boolean(localPath),
    baseUrl,
    urlPlaceholder: baseUrl ? "yourname" : "https://...",
  };
}

function isSimpleIcon(value: unknown): value is SimpleIconData {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    "title" in value &&
    "hex" in value
  );
}

function createCustomPlatform(
  slug: string,
  name: string,
  hex: string,
): SocialPlatform {
  const localPath = LOCAL_SOCIAL_ICONS[slug];

  return {
    id: slug,
    name,
    hex,
    logo: localPath
      ? encodeSocialLogoPath(localPath)
      : getSimpleIconCdnUrl(slug, hex.replace("#", "")),
    usesLocalIcon: Boolean(localPath),
    baseUrl: PROFILE_BASE_URLS[slug],
    urlPlaceholder: PROFILE_BASE_URLS[slug] ? "yourname" : "https://...",
  };
}

// Platforms removed from simple-icons but available as local assets.
const CUSTOM_SOCIAL_PLATFORMS: SocialPlatform[] = [
  createCustomPlatform("linkedin", "LinkedIn", "#0A66C2"),
];

const customPlatformIds = new Set(CUSTOM_SOCIAL_PLATFORMS.map((platform) => platform.id));

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  ...CUSTOM_SOCIAL_PLATFORMS,
  ...Object.values(simpleIcons)
    .filter(isSimpleIcon)
    .map(toPlatform)
    .filter((platform) => !customPlatformIds.has(platform.id)),
].sort((a, b) => a.name.localeCompare(b.name));

const platformsById = new Map(SOCIAL_PLATFORMS.map((platform) => [platform.id, platform]));

export function encodeSocialLogoPath(path: string) {
  const parts = path.replace(/^\//, "").split("/");
  return `/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

export function resolvePlatformId(id?: string) {
  if (!id) return undefined;
  return LEGACY_SLUG_ALIASES[id] ?? id;
}

export function getSocialPlatform(id?: string) {
  const slug = resolvePlatformId(id);
  if (!slug) return undefined;
  return platformsById.get(slug);
}

export function getDefaultSocialPlatformId() {
  return POPULAR_PLATFORM_SLUGS[0] ?? SOCIAL_PLATFORMS[0]?.id ?? "";
}

export function getPopularSocialPlatforms() {
  return POPULAR_PLATFORM_SLUGS.map((slug) => getSocialPlatform(slug)).filter(
    (platform): platform is SocialPlatform => Boolean(platform),
  );
}

export function searchSocialPlatforms(query: string, limit = 80) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getPopularSocialPlatforms();

  return SOCIAL_PLATFORMS.filter(
    (platform) =>
      platform.name.toLowerCase().includes(normalized) ||
      platform.id.toLowerCase().includes(normalized),
  ).slice(0, limit);
}

export function resolveSocialPlatform(link: { platformId?: string; id?: string; label?: string }) {
  if (link.platformId) {
    return getSocialPlatform(link.platformId);
  }

  const legacyId = resolvePlatformId(link.id?.toLowerCase());
  if (legacyId) {
    const fromLegacy = getSocialPlatform(legacyId);
    if (fromLegacy) return fromLegacy;
  }

  if (link.label) {
    const normalized = link.label.toLowerCase();
    return SOCIAL_PLATFORMS.find((platform) => platform.name.toLowerCase() === normalized);
  }

  return undefined;
}

export function getSocialLinkLogo(link: { platformId?: string; id?: string; label?: string }) {
  return resolveSocialPlatform(link)?.logo;
}

export function normalizeSocialUrl(platformId: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const platform = getSocialPlatform(platformId);
  const handle = trimmed.replace(/^@/, "");

  if (platform?.baseUrl) {
    if (platform.id === "whatsapp") {
      const digits = handle.replace(/\D/g, "");
      return digits ? `${platform.baseUrl}${digits}` : trimmed;
    }

    return `${platform.baseUrl}${handle}`;
  }

  return trimmed.includes(".") ? `https://${handle}` : trimmed;
}

export function formatSocialUrlDisplay(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function createSocialLinkId() {
  return `social-${Date.now()}`;
}
