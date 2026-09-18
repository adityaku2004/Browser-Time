export type ProductivityCategory = 'productive' | 'neutral' | 'distracting';

export interface WebsiteActivity {
  id: string;
  domain: string;
  name: string;
  timeSpent: number; // in seconds
  timeSpentWeek: number; // in seconds
  averageDailyTime: number; // in seconds
  category: ProductivityCategory;
  visits: number;
  excluded?: boolean;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Thursday, Sep 10"
  totalTime: number; // in seconds
  productiveTime: number; // in seconds
  distractingTime: number; // in seconds
  neutralTime: number; // in seconds
  idleTime: number; // in seconds
  productivityScore: number; // 0-100
  websitesVisited: number;
  contextSwitches: number;
}

export interface HourlyActivity {
  hour: number; // 0-23
  label: string; // "12 AM", "2 AM", etc.
  productiveMinutes: number;
  distractingMinutes: number;
  neutralMinutes: number;
  totalMinutes: number;
}

export interface TabActivity {
  id: string;
  title: string;
  domain: string;
  url: string;
  duration: number; // in seconds
  lastActive: string; // e.g., "Active now", "5m ago"
  isActive: boolean;
  category: ProductivityCategory;
  memoryUsageMb?: number;
}

export interface TimelineItem {
  id: string;
  time: string; // e.g. "09:00 AM"
  endTime?: string; // e.g. "09:32 AM"
  domain: string;
  name: string;
  title: string;
  duration: number; // in seconds
  category: ProductivityCategory;
  isIdle?: boolean;
}

export interface ScoreFactor {
  name: string;
  points: number; // e.g. +32, -8
  type: 'positive' | 'negative';
  description: string;
}

export interface ProductivityInsight {
  id: string;
  title: string;
  description: string;
  type: 'highlight' | 'warning' | 'tip' | 'stat';
  icon: string;
}

export interface TrackingSettings {
  enableTracking: boolean;
  trackInactiveTabs: boolean;
  trackIdleTime: boolean;
  idleTimeoutMinutes: number;
  startTrackingAutomatically: boolean;
  darkMode: boolean;
  compactMode: boolean;
  accentColor: string;
  excludedDomains: string[];
}

export type DateRangeOption = 'today' | 'yesterday' | 'week' | 'month';
