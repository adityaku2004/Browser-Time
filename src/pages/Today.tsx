import React from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { formatDuration } from '../utils/formatters';
import { ActivityTimeline } from '../components/today/ActivityTimeline';
import { Clock, CheckCircle2, Coffee, Repeat, Calendar } from 'lucide-react';

export const Today: React.FC = () => {
  const service = useTimeTracking();
  const summary = service.getDailySummary();
  const timeline = service.getTimeline();

  return (
    <div className="space-y-6">
      {/* Today Header Hero Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Chronological Activity Log</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Today's Browsing Timeline
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time sequence of domain sessions, focus blocks, and idle breaks
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" />
                Active Time
              </div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {formatDuration(summary.totalTime)}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Productive
              </div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                {formatDuration(summary.productiveTime)}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                Idle Break
              </div>
              <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                {formatDuration(summary.idleTime)}
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Repeat className="w-3 h-3 text-rose-400" />
                Domain Switches
              </div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {summary.contextSwitches}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <ActivityTimeline items={timeline} />
    </div>
  );
};
