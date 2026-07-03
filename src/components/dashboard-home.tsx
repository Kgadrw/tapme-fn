import { DashboardInsights } from "@/components/dashboard-insights";
import { useCurrentProfile } from "@/context/profile-context";

export function DashboardHome() {
  const { profile } = useCurrentProfile();

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          Hello, {profile.fullName.split(" ")[0]} 👋
        </h1>
      </div>

      <DashboardInsights />
    </div>
  );
}
