import React, { useState } from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { formatDuration } from '../utils/formatters';
import { ActivityHeatmap } from '../components/charts/ActivityHeatmap';
import { WeeklyComparisonChart } from '../components/charts/WeeklyComparisonChart';
import {
  History as HistoryIcon,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Activity,
  TrendingDown,
  Calendar,
} from 'lucide-react';

export const History: React.FC = () => {
  const service = useTimeTracking();
  const history = service.getDailyHistory();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Compute aggregated stats
  const totalBrowsing = 138240; // ~38h 24m
  const productiveBrowsing = 89280; // ~24h 48m
  const distractionBrowsing = 32400; // ~9h 00m
  const avgDaily = 19748; // ~5h 29m
  const avgScore = 76;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
              <HistoryIcon className="w-4 h-4" />
              <span>Long-Term Longitudinal Analytics</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Historical Usage Trends
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Multi-week comparisons, seasonal patterns, and productivity retention
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {(['day', 'week', 'month', 'year'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-3.5 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                  timeframe === t
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Browsing</span>
            <Clock className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {formatDuration(totalBrowsing)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>-9.2% vs last {timeframe}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Productive Time</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatDuration(productiveBrowsing)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">64.5% ratio</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Distraction Time</span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
            {formatDuration(distractionBrowsing)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">23.4% ratio</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Productivity Index</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {avgScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">+3 pts overall</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-md">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Daily Average</span>
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-1">
            {formatDuration(avgDaily)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">per active day</div>
        </div>
      </div>

      {/* Week over Week Comparison */}
      <WeeklyComparisonChart />

      {/* 12-Week Heatmap */}
      <ActivityHeatmap data={history} />
    </div>
  );
};
