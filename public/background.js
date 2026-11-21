// Browser Time - Background Service Worker
// Supports both Chrome (MV3 service_worker) and Firefox (background script)

const extensionAPI =
  typeof chrome !== 'undefined'
    ? chrome
    : typeof browser !== 'undefined'
    ? browser
    : null;

const STORAGE_KEY = 'browsertime_telemetry_v1';
const WINDOW_ID_NONE =
  extensionAPI && extensionAPI.windows && typeof extensionAPI.windows.WINDOW_ID_NONE === 'number'
    ? extensionAPI.windows.WINDOW_ID_NONE
    : -1;

let activeSession = {
  windowId: null,
  tabId: null,
  domain: '',
  title: '',
  startedAt: null,
};

function notifyUI(message) {
  if (!extensionAPI || !extensionAPI.runtime || !extensionAPI.runtime.sendMessage) return;
  try {
    const maybePromise = extensionAPI.runtime.sendMessage(message, () => {
      // Suppress unchecked runtime.lastError when popup/dashboard is closed
      void extensionAPI.runtime.lastError;
    });
    if (maybePromise && typeof maybePromise.catch === 'function') {
      maybePromise.catch(() => {});
    }
  } catch {
    // Ignore when no UI listener is open
  }
}

function classifyDomain(domain, existingWebsites) {
  const existing = (existingWebsites || []).find(
    (w) => w.domain && w.domain.toLowerCase() === domain.toLowerCase()
  );
  if (existing) return existing.category;

  const productivePatterns = [
    'github',
    'stackoverflow',
    'gitlab',
    'notion',
    'docs.google',
    'figma',
    'linear',
    'jira',
    'trello',
    'npm',
    'chatgpt',
    'claude',
  ];
  const distractingPatterns = [
    'youtube',
    'netflix',
    'facebook',
    'instagram',
    'twitter',
    'x.com',
    'reddit',
    'tiktok',
    'twitch',
  ];

  const lower = domain.toLowerCase();
  if (productivePatterns.some((p) => lower.includes(p))) return 'productive';
  if (distractingPatterns.some((p) => lower.includes(p))) return 'distracting';
  return 'neutral';
}

function isTrackableUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    !url.startsWith('chrome://') &&
    !url.startsWith('chrome-extension://') &&
    !url.startsWith('moz-extension://') &&
    !url.startsWith('about:') &&
    !url.startsWith('edge://')
  );
}

function commitElapsedSession(callback) {
  if (!activeSession.domain || !activeSession.startedAt) {
    if (callback) callback();
    return;
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - activeSession.startedAt) / 1000));
  const domain = activeSession.domain;
  const title = activeSession.title || domain;
  activeSession.startedAt = Date.now();

  if (elapsedSeconds <= 0 || !extensionAPI || !extensionAPI.storage || !extensionAPI.storage.local) {
    if (callback) callback();
    return;
  }

  extensionAPI.storage.local.get([STORAGE_KEY], (result) => {
    const data = result && result[STORAGE_KEY] ? result[STORAGE_KEY] : {};
    const websites = Array.isArray(data.websites) ? data.websites : [];
    const timeline = Array.isArray(data.timeline) ? data.timeline : [];
    const settings = data.settings || {};

    if (settings.enableTracking === false || data.isTrackingActive === false) {
      if (callback) callback();
      return;
    }

    const excludedDomains = Array.isArray(settings.excludedDomains) ? settings.excludedDomains : [];
    if (excludedDomains.includes(domain)) {
      if (callback) callback();
      return;
    }

    let site = websites.find((w) => w.domain && w.domain.toLowerCase() === domain.toLowerCase());
    if (!site) {
      site = {
        id: `site-${Date.now()}`,
        domain,
        name: domain.split('.')[0].toUpperCase(),
        timeSpent: 0,
        timeSpentWeek: 0,
        averageDailyTime: 0,
        category: classifyDomain(domain, websites),
        visits: 1,
        excluded: false,
      };
      websites.push(site);
    }

    if (!site.excluded) {
      site.timeSpent += elapsedSeconds;
      site.timeSpentWeek += elapsedSeconds;
    }

    if (elapsedSeconds >= 5) {
      timeline.unshift({
        id: `tl-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        domain,
        name: domain.split('.')[0].toUpperCase(),
        title,
        duration: elapsedSeconds,
        category: site.category,
      });
      if (timeline.length > 100) timeline.pop();
    }

    extensionAPI.storage.local.set(
      {
        [STORAGE_KEY]: {
          ...data,
          websites,
          timeline,
          lastStoppedAt: Date.now(),
        },
      },
      () => {
        if (callback) callback();
      }
    );
  });
}

function stopTrackingImmediately(reason) {
  if (extensionAPI && extensionAPI.alarms && extensionAPI.alarms.clear) {
    extensionAPI.alarms.clear('browsertime-heartbeat');
  }

  commitElapsedSession(() => {
    activeSession = {
      windowId: null,
      tabId: null,
      domain: '',
      title: '',
      startedAt: null,
    };

    notifyUI({
      type: 'TRACKING_STOPPED',
      reason,
      timestamp: Date.now(),
    });
  });
}

function startTrackingTab(tab) {
  if (!tab || !isTrackableUrl(tab.url)) {
    stopTrackingImmediately('non_trackable_tab');
    return;
  }

  let domain = '';
  try {
    domain = new URL(tab.url).hostname;
  } catch {
    return;
  }

  if (!domain) return;

  if (activeSession.domain === domain && activeSession.tabId === tab.id && activeSession.windowId === tab.windowId) {
    return;
  }

  commitElapsedSession(() => {
    activeSession = {
      windowId: typeof tab.windowId === 'number' ? tab.windowId : null,
      tabId: typeof tab.id === 'number' ? tab.id : null,
      domain,
      title: tab.title || domain,
      startedAt: Date.now(),
    };

    if (extensionAPI && extensionAPI.alarms && extensionAPI.alarms.create) {
      extensionAPI.alarms.create('browsertime-heartbeat', { periodInMinutes: 0.5 });
    }
  });
}

// Listen for extension installation or update
if (extensionAPI && extensionAPI.runtime) {
  extensionAPI.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      const dashboardUrl = extensionAPI.runtime.getURL('index.html');
      if (extensionAPI.tabs && extensionAPI.tabs.create) {
        extensionAPI.tabs.create({ url: dashboardUrl });
      }
    }
  });
}

// Context Menu for quick Dashboard access
if (extensionAPI && extensionAPI.contextMenus) {
  extensionAPI.runtime.onInstalled.addListener(() => {
    extensionAPI.contextMenus.create({
      id: 'open-browser-time-dashboard',
      title: 'Open Browser Time Dashboard',
      contexts: ['action'],
    });
  });

  extensionAPI.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'open-browser-time-dashboard') {
      const dashboardUrl = extensionAPI.runtime.getURL('index.html');
      extensionAPI.tabs.create({ url: dashboardUrl });
    }
  });
}

// Immediately stop tracking when a browser window is closed
if (extensionAPI && extensionAPI.windows) {
  if (extensionAPI.windows.onRemoved) {
    extensionAPI.windows.onRemoved.addListener((closedWindowId) => {
      if (closedWindowId === activeSession.windowId) {
        stopTrackingImmediately('window_closed');
        return;
      }

      if (extensionAPI.windows.getAll) {
        extensionAPI.windows.getAll({}, (windows) => {
          if (!windows || windows.length === 0) {
            stopTrackingImmediately('all_windows_closed');
          }
        });
      }
    });
  }

  // Stop tracking immediately when all browser windows lose focus or are minimized/closed
  if (extensionAPI.windows.onFocusChanged) {
    extensionAPI.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === WINDOW_ID_NONE) {
        stopTrackingImmediately('window_unfocused');
        return;
      }

      if (extensionAPI.tabs && extensionAPI.tabs.query) {
        extensionAPI.tabs.query({ active: true, windowId }, (tabs) => {
          if (tabs && tabs[0]) {
            startTrackingTab(tabs[0]);
          } else {
            stopTrackingImmediately('no_active_tab');
          }
        });
      }
    });
  }
}

// Track tab switching and tab closing
if (extensionAPI && extensionAPI.tabs) {
  if (extensionAPI.tabs.onActivated) {
    extensionAPI.tabs.onActivated.addListener((activeInfo) => {
      extensionAPI.tabs.get(activeInfo.tabId, (tab) => {
        if (extensionAPI.runtime && extensionAPI.runtime.lastError) return;
        if (tab) startTrackingTab(tab);
      });
    });
  }

  if (extensionAPI.tabs.onUpdated) {
    extensionAPI.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
      if (changeInfo.url && tab && tab.active) {
        startTrackingTab(tab);
      }
    });
  }

  if (extensionAPI.tabs.onRemoved) {
    extensionAPI.tabs.onRemoved.addListener((tabId) => {
      if (tabId === activeSession.tabId) {
        stopTrackingImmediately('tab_closed');
      }
    });
  }
}

// Pause immediately when user is idle or screen is locked
if (extensionAPI && extensionAPI.idle && extensionAPI.idle.onStateChanged) {
  extensionAPI.idle.onStateChanged.addListener((state) => {
    if (state === 'idle' || state === 'locked') {
      stopTrackingImmediately('user_idle');
    } else if (state === 'active' && extensionAPI.tabs && extensionAPI.tabs.query) {
      extensionAPI.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs && tabs[0]) startTrackingTab(tabs[0]);
      });
    }
  });
}

// Periodic alarm flush while a session is active
if (extensionAPI && extensionAPI.alarms && extensionAPI.alarms.onAlarm) {
  extensionAPI.alarms.onAlarm.addListener((alarm) => {
    if (alarm && alarm.name === 'browsertime-heartbeat') {
      commitElapsedSession();
    }
  });
}
