// Browser Time - Background Service Worker
// Supports both Chrome (MV3 service_worker) and Firefox (background script)

const isFirefox = typeof browser !== 'undefined';
const extensionAPI = typeof chrome !== 'undefined' ? chrome : (typeof browser !== 'undefined' ? browser : null);

console.log('[Browser Time] Background service worker initialized.');

// Listen for extension installation or update
if (extensionAPI && extensionAPI.runtime) {
  extensionAPI.runtime.onInstalled.addListener((details) => {
    console.log('[Browser Time] Extension installed:', details.reason);
    
    // Optional: Open full dashboard on initial install
    if (details.reason === 'install') {
      const dashboardUrl = extensionAPI.runtime.getURL('index.html');
      if (extensionAPI.tabs && extensionAPI.tabs.create) {
        extensionAPI.tabs.create({ url: dashboardUrl });
      }
    }
  });
}

// Context Menu / Shortcut for quick Dashboard access
if (extensionAPI && extensionAPI.contextMenus) {
  extensionAPI.runtime.onInstalled.addListener(() => {
    extensionAPI.contextMenus.create({
      id: 'open-browser-time-dashboard',
      title: 'Open Browser Time Dashboard',
      contexts: ['action']
    });
  });

  extensionAPI.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'open-browser-time-dashboard') {
      const dashboardUrl = extensionAPI.runtime.getURL('index.html');
      extensionAPI.tabs.create({ url: dashboardUrl });
    }
  });
}

// Future integration hooks for Chrome & Firefox tabs APIs:
// - chrome.tabs.onActivated: track when user switches tabs
// - chrome.tabs.onUpdated: detect URL changes / domain transitions
// - chrome.idle.onStateChanged: detect active vs idle time
// - chrome.storage.local: persist browsing session logs
