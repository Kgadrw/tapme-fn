import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { SignInModal } from "@/components/sign-in-modal";
import { RegisterModal } from "@/components/register-modal";
import {
  getMe,
  loginWithEmail,
  loginWithGoogle,
  type AuthResponse,
} from "@/lib/auth-api";
import { clearAuthToken, isAuthenticated, setAuthToken } from "@/lib/auth-store";
import { clearCurrentUserSlug, saveProfile, setCurrentUserSlug } from "@/lib/profile-store";
import { syncSubscriptionFromApi } from "@/lib/subscription-store";

type AuthContextValue = {
  isSignedIn: boolean;
  isBootstrapping: boolean;
  signInOpen: boolean;
  registerOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  openRegister: () => void;
  closeRegister: () => void;
  completeSignIn: (response: AuthResponse) => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function applyAuthResponse(response: AuthResponse) {
  setAuthToken(response.token);
  saveProfile(response.profile);
  setCurrentUserSlug(response.profile.slug);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(isAuthenticated);
  const [isBootstrapping, setIsBootstrapping] = useState(isAuthenticated);

  const openSignIn = useCallback(() => {
    setRegisterOpen(false);
    setSignInOpen(true);
  }, []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);
  const openRegister = useCallback(() => {
    setSignInOpen(false);
    setRegisterOpen(true);
  }, []);
  const closeRegister = useCallback(() => setRegisterOpen(false), []);

  const completeSignIn = useCallback((response: AuthResponse) => {
    applyAuthResponse(response);
    setIsSignedIn(true);
    setSignInOpen(false);
    setRegisterOpen(false);
    void syncSubscriptionFromApi();
  }, []);

  const signInWithEmailHandler = useCallback(
    async (email: string, password: string) => {
      const response = await loginWithEmail(email, password);
      completeSignIn(response);
    },
    [completeSignIn],
  );

  const signInWithGoogleHandler = useCallback(
    async (credential: string) => {
      const response = await loginWithGoogle(credential);
      completeSignIn(response);
    },
    [completeSignIn],
  );

  const signOut = useCallback(() => {
    clearAuthToken();
    clearCurrentUserSlug();
    setIsSignedIn(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      setIsBootstrapping(false);
      return;
    }

    getMe()
      .then(({ profile }) => {
        saveProfile(profile);
        setCurrentUserSlug(profile.slug);
        setIsSignedIn(true);
        return syncSubscriptionFromApi();
      })
      .catch(() => {
        clearAuthToken();
        clearCurrentUserSlug();
        setIsSignedIn(false);
      })
      .finally(() => setIsBootstrapping(false));
  }, []);

  const value = useMemo(
    () => ({
      isSignedIn,
      isBootstrapping,
      signInOpen,
      registerOpen,
      openSignIn,
      closeSignIn,
      openRegister,
      closeRegister,
      completeSignIn,
      signInWithEmail: signInWithEmailHandler,
      signInWithGoogle: signInWithGoogleHandler,
      signOut,
    }),
    [
      isSignedIn,
      isBootstrapping,
      signInOpen,
      registerOpen,
      openSignIn,
      closeSignIn,
      openRegister,
      closeRegister,
      completeSignIn,
      signInWithEmailHandler,
      signInWithGoogleHandler,
      signOut,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
