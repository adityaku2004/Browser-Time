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
  initialSettings,
} from '../data/mockData';

declare const chrome: any;

const STORAGE_KEY = 'browsertime_telemetry_v1';

class TimeTrackingService {
  private websites: WebsiteActivity[] = [...initialWebsites];
  private dailyHistory: DailyActivity[] = [...initialDailyHistory];
  private hourlyActivity: HourlyActivity[] = [...initialHourlyActivity];
  private tabs: TabActivity[] = [...initialTabs];
  private timeline: TimelineItem[] = [...initialTimeline];
  private settings: TrackingSettings = { ...initialSettings };

  // Live session state
  private isTrackingActive: boolean = true;
  private manuallyPaused: boolean = false;
  private currentDomain: string = '';
  private currentTabTitle: string = '';
  private currentWindowId: number | null = null;
  private currentTabId: number | null = null;
  private currentSessionSeconds: number = 0;
  private timerInterval: any = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadPersistedData();
    this.initBrowserExtensionHooks();
    this.initWindowLifecycleHooks();
    this.startSessionTimer();
  }

  private getExtensionAPI(): any {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.id) {
      return chrome;
    }
    if (typeof window !== 'undefined' && typeof (window as any).browser !== 'undefined') {
      return (window as any).browser;
    }
    return null;
  }

  private isExtensionPopupWindow(): boolean {
    if (typeof window === 'undefined') return false;
    const isExtProtocol =
      window.location.protocol === 'chrome-extension:' ||
      window.location.protocol === 'moz-extension:';
    return isExtProtocol && window.innerWidth <= 420;
  }

  private loadPersistedData() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.websites)) this.websites = parsed.websites;
          if (Array.isArray(parsed.dailyHistory) && parsed.dailyHistory.length > 0) {
            this.dailyHistory = parsed.dailyHistory;
          }
          if (Array.isArray(parsed.hourlyActivity) && parsed.hourlyActivity.length === 24) {
            this.hourlyActivity = parsed.hourlyActivity;
          }
          if (Array.isArray(parsed.tabs)) this.tabs = parsed.tabs;
          if (Array.isArray(parsed.timeline)) this.timeline = parsed.timeline;
          if (parsed.settings) this.settings = { ...this.settings, ...parsed.settings };
          if (typeof parsed.manuallyPaused === 'boolean') {
            this.manuallyPaused = parsed.manuallyPaused;
          }
          if (this.manuallyPaused || !this.settings.enableTracking) {
            this.isTrackingActive = false;
          } else if (this.settings.startTrackingAutomatically) {
            this.isTrackingActive = true;
          } else if (typeof parsed.isTrackingActive === 'boolean') {
            this.isTrackingActive = parsed.isTrackingActive;
          }
        }
      } catch (err) {
        console.warn('[Browser Time] Failed to load persisted state:', err);
      }
    }

    const extAPI = this.getExtensionAPI();
    if (extAPI?.storage?.local) {
      try {
        extAPI.storage.local.get([STORAGE_KEY], (result: any) => {
          const stored = result?.[STORAGE_KEY];
          if (!stored) return;
          if (Array.isArray(stored.websites) && stored.websites.length > 0) {
            this.websites = stored.websites;
          }
          if (Array.isArray(stored.timeline) && stored.timeline.length > 0) {
            this.timeline = stored.timeline;
          }
          if (stored.settings) {
            this.settings = { ...this.settings, ...stored.settings };
          }
          this.recalculateSummaryMetrics();
          this.notifyListeners();
        });
      } catch {
        // Ignored outside extension storage permissions
      }
    }
  }

  private persistData() {
    const payload = {
      websites: this.websites,
      dailyHistory: this.dailyHistory,
      hourlyActivity: this.hourlyActivity,
      tabs: this.tabs,
      timeline: this.timeline,
      settings: this.settings,
      isTrackingActive: this.isTrackingActive,
      manuallyPaused: this.manuallyPaused,
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignored
      }
    }

    const extAPI = this.getExtensionAPI();
    if (extAPI?.storage?.local) {
      try {
        extAPI.storage.local.set({ [STORAGE_KEY]: payload });
      } catch {
        // Ignored
      }
    }
  }

  private flushCurrentSession() {
    if (this.currentDomain && this.currentSessionSeconds >= 5) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const cat = this.classifyDomain(this.currentDomain);

      this.timeline.unshift({
        id: `tl-${Date.now()}`,
        time: timeStr,
        domain: this.currentDomain,
        name: this.currentDomain.split('.')[0].toUpperCase(),
        title: this.currentTabTitle || this.currentDomain,
        duration: this.currentSessionSeconds,
        category: cat,
      });

      if (this.timeline.length > 100) this.timeline.pop();
    }
    this.recalculateSummaryMetrics();
  }

  public stopTrackingImmediately(reason: string = 'window_closed', stopInterval: boolean = false) {
    if (stopInterval && this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    this.flushCurrentSession();

    this.currentDomain = '';
    this.currentTabTitle = '';
    this.currentWindowId = null;
    this.currentTabId = null;
    this.currentSessionSeconds = 0;

    if (reason === 'window_unload' || reason === 'all_windows_closed') {
      this.isTrackingActive = false;
    }

    this.tabs = this.tabs.map((t) => ({
      ...t,
      isActive: false,
      lastActive: t.isActive ? 'Stopped' : t.lastActive,
    }));

    this.persistData();
    this.notifyListeners();
  }

  private initWindowLifecycleHooks() {
    if (typeof window === 'undefined') return;

    const handleWindowClose = () => {
      const extAPI = this.getExtensionAPI();
      const isPopup = this.isExtensionPopupWindow();
      // In standalone web mode or when non-popup window closes without extension background worker,
      // stop active session and timer immediately. In extension mode, background.js stops on windows.onRemoved.
      const reason = isPopup || extAPI ? 'ui_window_closed' : 'window_unload';
      this.stopTrackingImmediately(reason, true);
    };

    window.addEventListener('beforeunload', handleWindowClose);
    window.addEventListener('pagehide', handleWindowClose);
  }

  private initBrowserExtensionHooks() {
    const extAPI = this.getExtensionAPI();

    if (extAPI && extAPI.tabs && extAPI.tabs.query) {
      // Query current active tab on startup
      extAPI.tabs.query({ active: true, lastFocusedWindow: true }, (tabs: any[]) => {
        if (tabs && tabs[0]?.url) {
          this.currentWindowId = typeof tabs[0].windowId === 'number' ? tabs[0].windowId : null;
          this.currentTabId = typeof tabs[0].id === 'number' ? tabs[0].id : null;
          this.handleActiveTabChanged(tabs[0].url, tabs[0].title || '', tabs[0].windowId, tabs[0].id);
        }
      });

      // Query all open tabs to populate real tab list
      extAPI.tabs.query({}, (tabs: any[]) => {
        if (tabs && Array.isArray(tabs)) {
          const realTabs: TabActivity[] = tabs
            .filter(
              (t) =>
                t.url &&
                !t.url.startsWith('chrome://') &&
                !t.url.startsWith('about:') &&
                !t.url.startsWith('moz-extension://') &&
                !t.url.startsWith('chrome-extension://')
            )
            .map((t) => {
              let domain = '';
              try {
                domain = new URL(t.url).hostname;
              } catch {
                domain = 'unknown';
              }
              return {
                id: `tab-${t.id || Math.random()}`,
                title: t.title || domain,
                domain,
                url: t.url,
                duration: 0,
                lastActive: t.active ? 'Active now' : 'Background',
                isActive: !!t.active,
                category: this.classifyDomain(domain),
              };
            });

          if (realTabs.length > 0) {
            this.tabs = realTabs;
            this.notifyListeners();
          }
        }
      });

      // Listen for tab activation / tab switch in browser
      if (extAPI.tabs.onActivated) {
        extAPI.tabs.onActivated.addListener((activeInfo: any) => {
          extAPI.tabs.get(activeInfo.tabId, (tab: any) => {
            if (extAPI.runtime?.lastError) return;
            if (tab?.url) {
              this.handleActiveTabChanged(tab.url, tab.title || '', tab.windowId, tab.id);
            }
          });
        });
      }

      // Listen for URL updates in browser
      if (extAPI.tabs.onUpdated) {
        extAPI.tabs.onUpdated.addListener((_tabId: any, changeInfo: any, tab: any) => {
          if (changeInfo.url && tab?.active) {
            this.handleActiveTabChanged(changeInfo.url, tab.title || '', tab.windowId, tab.id);
          }
        });
      }

      // Immediately stop tracking if the currently tracked tab is closed
      if (extAPI.tabs.onRemoved) {
        extAPI.tabs.onRemoved.addListener((tabId: number) => {
          this.tabs = this.tabs.filter((t) => t.id !== `tab-${tabId}`);
          if (this.currentTabId === tabId) {
            this.stopTrackingImmediately('tab_closed', false);
          } else {
            this.notifyListeners();
          }
        });
      }

      // Immediately stop tracking when a browser window closes
      if (extAPI.windows?.onRemoved) {
        extAPI.windows.onRemoved.addListener((closedWindowId: number) => {
          if (this.currentWindowId === closedWindowId) {
            this.stopTrackingImmediately('window_closed', false);
          }
          if (extAPI.windows.getAll) {
            extAPI.windows.getAll({}, (windows: any[]) => {
              if (!windows || windows.length === 0) {
                this.stopTrackingImmediately('all_windows_closed', true);
              }
            });
          }
        });
      }

      // Stop tracking when browser window loses focus; resume when a window gains focus
      if (extAPI.windows?.onFocusChanged) {
        const noneId = typeof extAPI.windows.WINDOW_ID_NONE === 'number' ? extAPI.windows.WINDOW_ID_NONE : -1;
        extAPI.windows.onFocusChanged.addListener((windowId: number) => {
          if (windowId === noneId) {
            this.stopTrackingImmediately('window_unfocused', false);
            return;
          }
          if (this.isTrackingActive) {
            extAPI.tabs.query({ active: true, windowId }, (tabs: any[]) => {
              if (tabs && tabs[0]?.url) {
                this.handleActiveTabChanged(tabs[0].url, tabs[0].title || '', tabs[0].windowId, tabs[0].id);
              }
            });
          }
        });
      }

      // Listen for idle state changes
      if (extAPI.idle?.onStateChanged) {
        extAPI.idle.onStateChanged.addListener((state: string) => {
          if (state === 'idle' || state === 'locked') {
            this.stopTrackingImmediately('user_idle', false);
          } else if (state === 'active' && this.isTrackingActive) {
            extAPI.tabs.query({ active: true, lastFocusedWindow: true }, (tabs: any[]) => {
              if (tabs && tabs[0]?.url) {
                this.handleActiveTabChanged(tabs[0].url, tabs[0].title || '', tabs[0].windowId, tabs[0].id);
              }
            });
          }
        });
      }

      // Sync stop events emitted by background worker
      if (extAPI.runtime?.onMessage) {
        extAPI.runtime.onMessage.addListener((msg: any) => {
          if (msg?.type === 'TRACKING_STOPPED') {
            this.stopTrackingImmediately(msg.reason || 'background_stopped', false);
          }
        });
      }
    }
  }

  private classifyDomain(domain: string): ProductivityCategory {
    const existing = this.websites.find((w) => w.domain.toLowerCase() === domain.toLowerCase());
    if (existing) return existing.category;

    // Standard default domain classification
    const productivePatterns = ['github', 'stackoverflow', 'gitlab', 'notion', 'docs.google', 'figma', 'linear', 'jira', 'trello', 'npm', 'chatgpt', 'claude'];
    const distractingPatterns = ['youtube', 'netflix', 'facebook', 'instagram', 'twitter', 'x.com', 'reddit', 'tiktok', 'twitch'];

    const lower = domain.toLowerCase();
    if (productivePatterns.some((p) => lower.includes(p))) return 'productive';
    if (distractingPatterns.some((p) => lower.includes(p))) return 'distracting';
    return 'neutral';
  }

  private handleActiveTabChanged(url: string, title: string, windowId?: number, tabId?: number) {
    if (
      !url ||
      url.startsWith('chrome://') ||
      url.startsWith('about:') ||
      url.startsWith('moz-extension://') ||
      url.startsWith('chrome-extension://')
    ) {
      return;
    }

    try {
      const domain = new URL(url).hostname;
      if (!domain) return;

      if (typeof windowId === 'number') this.currentWindowId = windowId;
      if (typeof tabId === 'number') this.currentTabId = tabId;

      if (this.currentDomain !== domain) {
        this.flushCurrentSession();

        this.currentDomain = domain;
        this.currentTabTitle = title || domain;
        this.currentSessionSeconds = 0;

        // Ensure domain is tracked in websites list
        let site = this.websites.find((w) => w.domain.toLowerCase() === domain.toLowerCase());
        if (!site) {
          site = {
            id: `site-${Date.now()}`,
            domain,
            name: domain.split('.')[0].toUpperCase(),
            timeSpent: 0,
            timeSpentWeek: 0,
            averageDailyTime: 0,
            category: this.classifyDomain(domain),
            visits: 1,
            excluded: false,
          };
          this.websites.push(site);
        } else {
          site.visits += 1;
        }

        // Update tabs active state
        this.tabs = this.tabs.map((t) => ({
          ...t,
          isActive: t.domain.toLowerCase() === domain.toLowerCase(),
          lastActive: t.domain.toLowerCase() === domain.toLowerCase() ? 'Active now' : t.lastActive,
        }));

        this.notifyListeners();
        this.persistData();
      }
    } catch {
      // Invalid URL
    }
  }

  private startSessionTimer() {
    if (typeof window !== 'undefined') {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.timerInterval = setInterval(() => {
        if (this.isTrackingActive && this.currentDomain) {
          this.currentSessionSeconds += 1;

          // Tick site timeSpent
          const site = this.websites.find((w) => w.domain.toLowerCase() === this.currentDomain.toLowerCase());
          if (site && !site.excluded) {
            site.timeSpent += 1;
            site.timeSpentWeek += 1;
          }

          // Tick active tab
          const activeTab = this.tabs.find((t) => t.isActive);
          if (activeTab) {
            activeTab.duration += 1;
          }

          // Tick hourly activity for current hour
          const currentHour = new Date().getHours();
          const hourEntry = this.hourlyActivity.find((h) => h.hour === currentHour);
          if (hourEntry && site && !site.excluded) {
            const minutesToAdd = 1 / 60;
            if (site.category === 'productive') hourEntry.productiveMinutes += minutesToAdd;
            else if (site.category === 'distracting') hourEntry.distractingMinutes += minutesToAdd;
            else hourEntry.neutralMinutes += minutesToAdd;
            hourEntry.totalMinutes = Math.round(hourEntry.productiveMinutes + hourEntry.distractingMinutes + hourEntry.neutralMinutes);
          }

          // Recalculate summary metrics for today
          this.recalculateSummaryMetrics();
          this.notifyListeners();

          // Persist every 10 seconds
          if (this.currentSessionSeconds % 10 === 0) {
            this.persistData();
          }
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
      .filter((w) => !w.excluded && w.timeSpent > 0)
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, limit);
  }

  public updateWebsiteCategory(domain: string, category: ProductivityCategory) {
    this.websites = this.websites.map((w) =>
      w.domain.toLowerCase() === domain.toLowerCase() ? { ...w, category } : w
    );

    this.tabs = this.tabs.map((t) =>
      t.domain.toLowerCase() === domain.toLowerCase() ? { ...t, category } : t
    );

    this.timeline = this.timeline.map((item) =>
      item.domain.toLowerCase() === domain.toLowerCase() ? { ...item, category } : item
    );

    this.recalculateSummaryMetrics();
    this.notifyListeners();
    this.persistData();
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
    this.persistData();
  }

  public removeDomain(domain: string) {
    this.websites = this.websites.filter((w) => w.domain !== domain);
    this.recalculateSummaryMetrics();
    this.notifyListeners();
    this.persistData();
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

    this.recalculateSummaryMetrics();
    this.notifyListeners();
    this.persistData();
  }

  // --- Daily Activity & History ---
  public getDailyHistory(): DailyActivity[] {
    return [...this.dailyHistory];
  }

  public getDailySummary(dateStr?: string): DailyActivity {
    if (this.dailyHistory.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      return {
        date: today,
        dayLabel: 'Today',
        totalTime: 0,
        productiveTime: 0,
        distractingTime: 0,
        neutralTime: 0,
        idleTime: 0,
        productivityScore: 0,
        websitesVisited: 0,
        contextSwitches: 0,
      };
    }

    if (!dateStr) {
      return { ...this.dailyHistory[this.dailyHistory.length - 1] };
    }

    const match = this.dailyHistory.find((d) => d.date === dateStr);
    return match ? { ...match } : { ...this.dailyHistory[this.dailyHistory.length - 1] };
  }

  public updateTodayStats(override: Partial<DailyActivity>) {
    if (this.dailyHistory.length === 0) return;
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
    let visitedCount = 0;

    this.websites.forEach((w) => {
      if (w.excluded) return;
      if (w.timeSpent > 0) visitedCount += 1;

      if (w.category === 'productive') productive += w.timeSpent;
      else if (w.category === 'distracting') distracting += w.timeSpent;
      else neutral += w.timeSpent;
    });

    const total = productive + distracting + neutral;
    // Score between 0 and 100 based on proportion of productive vs total time
    const score = total > 0 ? Math.min(100, Math.round((productive / total) * 100)) : 0;

    this.updateTodayStats({
      totalTime: total,
      productiveTime: productive,
      distractingTime: distracting,
      neutralTime: neutral,
      productivityScore: score,
      websitesVisited: visitedCount,
      contextSwitches: this.timeline.length,
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
    this.persistData();
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
        lastActive: isTarget ? 'Active now' : 'Background',
      };
    });
    this.notifyListeners();
    this.persistData();
  }

  // --- Timeline ---
  public getTimeline(): TimelineItem[] {
    return [...this.timeline];
  }

  // --- Score Factors & Insights (Dynamically computed from real stats) ---
  public getScoreFactors(): ScoreFactor[] {
    const summary = this.getDailySummary();
    if (summary.totalTime === 0) {
      return [];
    }

    const factors: ScoreFactor[] = [];
    const prodMinutes = Math.round(summary.productiveTime / 60);
    const distMinutes = Math.round(summary.distractingTime / 60);

    if (prodMinutes > 0) {
      const prodPoints = Math.min(50, Math.round((summary.productiveTime / summary.totalTime) * 50));
      factors.push({
        name: 'Productive browsing',
        points: prodPoints,
        type: 'positive',
        description: `${prodMinutes} minutes spent on productive domains`,
      });
    }

    if (distMinutes > 0) {
      const distRatio = summary.distractingTime / summary.totalTime;
      const penalty = Math.round(distRatio * 30);
      factors.push({
        name: 'Distraction time',
        points: -penalty,
        type: 'negative',
        description: `${distMinutes} minutes on leisure and non-work domains`,
      });
    }

    if (summary.contextSwitches > 15) {
      factors.push({
        name: 'Context switching',
        points: -Math.min(15, Math.round(summary.contextSwitches / 5)),
        type: 'negative',
        description: `${summary.contextSwitches} domain switches detected today`,
      });
    }

    return factors;
  }

  public getInsights(): ProductivityInsight[] {
    const summary = this.getDailySummary();
    if (summary.totalTime === 0) {
      return [];
    }

    const insights: ProductivityInsight[] = [];
    const topSites = this.getTopWebsites(1);

    if (topSites.length > 0) {
      const top = topSites[0];
      const mins = Math.round(top.timeSpent / 60);
      insights.push({
        id: 'ins-top-site',
        title: 'Primary Activity',
        description: `${top.name} is your most active domain today with ${mins} minutes logged.`,
        type: top.category === 'productive' ? 'highlight' : 'warning',
        icon: top.category === 'productive' ? 'Code' : 'Flame',
      });
    }

    // Find peak hour
    let peakHour = this.hourlyActivity[0];
    for (const h of this.hourlyActivity) {
      if (h.totalMinutes > peakHour.totalMinutes) {
        peakHour = h;
      }
    }

    if (peakHour && peakHour.totalMinutes > 0) {
      insights.push({
        id: 'ins-peak-hour',
        title: 'Peak Browsing Window',
        description: `Your highest activity occurred around ${peakHour.label} with ${peakHour.totalMinutes} minutes logged.`,
        type: 'highlight',
        icon: 'Zap',
      });
    }

    return insights;
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
    this.manuallyPaused = true;
    this.notifyListeners();
    this.persistData();
  }

  public resumeTracking() {
    this.isTrackingActive = true;
    this.manuallyPaused = false;
    this.notifyListeners();
    this.persistData();
  }

  public toggleTracking(): boolean {
    this.isTrackingActive = !this.isTrackingActive;
    this.manuallyPaused = !this.isTrackingActive;
    this.notifyListeners();
    this.persistData();
    return this.isTrackingActive;
  }

  public excludeCurrentWebsite() {
    if (this.currentDomain) {
      this.toggleExcludeDomain(this.currentDomain);
    }
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
    this.persistData();
  }

  public clearBrowsingStats() {
    this.websites = [];
    this.timeline = [];
    this.tabs = [];
    this.currentDomain = '';
    this.currentSessionSeconds = 0;
    this.hourlyActivity = this.hourlyActivity.map((h) => ({
      ...h,
      productiveMinutes: 0,
      distractingMinutes: 0,
      neutralMinutes: 0,
      totalMinutes: 0,
    }));
    this.updateTodayStats({
      totalTime: 0,
      productiveTime: 0,
      distractingTime: 0,
      neutralTime: 0,
      productivityScore: 0,
      websitesVisited: 0,
      contextSwitches: 0,
    });
    this.notifyListeners();
    this.persistData();
  }
}

// Singleton export
export const timeTrackingService = new TimeTrackingService();
