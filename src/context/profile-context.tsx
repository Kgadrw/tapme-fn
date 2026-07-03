import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import {
  type PaymentLink,
  type SocialLink,
  type UserProfile,
} from "@/lib/profile";
import { getMyProfile, getPublicProfile, updateMyProfile } from "@/lib/profile-api";
import { isAuthenticated, subscribeAuth } from "@/lib/auth-store";
import {
  getCurrentUserSlug,
  getProfileBySlug,
  saveProfile,
  setCurrentUserSlug,
  subscribe,
} from "@/lib/profile-store";

type ProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUsername: (username: string) => Promise<boolean>;
  setSocialLinks: (links: SocialLink[]) => Promise<void>;
  setPaymentLinks: (links: PaymentLink[]) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(isAuthenticated);
  const [version, bump] = useState(0);
  const [loading, setLoading] = useState(isAuthenticated);

  useEffect(() => subscribe(() => bump((n) => n + 1)), []);

  useEffect(() => {
    return subscribeAuth(() => setSignedIn(isAuthenticated()));
  }, []);

  useEffect(() => {
    if (!signedIn || !isAuthenticated()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getMyProfile()
      .then((profile) => {
        if (cancelled) return;
        saveProfile(profile);
        setCurrentUserSlug(profile.slug);
        bump((n) => n + 1);
      })
      .catch((error) => {
        if (cancelled) return;
        toast.error(error instanceof Error ? error.message : "Failed to load profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const profile = useMemo(() => {
    const slug = getCurrentUserSlug();
    return slug ? getProfileBySlug(slug) : null;
  }, [version, signedIn]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!profile) return;

      const optimistic = { ...profile, ...updates };
      saveProfile(optimistic);
      bump((n) => n + 1);

      try {
        const updated = await updateMyProfile(updates);
        saveProfile(updated);
        if (updated.slug !== profile.slug) {
          setCurrentUserSlug(updated.slug);
        }
        bump((n) => n + 1);
      } catch (error) {
        saveProfile(profile);
        bump((n) => n + 1);
        toast.error(error instanceof Error ? error.message : "Failed to save profile");
        throw error;
      }
    },
    [profile],
  );

  const updateUsername = useCallback(
    async (username: string) => {
      if (!profile) return false;

      try {
        const updated = await updateMyProfile({ slug: username });
        saveProfile(updated);
        setCurrentUserSlug(updated.slug);
        bump((n) => n + 1);
        return true;
      } catch {
        return false;
      }
    },
    [profile],
  );

  const setSocialLinks = useCallback(
    async (socialLinks: SocialLink[]) => {
      await updateProfile({ socialLinks });
    },
    [updateProfile],
  );

  const setPaymentLinks = useCallback(
    async (paymentLinks: PaymentLink[]) => {
      await updateProfile({ paymentLinks });
    },
    [updateProfile],
  );

  const value = useMemo(
    () => ({
      profile,
      loading,
      updateProfile,
      updateUsername,
      setSocialLinks,
      setPaymentLinks,
    }),
    [profile, loading, updateProfile, updateUsername, setSocialLinks, setPaymentLinks],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileBootstrap() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileBootstrap must be used within ProfileProvider");
  }
  return { loading: context.loading, profile: context.profile };
}

export function useCurrentProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useCurrentProfile must be used within ProfileProvider");
  }
  if (!context.profile) {
    throw new Error("Profile is not loaded");
  }
  return context as ProfileContextValue & { profile: UserProfile };
}

export function usePublicProfile(slug: string): { profile: UserProfile | null; loading: boolean } {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getPublicProfile(slug)
      .then((data) => {
        if (cancelled) return;
        saveProfile(data);
        setProfile(data);
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { profile, loading };
}
