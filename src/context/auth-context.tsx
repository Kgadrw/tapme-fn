import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RegisterModal } from "@/components/RegisterModal";
import { SignInModal } from "@/components/SignInModal";
import {
  getMe,
  loginWithEmail,
  loginWithGoogle,
  registerAccount,
  type AuthProfile,
  type AuthResponse,
  type AuthUser,
} from "@/lib/auth-api";
import {
  clearAuthToken,
  isAuthenticated,
  setAuthToken,
  subscribeAuth,
} from "@/lib/auth-store";

type AuthContextValue = {
  isSignedIn: boolean;
  isBootstrapping: boolean;
  user: AuthUser | null;
  profile: AuthProfile | null;
  signInOpen: boolean;
  registerOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  openRegister: () => void;
  closeRegister: () => void;
  completeSignIn: (response: AuthResponse) => void;
  signInWithEmail: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: (credential: string) => Promise<AuthResponse>;
  register: (fullName: string, email: string, password: string) => Promise<AuthResponse>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? "";

function applyAuthResponse(response: AuthResponse) {
  setAuthToken(response.token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(isAuthenticated);
  const [isBootstrapping, setIsBootstrapping] = useState(isAuthenticated);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);

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
    setUser(response.user);
    setProfile(response.profile);
    setIsSignedIn(true);
    setSignInOpen(false);
    setRegisterOpen(false);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!isAuthenticated()) {
      setIsSignedIn(false);
      setUser(null);
      setProfile(null);
      setIsBootstrapping(false);
      return;
    }

    try {
      const me = await getMe();
      setUser(me.user);
      setProfile(me.profile);
      setIsSignedIn(true);
    } catch {
      clearAuthToken();
      setIsSignedIn(false);
      setUser(null);
      setProfile(null);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
    return subscribeAuth(() => {
      setIsSignedIn(isAuthenticated());
    });
  }, [refreshSession]);

  const signInWithEmailHandler = useCallback(
    async (email: string, password: string) => {
      const response = await loginWithEmail(email, password);
      completeSignIn(response);
      return response;
    },
    [completeSignIn],
  );

  const signInWithGoogleHandler = useCallback(
    async (credential: string) => {
      const response = await loginWithGoogle(credential);
      completeSignIn(response);
      return response;
    },
    [completeSignIn],
  );

  const registerHandler = useCallback(
    async (fullName: string, email: string, password: string) => {
      const response = await registerAccount(fullName, email, password);
      completeSignIn(response);
      return response;
    },
    [completeSignIn],
  );

  const signOut = useCallback(() => {
    clearAuthToken();
    setIsSignedIn(false);
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      isSignedIn,
      isBootstrapping,
      user,
      profile,
      signInOpen,
      registerOpen,
      openSignIn,
      closeSignIn,
      openRegister,
      closeRegister,
      completeSignIn,
      signInWithEmail: signInWithEmailHandler,
      signInWithGoogle: signInWithGoogleHandler,
      register: registerHandler,
      signOut,
    }),
    [
      isSignedIn,
      isBootstrapping,
      user,
      profile,
      signInOpen,
      registerOpen,
      openSignIn,
      closeSignIn,
      openRegister,
      closeRegister,
      completeSignIn,
      signInWithEmailHandler,
      signInWithGoogleHandler,
      registerHandler,
      signOut,
    ],
  );

  const content = (
    <AuthContext.Provider value={value}>
      {children}
      <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />
      <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} />
    </AuthContext.Provider>
  );

  if (!googleClientId) return content;

  return <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
