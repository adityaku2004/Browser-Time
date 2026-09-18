import React from 'react';
import { ProductivityCategory } from '../../types';
import { getCategoryConfig } from '../../utils/formatters';

interface BadgeProps {
  category?: ProductivityCategory;
  text?: string;
  variant?: 'outline' | 'solid' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  category,
  text,
  size = 'sm',
  className = '',
}) => {
  if (category) {
    const config = getCategoryConfig(category);
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap transition-colors ${
          config.bgLight
        } ${config.border} ${config.text} ${
          size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
        } ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {text || config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 whitespace-nowrap ${
        size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'
      } ${className}`}
    >
      {text}
    </span>
  );
};
