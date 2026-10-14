import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export type ExecutiveRange = 'Day' | 'Week' | 'Month' | 'Year';

interface ExecutiveDateHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedRange: ExecutiveRange;
  onRangeChange: (range: ExecutiveRange) => void;
}

export const ExecutiveDateHeader: React.FC<ExecutiveDateHeaderProps> = ({
  currentDate,
  onDateChange,
  selectedRange,
  onRangeChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const ranges: ExecutiveRange[] = ['Day', 'Week', 'Month', 'Year'];

  const formatDateDisplay = (date: Date, range: ExecutiveRange) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    if (range === 'Day') {
      const dayName = days[date.getDay()];
      const dayNum = date.getDate();
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      return `${dayName}, ${dayNum} ${monthName} ${year}`;
    }
    if (range === 'Week') {
      return `Week of ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    if (range === 'Month') {
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return `${date.getFullYear()} Overview`;
  };

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (selectedRange === 'Day') next.setDate(next.getDate() - 1);
    else if (selectedRange === 'Week') next.setDate(next.getDate() - 7);
    else if (selectedRange === 'Month') next.setMonth(next.getMonth() - 1);
    else next.setFullYear(next.getFullYear() - 1);
    onDateChange(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (selectedRange === 'Day') next.setDate(next.getDate() + 1);
    else if (selectedRange === 'Week') next.setDate(next.getDate() + 7);
    else if (selectedRange === 'Month') next.setMonth(next.getMonth() + 1);
    else next.setFullYear(next.getFullYear() + 1);
    onDateChange(next);
  };

  return (
    <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1 pb-4">
      {/* Left: Greeting & Large Date Title */}
      <div>
        <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
          <span>Today Nice Day</span>
          <span>☀️</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-none">
          {formatDateDisplay(currentDate, selectedRange)}
        </h1>
      </div>

      {/* Right: Segmented Range + Navigation Arrows */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Day / Week / Month / Year Segmented Control */}
        <div className="flex items-center p-1 rounded-full bg-[#1A1C23] border border-[#2B2F3A] shadow-inner text-xs font-semibold">
          {ranges.map((r) => {
            const isActive = selectedRange === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => onRangeChange(r)}
                className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons: < 📅 > */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#1A1C23] border border-[#2B2F3A] relative">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252830] transition-colors"
            title="Previous period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252830] transition-colors"
            title="Jump to date"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252830] transition-colors"
            title="Next period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick Date Picker Popover */}
          {showDatePicker && (
            <div className="absolute right-0 top-11 p-3 w-56 rounded-2xl bg-[#16181D] border border-[#2B2F3A] shadow-2xl z-50 text-xs">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2">
                Select Date
              </div>
              <input
                type="date"
                defaultValue={currentDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    onDateChange(new Date(e.target.value));
                    setShowDatePicker(false);
                  }
                }}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#23262F] text-slate-200 border border-slate-700/60 focus:outline-hidden focus:border-[#38E1C2]"
              />
              <div className="flex justify-between mt-2 pt-2 border-t border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    onDateChange(new Date(2025, 4, 22)); // May 22, 2025 to match screenshot
                    setShowDatePicker(false);
                  }}
                  className="text-[#38E1C2] hover:underline"
                >
                  Reset to May 22, 2025
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDateChange(new Date());
                    setShowDatePicker(false);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Today
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
