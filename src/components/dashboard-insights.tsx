import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Spinner } from "@/components/spinner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getInsights } from "@/lib/analytics-api";
import {
  emptyInsightsForPeriod,
  formatInsightChange,
  formatInsightNumber,
  insightPeriods,
  type InsightPeriod,
  type InsightPeriodData,
} from "@/lib/insights";
import { cn } from "@/lib/utils";

const chartConfig = {
  views: {
    label: "Profile views",
    color: "var(--chart-1)",
  },
  taps: {
    label: "Card taps",
    color: "var(--chart-2)",
  },
  clicks: {
    label: "Clicks",
    color: "var(--chart-3)",
  },
};

export function DashboardInsights() {
  const [period, setPeriod] = useState<InsightPeriod>("week");
  const [data, setData] = useState<InsightPeriodData>(emptyInsightsForPeriod("week"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getInsights(period)
      .then((response) => {
        if (cancelled) return;
        setData(response);
      })
      .catch(() => {
        if (cancelled) return;
        setData(emptyInsightsForPeriod(period));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tight text-foreground">Insights</h2>
        </div>

        <div className="inline-flex rounded-full border border-border p-1">
          {insightPeriods.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={cn(
                "inline-flex h-8 items-center rounded-full px-3 text-xs font-medium transition-colors",
                period === option.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-border">
          <Spinner className="h-8 w-8" label="Loading insights" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <div key={metric.id} className="flex min-h-28 flex-col justify-between rounded-2xl border border-border p-4">
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="text-2xl font-medium tracking-tight text-foreground">
                    {formatInsightNumber(metric.value)}
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      metric.change >= 0
                        ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                        : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
                    )}
                  >
                    {formatInsightChange(metric.change)}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{data.compareLabel}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-stretch">
            <div className="flex min-h-60 flex-col rounded-2xl border border-border p-4">
              <div className="mb-3">
                <div className="text-sm font-medium text-foreground">Profile activity</div>
              </div>
              <ChartContainer config={chartConfig} className="h-44 w-full flex-1">
                <AreaChart data={data.viewsOverTime} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    fontSize={11}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    fill="var(--color-views)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="taps"
                    stroke="var(--color-taps)"
                    fill="var(--color-taps)"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            <div className="flex min-h-60 flex-col rounded-2xl border border-border p-4">
              <div className="mb-3">
                <div className="text-sm font-medium text-foreground">Top links</div>
              </div>
              <ChartContainer config={chartConfig} className="h-44 w-full flex-1">
                <BarChart
                  data={data.topLinks.map((link) => ({
                    label: link.label,
                    clicks: link.clicks,
                  }))}
                  margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                  />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="clicks"
                    fill="var(--color-clicks)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
