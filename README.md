# ⏱️ Browser Time — Productivity & Time Tracking Extension

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chrome & Firefox](https://img.shields.io/badge/Browser_Extension-Chrome_&_Firefox-10b981?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)

**Browser Time** is a desktop-grade productivity analytics application and browser extension companion. Designed with a dark-first cyber aesthetic, it empowers users to monitor active vs. idle browsing time, classify domains into Productive, Neutral, and Distracting categories, inspect active browser tabs, and review historical trends with interactive heatmaps and score factor breakdowns.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Prerequisites](#-prerequisites)
- [Quick Start (Local Web Dev)](#-quick-start-local-web-dev)
- [Compiling the Extension](#-compiling-the-extension)
- [Testing in Google Chrome & Chromium](#-testing-in-google-chrome--chromium)
- [Testing in Mozilla Firefox](#-testing-in-mozilla-firefox)
- [Creating & Installing a Firefox `.xpi` Package](#-creating--installing-a-firefox-xpi-package)
- [Extension Architecture & Migration Guide](#-extension-architecture--migration-guide)
- [Project Directory Structure](#-project-directory-structure)
- [Available npm Scripts](#-available-npm-scripts)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🚀 Key Features

* **Command Dashboard**: Live stat cards displaying Total Active Time, Productive Focus %, Distraction %, and real-time circular Productivity Score gauge.
* **12-Week Browsing Heatmap**: GitHub-style interactive activity matrix mapping daily browsing intensity, hover tooltips, and day selection.
* **Hourly Breakdown Area Chart**: 24-hour stacked activity curves displaying productive, neutral, and distracting hours.
* **Website Management & Categorization**: Searchable domain table with quick reclassification (Productive / Neutral / Distracting), duration bars, and quick blacklist toggling.
* **Active Tabs Monitor**: Live inspection of open browser tabs with active indicators, domain tags, memory usage indicators, and simulated focus mode.
* **Daily Timeline (`/today`)**: Chronological browsing audit feed with time badges and category filters.
* **Long-Term Analytics (`/history`)**: Daily, Weekly, and Monthly aggregated reports, weekly comparative bar charts, and trends.
* **Extension Popup Companion**: Pixel-perfect `360px × 520px` extension action popup featuring active domain timer, today's productivity score, pause/resume tracking toggle, and direct dashboard launch.
* **Modular Service Abstraction**: All metrics flow through `services/timeTrackingService.ts` via an event-driven pub/sub pattern, architected specifically for simple substitution with `chrome.*` and `browser.*` APIs.

---

## 💻 Prerequisites

Ensure you have the following installed on your machine:

1. **Node.js**: `v18.0.0` or higher (`v20.x` or `v22.x` LTS recommended)
2. **npm** (bundled with Node.js) or **bun** / **pnpm** / **yarn**
3. **Google Chrome** (v109+ for Manifest V3) or any Chromium browser (Edge, Brave, Arc, Opera, Vivaldi)
4. **Mozilla Firefox** (v109+ for Manifest V3 support, or Firefox Developer Edition)

---

## ⚡ Quick Start (Local Web Dev)

To run the interactive UI dashboard immediately in your browser:

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Tip**: You can preview the extension popup interface at any time by clicking **"Popup View"** in the top navigation bar or the tracking indicator in the bottom-left sidebar.

---

## 📦 Compiling the Extension

Running the build command automatically produces **both** production extensions in dedicated directories:
* **`chrome-dist/`** — Configured for Google Chrome, Brave, Microsoft Edge, Opera, and Arc (Manifest V3 Service Worker).
* **`firefox-dist/`** — Configured for Mozilla Firefox and Firefox Developer Edition (Gecko ID + background scripts).

### Compile Both Distributions in One Step
```bash
npm run build
```
This single command runs `vite build` followed by the multi-browser packager. It outputs:
* `dist/` (Base web build)
* `chrome-dist/` (Manifest V3 Chrome bundle)
* `firefox-dist/` (Manifest V3 Firefox bundle)

You can also run `npm run build:chrome` or `npm run build:firefox` which execute the same unified compilation pipeline.

### Verification of Generated Folders
After running `npm run build`, your project directory will contain:
```
├── chrome-dist/                 # Load unpacked into chrome://extensions
│   ├── assets/                  # Bundled JS and CSS chunks
│   ├── icons/                   # Extension icons (16px, 48px, 128px PNGs + SVG)
│   ├── background.js            # Background service worker
│   ├── index.html               # Main dashboard & popup entrypoint
│   └── manifest.json            # Chrome MV3 manifest (service_worker: "background.js")
│
└── firefox-dist/                # Load unpacked into about:debugging
    ├── assets/                  # Bundled JS and CSS chunks
    ├── icons/                   # Extension icons
    ├── background.js            # Background script
    ├── index.html               # Main dashboard & popup entrypoint
    └── manifest.json            # Firefox MV3 manifest (with Gecko ID)
```

---

## 🌐 Testing in Google Chrome & Chromium

Follow these steps to load and test Browser Time as an unpacked extension in Google Chrome, Brave, Edge, or Arc:

### Step 1: Open the Extensions Management Page
1. In Google Chrome, navigate to:
   ```
   chrome://extensions
   ```
   *(For Microsoft Edge, use `edge://extensions`; for Brave, use `brave://extensions`)*

### Step 2: Enable Developer Mode
1. In the top-right corner of the page, toggle the **"Developer mode"** switch to **ON**.

### Step 3: Load Unpacked Extension
1. Click the **"Load unpacked"** button in the top-left toolbar.
2. In the file picker dialog, navigate to your project directory and select the **`chrome-dist`** folder.
3. Click **Select Folder** (or **Open**).

### Step 4: Verify and Pin
1. **Browser Time — Productivity & Time Tracking** will now appear in your list of active extensions with version `1.0.0`.
2. Click the puzzle icon (Extensions menu) in Chrome's top-right toolbar and click the **Pin** 📌 icon next to **Browser Time**.

### Step 5: Test Extension Popup & Dashboard
* **Extension Action Popup**: Click the **Browser Time** clock icon in the browser toolbar. The compact `360px × 520px` popup will open showing live session tracking, quick pause/play controls, and today's score.
* **Full-Page Dashboard**: In the popup, click **"Open Full Dashboard"**, or open a new tab and navigate to:
  ```
  chrome-extension://<YOUR_EXTENSION_ID>/index.html
  ```
  *(Replace `<YOUR_EXTENSION_ID>` with the ID shown on `chrome://extensions`)*.

### Step 6: Debugging & Hot Reloading
* To inspect the extension popup: Right-click inside the popup window and select **Inspect**.
* To inspect the background worker: On `chrome://extensions`, click **"service worker"** under the Browser Time card to open dedicated DevTools.
* To reload after making code changes: Run `npm run build`, then click the circular **Reload** (⟳) icon on the Browser Time card in `chrome://extensions`.

---

## 🦊 Testing in Mozilla Firefox

Firefox supports loading temporary add-ons directly or via the Mozilla `web-ext` development runner.

### Method A: Temporary Add-on via `about:debugging` (Recommended)

#### Step 1: Compile the Extension
```bash
npm run build
```
*(This automatically prepares `firefox-dist/` with the Firefox-compatible Gecko ID and background settings in `manifest.json`)*.

#### Step 2: Open Firefox Debugging Page
1. In Firefox's address bar, type:
   ```
   about:debugging#/runtime/this-firefox
   ```
   and press **Enter**.

#### Step 3: Load Temporary Add-on
1. Click the **"Load Temporary Add-on..."** button.
2. Navigate to your project's **`firefox-dist/`** folder.
3. Select either **`firefox-dist/manifest.json`** or **`firefox-dist/index.html`** and click **Open**.

#### Step 4: Test in Firefox
1. The **Browser Time** extension icon will appear on Firefox's toolbar.
2. Click the icon to inspect the extension popup.
3. Click **"Open Full Dashboard"** or visit `moz-extension://<EXTENSION_UUID>/index.html` to test the full analytics suite.

#### Step 5: Reloading in Firefox
* When you rebuild (`npm run build`), click the **Reload** button under the extension's entry on `about:debugging#/runtime/this-firefox`.
* Click **Inspect** to open Firefox's WebExtension Developer Tools (console, network, and storage inspection).

---

### Method B: Using Mozilla's `web-ext` CLI Runner

You can also run Firefox with the extension preloaded using Mozilla's official CLI tool without installing it globally:

```bash
# 1. Build the extensions
npm run build

# 2. Launch Firefox with web-ext targeting firefox-dist
npx web-ext run --source-dir firefox-dist/
```
`web-ext` launches a dedicated, sandboxed Firefox instance with the extension installed, featuring automatic reloads whenever files in `firefox-dist/` change.

---

## 📦 Creating & Installing a Firefox `.xpi` Package

Firefox `.xpi` files are standard ZIP archives whose root contains `manifest.json` (not wrapped inside an extra subfolder).

### Step 1: Build and Validate the Firefox Bundle

```bash
# 1. Clean old artifacts and compile fresh chrome-dist/ and firefox-dist/
npm run clean
npm run build

# 2. Validate against Mozilla Add-ons (AMO) linter rules
npx addons-linter firefox-dist/
```
Verify that `manifest.json` inside `firefox-dist/` passes with `0 errors` (including `browser_specific_settings.gecko.data_collection_permissions: { "required": ["none"] }`).

### Step 2: Create the `.xpi` File

Choose **either** Mozilla's `web-ext` CLI (recommended) or a standard ZIP command:

#### Option 1: Using `web-ext` (Recommended)
```bash
npx web-ext build --source-dir firefox-dist/ --artifacts-dir web-ext-artifacts/ --overwrite-dest
```
This outputs a `.zip` package inside `web-ext-artifacts/`. Rename it to `.xpi` if installing directly:
```bash
cp web-ext-artifacts/browser_time-1.0.0.zip web-ext-artifacts/browser-time-1.0.0.xpi
```

#### Option 2: Using `zip` (macOS / Linux)
> **Important**: Run `zip` from **inside** `firefox-dist/` so `manifest.json` sits at the root of the `.xpi` archive.
```bash
cd firefox-dist
zip -r ../browser-time-1.0.0.xpi .
cd ..
```

#### Option 3: Using PowerShell (Windows)
```powershell
Compress-Archive -Path .\firefox-dist\* -DestinationPath .\browser-time.zip -Force
Move-Item -Path .\browser-time.zip -Destination .\browser-time-1.0.0.xpi -Force
```

### Step 3: Sign `.xpi` for Standard Firefox Releases (AMO)

Standard Firefox releases require add-ons to be signed by Mozilla before permanent installation:

1. **Upload via AMO Developer Hub**:
   - Zip the contents of `firefox-dist/` (or upload `browser-time-1.0.0.xpi` / `browser_time-1.0.0.zip`) at [addons.mozilla.org/developers](https://addons.mozilla.org/developers/).
   - Submit for **Self-distribution** (unlisted signed `.xpi`) or **On this site** (public listing).
   - Download the signed `.xpi` file once AMO finishes validation.
2. **Or sign via CLI with `web-ext sign`**:
   ```bash
   npx web-ext sign \
     --source-dir firefox-dist/ \
     --artifacts-dir web-ext-artifacts/ \
     --api-key "<AMO_JWT_ISSUER>" \
     --api-secret "<AMO_JWT_SECRET>"
   ```

### Step 4: Install & Test the `.xpi` in Firefox

1. **For a Signed `.xpi` (All Firefox editions)**:
   - Open Firefox and press `Ctrl+O` (or `Cmd+O` on macOS), or drag and drop the `.xpi` file directly onto a Firefox tab.
   - Or open `about:addons` → click the gear icon ⚙️ → **Install Add-on From File...** → select your `.xpi` file → click **Add**.
2. **For an Unsigned `.xpi` (Local testing in Firefox Developer Edition / Nightly / ESR)**:
   - Navigate to `about:config` in the address bar and accept the risk prompt.
   - Search for `xpinstall.signatures.required` and toggle it to **`false`**.
   - Open `about:addons` → gear icon ⚙️ → **Install Add-on From File...** → select `browser-time-1.0.0.xpi`.
3. **Verify Tracking & Window-Close Behavior**:
   - Click the **Browser Time** toolbar icon to inspect live tracking.
   - Switch between tabs and verify active domain tracking updates.
   - Close the browser window (`Alt+F4` / `Cmd+W` / close button) and verify tracking stops immediately without accruing phantom idle/closed time.

---

## 🔌 Extension Architecture & Migration Guide

Browser Time is intentionally structured to decouple UI state management from browser APIs, allowing standard web testing during development and native extension execution in production.

### Data Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│               Browser Time React UI                    │
│   (Dashboard, Today, Websites, Tabs, History, Popup)   │
└──────────────────────────┬─────────────────────────────┘
                           │ Subscribes to changes
                           ▼
┌────────────────────────────────────────────────────────┐
│             useTimeTracking React Hook                 │
└──────────────────────────┬─────────────────────────────┘
                           │ Calls methods
                           ▼
┌────────────────────────────────────────────────────────┐
│      TimeTrackingService (services/timeTrackingService)│
│                                                        │
│  • Current session ticker                              │
│  • Domain aggregation & classification                 │
│  • Score calculations                                  │
│  • Pub/Sub notification listeners                      │
└───────────┬────────────────────────────────┬───────────┘
            │ Current: Mock / Local State    │ Production: Native Extension APIs
            ▼                                ▼
┌───────────────────────┐        ┌───────────────────────────────────┐
│  src/data/mockData.ts │        │  chrome.tabs / browser.tabs       │
│  (Realistic dataset)  │        │  chrome.idle / browser.idle       │
│                       │        │  chrome.storage.local             │
└───────────────────────┘        └───────────────────────────────────┘
```

### Transitioning from Mock Data to Live Browser APIs

When connecting real browsing activity:

1. **Active Tab Tracking**:
   In `public/background.js` or `src/services/browserApiAdapter.ts`, listen to tab events:
   ```ts
   // Listen for active tab switch
   chrome.tabs.onActivated.addListener(async (activeInfo) => {
     const tab = await chrome.tabs.get(activeInfo.tabId);
     if (tab?.url) {
       const domain = new URL(tab.url).hostname;
       timeTrackingService.recordTabSwitch(domain, tab.title);
     }
   });

   // Listen for URL changes
   chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
     if (changeInfo.url) {
       const domain = new URL(changeInfo.url).hostname;
       timeTrackingService.recordUrlChange(domain, tab.title);
     }
   });
   ```

2. **Idle Detection**:
   Use `chrome.idle` to pause tracking when the user steps away:
   ```ts
   chrome.idle.setDetectionInterval(60); // 60 seconds
   chrome.idle.onStateChanged.addListener((state) => {
     if (state === 'idle' || state === 'locked') {
       timeTrackingService.setTrackingPaused(true);
     } else if (state === 'active') {
       timeTrackingService.setTrackingPaused(false);
     }
   });
   ```

3. **Persistent Storage**:
   Swap in `chrome.storage.local` inside `src/services/timeTrackingService.ts`:
   ```ts
   // Save state
   await chrome.storage.local.set({ browserTimeData: this.serialize() });

   // Load state on startup
   const result = await chrome.storage.local.get(['browserTimeData']);
   if (result.browserTimeData) {
     this.hydrate(result.browserTimeData);
   }
   ```

---

## 📁 Project Directory Structure

```
├── public/
│   ├── background.js            # Background service worker for extension
│   ├── icons/                   # Chrome & Firefox extension icons (16, 48, 128px)
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   ├── icon-128.png
│   │   └── icon.svg
│   ├── manifest.json            # Chrome MV3 manifest template
│   └── manifest.firefox.json    # Firefox MV3 manifest template
├── src/
│   ├── components/
│   │   ├── charts/              # Recharts visualizations (Heatmap, Area, Donut, Bar)
│   │   │   ├── ActivityHeatmap.tsx
│   │   │   ├── HourlyActivityChart.tsx
│   │   │   ├── ProductivityDonut.tsx
│   │   │   └── WeeklyComparisonChart.tsx
│   │   ├── common/              # Modals, badges, stat cards, progress bars
│   │   │   ├── Badge.tsx
│   │   │   ├── ExtensionPopupModal.tsx
│   │   │   ├── PrivacyModal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── TrackingStatusModal.tsx
│   │   ├── dashboard/           # Top websites card, score breakdown card
│   │   ├── layout/              # Sidebar, Header, Responsive Shell
│   │   ├── tabs/                # Open tab inspection card
│   │   ├── today/               # Detailed timeline feed
│   │   └── websites/            # Searchable, filterable websites data table
│   ├── data/
│   │   └── mockData.ts          # Comprehensive realistic browsing seed data
│   ├── hooks/
│   │   └── useTimeTracking.ts   # Custom React hook for live telemetry
│   ├── pages/                   # Route views (Dashboard, Today, Websites, Tabs, etc.)
│   ├── services/
│   │   └── timeTrackingService.ts # Time tracking data abstraction service
│   ├── types/
│   │   └── index.ts             # TypeScript domain definitions
│   ├── utils/
│   │   └── formatters.ts        # Time string formatters, color mappers
│   ├── App.tsx                  # HashRouter application root
│   ├── index.css                # Tailwind CSS v4 styling & dark theme tokens
│   └── main.tsx                 # React DOM mount point
├── scripts/
│   └── generate-icons.js        # Script generating pixel-perfect PNG icon assets
├── index.html                   # HTML entrypoint
├── package.json                 # Project configuration & build scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite bundler configuration (relative base for MV3)
```

---

## 🛠️ Available npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite --port=3000 --host=0.0.0.0` | Starts local development server on port 3000 |
| `npm run build` | `vite build && node scripts/build-extensions.js` | Compiles app and generates both `chrome-dist/` and `firefox-dist/` |
| `npm run build:chrome` | `vite build && node scripts/build-extensions.js` | Alias to build `chrome-dist/` and `firefox-dist/` |
| `npm run build:firefox` | `vite build && node scripts/build-extensions.js` | Alias to build `chrome-dist/` and `firefox-dist/` |
| `npm run preview` | `vite preview` | Previews the compiled `dist/` web output locally |
| `npm run lint` | `tsc --noEmit` | Runs TypeScript type checking |
| `npm run clean` | `rm -rf dist chrome-dist firefox-dist server.js` | Deletes compiled output directories |

---

## ❓ Troubleshooting & FAQ

### 1. `Manifest file is missing or unreadable`
* Ensure you ran `npm run build` prior to loading the extension.
* In Chrome, click **"Load unpacked"** and select the **`chrome-dist`** directory (not `dist` or the project root).
* In Firefox `about:debugging`, select `firefox-dist/manifest.json`.

### 2. Assets (CSS or JS) fail to load (404 error)
* Browser extensions do not serve files from the root domain `/`. The `vite.config.ts` in this project is pre-configured with `base: './'` so all script and stylesheet references are relative (`./assets/...`).
* Both `chrome-dist/` and `firefox-dist/` have relative asset references and load immediately.
* If you customize `vite.config.ts`, ensure `base: './'` remains in place.

### 3. Navigation causes 404 in the extension
* Traditional browser routing with `BrowserRouter` (HTML5 history) expects server-side fallback rules (e.g. rewriting all requests to `/index.html`).
* Browser Time uses `HashRouter` (`#/dashboard`, `#/today`, etc.), ensuring instant client-side route transitions in extension popups and standalone extension tabs without requiring server rewrites.

### 4. Temporary add-on disappears when Firefox is closed
* Firefox automatically unloads temporary add-ons when the browser restarts. This is standard Firefox security behavior for unpacked extensions.
* To reload it, simply revisit `about:debugging#/runtime/this-firefox` and click **"Load Temporary Add-on..."** again.
* To keep it permanently installed for personal use, you can package it with `npx web-ext build --source-dir dist/` and sign it through the Mozilla Add-on Developer Hub or install it in Firefox Developer Edition / Nightly with `xpinstall.signatures.required` disabled.

---

## 📄 License

MIT License. Built for **Browser Time**.
