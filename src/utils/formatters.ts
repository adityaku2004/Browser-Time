import { ProductivityCategory } from '../types';

/**
 * Formats seconds into a clean human readable string:
 * e.g., 24120 -> "6h 42m", 1080 -> "18m", 45 -> "45s"
 */
export function formatDuration(seconds: number, compact = false): string {
  if (!seconds || seconds <= 0) {
    return compact ? '0m' : '0m';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSecs = Math.floor(seconds % 60);

  if (hours > 0) {
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes < 10 && !compact ? '0' : ''}${minutes}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m`;
  }
  
  return `${remainingSecs}s`;
}

/**
 * Formats seconds into exact timer display: "42m 18s" or "01:24:15"
 */
export function formatTimer(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
}

/**
 * Formats a ratio as percentage string e.g. 64%
 */
export function formatPercent(value: number, total: number): number {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

/**
 * Returns color classes and badges for category
 */
export function getCategoryConfig(category: ProductivityCategory) {
  switch (category) {
    case 'productive':
      return {
        label: 'Productive',
        bgLight: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        fill: '#10b981',
        dot: 'bg-emerald-400',
        ring: 'ring-emerald-500/20',
      };
    case 'distracting':
      return {
        label: 'Distracting',
        bgLight: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        fill: '#f43f5e',
        dot: 'bg-rose-400',
        ring: 'ring-rose-500/20',
      };
    case 'neutral':
    default:
      return {
        label: 'Neutral',
        bgLight: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        fill: '#f59e0b',
        dot: 'bg-amber-400',
        ring: 'ring-amber-500/20',
      };
  }
}

/**
 * Returns domain favicon URL or fallback generator
 */
export function getDomainFavicon(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
