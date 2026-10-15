import { DashboardInsights } from "@/components/dashboard-insights";
import { useCurrentProfile } from "@/context/profile-context";

export function DashboardHome() {
  const { profile } = useCurrentProfile();
  const firstName = profile.fullName.split(" ")[0] || "there";

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="g-page-title">Welcome, {firstName}</h1>
        <p className="g-page-subtitle">Overview of your TapMe profile activity.</p>
      </div>

      <DashboardInsights />
    </div>
  );
}
