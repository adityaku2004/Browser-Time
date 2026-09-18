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

export const initialWebsites: WebsiteActivity[] = [
  {
    id: 'site-1',
    domain: 'youtube.com',
    name: 'YouTube',
    timeSpent: 5040, // 1h 24m
    timeSpentWeek: 33480, // 9h 18m
    averageDailyTime: 4740, // 1h 19m
    category: 'distracting',
    visits: 19,
    excluded: false,
  },
  {
    id: 'site-2',
    domain: 'github.com',
    name: 'GitHub',
    timeSpent: 4080, // 1h 08m
    timeSpentWeek: 27720, // 7h 42m
    averageDailyTime: 3960, // 1h 06m
    category: 'productive',
    visits: 28,
    excluded: false,
  },
  {
    id: 'site-3',
    domain: 'stackoverflow.com',
    name: 'Stack Overflow',
    timeSpent: 2520, // 42m
    timeSpentWeek: 15120, // 4h 12m
    averageDailyTime: 2160, // 36m
    category: 'productive',
    visits: 14,
    excluded: false,
  },
  {
    id: 'site-4',
    domain: 'google.com',
    name: 'Google Search',
    timeSpent: 2280, // 38m
    timeSpentWeek: 14400, // 4h 00m
    averageDailyTime: 2040, // 34m
    category: 'neutral',
    visits: 35,
    excluded: false,
  },
  {
    id: 'site-5',
    domain: 'reddit.com',
    name: 'Reddit',
    timeSpent: 1860, // 31m
    timeSpentWeek: 11880, // 3h 18m
    averageDailyTime: 1680, // 28m
    category: 'distracting',
    visits: 11,
    excluded: false,
  },
  {
    id: 'site-6',
    domain: 'notion.so',
    name: 'Notion',
    timeSpent: 3120, // 52m
    timeSpentWeek: 20400, // 5h 40m
    averageDailyTime: 2880, // 48m
    category: 'productive',
    visits: 17,
    excluded: false,
  },
  {
    id: 'site-7',
    domain: 'docs.google.com',
    name: 'Google Docs',
    timeSpent: 2880, // 48m
    timeSpentWeek: 18000, // 5h 00m
    averageDailyTime: 2520, // 42m
    category: 'productive',
    visits: 9,
    excluded: false,
  },
  {
    id: 'site-8',
    domain: 'figma.com',
    name: 'Figma',
    timeSpent: 1980, // 33m
    timeSpentWeek: 13200, // 3h 40m
    averageDailyTime: 1860, // 31m
    category: 'productive',
    visits: 8,
    excluded: false,
  },
  {
    id: 'site-9',
    domain: 'instagram.com',
    name: 'Instagram',
    timeSpent: 720, // 12m
    timeSpentWeek: 4680, // 1h 18m
    averageDailyTime: 660, // 11m
    category: 'distracting',
    visits: 7,
    excluded: false,
  },
  {
    id: 'site-10',
    domain: 'wikipedia.org',
    name: 'Wikipedia',
    timeSpent: 900, // 15m
    timeSpentWeek: 5400, // 1h 30m
    averageDailyTime: 780, // 13m
    category: 'neutral',
    visits: 6,
    excluded: false,
  },
  {
    id: 'site-11',
    domain: 'slack.com',
    name: 'Slack Web',
    timeSpent: 1620, // 27m
    timeSpentWeek: 12600, // 3h 30m
    averageDailyTime: 1800, // 30m
    category: 'productive',
    visits: 22,
    excluded: false,
  },
  {
    id: 'site-12',
    domain: 'twitter.com',
    name: 'X (Twitter)',
    timeSpent: 600, // 10m
    timeSpentWeek: 4200, // 1h 10m
    averageDailyTime: 600, // 10m
    category: 'distracting',
    visits: 5,
    excluded: false,
  },
];

// Generates 12 weeks of daily activity (84 days) leading up to today
export function generate12WeeksData(): DailyActivity[] {
  const list: DailyActivity[] = [];
  const baseDate = new Date(); // today
  
  for (let i = 83; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isWeekend = dayOfWeek === 'Sat' || dayOfWeek === 'Sun';

    // Weekend has slightly different distribution
    const multiplier = isWeekend ? 0.65 : 1.0;
    const baseTotal = i === 0 ? 24120 : Math.floor((14000 + Math.sin(i * 0.4) * 8000 + Math.random() * 4000) * multiplier);
    
    // Ratios
    const productiveRatio = i === 0 ? 0.64 : 0.52 + (Math.sin(i * 0.2) * 0.18);
    const distractingRatio = i === 0 ? 0.24 : 0.20 + (Math.cos(i * 0.3) * 0.12);
    const neutralRatio = Math.max(0.08, 1 - productiveRatio - distractingRatio);

    const productiveTime = i === 0 ? 15480 : Math.floor(baseTotal * productiveRatio);
    const distractingTime = i === 0 ? 5820 : Math.floor(baseTotal * distractingRatio);
    const neutralTime = i === 0 ? 2820 : Math.floor(baseTotal * neutralRatio);
    const totalTime = productiveTime + distractingTime + neutralTime;
    const idleTime = Math.floor(totalTime * 0.15);

    // Productivity score (0-100)
    const score = i === 0 ? 78 : Math.min(96, Math.max(38, Math.round((productiveTime / totalTime) * 110 + (Math.random() * 8 - 4))));

    list.push({
      date: dateStr,
      dayLabel: `${dayOfWeek}, ${fullDate}`,
      totalTime,
      productiveTime,
      distractingTime,
      neutralTime,
      idleTime,
      productivityScore: score,
      websitesVisited: i === 0 ? 24 : Math.floor(12 + Math.random() * 20),
      contextSwitches: i === 0 ? 47 : Math.floor(25 + Math.random() * 35),
    });
  }
  return list;
}

export const initialDailyHistory: DailyActivity[] = generate12WeeksData();

// Hourly activity for today (12 AM to 11 PM)
export const initialHourlyActivity: HourlyActivity[] = [
  { hour: 0, label: '12 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 1, label: '1 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 2, label: '2 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 3, label: '3 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 4, label: '4 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 5, label: '5 AM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 6, label: '6 AM', productiveMinutes: 5, distractingMinutes: 0, neutralMinutes: 2, totalMinutes: 7 },
  { hour: 7, label: '7 AM', productiveMinutes: 12, distractingMinutes: 5, neutralMinutes: 8, totalMinutes: 25 },
  { hour: 8, label: '8 AM', productiveMinutes: 28, distractingMinutes: 4, neutralMinutes: 6, totalMinutes: 38 },
  { hour: 9, label: '9 AM', productiveMinutes: 46, distractingMinutes: 6, neutralMinutes: 4, totalMinutes: 56 },
  { hour: 10, label: '10 AM', productiveMinutes: 52, distractingMinutes: 3, neutralMinutes: 5, totalMinutes: 60 },
  { hour: 11, label: '11 AM', productiveMinutes: 45, distractingMinutes: 8, neutralMinutes: 4, totalMinutes: 57 },
  { hour: 12, label: '12 PM', productiveMinutes: 18, distractingMinutes: 24, neutralMinutes: 8, totalMinutes: 50 },
  { hour: 13, label: '1 PM', productiveMinutes: 38, distractingMinutes: 10, neutralMinutes: 5, totalMinutes: 53 },
  { hour: 14, label: '2 PM', productiveMinutes: 48, distractingMinutes: 4, neutralMinutes: 3, totalMinutes: 55 },
  { hour: 15, label: '3 PM', productiveMinutes: 42, distractingMinutes: 7, neutralMinutes: 5, totalMinutes: 54 },
  { hour: 16, label: '4 PM', productiveMinutes: 36, distractingMinutes: 12, neutralMinutes: 4, totalMinutes: 52 },
  { hour: 17, label: '5 PM', productiveMinutes: 22, distractingMinutes: 20, neutralMinutes: 6, totalMinutes: 48 },
  { hour: 18, label: '6 PM', productiveMinutes: 10, distractingMinutes: 28, neutralMinutes: 4, totalMinutes: 42 },
  { hour: 19, label: '7 PM', productiveMinutes: 6, distractingMinutes: 15, neutralMinutes: 3, totalMinutes: 24 },
  { hour: 20, label: '8 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 21, label: '9 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 22, label: '10 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
  { hour: 23, label: '11 PM', productiveMinutes: 0, distractingMinutes: 0, neutralMinutes: 0, totalMinutes: 0 },
];

export const initialTabs: TabActivity[] = [
  {
    id: 'tab-1',
    title: 'Pull Requests · browser-time/extension-core',
    domain: 'github.com',
    url: 'https://github.com/browser-time/extension-core/pulls',
    duration: 2520, // 42m
    lastActive: 'Active now',
    isActive: true,
    category: 'productive',
    memoryUsageMb: 84,
  },
  {
    id: 'tab-2',
    title: 'How to calculate weighted productivity scores in TypeScript',
    domain: 'stackoverflow.com',
    url: 'https://stackoverflow.com/questions/5918231',
    duration: 1080, // 18m
    lastActive: '4m ago',
    isActive: false,
    category: 'productive',
    memoryUsageMb: 62,
  },
  {
    id: 'tab-3',
    title: 'Lo-Fi Chill Beats for Coding & Focus - 24/7 Live Stream',
    domain: 'youtube.com',
    url: 'https://youtube.com/watch?v=5qap5aO4i9A',
    duration: 5040, // 1h 24m
    lastActive: '12m ago',
    isActive: false,
    category: 'distracting',
    memoryUsageMb: 145,
  },
  {
    id: 'tab-4',
    title: 'Q3 Product Roadmap & Feature Milestones · Notion Workspace',
    domain: 'notion.so',
    url: 'https://notion.so/workspace/roadmap-2026',
    duration: 3120, // 52m
    lastActive: '22m ago',
    isActive: false,
    category: 'productive',
    memoryUsageMb: 110,
  },
  {
    id: 'tab-5',
    title: 'Browser Time Extension Architecture Specification',
    domain: 'docs.google.com',
    url: 'https://docs.google.com/document/d/1XyZ...',
    duration: 2880, // 48m
    lastActive: '35m ago',
    isActive: false,
    category: 'productive',
    memoryUsageMb: 76,
  },
  {
    id: 'tab-6',
    title: 'r/webdev: Modern UI Patterns for Dark Analytics Dashboards',
    domain: 'reddit.com',
    url: 'https://reddit.com/r/webdev/comments/912...',
    duration: 1860, // 31m
    lastActive: '48m ago',
    isActive: false,
    category: 'distracting',
    memoryUsageMb: 95,
  },
  {
    id: 'tab-7',
    title: 'Design System Tokens & Dark Palette · Figma',
    domain: 'figma.com',
    url: 'https://figma.com/file/a89z/BrowserTime-Design-System',
    duration: 1980, // 33m
    lastActive: '1h ago',
    isActive: false,
    category: 'productive',
    memoryUsageMb: 180,
  },
];

export const initialTimeline: TimelineItem[] = [
  {
    id: 'tl-1',
    time: '9:00 AM',
    endTime: '9:32 AM',
    domain: 'github.com',
    name: 'GitHub',
    title: 'Reviewing PR #142: Time tracking aggregation engine',
    duration: 1920, // 32m
    category: 'productive',
  },
  {
    id: 'tl-2',
    time: '9:32 AM',
    endTime: '9:50 AM',
    domain: 'stackoverflow.com',
    name: 'Stack Overflow',
    title: 'Debugging SVG donut gauge transition calculations',
    duration: 1080, // 18m
    category: 'productive',
  },
  {
    id: 'tl-3',
    time: '9:50 AM',
    endTime: '10:02 AM',
    domain: 'youtube.com',
    name: 'YouTube',
    title: 'Tech news highlight: New browser extension manifest updates',
    duration: 720, // 12m
    category: 'distracting',
  },
  {
    id: 'tl-4',
    time: '10:02 AM',
    endTime: '10:47 AM',
    domain: 'github.com',
    name: 'GitHub',
    title: 'Merging features into branch release/v2.4.0',
    duration: 2700, // 45m
    category: 'productive',
  },
  {
    id: 'tl-5',
    time: '10:47 AM',
    endTime: '11:15 AM',
    domain: 'notion.so',
    name: 'Notion',
    title: 'Sprint planning and task breakdown for upcoming milestone',
    duration: 1680, // 28m
    category: 'productive',
  },
  {
    id: 'tl-6',
    time: '11:15 AM',
    endTime: '11:35 AM',
    domain: 'docs.google.com',
    name: 'Google Docs',
    title: 'Editing Technical RFC: Browser storage encryption',
    duration: 1200, // 20m
    category: 'productive',
  },
  {
    id: 'tl-7',
    time: '11:35 AM',
    endTime: '11:55 AM',
    domain: 'reddit.com',
    name: 'Reddit',
    title: 'Browsing r/programming news thread',
    duration: 1200, // 20m
    category: 'distracting',
  },
  {
    id: 'tl-8',
    time: '12:00 PM',
    endTime: '12:30 PM',
    domain: 'idle',
    name: 'Idle Time',
    title: 'No user input detected (Break/Lunch)',
    duration: 1800, // 30m
    category: 'neutral',
    isIdle: true,
  },
  {
    id: 'tl-9',
    time: '12:30 PM',
    endTime: '1:15 PM',
    domain: 'youtube.com',
    name: 'YouTube',
    title: 'Conference talk: Next generation web application architectures',
    duration: 2700, // 45m
    category: 'distracting',
  },
  {
    id: 'tl-10',
    time: '1:15 PM',
    endTime: '2:10 PM',
    domain: 'figma.com',
    name: 'Figma',
    title: 'Visual polish on extension popup and dark card layouts',
    duration: 3300, // 55m
    category: 'productive',
  },
  {
    id: 'tl-11',
    time: '2:10 PM',
    endTime: '3:05 PM',
    domain: 'github.com',
    name: 'GitHub',
    title: 'Active code review and automated CI validation checks',
    duration: 3300, // 55m
    category: 'productive',
  },
];

export const initialScoreFactors: ScoreFactor[] = [
  {
    name: 'Productive browsing',
    points: 32,
    type: 'positive',
    description: '4h 18m spent on work and engineering domains',
  },
  {
    name: 'Focus sessions',
    points: 21,
    type: 'positive',
    description: '3 uninterrupted sessions lasting over 45 minutes',
  },
  {
    name: 'Distraction control',
    points: 15,
    type: 'positive',
    description: 'Distraction ratio kept under 25% for peak work hours',
  },
  {
    name: 'Context switching',
    points: -8,
    type: 'negative',
    description: '47 domain switches detected (slight attention fragmentation)',
  },
  {
    name: 'Idle time',
    points: -4,
    type: 'negative',
    description: '38 minutes of inactive tab lingering during active hours',
  },
];

export const initialInsights: ProductivityInsight[] = [
  {
    id: 'ins-1',
    title: 'Peak Productivity Window',
    description: 'Your most productive hour today was 10:00 AM with 52 minutes of deep work.',
    type: 'highlight',
    icon: 'Zap',
  },
  {
    id: 'ins-2',
    title: 'Morning Discipline',
    description: 'You spent 31% less time on distracting websites during the morning hours.',
    type: 'stat',
    icon: 'Sun',
  },
  {
    id: 'ins-3',
    title: 'Primary Workhorse',
    description: 'GitHub is your most productive website today, accounting for 1h 08m.',
    type: 'highlight',
    icon: 'Code',
  },
  {
    id: 'ins-4',
    title: 'Attention Fragmentation',
    description: 'You switched websites 47 times today. Try batching communication tabs.',
    type: 'warning',
    icon: 'Repeat',
  },
  {
    id: 'ins-5',
    title: 'Deep Work Endurance',
    description: 'Your longest uninterrupted productive session was 1h 18m on Figma and GitHub.',
    type: 'highlight',
    icon: 'Flame',
  },
];

export const initialSettings: TrackingSettings = {
  enableTracking: true,
  trackInactiveTabs: true,
  trackIdleTime: true,
  idleTimeoutMinutes: 5,
  startTrackingAutomatically: true,
  darkMode: true,
  compactMode: false,
  accentColor: '#38bdf8', // Electric blue
  excludedDomains: ['bank.chase.com', 'healthportal.internal', 'localhost'],
};
