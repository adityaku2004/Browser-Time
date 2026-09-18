import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { HourlyActivity } from '../../types';

interface HourlyActivityChartProps {
  data: HourlyActivity[];
}

export const HourlyActivityChart: React.FC<HourlyActivityChartProps> = ({ data }) => {
  const [activeView, setActiveView] = useState<'stacked' | 'productive' | 'distracting'>('stacked');

  // Format custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload.find((item: any) => item.dataKey === 'productiveMinutes')?.value || 0;
      const d = payload.find((item: any) => item.dataKey === 'distractingMinutes')?.value || 0;
      const n = payload.find((item: any) => item.dataKey === 'neutralMinutes')?.value || 0;
      const total = p + d + n;

      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[170px]">
          <div className="text-xs font-bold text-white border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-slate-400">{total}m total</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Productive:
              </span>
              <span className="font-semibold">{p}m</span>
            </div>
            <div className="flex items-center justify-between text-rose-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Distracting:
              </span>
              <span className="font-semibold">{d}m</span>
            </div>
            <div className="flex items-center justify-between text-amber-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Neutral:
              </span>
              <span className="font-semibold">{n}m</span>
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
            Hourly Browsing Activity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active time distribution across the day
          </p>
        </div>

        {/* View toggle pills */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('stacked')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeView === 'stacked'
                ? 'bg-slate-800 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          <button
            type="button"
            onClick={() => setActiveView('productive')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeView === 'productive'
                ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Productive
          </button>
          <button
            type="button"
            onClick={() => setActiveView('distracting')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeView === 'distracting'
                ? 'bg-rose-500/20 text-rose-400 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Distracting
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorNeut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tick={{ fontSize: 11 }}
              interval={2}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              tick={{ fontSize: 11 }}
              unit="m"
            />
            <Tooltip content={<CustomTooltip />} />

            {(activeView === 'stacked' || activeView === 'productive') && (
              <Area
                type="monotone"
                dataKey="productiveMinutes"
                name="Productive"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProd)"
                stackId={activeView === 'stacked' ? '1' : undefined}
              />
            )}

            {(activeView === 'stacked' || activeView === 'distracting') && (
              <Area
                type="monotone"
                dataKey="distractingMinutes"
                name="Distracting"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDist)"
                stackId={activeView === 'stacked' ? '1' : undefined}
              />
            )}

            {activeView === 'stacked' && (
              <Area
                type="monotone"
                dataKey="neutralMinutes"
                name="Neutral"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorNeut)"
                stackId="1"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300">Productive</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-300">Distracting</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">Neutral</span>
        </div>
      </div>
    </div>
  );
};
