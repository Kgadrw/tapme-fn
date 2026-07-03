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

function isDataImageUrl(url: string) {
  return /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i.test(url);
}

/** Embed avatar in the vCard when it's already a data URL (no CORS fetch needed). */
function buildPhotoLine(avatarUrl?: string): string | null {
  if (!avatarUrl || !isDataImageUrl(avatarUrl)) return null;

  const match = avatarUrl.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,(.+)$/i);
  if (!match) return null;

  const type = match[1]!.toLowerCase() === "jpg" ? "JPEG" : match[1]!.toUpperCase();
  const data = match[2]!.replace(/\s/g, "");
  return `PHOTO;ENCODING=b;TYPE=${type}:${data}`;
}

export function generateVCard(profile: UserProfile, origin = ""): string {
  const { given, family } = parseName(profile.fullName);
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  lines.push(`N:${escapeVCard(family)};${escapeVCard(given)};;;`);
  lines.push(`FN:${escapeVCard(profile.fullName)}`);

  const photo = buildPhotoLine(profile.avatarUrl);
  if (photo) lines.push(photo);

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
    const type = (social.platformId || social.label).toUpperCase();
    lines.push(`X-SOCIALPROFILE;TYPE=${escapeVCard(type)}:${escapeVCard(social.url)}`);
    lines.push(`URL;TYPE=${escapeVCard(type)}:${escapeVCard(social.url)}`);
  }

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export function getVCardFileName(profile: UserProfile) {
  const base = profile.fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || profile.slug}.vcf`;
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isAndroidDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

function triggerBlobDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}

/**
 * Opens the device contact book with this profile pre-filled.
 * Mobile browsers open the system "Add contact" flow for .vcf files.
 */
export async function saveContactToDevice(profile: UserProfile): Promise<void> {
  const vcard = generateVCard(profile);
  const fileName = getVCardFileName(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const file = new File([blob], fileName, { type: "text/vcard" });

  // Prefer native share sheet when it can hand the vCard to Contacts
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    const shareData: ShareData = {
      files: [file],
      title: profile.fullName,
      text: `Save ${profile.fullName} to contacts`,
    };

    try {
      if (!navigator.canShare || navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      // User cancelled share — don't fall through to a second prompt
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  // iOS Safari: navigating to a vCard data URL opens "Add to Contacts"
  if (isIosDevice()) {
    const dataUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
    window.location.href = dataUrl;
    return;
  }

  // Android: open the .vcf so the Contacts app imports it
  if (isAndroidDevice()) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
    return;
  }

  // Desktop: download the .vcf file
  triggerBlobDownload(blob, fileName);
}

/** @deprecated Prefer saveContactToDevice — kept for callers that only need a file download */
export function downloadVCard(profile: UserProfile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  triggerBlobDownload(blob, getVCardFileName(profile));
}

export function getVCardDataUrl(profile: UserProfile) {
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard(profile))}`;
}
