import { getProfileUrl, type UserProfile } from "@/lib/profile";

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n/g, "\\n")
    .replace(/\n/g, "\\n");
}

function foldLine(line: string): string {
  // vCard lines should stay under ~75 octets; fold long PHOTO/NOTE lines
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let remaining = line;
  parts.push(remaining.slice(0, 75));
  remaining = remaining.slice(75);
  while (remaining.length > 0) {
    parts.push(` ${remaining.slice(0, 74)}`);
    remaining = remaining.slice(74);
  }
  return parts.join("\r\n");
}

function parseName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { given: "", family: "" };
  if (parts.length === 1) return { given: parts[0]!, family: "" };
  return {
    given: parts.slice(0, -1).join(" "),
    family: parts[parts.length - 1]!,
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
  return foldLine(`PHOTO;ENCODING=b;TYPE=${type}:${data}`);
}

/**
 * Build a vCard 3.0 that phone Contacts apps import as a **new contact**,
 * including name, username, email, phone, and social profiles.
 */
export function generateVCard(profile: UserProfile, origin = ""): string {
  const fullName = profile.fullName.trim() || profile.slug;
  const { given, family } = parseName(fullName);
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0", "PRODID:-//tapme//EN"];

  // Name (required for Contacts apps)
  lines.push(`N:${escapeVCard(family)};${escapeVCard(given)};;;`);
  lines.push(`FN:${escapeVCard(fullName)}`);

  // Username / tapme handle
  if (profile.slug) {
    lines.push(`NICKNAME:${escapeVCard(profile.slug)}`);
  }

  const photo = buildPhotoLine(profile.avatarUrl);
  if (photo) lines.push(photo);

  if (profile.company) lines.push(`ORG:${escapeVCard(profile.company)}`);
  if (profile.jobTitle) lines.push(`TITLE:${escapeVCard(profile.jobTitle)}`);

  // Phone
  if (profile.phone?.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${escapeVCard(normalizePhone(profile.phone))}`);
  }

  // Email
  if (profile.email?.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET,PREF:${escapeVCard(profile.email.trim())}`);
  }

  // Website
  if (profile.website?.trim()) {
    lines.push(`URL;TYPE=WORK:${escapeVCard(normalizeWebsite(profile.website))}`);
  }

  // Public tapme profile
  const profileUrl = getProfileUrl(profile.slug, origin);
  if (profileUrl) {
    lines.push(`URL;TYPE=tapme:${escapeVCard(profileUrl)}`);
  }

  if (profile.location?.trim()) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCard(profile.location.trim())};;;;`);
  }

  // Social profiles — formats recognized by iOS Contacts and many Android apps
  let itemIndex = 1;
  const socialNoteLines: string[] = [];

  for (const social of profile.socialLinks) {
    const label = (social.label || social.platformId || "Social").trim();
    const type = (social.platformId || label).toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const url = social.url.trim();
    if (!url) continue;

    // Apple Contacts social profile field
    lines.push(
      `X-SOCIALPROFILE;TYPE=${escapeVCard(type)};x-user=${escapeVCard(label)}:${escapeVCard(url)}`,
    );

    // Labeled URL (works widely as a contact field)
    lines.push(`item${itemIndex}.URL:${escapeVCard(url)}`);
    lines.push(`item${itemIndex}.X-ABLabel:${escapeVCard(label)}`);
    itemIndex += 1;

    socialNoteLines.push(`${label}: ${url}`);
  }

  // Notes: bio + social list (visible on all devices)
  const noteParts: string[] = [];
  if (profile.bio?.trim()) noteParts.push(profile.bio.trim());
  if (profile.slug) noteParts.push(`tapme: @${profile.slug}`);
  if (profileUrl) noteParts.push(profileUrl);
  if (socialNoteLines.length > 0) {
    noteParts.push("Socials:", ...socialNoteLines);
  }
  if (noteParts.length > 0) {
    lines.push(foldLine(`NOTE:${escapeVCard(noteParts.join("\n"))}`));
  }

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export function getVCardFileName(profile: UserProfile) {
  const base = (profile.fullName || profile.slug)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "contact"}.vcf`;
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isAndroidDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

function isMobileDevice() {
  return isIosDevice() || isAndroidDevice();
}

function openVCardInContactsApp(vcard: string, fileName: string) {
  // text/x-vcard is widely registered to the Contacts app on Android;
  // text/vcard works on iOS Safari for "Create New Contact".
  const mime = isAndroidDevice() ? "text/x-vcard" : "text/vcard";
  const blob = new Blob([vcard], { type: `${mime};charset=utf-8` });

  // Mobile: open the vCard so the system Contacts app creates a new contact
  if (isMobileDevice()) {
    const dataUrl = `data:${mime};charset=utf-8,${encodeURIComponent(vcard)}`;

    // Prefer navigating to the data URL — opens Contacts "Add contact" UI
    try {
      const opened = window.open(dataUrl, "_blank");
      if (!opened) {
        window.location.href = dataUrl;
      }
      return;
    } catch {
      window.location.href = dataUrl;
      return;
    }
  }

  // Desktop: download .vcf (user can open it in their contacts app)
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
 * Save this profile as a **new contact** in the device Contacts app.
 * Includes name, username, email, phone, and social links.
 */
export async function saveContactToDevice(profile: UserProfile): Promise<void> {
  const vcard = generateVCard(profile);
  const fileName = getVCardFileName(profile);

  // Always hand off to the Contacts app via vCard — do not use the share sheet,
  // which offers Messages/Mail instead of "Create new contact".
  openVCardInContactsApp(vcard, fileName);
}

/** Download-only fallback (desktop / explicit file save). */
export function downloadVCard(profile: UserProfile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getVCardFileName(profile);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}

export function getVCardDataUrl(profile: UserProfile) {
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard(profile))}`;
}
