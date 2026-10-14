import React, { useState } from 'react';
import { MoreHorizontal, Download, Sliders, ExternalLink } from 'lucide-react';

interface ExecutiveDailySummaryProps {
  focusPercent?: number; // 50
  breaksPercent?: number; // 30
  meetingPercent?: number; // 20
  focusDuration?: string; // 5h 10 min
  meetingDuration?: string; // 1h 15 min
  breaksDuration?: string; // 1h 5 min
}

export const ExecutiveDailySummary: React.FC<ExecutiveDailySummaryProps> = ({
  focusPercent = 50,
  breaksPercent = 30,
  meetingPercent = 20,
  focusDuration = '5h 10 min',
  meetingDuration = '1h 15 min',
  breaksDuration = '1h 5 min',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // SVG Donut calculation
  // Circle circumference with r = 70: C = 2 * PI * 70 ≈ 439.82
  const r = 70;
  const circumference = 2 * Math.PI * r;

  // Segment strokeDasharray & offsets
  const focusLength = (focusPercent / 100) * circumference;
  const breaksLength = (breaksPercent / 100) * circumference;
  const meetingLength = (meetingPercent / 100) * circumference;

  // Offsets: start from top (-90 deg), gap = 6px
  const gap = 8;
  const focusDash = `${Math.max(0, focusLength - gap)} ${circumference - (focusLength - gap)}`;
  const breaksDash = `${Math.max(0, breaksLength - gap)} ${circumference - (breaksLength - gap)}`;
  const meetingDash = `${Math.max(0, meetingLength - gap)} ${circumference - (meetingLength - gap)}`;

  const focusOffset = 0;
  const breaksOffset = -focusLength;
  const meetingOffset = -(focusLength + breaksLength);

  return (
    <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg flex flex-col justify-between h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Daily Summary - Today
        </h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252830] transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-9 w-44 rounded-2xl bg-[#16181D] border border-[#2B2F3A] shadow-2xl p-2 z-50 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#23262F] flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
                Export CSV Report
              </button>
              <button
                type="button"
                onClick={() => setShowMenu(false)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#23262F] flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-[#4EECD3]" />
                Configure Goals
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Donut Chart with Callout Labels (matching screenshot) */}
      <div className="relative flex items-center justify-center my-3 py-1">
        <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 190 190">
            {/* Background ring */}
            <circle
              cx="95"
              cy="95"
              r={r}
              fill="none"
              stroke="#23262F"
              strokeWidth="20"
            />

            {/* 1. Focus Segment (Sky Blue #38BDF8) */}
            <circle
              cx="95"
              cy="95"
              r={r}
              fill="none"
              stroke="#38BDF8"
              strokeWidth={hoveredSegment === 'focus' ? '24' : '20'}
              strokeDasharray={focusDash}
              strokeDashoffset={focusOffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSegment('focus')}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* 2. Breaks Segment (Mint #4EECD3) */}
            <circle
              cx="95"
              cy="95"
              r={r}
              fill="none"
              stroke="#4EECD3"
              strokeWidth={hoveredSegment === 'breaks' ? '24' : '20'}
              strokeDasharray={breaksDash}
              strokeDashoffset={breaksOffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSegment('breaks')}
              onMouseLeave={() => setHoveredSegment(null)}
            />

            {/* 3. Meeting Segment (Royal Blue #3B82F6) */}
            <circle
              cx="95"
              cy="95"
              r={r}
              fill="none"
              stroke="#3B82F6"
              strokeWidth={hoveredSegment === 'meeting' ? '24' : '20'}
              strokeDasharray={meetingDash}
              strokeDashoffset={meetingOffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSegment('meeting')}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          </svg>

          {/* Floating Callout Badges on Donut (matches screenshot) */}
          {/* Focus 50% badge (Right side) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 px-2.5 py-1 rounded-full bg-[#16181D]/90 border border-slate-700 shadow-lg text-[11px] font-semibold text-white whitespace-nowrap">
            Focus {focusPercent}%
          </div>

          {/* Breaks 30% badge (Top-left) */}
          <div className="absolute left-2 top-8 px-2.5 py-1 rounded-full bg-[#16181D]/90 border border-slate-700 shadow-lg text-[11px] font-semibold text-white whitespace-nowrap">
            Breaks {breaksPercent}%
          </div>

          {/* Meeting 20% badge (Bottom-center) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#16181D]/90 border border-slate-700 shadow-lg text-[11px] font-semibold text-white whitespace-nowrap">
            Meeting {meetingPercent}%
          </div>
        </div>
      </div>

      {/* Metrics List Legend Underneath */}
      <div className="space-y-3 pt-3 border-t border-[#2B2F3A]/60">
        {/* Row 1: Focus on work */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shrink-0" />
            <span className="font-medium">Focus on work</span>
          </div>
          <span className="font-bold text-white font-mono">{focusDuration}</span>
        </div>

        {/* Row 2: Meeting time */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
            <span className="font-medium">Meeting time</span>
          </div>
          <span className="font-bold text-white font-mono">{meetingDuration}</span>
        </div>

        {/* Row 3: Breaks */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4EECD3] shrink-0" />
            <span className="font-medium">Breaks</span>
          </div>
          <span className="font-bold text-white font-mono">{breaksDuration}</span>
        </div>
      </div>
    </div>
  );
};
