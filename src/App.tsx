import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { SiteLayout } from "./components/SiteLayout";
import { AuthProvider, useAuth } from "./context/auth-context";
import { isDashboardHost, isPublicProfileHost } from "./lib/domains";
import { AboutPage } from "./pages/AboutPage";
import { BusinessPage } from "./pages/BusinessPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { PublicProfilePage } from "./pages/PublicProfilePage";
import { DashboardLayout } from "./pages/dashboard/DashboardLayout";
import { DashboardHomePage } from "./pages/dashboard/DashboardHomePage";
import { DashboardProfilePage } from "./pages/dashboard/DashboardProfilePage";
import { DashboardBillingPage } from "./pages/dashboard/DashboardBillingPage";
import { DashboardSettingsPage } from "./pages/dashboard/DashboardSettingsPage";
import { BusinessDashboardOfferPage } from "./pages/business-dashboard/BusinessDashboardOfferPage";
import { BusinessDashboardTeamPage } from "./pages/business-dashboard/BusinessDashboardTeamPage";
import { BusinessDashboardRequestsPage } from "./pages/business-dashboard/BusinessDashboardRequestsPage";

function AuthRouteOpener({ mode }: { mode: "signin" | "register" }) {
  const navigate = useNavigate();
  const { openSignIn, openRegister } = useAuth();

  useEffect(() => {
    if (mode === "signin") openSignIn();
    else openRegister();
    navigate("/", { replace: true });
  }, [mode, navigate, openRegister, openSignIn]);

  return null;
}

function MarketingRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="business" element={<BusinessPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="signin" element={<AuthRouteOpener mode="signin" />} />
        <Route path="register" element={<AuthRouteOpener mode="register" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHomePage />} />
        <Route path="profile" element={<DashboardProfilePage />} />
        <Route path="billing" element={<DashboardBillingPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
        <Route
          path="business/dashboard"
          element={<Navigate to="/business/dashboard/team" replace />}
        />
        <Route path="business/dashboard/team" element={<BusinessDashboardTeamPage />} />
        <Route path="business/dashboard/offer" element={<BusinessDashboardOfferPage />} />
        <Route path="business/dashboard/requests" element={<BusinessDashboardRequestsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function PublicProfileRoutes() {
  return (
    <Routes>
      <Route path=":slug" element={<PublicProfilePage />} />
      <Route
        path="*"
        element={
          <div className="flex min-h-dvh items-center justify-center bg-background px-6 text-center text-sm text-muted-foreground">
            Enter a profile URL like /your-username
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  const onDashboard = isDashboardHost();
  const onPublicProfile = isPublicProfileHost();

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        {onDashboard ? (
          <DashboardRoutes />
        ) : onPublicProfile ? (
          <PublicProfileRoutes />
        ) : (
          <MarketingRoutes />
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}
