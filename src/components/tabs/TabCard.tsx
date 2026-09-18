import React from 'react';
import { TabActivity } from '../../types';
import { formatDuration } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { ExternalLink, X, Radio, Cpu } from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';

interface TabCardProps {
  tab: TabActivity;
}

export const TabCard: React.FC<TabCardProps> = ({ tab }) => {
  const service = useTimeTracking();

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all duration-200 border ${
        tab.isActive
          ? 'bg-gradient-to-r from-slate-900/90 via-sky-950/30 to-slate-900/90 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
          : 'bg-slate-900/60 backdrop-blur-xl border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Favicon & Title & Domain */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="relative w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
            <img
              src={`https://www.google.com/s2/favicons?domain=${tab.domain}&sz=64`}
              alt={tab.domain}
              className="w-4 h-4 rounded-xs"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {tab.isActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white truncate">
                {tab.title}
              </span>
              {tab.isActive && (
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-spin" />
                  Currently Active
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
              <span className="text-sky-400 font-medium">{tab.domain}</span>
              <span>·</span>
              <span>Last: {tab.lastActive}</span>
              {tab.memoryUsageMb && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Cpu className="w-3 h-3" />
                    {tab.memoryUsageMb} MB
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Duration, Category & Action buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 shrink-0">
          <div className="text-right">
            <div className="text-sm font-extrabold text-white font-mono">
              {formatDuration(tab.duration)}
            </div>
            <div className="text-[10px] text-slate-400">Tracked Time</div>
          </div>

          <Badge category={tab.category} size="sm" />

          <div className="flex items-center gap-1 ml-2">
            {!tab.isActive && (
              <button
                type="button"
                onClick={() => service.activateTab(tab.id)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Simulate switching to this tab"
              >
                Focus
              </button>
            )}

            <a
              href={tab.url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Open link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => service.closeTab(tab.id)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
              title="Close tab"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
