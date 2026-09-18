import React, { useState } from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { TabCard } from '../components/tabs/TabCard';
import { Layers, Radio, Cpu, Search, Sparkles } from 'lucide-react';

export const Tabs: React.FC = () => {
  const service = useTimeTracking();
  const tabs = service.getTabs();
  const [search, setSearch] = useState('');

  const activeTab = tabs.find((t) => t.isActive);
  const totalMemory = tabs.reduce((acc, t) => acc + (t.memoryUsageMb || 0), 0);

  const filteredTabs = tabs.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
              <Layers className="w-4 h-4" />
              <span>Active Tab Telemetry</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Open &amp; Tracked Browser Tabs
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Monitoring active foreground duration, memory footprints, and background tab state
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Open Tabs
              </div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {tabs.length}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3" />
                Active Focus
              </div>
              <div className="text-xs font-bold text-emerald-300 font-mono mt-0.5 truncate max-w-[130px]">
                {activeTab?.domain || 'None'}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-400" />
                Memory Footprint
              </div>
              <div className="text-base font-bold text-sky-400 font-mono mt-0.5">
                {totalMemory} MB
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search open tabs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Click "Focus" to simulate switching tabs</span>
        </div>
      </div>

      {/* Tabs List */}
      <div className="space-y-3">
        {filteredTabs.map((tab) => (
          <TabCard key={tab.id} tab={tab} />
        ))}
      </div>
    </div>
  );
};
