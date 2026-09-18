import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const WeeklyComparisonChart: React.FC = () => {
  const comparisonData = [
    { day: 'Mon', thisWeek: 6.2, lastWeek: 6.8 },
    { day: 'Tue', thisWeek: 7.1, lastWeek: 6.5 },
    { day: 'Wed', thisWeek: 5.8, lastWeek: 6.9 },
    { day: 'Thu', thisWeek: 6.7, lastWeek: 7.2 },
    { day: 'Fri', thisWeek: 5.4, lastWeek: 6.1 },
    { day: 'Sat', thisWeek: 3.8, lastWeek: 4.5 },
    { day: 'Sun', thisWeek: 3.4, lastWeek: 4.2 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[150px]">
          <div className="text-xs font-bold text-white border-b border-slate-800 pb-1 mb-2">
            {label} Browsing Hours
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-sky-400">
              <span>This Week:</span>
              <span className="font-mono font-bold">{payload[0]?.value}h</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Last Week:</span>
              <span className="font-mono font-bold">{payload[1]?.value}h</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Week-over-Week Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily browsing hours compared with previous week
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-500" />
            <span className="text-slate-300">This Week (38h 24m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-700" />
            <span className="text-slate-400">Last Week (42h 18m)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tick={{ fontSize: 11 }}
              unit="h"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="thisWeek" name="This Week" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lastWeek" name="Last Week" fill="#334155" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
