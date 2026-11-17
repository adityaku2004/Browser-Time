import {
  WebsiteActivity,
  DailyActivity,
  HourlyActivity,
  TabActivity,
  TimelineItem,
  ScoreFactor,
  ProductivityInsight,
  TrackingSettings,
} from '../types';

// Clean initial state with zero mock data.
// Real data is populated dynamically by tracking active browser tabs and user sessions.
export const initialWebsites: WebsiteActivity[] = [];

// Generates 12 weeks of empty daily calendar activity (84 days) leading up to today
// Initialized to 0 seconds so the activity heatmap structure renders cleanly without fake data.
export function generateEmpty12Weeks(): DailyActivity[] {
  const list: DailyActivity[] = [];
  const baseDate = new Date(); // today
  
  for (let i = 83; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    list.push({
      date: dateStr,
      dayLabel: `${dayOfWeek}, ${fullDate}`,
      totalTime: 0,
      productiveTime: 0,
      distractingTime: 0,
      neutralTime: 0,
      idleTime: 0,
      productivityScore: 0,
      websitesVisited: 0,
      contextSwitches: 0,
    });
  }
  return list;
}

export const initialDailyHistory: DailyActivity[] = generateEmpty12Weeks();

// Hourly activity for today (12 AM to 11 PM), initialized to 0 minutes
export const initialHourlyActivity: HourlyActivity[] = [
  { hour: 0, label: '12 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 1, label: '1 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 2, label: '2 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 3, label: '3 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 4, label: '4 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 5, label: '5 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 6, label: '6 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 7, label: '7 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 8, label: '8 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 9, label: '9 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 10, label: '10 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 11, label: '11 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 12, label: '12 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 13, label: '1 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 14, label: '2 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 15, label: '3 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 16, label: '4 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 17, label: '5 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 18, label: '6 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 19, label: '7 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 20, label: '8 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 21, label: '9 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 22, label: '10 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 23, label: '11 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
];

export const initialTabs: TabActivity[] = [];

export const initialTimeline: TimelineItem[] = [];

export const initialScoreFactors: ScoreFactor[] = [];

export const initialInsights: ProductivityInsight[] = [];

export const initialSettings: TrackingSettings = {
  enableTracking: true,
  trackInactiveTabs: true,
  trackIdleTime: true,
  idleTimeoutMinutes: 5,
  startTrackingAutomatically: true,
  darkMode: true,
  compactMode: false,
  accentColor: '#38bdf8', // Electric blue
  excludedDomains: [],
};
