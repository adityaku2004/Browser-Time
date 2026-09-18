import React, { useState } from 'react';
import { DailyActivity } from '../../types';
import { formatDuration } from '../../utils/formatters';

interface ActivityHeatmapProps {
  data: DailyActivity[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  data,
  selectedDate,
  onSelectDate,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DailyActivity | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Group into columns of 7 days (weeks)
  const weeks: DailyActivity[][] = [];
  let currentWeek: DailyActivity[] = [];

  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Calculate intensity color based on total seconds
  const getIntensityClass = (seconds: number) => {
    const hours = seconds / 3600;
    if (hours === 0) return 'bg-slate-800/40 border-slate-700/30';
    if (hours < 2) return 'bg-sky-950/70 border-sky-800/40 text-sky-400';
    if (hours < 4) return 'bg-sky-800/80 border-sky-600/50 text-sky-300';
    if (hours < 6) return 'bg-sky-600 border-sky-400 text-white';
    return 'bg-sky-400 border-sky-200 text-slate-950 shadow-sm shadow-sky-500/40';
  };

  const handleMouseEnter = (day: DailyActivity, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setTooltipPos(null);
  };

  return (
    <div className="relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Browsing Activity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Your browsing activity over the last 12 weeks
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px] text-slate-400">Less</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-slate-800/60 border border-slate-700/40" />
          <span className="w-2.5 h-2.5 rounded-xs bg-sky-950/80 border border-sky-800/50" />
          <span className="w-2.5 h-2.5 rounded-xs bg-sky-800/90 border border-sky-600/60" />
          <span className="w-2.5 h-2.5 rounded-xs bg-sky-600 border border-sky-400" />
          <span className="w-2.5 h-2.5 rounded-xs bg-sky-400 border border-sky-200" />
          <span className="text-[11px] text-slate-400 ml-1">More</span>
        </div>
      </div>

      {/* Grid container with overflow-x scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-2 items-start min-w-[620px]">
          {/* Day of week labels */}
          <div className="grid grid-rows-7 gap-1.5 text-[10px] text-slate-400 font-mono pr-2 select-none">
            <span className="h-3 leading-3">Mon</span>
            <span className="h-3 leading-3" />
            <span className="h-3 leading-3">Wed</span>
            <span className="h-3 leading-3" />
            <span className="h-3 leading-3">Fri</span>
            <span className="h-3 leading-3" />
            <span className="h-3 leading-3">Sun</span>
          </div>

          {/* Weeks columns */}
          <div className="flex gap-1.5">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1.5">
                {week.map((day) => {
                  const isSelected = selectedDate === day.date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      aria-label={`Activity for ${day.dayLabel}`}
                      onClick={() => onSelectDate?.(day.date)}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                      className={`w-3.5 h-3.5 rounded-xs border transition-all duration-150 cursor-pointer ${getIntensityClass(
                        day.totalTime
                      )} ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-125 z-10'
                          : 'hover:scale-125 hover:z-10'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Tooltip fixed position */}
      {hoveredDay && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[200px]"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="text-xs font-bold text-white border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
            <span>{hoveredDay.dayLabel}</span>
            <span className="text-[10px] text-sky-400 font-mono">Score: {hoveredDay.productivityScore}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Total time:</span>
              <span className="font-semibold text-white">{formatDuration(hoveredDay.totalTime)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400">
              <span>Productive:</span>
              <span className="font-medium">{formatDuration(hoveredDay.productiveTime)}</span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span>Distracting:</span>
              <span className="font-medium">{formatDuration(hoveredDay.distractingTime)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Sites visited:</span>
              <span className="text-slate-200">{hoveredDay.websitesVisited}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
