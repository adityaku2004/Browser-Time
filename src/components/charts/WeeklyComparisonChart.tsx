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
import { useTimeTracking } from '../../hooks/useTimeTracking';

export const WeeklyComparisonChart: React.FC = () => {
  const service = useTimeTracking();
  const history = service.getDailyHistory();

  // Compute this week vs previous week from actual recorded history
  const comparisonData = React.useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Get last 14 days from history
    const len = history.length;
    const thisWeekSlice = history.slice(Math.max(0, len - 7), len);
    const lastWeekSlice = history.slice(Math.max(0, len - 14), Math.max(0, len - 7));

    return days.map((dayName, idx) => {
      const thisDay = thisWeekSlice[idx];
      const lastDay = lastWeekSlice[idx];

      const thisWeekHours = thisDay ? Number((thisDay.totalTime / 3600).toFixed(1)) : 0;
      const lastWeekHours = lastDay ? Number((lastDay.totalTime / 3600).toFixed(1)) : 0;

      return {
        day: dayName,
        thisWeek: thisWeekHours,
        lastWeek: lastWeekHours,
      };
    });
  }, [history]);

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
            <span className="text-slate-300">This Week</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-700" />
            <span className="text-slate-400">Last Week</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="thisWeek" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="lastWeek" fill="#334155" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
