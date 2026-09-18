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

  // Daily goal calculation (target 4 hours = 14400 seconds)
  const targetSeconds = 14400;
  const goalProgress = Math.min(150, Math.round((summary.productiveTime / targetSeconds) * 100));

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
              Holistic assessment of uninterrupted coding, tab discipline, and task switching
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Focus Streak
              </div>
              <div className="text-lg font-extrabold text-orange-400 font-mono mt-0.5">
                5 Days
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                Monthly Rank
              </div>
              <div className="text-lg font-extrabold text-sky-400 font-mono mt-0.5">
                Top 12%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Goal & Targets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Goal 1 */}
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
              style={{ width: `${Math.min(100, goalProgress)}%` }}
            />
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Target achieved 18 minutes ahead of schedule</span>
          </div>
        </div>

        {/* Goal 2: Longest Uninterrupted Session */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Longest Deep Work Session
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">
              1h 18m
            </span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              GitHub + Figma
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full w-3/4" />
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Occurred between 10:02 AM - 11:20 AM</span>
          </div>
        </div>

        {/* Goal 3: Attention Fragmentation */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Context Switches
            </span>
            <Repeat className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">
              {summary.contextSwitches}
            </span>
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
              ~6.7 / hour
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full w-2/5" />
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-rose-400">●</span>
            <span>Switch rate is 14% lower than last Thursday</span>
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
