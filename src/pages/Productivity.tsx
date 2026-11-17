import React from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { formatDuration } from '../utils/formatters';
import { ProductivityScoreCard } from '../components/dashboard/ProductivityScoreCard';
import { ProductivityDonut } from '../components/charts/ProductivityDonut';
import {
  Activity,
  Target,
  Flame,
  Zap,
  Repeat,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';

export const Productivity: React.FC = () => {
  const service = useTimeTracking();
  const summary = service.getDailySummary();
  const scoreFactors = service.getScoreFactors();
  const topSites = service.getTopWebsites(1);
  const history = service.getDailyHistory();

  // Daily goal calculation (target 4 hours = 14400 seconds)
  const targetSeconds = 14400;
  const goalProgress = Math.min(100, Math.round((summary.productiveTime / targetSeconds) * 100));

  // Compute active streak (consecutive days with totalTime > 0)
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].totalTime > 0) streak += 1;
    else if (i !== history.length - 1) break;
  }

  // Top work session
  const topProductiveSite = topSites.find((s) => s.category === 'productive');

  // Context switch rate
  const switchRate =
    summary.totalTime > 0
      ? `${(summary.contextSwitches / (summary.totalTime / 3600)).toFixed(1)} / hr`
      : '0 / hr';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Activity className="w-4 h-4" />
              <span>Deep Work Intelligence</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Productivity Index &amp; Focus Metrics
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Holistic assessment of uninterrupted work, tab discipline, and task switching
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Active Streak
              </div>
              <div className="text-lg font-extrabold text-orange-400 font-mono mt-0.5">
                {streak} {streak === 1 ? 'Day' : 'Days'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[110px]">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                Focus Score
              </div>
              <div className="text-lg font-extrabold text-sky-400 font-mono mt-0.5">
                {summary.productivityScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Goal & Targets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Goal 1: Daily Productive Goal */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Daily Productive Goal
            </span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">
              {formatDuration(summary.productiveTime)}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {goalProgress}% of 4h goal
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>
              {goalProgress >= 100
                ? 'Daily 4-hour target achieved!'
                : `${formatDuration(Math.max(0, targetSeconds - summary.productiveTime))} remaining to reach daily goal`}
            </span>
          </div>
        </div>

        {/* Goal 2: Top Productive Session */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Top Productive Domain
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">
              {topProductiveSite ? formatDuration(topProductiveSite.timeSpent) : '0m'}
            </span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 truncate max-w-[120px]">
              {topProductiveSite ? topProductiveSite.name : 'None yet'}
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{
                width: `${
                  topProductiveSite && summary.productiveTime > 0
                    ? Math.round((topProductiveSite.timeSpent / summary.productiveTime) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>
              {topProductiveSite
                ? `Primary focus spent on ${topProductiveSite.domain}`
                : 'Browse productive domains to log sessions'}
            </span>
          </div>
        </div>

        {/* Goal 3: Attention Fragmentation */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Context Switches
            </span>
            <Repeat className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">
              {summary.contextSwitches}
            </span>
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
              {switchRate}
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, summary.contextSwitches * 3)}%` }}
            />
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span>●</span>
            <span>
              {summary.contextSwitches > 0
                ? `${summary.contextSwitches} tab transitions recorded today`
                : 'No tab switches logged today'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductivityScoreCard
          score={summary.productivityScore}
          factors={scoreFactors}
        />

        <ProductivityDonut
          productiveSeconds={summary.productiveTime}
          distractingSeconds={summary.distractingTime}
          neutralSeconds={summary.neutralTime}
          totalSeconds={summary.totalTime}
        />
      </div>
    </div>
  );
};
