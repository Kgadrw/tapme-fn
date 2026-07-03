import { profilesBySlug as defaultProfiles, slugify, type UserProfile } from "@/lib/profile";

const STORAGE_KEY = "tapme-profiles";

function sanitizeProfile(profile: UserProfile): UserProfile {
  let next = profile;

  if (next.avatarUrl?.startsWith("blob:")) {
    next = { ...next, avatarUrl: undefined };
  }
  if (next.coverPhotoUrl?.startsWith("blob:")) {
    next = { ...next, coverPhotoUrl: undefined };
  }

  return next;
}

function loadProfiles(): Record<string, UserProfile> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const merged = { ...defaultProfiles, ...JSON.parse(stored) } as Record<string, UserProfile>;
      for (const slug of Object.keys(merged)) {
        merged[slug] = sanitizeProfile(merged[slug]);
      }
      return merged;
    }
  } catch {
    // ignore corrupt storage
  }
  return { ...defaultProfiles };
}

let profiles = loadProfiles();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // ignore quota errors
  }
}

export function getProfileBySlug(slug: string): UserProfile | null {
  return profiles[slug] ?? null;
}

export function saveProfile(profile: UserProfile): void {
  profiles = { ...profiles, [profile.slug]: profile };
  persist();
  listeners.forEach((listener) => listener());
}

const CURRENT_USER_STORAGE_KEY = "tapme-current-user-slug";

export function clearCurrentUserSlug(): void {
  try {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  } catch {
    // ignore
  }
  listeners.forEach((listener) => listener());
}

export function getCurrentUserSlug(): string | null {
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (stored && profiles[stored]) {
      return stored;
    }
  } catch {
    // ignore corrupt storage
  }

  return null;
}

export function setCurrentUserSlug(slug: string): void {
  try {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, slug);
  } catch {
    // ignore quota errors
  }
  listeners.forEach((listener) => listener());
}

export function isUsernameAvailable(slug: string, excludeSlug?: string): boolean {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized === excludeSlug) return true;
  return !profiles[normalized];
}

export function renameProfileSlug(oldSlug: string, newSlug: string): UserProfile | null {
  const normalized = slugify(newSlug);
  if (!normalized) return null;
  if (normalized === oldSlug) {
    return profiles[oldSlug] ?? null;
  }
  if (profiles[normalized]) return null;

  const profile = profiles[oldSlug];
  if (!profile) return null;

  const updated: UserProfile = { ...profile, slug: normalized };
  const next = { ...profiles };
  delete next[oldSlug];
  next[normalized] = updated;
  profiles = next;
  persist();

  if (getCurrentUserSlug() === oldSlug) {
    setCurrentUserSlug(normalized);
  }

  listeners.forEach((listener) => listener());
  return updated;
}

export function createProfileForUser(input: {
  fullName: string;
  email: string;
  username?: string;
}): UserProfile {
  const username = input.username ?? generateUniqueUsername(input.fullName);
  const profile: UserProfile = {
    slug: username,
    fullName: input.fullName.trim(),
    jobTitle: "",
    company: "",
    phone: "",
    email: input.email.trim(),
    website: "",
    location: "",
    bio: "",
    linksLayout: "grid",
    socialLinks: [],
    paymentLinks: [],
  };

  saveProfile(profile);
  setCurrentUserSlug(username);
  return profile;
}

export function generateUniqueUsername(base: string): string {
  let slug = slugify(base);
  if (!slug) {
    slug = `user-${Date.now().toString(36)}`;
  }

  let candidate = slug;
  let suffix = 2;
  while (profiles[candidate]) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProfileStore(): Record<string, UserProfile> {
  return profiles;
}
