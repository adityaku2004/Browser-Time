import React from 'react';
import { ScoreFactor } from '../../types';
import { TrendingUp, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ProductivityScoreCardProps {
  score: number;
  factors: ScoreFactor[];
}

export const ProductivityScoreCard: React.FC<ProductivityScoreCardProps> = ({
  score,
  factors,
}) => {
  // Determine score status and colors
  let statusText = 'Good Productivity';
  let statusColor = 'text-emerald-400';
  let strokeColor = '#10b981';

  if (score >= 85) {
    statusText = 'Excellent Productivity';
    statusColor = 'text-teal-400';
    strokeColor = '#14b8a6';
  } else if (score >= 70) {
    statusText = 'Good Productivity';
    statusColor = 'text-emerald-400';
    strokeColor = '#10b981';
  } else if (score >= 50) {
    statusText = 'Moderate Focus';
    statusColor = 'text-amber-400';
    strokeColor = '#f59e0b';
  } else {
    statusText = 'High Distraction';
    statusColor = 'text-rose-400';
    strokeColor = '#f43f5e';
  }

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  // Let's make an arc (75% circle gauge)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, Math.max(0, score))) / 100;

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Productivity Score
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            Daily Index
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Weighted score across focus time &amp; tab discipline
        </p>
      </div>

      {/* Center Gauge */}
      <div className="my-4 flex flex-col items-center justify-center relative">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-135" viewBox="0 0 130 130">
            {/* Background Arc */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
            {/* Active Gauge Arc */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              stroke={strokeColor}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Inner Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
              {score}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">/ 100</span>
          </div>
        </div>

        <div className={`text-sm font-bold tracking-tight ${statusColor} -mt-2`}>
          {statusText}
        </div>
        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>+6 points vs yesterday</span>
        </div>
      </div>

      {/* Factors list */}
      <div className="space-y-2 border-t border-slate-800/80 pt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Score Breakdown Factors
        </div>
        {factors.map((factor, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-none"
          >
            <div className="flex items-center gap-2">
              {factor.type === 'positive' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span className="text-slate-300 font-medium">{factor.name}</span>
            </div>
            <span
              className={`font-mono font-bold ${
                factor.type === 'positive' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {factor.points > 0 ? `+${factor.points}` : factor.points}
            </span>
          </div>
        ))}
      </div>

      {/* Benchmark Footer */}
      <div className="mt-4 p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200/90 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 animate-pulse" />
        <span>Your score is higher than <strong>72%</strong> of your previous days</span>
      </div>
    </div>
  );
};
