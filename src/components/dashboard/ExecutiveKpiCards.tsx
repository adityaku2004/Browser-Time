import React from 'react';

interface ExecutiveKpiCardsProps {
  workHoursFormatted: string; // e.g. "7hr 30min"
  targetHoursFormatted: string; // e.g. "7hr 30min"
  targetPercent: number; // e.g. 90
  focusPercent: number; // e.g. 80
}

export const ExecutiveKpiCards: React.FC<ExecutiveKpiCardsProps> = ({
  workHoursFormatted = '7hr 30min',
  targetHoursFormatted = '7hr 30min',
  targetPercent = 90,
  focusPercent = 80,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg">
      {/* 1. Work Hours Card */}
      <div className="flex flex-col justify-between min-h-[140px] p-2">
        <span className="text-sm font-medium text-slate-400">
          Work Hours
        </span>
        <div className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight flex items-baseline gap-1.5 font-mono">
          <span>{workHoursFormatted.split(' ')[0]}</span>
          <span className="text-2xl sm:text-3xl font-semibold text-slate-200">
            {workHoursFormatted.split(' ')[1] || ''}
          </span>
        </div>
      </div>

      {/* 2. Percent of Target Highlight Card (Vibrant Mint #4EECD3) */}
      <div className="flex flex-col justify-between min-h-[140px] p-5 rounded-2xl bg-[#4EECD3] text-[#0c2420] shadow-md shadow-[#4EECD3]/15 transition-transform hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight">
            Percent of Target
          </span>
          <div className="w-6 h-6 rounded-full bg-[#0c2420] text-[#4EECD3] flex items-center justify-center text-xs font-bold font-mono">
            %
          </div>
        </div>
        <div className="mt-2">
          <div className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
            {targetPercent}%{' '}
            <span className="text-lg sm:text-xl font-bold opacity-85">
              of {targetHoursFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Focus Percent Card */}
      <div className="flex flex-col justify-between min-h-[140px] p-2 sm:pl-4">
        <span className="text-sm font-medium text-slate-400">
          Focus Percent
        </span>
        <div className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight font-mono">
          {focusPercent}%
        </div>
      </div>
    </div>
  );
};
