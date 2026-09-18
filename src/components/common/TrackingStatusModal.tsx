import React from 'react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { formatDuration, formatTimer } from '../../utils/formatters';
import { Play, Pause, ShieldBan, X, Globe, Clock, CheckCircle } from 'lucide-react';

interface TrackingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackingStatusModal: React.FC<TrackingStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const service = useTimeTracking();
  const status = service.getTrackingStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                status.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <h3 className="text-base font-bold text-white">
              {status.isActive ? 'Tracking Active' : 'Tracking Paused'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-3">
          {status.isActive
            ? 'Browser Time is actively tracking foreground tabs and recording duration.'
            : 'Activity monitoring is currently paused. No tab time is being recorded.'}
        </p>

        {/* Current Active Site Details */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              Current Website:
            </span>
            <span className="font-mono font-bold text-white">{status.currentDomain}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Current Session:
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {formatTimer(status.currentSessionSeconds)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Today's Total Browsing:
            </span>
            <span className="font-mono font-bold text-white">
              {formatDuration(status.todayTotalSeconds)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          {status.isActive ? (
            <button
              type="button"
              onClick={() => service.pauseTracking()}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Tracking</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => service.resumeTracking()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Resume Tracking</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              service.excludeCurrentWebsite();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShieldBan className="w-4 h-4 text-rose-400" />
            <span>Exclude "{status.currentDomain}" From Tracking</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
          Data stored 100% locally in browser memory. No external servers.
        </div>
      </div>
    </div>
  );
};
