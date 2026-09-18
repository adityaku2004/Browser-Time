import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Shield, Menu, MonitorSmartphone } from 'lucide-react';
import { DateRangeOption } from '../../types';

interface HeaderProps {
  selectedRange: DateRangeOption;
  onChangeRange: (range: DateRangeOption) => void;
  onPrevDate: () => void;
  onNextDate: () => void;
  dateLabel: string;
  onOpenTrackingModal: () => void;
  onOpenPopupModal: () => void;
  onOpenPrivacyModal: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRange,
  onChangeRange,
  onPrevDate,
  onNextDate,
  dateLabel,
  onOpenPopupModal,
  onOpenPrivacyModal,
  onToggleMobileSidebar,
}) => {
  // Contextual greeting based on hour
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const ranges: { id: DateRangeOption; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Greeting & Subtitle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                {greeting}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Here's how you spent your browsing time today.
            </p>
          </div>
        </div>

        {/* Right: Date Range Selector + Navigation + Extension Popup preview launcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Previous / Next Date Navigation */}
          <div className="flex items-center rounded-xl bg-slate-900/90 border border-slate-800 p-0.5">
            <button
              type="button"
              onClick={onPrevDate}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-200 px-2.5 font-mono">
              {dateLabel}
            </span>
            <button
              type="button"
              onClick={onNextDate}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Range Pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            {ranges.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onChangeRange(r.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedRange === r.id
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Quick buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPopupModal}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Preview Extension Popup"
            >
              <MonitorSmartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Popup View</span>
            </button>

            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Privacy: 100% Local"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
