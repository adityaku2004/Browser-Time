import React, { useState } from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { ProductivityCategory } from '../types';
import {
  Settings as SettingsIcon,
  Sliders,
  Globe,
  Palette,
  Database,
  ShieldCheck,
  Plus,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  Check,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const service = useTimeTracking();
  const settings = service.getSettings();
  const websites = service.getWebsites();

  const [activeTab, setActiveTab] = useState<'tracking' | 'classification' | 'appearance' | 'data' | 'privacy'>('tracking');
  const [domainSearch, setDomainSearch] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newCategory, setNewCategory] = useState<ProductivityCategory>('productive');
  const [newExcludedDomain, setNewExcludedDomain] = useState('');
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      version: '2.4.0',
      settings,
      websites,
      history: service.getDailyHistory(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser-time-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Data exported successfully!');
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    service.addDomain(newDomain, newCategory);
    setNewDomain('');
    showFeedback(`Domain added under ${newCategory}`);
  };

  const handleAddExcluded = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExcludedDomain.trim()) return;
    service.toggleExcludeDomain(newExcludedDomain.trim().toLowerCase());
    setNewExcludedDomain('');
    showFeedback('Domain added to exclusion list');
  };

  const filteredWebsites = websites.filter(
    (w) =>
      w.domain.toLowerCase().includes(domainSearch.toLowerCase()) ||
      w.name.toLowerCase().includes(domainSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
              <SettingsIcon className="w-4 h-4" />
              <span>Configuration &amp; Controls</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Extension Settings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Fine-tune tracking thresholds, domain classifications, export telemetry, and privacy rules
            </p>
          </div>

          {feedbackMessage && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80">
        {[
          { id: 'tracking', label: 'Tracking Engine', icon: Sliders },
          { id: 'classification', label: 'Website Categories', icon: Globe },
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'data', label: 'Data & Backup', icon: Database },
          { id: 'privacy', label: 'Privacy & Blacklist', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Tracking Engine */}
      {activeTab === 'tracking' && (
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Tracking Rules</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control when and how tab timers record active browsing time.
            </p>
          </div>

          <div className="space-y-4">
            {/* Enable Tracking Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Enable Time Tracking</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Master switch to capture foreground tab duration.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  service.updateSettings({ enableTracking: !settings.enableTracking })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.enableTracking ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.enableTracking ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Inactive Tabs */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Track Inactive / Background Tabs</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Record duration even when tab is in background with active media playing.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  service.updateSettings({ trackInactiveTabs: !settings.trackInactiveTabs })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.trackInactiveTabs ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.trackInactiveTabs ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Track Idle Time */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Track Idle Time Detection</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Automatically pause timers when mouse/keyboard inactivity is detected.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  service.updateSettings({ trackIdleTime: !settings.trackIdleTime })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.trackIdleTime ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.trackIdleTime ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Idle Timeout Selector */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Idle Timeout Threshold</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Time of continuous user inactivity before pausing active tracking.
                </div>
              </div>
              <select
                value={settings.idleTimeoutMinutes}
                onChange={(e) =>
                  service.updateSettings({ idleTimeoutMinutes: parseInt(e.target.value, 10) })
                }
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
              >
                <option value="2">2 Minutes</option>
                <option value="5">5 Minutes (Recommended)</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>

            {/* Start tracking automatically */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Start Tracking Automatically on Browser Launch</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Resume active timer whenever Chrome or Firefox starts up.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  service.updateSettings({
                    startTrackingAutomatically: !settings.startTrackingAutomatically,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.startTrackingAutomatically ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.startTrackingAutomatically ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Website Categories */}
      {activeTab === 'classification' && (
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Website Classification Rules</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Assign domains to Productive, Neutral, or Distracting tiers to calibrate your score.
              </p>
            </div>

            <div className="w-full sm:w-60">
              <input
                type="text"
                placeholder="Search domains..."
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          {/* Add New Domain Form */}
          <form
            onSubmit={handleAddDomain}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="text"
              placeholder="Add domain (e.g., gitlab.com, twitch.tv)"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-400"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as ProductivityCategory)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
            >
              <option value="productive">Productive</option>
              <option value="neutral">Neutral</option>
              <option value="distracting">Distracting</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Classification</span>
            </button>
          </form>

          {/* Categorized List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Productive Column */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Productive Domains
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {websites.filter((w) => w.category === 'productive').length}
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredWebsites
                  .filter((w) => w.category === 'productive')
                  .map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                    >
                      <span className="font-mono text-slate-200 truncate">{site.domain}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <select
                          value={site.category}
                          onChange={(e) =>
                            service.updateWebsiteCategory(
                              site.domain,
                              e.target.value as ProductivityCategory
                            )
                          }
                          className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5"
                        >
                          <option value="productive">Prod</option>
                          <option value="neutral">Neut</option>
                          <option value="distracting">Dist</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => service.removeDomain(site.domain)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Neutral Column */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Neutral Domains
                </span>
                <span className="text-xs font-mono text-amber-400">
                  {websites.filter((w) => w.category === 'neutral').length}
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredWebsites
                  .filter((w) => w.category === 'neutral')
                  .map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                    >
                      <span className="font-mono text-slate-200 truncate">{site.domain}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <select
                          value={site.category}
                          onChange={(e) =>
                            service.updateWebsiteCategory(
                              site.domain,
                              e.target.value as ProductivityCategory
                            )
                          }
                          className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5"
                        >
                          <option value="productive">Prod</option>
                          <option value="neutral">Neut</option>
                          <option value="distracting">Dist</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => service.removeDomain(site.domain)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Distracting Column */}
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20 mb-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Distracting Domains
                </span>
                <span className="text-xs font-mono text-rose-400">
                  {websites.filter((w) => w.category === 'distracting').length}
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredWebsites
                  .filter((w) => w.category === 'distracting')
                  .map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
                    >
                      <span className="font-mono text-slate-200 truncate">{site.domain}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <select
                          value={site.category}
                          onChange={(e) =>
                            service.updateWebsiteCategory(
                              site.domain,
                              e.target.value as ProductivityCategory
                            )
                          }
                          className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5"
                        >
                          <option value="productive">Prod</option>
                          <option value="neutral">Neut</option>
                          <option value="distracting">Dist</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => service.removeDomain(site.domain)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Appearance */}
      {activeTab === 'appearance' && (
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Visual Appearance &amp; Theming</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize contrast and density for your workspace environment.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Dark Mode (Default)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  High-contrast deep charcoal and near-black canvas engineered for eye safety.
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/30">
                Always Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Compact High-Density Mode</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Reduces padding and card heights to fit maximum statistical tables on screen.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  service.updateSettings({ compactMode: !settings.compactMode })
                }
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.compactMode ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.compactMode ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div>
                <div className="text-xs font-semibold text-white">Accent Color Palette</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Key highlight color for primary indicators and gauges.
                </div>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Electric Blue', hex: '#38bdf8' },
                  { name: 'Emerald', hex: '#10b981' },
                  { name: 'Purple', hex: '#a855f7' },
                  { name: 'Amber', hex: '#f59e0b' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => {
                      service.updateSettings({ accentColor: color.hex });
                      showFeedback(`Accent changed to ${color.name}`);
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      settings.accentColor === color.hex ? 'scale-125 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Data & Backup */}
      {activeTab === 'data' && (
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Data Management &amp; Storage</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Export, import, or purge local time-tracking records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Export Telemetry</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Download all your browsing durations, daily scores, and custom domain classifications as JSON.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Import Backup</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Restore previously saved time-tracking statistics and website classifications from file.
                </p>
              </div>
              <label className="mt-4 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={() => showFeedback('Backup data imported successfully!')}
                />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reset Statistics</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Clear all accumulated browsing hours, tab timelines, and daily logs for a fresh restart.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setClearModalOpen(true)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Browsing Stats</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Privacy & Blacklist */}
      {activeTab === 'privacy' && (
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white">Privacy Architecture &amp; Domain Blacklist</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Excluded domains are instantly bypassed: no timer, no history, zero tracking.
            </p>
          </div>

          {/* Form to exclude domain */}
          <form
            onSubmit={handleAddExcluded}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="text"
              placeholder="e.g. chase.com, localhost, internal.corp"
              value={newExcludedDomain}
              onChange={(e) => setNewExcludedDomain(e.target.value)}
              className="flex-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Exclude Domain</span>
            </button>
          </form>

          {/* Excluded Domains List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Currently Excluded Websites ({settings.excludedDomains.length})
            </div>
            {settings.excludedDomains.map((domain) => (
              <div
                key={domain}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-white font-semibold">{domain}</span>
                  <span className="text-[10px] text-slate-400">· Excluded from tracking</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    service.toggleExcludeDomain(domain);
                    showFeedback(`Removed ${domain} from exclusion list`);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove from exclusion list"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing Stats */}
      {clearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-rose-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Clear Browsing Statistics?</h3>
                <p className="text-xs text-slate-400">This will reset all accumulated timers to zero.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to clear your statistics? This action cannot be undone. Custom classifications and preferences will remain intact.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setClearModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  service.clearBrowsingStats();
                  setClearModalOpen(false);
                  showFeedback('All statistics cleared successfully.');
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
