import { getProfileUrl, type UserProfile } from "@/lib/profile";

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n/g, "\\n")
    .replace(/\n/g, "\\n");
}

function parseName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { given: "", family: "" };
  if (parts.length === 1) return { given: parts[0], family: "" };
  return {
    given: parts.slice(0, -1).join(" "),
    family: parts[parts.length - 1],
  };
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function normalizeWebsite(website: string) {
  return website.startsWith("http") ? website : `https://${website}`;
}

export function generateVCard(profile: UserProfile, origin = ""): string {
  const { given, family } = parseName(profile.fullName);
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  lines.push(`N:${escapeVCard(family)};${escapeVCard(given)};;;`);
  lines.push(`FN:${escapeVCard(profile.fullName)}`);

  if (profile.company) lines.push(`ORG:${escapeVCard(profile.company)}`);
  if (profile.jobTitle) lines.push(`TITLE:${escapeVCard(profile.jobTitle)}`);
  if (profile.phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCard(normalizePhone(profile.phone))}`);
  }
  if (profile.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(profile.email)}`);
  if (profile.website) lines.push(`URL:${escapeVCard(normalizeWebsite(profile.website))}`);

  const profileUrl = getProfileUrl(profile.slug, origin);
  if (profileUrl) lines.push(`URL;TYPE=PROFILE:${escapeVCard(profileUrl)}`);

  if (profile.location) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCard(profile.location)};;;;`);
  }
  if (profile.bio) lines.push(`NOTE:${escapeVCard(profile.bio)}`);

  for (const social of profile.socialLinks) {
    lines.push(`X-SOCIALPROFILE;TYPE=${escapeVCard(social.id)}:${escapeVCard(social.url)}`);
    lines.push(`URL;TYPE=${escapeVCard(social.label.toUpperCase())}:${escapeVCard(social.url)}`);
  }

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export function getVCardFileName(profile: UserProfile) {
  const base = profile.fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${base || profile.slug}.vcf`;
}

export function downloadVCard(profile: UserProfile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getVCardFileName(profile);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function getVCardDataUrl(profile: UserProfile) {
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard(profile))}`;
}
