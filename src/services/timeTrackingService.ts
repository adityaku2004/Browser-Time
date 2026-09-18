import {
  WebsiteActivity,
  DailyActivity,
  HourlyActivity,
  TabActivity,
  TimelineItem,
  ScoreFactor,
  ProductivityInsight,
  TrackingSettings,
  ProductivityCategory,
} from '../types';
import {
  initialWebsites,
  initialDailyHistory,
  initialHourlyActivity,
  initialTabs,
  initialTimeline,
  initialScoreFactors,
  initialInsights,
  initialSettings,
} from '../data/mockData';

class TimeTrackingService {
  private websites: WebsiteActivity[] = [...initialWebsites];
  private dailyHistory: DailyActivity[] = [...initialDailyHistory];
  private hourlyActivity: HourlyActivity[] = [...initialHourlyActivity];
  private tabs: TabActivity[] = [...initialTabs];
  private timeline: TimelineItem[] = [...initialTimeline];
  private scoreFactors: ScoreFactor[] = [...initialScoreFactors];
  private insights: ProductivityInsight[] = [...initialInsights];
  private settings: TrackingSettings = { ...initialSettings };

  // Live session state
  private isTrackingActive: boolean = true;
  private currentDomain: string = 'github.com';
  private currentSessionSeconds: number = 2538; // 42m 18s
  private timerInterval: any = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.startSessionTimer();
  }

  private startSessionTimer() {
    if (typeof window !== 'undefined') {
      this.timerInterval = setInterval(() => {
        if (this.isTrackingActive) {
          this.currentSessionSeconds += 1;
          // Slowly tick the active tab
          const activeTab = this.tabs.find((t) => t.isActive);
          if (activeTab) {
            activeTab.duration += 1;
          }
          this.notifyListeners();
        }
      }, 1000);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Websites ---
  public getWebsites(): WebsiteActivity[] {
    return [...this.websites];
  }

  public getTopWebsites(limit: number = 5): WebsiteActivity[] {
    return [...this.websites]
      .filter((w) => !w.excluded)
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, limit);
  }

  public updateWebsiteCategory(domain: string, category: ProductivityCategory) {
    this.websites = this.websites.map((w) =>
      w.domain.toLowerCase() === domain.toLowerCase() ? { ...w, category } : w
    );

    // Update tabs matching domain
    this.tabs = this.tabs.map((t) =>
      t.domain.toLowerCase() === domain.toLowerCase() ? { ...t, category } : t
    );

    // Update timeline
    this.timeline = this.timeline.map((item) =>
      item.domain.toLowerCase() === domain.toLowerCase() ? { ...item, category } : item
    );

    // Recalculate summary metrics based on category changes
    this.recalculateSummaryMetrics();
    this.notifyListeners();
  }

  public addDomain(domain: string, category: ProductivityCategory) {
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!cleanDomain) return;

    const existing = this.websites.find((w) => w.domain === cleanDomain);
    if (existing) {
      this.updateWebsiteCategory(cleanDomain, category);
      return;
    }

    const newSite: WebsiteActivity = {
      id: `site-${Date.now()}`,
      domain: cleanDomain,
      name: cleanDomain.split('.')[0].toUpperCase(),
      timeSpent: 0,
      timeSpentWeek: 0,
      averageDailyTime: 0,
      category,
      visits: 0,
      excluded: false,
    };

    this.websites.unshift(newSite);
    this.notifyListeners();
  }

  public removeDomain(domain: string) {
    this.websites = this.websites.filter((w) => w.domain !== domain);
    this.notifyListeners();
  }

  public toggleExcludeDomain(domain: string) {
    this.websites = this.websites.map((w) =>
      w.domain === domain ? { ...w, excluded: !w.excluded } : w
    );

    const isExcluded = this.settings.excludedDomains.includes(domain);
    if (isExcluded) {
      this.settings.excludedDomains = this.settings.excludedDomains.filter((d) => d !== domain);
    } else {
      this.settings.excludedDomains.push(domain);
    }

    this.notifyListeners();
  }

  // --- Daily Activity & History ---
  public getDailyHistory(): DailyActivity[] {
    return [...this.dailyHistory];
  }

  public getDailySummary(dateStr?: string): DailyActivity {
    if (!dateStr) {
      // Return latest (today)
      return { ...this.dailyHistory[this.dailyHistory.length - 1] };
    }
    const match = this.dailyHistory.find((d) => d.date === dateStr);
    return match ? { ...match } : { ...this.dailyHistory[this.dailyHistory.length - 1] };
  }

  public updateTodayStats(override: Partial<DailyActivity>) {
    const lastIndex = this.dailyHistory.length - 1;
    this.dailyHistory[lastIndex] = {
      ...this.dailyHistory[lastIndex],
      ...override,
    };
    this.notifyListeners();
  }

  private recalculateSummaryMetrics() {
    let productive = 0;
    let distracting = 0;
    let neutral = 0;

    this.websites.forEach((w) => {
      if (w.excluded) return;
      if (w.category === 'productive') productive += w.timeSpent;
      else if (w.category === 'distracting') distracting += w.timeSpent;
      else neutral += w.timeSpent;
    });

    const total = productive + distracting + neutral;
    const score = total > 0 ? Math.min(100, Math.round((productive / total) * 110)) : 75;

    this.updateTodayStats({
      totalTime: total || 24120,
      productiveTime: productive || 15480,
      distractingTime: distracting || 5820,
      neutralTime: neutral || 2820,
      productivityScore: score,
    });
  }

  // --- Hourly Activity ---
  public getHourlyActivity(): HourlyActivity[] {
    return [...this.hourlyActivity];
  }

  // --- Tabs ---
  public getTabs(): TabActivity[] {
    return [...this.tabs];
  }

  public closeTab(tabId: string) {
    this.tabs = this.tabs.filter((t) => t.id !== tabId);
    this.notifyListeners();
  }

  public activateTab(tabId: string) {
    this.tabs = this.tabs.map((t) => {
      const isTarget = t.id === tabId;
      if (isTarget) {
        this.currentDomain = t.domain;
        this.currentSessionSeconds = 0;
      }
      return {
        ...t,
        isActive: isTarget,
        lastActive: isTarget ? 'Active now' : 'Just now',
      };
    });
    this.notifyListeners();
  }

  // --- Timeline ---
  public getTimeline(): TimelineItem[] {
    return [...this.timeline];
  }

  // --- Score Factors & Insights ---
  public getScoreFactors(): ScoreFactor[] {
    return [...this.scoreFactors];
  }

  public getInsights(): ProductivityInsight[] {
    return [...this.insights];
  }

  // --- Tracking State ---
  public getTrackingStatus() {
    const todaySummary = this.getDailySummary();
    return {
      isActive: this.isTrackingActive,
      currentDomain: this.currentDomain,
      currentSessionSeconds: this.currentSessionSeconds,
      todayTotalSeconds: todaySummary.totalTime,
      todayProductiveSeconds: todaySummary.productiveTime,
      todayDistractingSeconds: todaySummary.distractingTime,
      todayScore: todaySummary.productivityScore,
    };
  }

  public pauseTracking() {
    this.isTrackingActive = false;
    this.notifyListeners();
  }

  public resumeTracking() {
    this.isTrackingActive = true;
    this.notifyListeners();
  }

  public excludeCurrentWebsite() {
    this.toggleExcludeDomain(this.currentDomain);
  }

  // --- Settings ---
  public getSettings(): TrackingSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<TrackingSettings>) {
    this.settings = { ...this.settings, ...partial };
    if (partial.enableTracking !== undefined) {
      this.isTrackingActive = partial.enableTracking;
    }
    this.notifyListeners();
  }

  public clearBrowsingStats() {
    this.websites = this.websites.map((w) => ({
      ...w,
      timeSpent: 0,
      timeSpentWeek: 0,
      visits: 0,
    }));
    this.timeline = [];
    this.updateTodayStats({
      totalTime: 0,
      productiveTime: 0,
      distractingTime: 0,
      neutralTime: 0,
      productivityScore: 100,
    });
    this.notifyListeners();
  }
}

// Singleton export
export const timeTrackingService = new TimeTrackingService();
