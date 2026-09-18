import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'primary' | 'emerald' | 'rose' | 'amber';
  height?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  height = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorStyles = {
    primary: 'bg-gradient-to-r from-sky-500 to-blue-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    rose: 'bg-gradient-to-r from-rose-500 to-red-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-400',
  }[color];

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[height];

  return (
    <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/30 ${className}`}>
      <div
        className={`${heightStyles} rounded-full transition-all duration-500 ease-out ${colorStyles}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
