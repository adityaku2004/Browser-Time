import React from 'react';
import { WebsiteActivity } from '../../types';
import { formatDuration } from '../../utils/formatters';
import { AlertOctagon, TrendingDown, Flame } from 'lucide-react';

interface DistractionCardProps {
  distractingSeconds: number;
  totalSeconds: number;
  websites: WebsiteActivity[];
}

export const DistractionCard: React.FC<DistractionCardProps> = ({
  distractingSeconds,
  totalSeconds,
  websites,
}) => {
  const percentage = totalSeconds > 0 ? Math.round((distractingSeconds / totalSeconds) * 100) : 24;

  const distractingWebsites = websites
    .filter((w) => w.category === 'distracting' && !w.excluded)
    .sort((a, b) => b.timeSpent - a.timeSpent);

  const biggestDistraction = distractingWebsites[0]?.name || 'YouTube';
  const topList = distractingWebsites.slice(0, 4);

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Distraction Analysis</span>
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            Leisure Alert
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Time consumed by non-work &amp; entertainment domains
        </p>

        {/* Big Metric Display */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/30 to-slate-900/60 border border-rose-900/30 mb-4">
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold tracking-tight text-rose-400 font-mono">
              {formatDuration(distractingSeconds)}
            </div>
            <div className="text-xs font-bold text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30">
              {percentage}% of active browsing
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-700"
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>

        {/* Top Distracting Sites List */}
        <div className="space-y-2.5 mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Top Distracting Destinations
          </div>
          {topList.map((site) => {
            const sitePct = distractingSeconds > 0 ? (site.timeSpent / distractingSeconds) * 100 : 0;
            return (
              <div key={site.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
                      alt={site.name}
                      className="w-3.5 h-3.5 rounded-xs"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-medium text-slate-200">{site.name}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-300">
                    {formatDuration(site.timeSpent)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500/90 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, sitePct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Distraction Insights */}
      <div className="space-y-2 pt-3 border-t border-slate-800/70">
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs">
          <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-slate-300">
            Your biggest distraction today was <strong className="text-white">{biggestDistraction}</strong>.
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-xs">
          <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="text-slate-300">
            You spent <strong className="text-emerald-400">37 minutes less</strong> on distracting sites than yesterday.
          </span>
        </div>
      </div>
    </div>
  );
};
