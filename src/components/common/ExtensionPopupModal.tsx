import React from 'react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { formatDuration, formatTimer } from '../../utils/formatters';
import { Clock, Pause, Play, ShieldBan, ExternalLink, X, Activity, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExtensionPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionPopupModal: React.FC<ExtensionPopupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const service = useTimeTracking();
  const navigate = useNavigate();
  const status = service.getTrackingStatus();

  if (!isOpen) return null;

  const total = status.todayTotalSeconds || 1;
  const prodPct = Math.round((status.todayProductiveSeconds / total) * 100);
  const distPct = Math.round((status.todayDistractingSeconds / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative flex flex-col items-center">
        {/* Helper preview banner */}
        <div className="text-[11px] font-mono text-sky-400 mb-2 flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full">
          <span>Browser Action Extension Popup Mode (360px × 500px)</span>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* The Exact 360x500 Extension Popup Container */}
        <div
          className="w-[360px] h-[520px] rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl shadow-black p-4 flex flex-col justify-between overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-bold text-sm text-white tracking-tight">
                  Browser Time
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 ${
                    status.isActive
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  {status.isActive ? 'Active' : 'Paused'}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Active Site Live Tracker */}
            <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  Current Site
                </span>
                <span className="font-mono font-bold text-white text-xs">
                  {status.currentDomain}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-slate-400">Current session:</span>
                <span className="font-mono text-base font-extrabold text-emerald-400">
                  {formatTimer(status.currentSessionSeconds)}
                </span>
              </div>
            </div>

            {/* Today's Usage & Productivity Score */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase font-semibold text-slate-400">
                  Today's Usage
                </div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {formatDuration(status.todayTotalSeconds)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">24 websites visited</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center justify-between">
                  <span>Score</span>
                  <Activity className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {status.todayScore}{' '}
                  <span className="text-[10px] text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1">
                  Good focus
                </div>
              </div>
            </div>

            {/* Compact Breakdown Bars */}
            <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-medium">Productive</span>
                  <span className="font-mono text-slate-200">
                    {formatDuration(status.todayProductiveSeconds)} ({prodPct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${prodPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-400 font-medium">Distracting</span>
                  <span className="font-mono text-slate-200">
                    {formatDuration(status.todayDistractingSeconds)} ({distPct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${distPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  status.isActive ? service.pauseTracking() : service.resumeTracking()
                }
                className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {status.isActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => service.excludeCurrentWebsite()}
                className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-rose-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldBan className="w-3.5 h-3.5 text-rose-400" />
                <span>Exclude Site</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/dashboard');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <span>Open Full Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
