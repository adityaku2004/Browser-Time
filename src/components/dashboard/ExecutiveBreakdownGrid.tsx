import React, { useState } from 'react';
import { MoreHorizontal, SquarePen, Check, X, Globe, Layers, Folder } from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { formatDuration } from '../../utils/formatters';

export const ExecutiveBreakdownGrid: React.FC = () => {
  const service = useTimeTracking();
  const websites = service.getWebsites();
  const summary = service.getDailySummary();
  const total = summary.totalTime;

  // 1. Categories Breakdown (Derived from real tracking data)
  const categoryData = React.useMemo(() => {
    if (total === 0) return [];

    let prod = 0;
    let dist = 0;
    let neut = 0;

    websites.forEach((w) => {
      if (w.excluded) return;
      if (w.category === 'productive') prod += w.timeSpent;
      else if (w.category === 'distracting') dist += w.timeSpent;
      else neut += w.timeSpent;
    });

    const list = [];
    if (prod > 0) {
      list.push({
        label: 'Productive Work',
        duration: formatDuration(prod),
        percent: Math.round((prod / total) * 100),
        color: '#38BDF8',
      });
    }
    if (dist > 0) {
      list.push({
        label: 'Distraction & Leisure',
        duration: formatDuration(dist),
        percent: Math.round((dist / total) * 100),
        color: '#F43F5E',
      });
    }
    if (neut > 0) {
      list.push({
        label: 'Neutral Browsing',
        duration: formatDuration(neut),
        percent: Math.round((neut / total) * 100),
        color: '#F59E0B',
      });
    }

    return list;
  }, [websites, total]);

  // 2. Apps & Websites Breakdown (Top 4 websites by time)
  const appData = React.useMemo(() => {
    return websites
      .filter((w) => !w.excluded && w.timeSpent > 0)
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 4)
      .map((w) => ({
        label: w.name,
        domain: w.domain,
        duration: formatDuration(w.timeSpent),
        percent: total > 0 ? Math.round((w.timeSpent / total) * 100) : 0,
        color: w.category === 'productive' ? '#38BDF8' : w.category === 'distracting' ? '#F43F5E' : '#4EECD3',
      }));
  }, [websites, total]);

  // 3. Domains / Projects (Ranked by time)
  const projectData = React.useMemo(() => {
    return websites
      .filter((w) => !w.excluded && w.timeSpent > 0)
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 4)
      .map((w) => ({
        label: w.domain,
        duration: formatDuration(w.timeSpent),
        percent: total > 0 ? Math.round((w.timeSpent / total) * 100) : 0,
        color: '#38BDF8',
      }));
  }, [websites, total]);

  // Helper circular ring component
  const CircularProgressRing = ({ percent, color }: { percent: number; color: string }) => {
    const radius = 10;
    const c = 2 * Math.PI * radius; // ~62.8
    const dash = (percent / 100) * c;
    return (
      <svg className="w-6 h-6 -rotate-90 shrink-0" viewBox="0 0 28 28">
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke="#2B2F3A"
          strokeWidth="3"
        />
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {/* 1. Categories Card */}
      <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Categories</span>
            </h3>
          </div>

          {categoryData.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No category data recorded today.
            </div>
          ) : (
            <div className="space-y-3.5">
              {categoryData.map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center justify-between text-xs sm:text-sm p-1.5 -mx-1.5 rounded-xl hover:bg-[#23262F]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-slate-300 w-9 text-left">
                      {cat.percent}%
                    </span>
                    <CircularProgressRing percent={cat.percent} color={cat.color} />
                    <span className="font-medium text-slate-200">
                      {cat.label}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-slate-400">
                    {cat.duration}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Apps & Websites Card */}
      <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#4EECD3]" />
              <span>Apps &amp; Websites</span>
            </h3>
          </div>

          {appData.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No websites visited today yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {appData.map((app) => (
                <div
                  key={app.label}
                  className="flex items-center justify-between text-xs sm:text-sm p-1.5 -mx-1.5 rounded-xl hover:bg-[#23262F]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-medium text-slate-300 w-9 text-left shrink-0">
                      {app.percent}%
                    </span>
                    <CircularProgressRing percent={app.percent} color={app.color} />
                    <span className="font-medium text-slate-200 truncate">
                      {app.label}
                    </span>
                  </div>
                  <span className="font-mono font-medium text-slate-400 shrink-0">
                    {app.duration}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Projects & Domains Card */}
      <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Folder className="w-4 h-4 text-sky-400" />
              <span>Active Domains</span>
            </h3>
          </div>

          {projectData.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No domain activity recorded yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {projectData.map((proj) => (
                <div
                  key={proj.label}
                  className="flex items-center justify-between text-xs sm:text-sm p-1.5 -mx-1.5 rounded-xl hover:bg-[#23262F]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-3">
                    <span className="font-mono font-medium text-slate-300 w-9 text-left shrink-0">
                      {proj.percent}%
                    </span>
                    <span className="font-medium text-slate-200 truncate w-24">
                      {proj.label}
                    </span>
                    {/* Linear Progress Bar */}
                    <div className="flex-1 h-2 rounded-full bg-[#23262F] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${proj.percent}%`,
                          backgroundColor: proj.color,
                        }}
                      />
                    </div>
                  </div>

                  <span className="font-mono font-medium text-slate-400 shrink-0">
                    {proj.duration}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
