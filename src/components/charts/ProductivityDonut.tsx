import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatDuration } from '../../utils/formatters';

interface ProductivityDonutProps {
  productiveSeconds: number;
  distractingSeconds: number;
  neutralSeconds: number;
  totalSeconds: number;
}

export const ProductivityDonut: React.FC<ProductivityDonutProps> = ({
  productiveSeconds,
  distractingSeconds,
  neutralSeconds,
  totalSeconds,
}) => {
  const safeTotal = totalSeconds || (productiveSeconds + distractingSeconds + neutralSeconds) || 1;

  const prodPct = Math.round((productiveSeconds / safeTotal) * 100);
  const distPct = Math.round((distractingSeconds / safeTotal) * 100);
  const neutPct = Math.max(0, 100 - prodPct - distPct);

  const chartData = [
    { name: 'Productive', value: productiveSeconds, percent: prodPct, color: '#10b981' },
    { name: 'Neutral', value: neutralSeconds, percent: neutPct, color: '#f59e0b' },
    { name: 'Distracting', value: distractingSeconds, percent: distPct, color: '#f43f5e' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {formatDuration(data.value)} ({data.percent}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-white tracking-tight">
          Productivity Breakdown
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Ratio of focused vs leisure browsing
        </p>
      </div>

      {/* Donut Container with centered text */}
      <div className="relative w-full h-52 my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={84}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Donut Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold tracking-tight text-white">
            {formatDuration(totalSeconds)}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Total
          </span>
        </div>
      </div>

      {/* Breakdown Legend Cards */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/70">
        <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
          <div className="text-xs text-slate-400 font-medium">Productive</div>
          <div className="text-base font-bold text-emerald-400 mt-0.5">{prodPct}%</div>
          <div className="text-[10px] text-slate-400 truncate">{formatDuration(productiveSeconds)}</div>
        </div>

        <div className="p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
          <div className="text-xs text-slate-400 font-medium">Neutral</div>
          <div className="text-base font-bold text-amber-400 mt-0.5">{neutPct}%</div>
          <div className="text-[10px] text-slate-400 truncate">{formatDuration(neutralSeconds)}</div>
        </div>

        <div className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/20 text-center">
          <div className="text-xs text-slate-400 font-medium">Distracting</div>
          <div className="text-base font-bold text-rose-400 mt-0.5">{distPct}%</div>
          <div className="text-[10px] text-slate-400 truncate">{formatDuration(distractingSeconds)}</div>
        </div>
      </div>
    </div>
  );
};
