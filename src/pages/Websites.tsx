import React from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { WebsiteTable } from '../components/websites/WebsiteTable';
import { Globe, CheckCircle2, AlertOctagon, ShieldBan } from 'lucide-react';

export const Websites: React.FC = () => {
  const service = useTimeTracking();
  const websites = service.getWebsites();

  const productiveCount = websites.filter((w) => w.category === 'productive').length;
  const distractingCount = websites.filter((w) => w.category === 'distracting').length;
  const excludedCount = websites.filter((w) => w.excluded).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
              <Globe className="w-4 h-4" />
              <span>Domain Analytics &amp; Classification</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Website Analytics
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Analyze time distribution and customize productivity classifications for every visited domain
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Total Domains
              </div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {websites.length}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Productive
              </div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                {productiveCount}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="text-[10px] text-rose-400 uppercase font-semibold flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" />
                Distracting
              </div>
              <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                {distractingCount}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <ShieldBan className="w-3 h-3 text-amber-400" />
                Excluded
              </div>
              <div className="text-base font-bold text-slate-300 font-mono mt-0.5">
                {excludedCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <WebsiteTable websites={websites} />
    </div>
  );
};
