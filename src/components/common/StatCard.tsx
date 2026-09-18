import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  progressPercent?: number;
  progressColor?: 'primary' | 'emerald' | 'rose' | 'amber';
  scoreCircle?: boolean;
  statusBadge?: string;
  statusColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-sky-400',
  progressPercent,
  progressColor = 'primary',
  scoreCircle = false,
  statusBadge,
  statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
}) => {
  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all duration-200 group"
    >
      {/* Subtle corner light reflection */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-slate-700/10 to-transparent pointer-events-none rounded-tr-2xl" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
          {value}
        </div>
        {statusBadge && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>
            {statusBadge}
          </span>
        )}
      </div>

      {/* Progress Bar if given */}
      {typeof progressPercent === 'number' && !scoreCircle && (
        <div className="mt-3.5 space-y-1.5">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                progressColor === 'emerald'
                  ? 'bg-emerald-400'
                  : progressColor === 'rose'
                  ? 'bg-rose-400'
                  : 'bg-sky-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>
      )}

      {/* Circular mini gauge if score card */}
      {scoreCircle && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{ width: `${Math.min(100, parseInt(value, 10) || 78)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center text-xs text-slate-400">
        <span className="font-medium text-slate-300">{subtitle}</span>
      </div>
    </div>
  );
};
