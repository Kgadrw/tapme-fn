export type InsightPeriod = "week" | "month" | "year";

export type InsightMetric = {
  id: string;
  label: string;
  value: number;
  change: number;
};

export type ViewsDataPoint = {
  date: string;
  views: number;
  taps: number;
};

export type TopLink = {
  label: string;
  clicks: number;
  share: number;
};

export type InsightPeriodData = {
  label: string;
  compareLabel: string;
  activityLabel: string;
  metrics: InsightMetric[];
  viewsOverTime: ViewsDataPoint[];
  topLinks: TopLink[];
};

export const insightPeriods: { value: InsightPeriod; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export const insightsByPeriod: Record<InsightPeriod, InsightPeriodData> = {
  week: {
    label: "last 7 days",
    compareLabel: "vs previous week",
    activityLabel: "Views and card taps by day",
    metrics: [
      { id: "views", label: "Profile Views", value: 312, change: 9.8 },
      { id: "taps", label: "Card Taps", value: 84, change: 6.4 },
      { id: "contacts", label: "Contacts Saved", value: 21, change: 4.2 },
      { id: "clicks", label: "Link Clicks", value: 126, change: 11.3 },
    ],
    viewsOverTime: [
      { date: "Mon", views: 38, taps: 10 },
      { date: "Tue", views: 42, taps: 11 },
      { date: "Wed", views: 39, taps: 9 },
      { date: "Thu", views: 47, taps: 13 },
      { date: "Fri", views: 51, taps: 14 },
      { date: "Sat", views: 44, taps: 12 },
      { date: "Sun", views: 51, taps: 15 },
    ],
    topLinks: [
      { label: "LinkedIn", clicks: 44, share: 35 },
      { label: "Email", clicks: 34, share: 27 },
      { label: "Website", clicks: 24, share: 19 },
      { label: "Call", clicks: 14, share: 11 },
    ],
  },
  month: {
    label: "last 30 days",
    compareLabel: "vs previous month",
    activityLabel: "Views and card taps by week",
    metrics: [
      { id: "views", label: "Profile Views", value: 1284, change: 12.4 },
      { id: "taps", label: "Card Taps", value: 342, change: 8.2 },
      { id: "contacts", label: "Contacts Saved", value: 87, change: 5.1 },
      { id: "clicks", label: "Link Clicks", value: 516, change: 15.7 },
    ],
    viewsOverTime: [
      { date: "W1", views: 268, taps: 72 },
      { date: "W2", views: 294, taps: 78 },
      { date: "W3", views: 312, taps: 84 },
      { date: "W4", views: 410, taps: 108 },
    ],
    topLinks: [
      { label: "LinkedIn", clicks: 186, share: 36 },
      { label: "Email", clicks: 142, share: 28 },
      { label: "Website", clicks: 98, share: 19 },
      { label: "Instagram", clicks: 54, share: 10 },
      { label: "Call", clicks: 36, share: 7 },
    ],
  },
  year: {
    label: "last 12 months",
    compareLabel: "vs previous year",
    activityLabel: "Views and card taps by month",
    metrics: [
      { id: "views", label: "Profile Views", value: 14820, change: 24.6 },
      { id: "taps", label: "Card Taps", value: 3924, change: 18.9 },
      { id: "contacts", label: "Contacts Saved", value: 1046, change: 16.2 },
      { id: "clicks", label: "Link Clicks", value: 6112, change: 21.4 },
    ],
    viewsOverTime: [
      { date: "Jan", views: 980, taps: 248 },
      { date: "Feb", views: 1042, taps: 266 },
      { date: "Mar", views: 1124, taps: 284 },
      { date: "Apr", views: 1188, taps: 302 },
      { date: "May", views: 1264, taps: 328 },
      { date: "Jun", views: 1312, taps: 342 },
      { date: "Jul", views: 1288, taps: 336 },
      { date: "Aug", views: 1346, taps: 354 },
      { date: "Sep", views: 1398, taps: 368 },
      { date: "Oct", views: 1456, taps: 386 },
      { date: "Nov", views: 1512, taps: 402 },
      { date: "Dec", views: 1620, taps: 428 },
    ],
    topLinks: [
      { label: "LinkedIn", clicks: 2148, share: 35 },
      { label: "Email", clicks: 1684, share: 28 },
      { label: "Website", clicks: 1162, share: 19 },
      { label: "Instagram", clicks: 612, share: 10 },
      { label: "Call", clicks: 506, share: 8 },
    ],
  },
};

export function emptyInsightsForPeriod(period: InsightPeriod): InsightPeriodData {
  const base = insightsByPeriod[period];
  return {
    label: base.label,
    compareLabel: base.compareLabel,
    activityLabel: base.activityLabel,
    metrics: [
      { id: "views", label: "Profile Views", value: 0, change: 0 },
      { id: "taps", label: "Card Taps", value: 0, change: 0 },
      { id: "contacts", label: "Contacts Saved", value: 0, change: 0 },
      { id: "clicks", label: "Link Clicks", value: 0, change: 0 },
    ],
    viewsOverTime: base.viewsOverTime.map((point) => ({ ...point, views: 0, taps: 0 })),
    topLinks: [],
  };
}

export function formatInsightNumber(value: number) {
  return value.toLocaleString();
}

export function formatInsightChange(change: number) {
  const prefix = change >= 0 ? "+" : "";
  return `${prefix}${change.toFixed(1)}%`;
}
