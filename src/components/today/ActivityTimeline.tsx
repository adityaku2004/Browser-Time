import React, { useState } from 'react';
import { TimelineItem, ProductivityCategory } from '../../types';
import { formatDuration, getCategoryConfig } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Clock, Coffee, Search } from 'lucide-react';

interface ActivityTimelineProps {
  items: TimelineItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items }) => {
  const [filter, setFilter] = useState<'all' | ProductivityCategory | 'idle'>('all');
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) => {
    if (filter === 'idle') return item.isIdle;
    if (filter !== 'all' && item.category !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.domain.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search timeline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {(['all', 'productive', 'distracting', 'idle'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filter === cat
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
              No activity matching the current filter.
            </div>
          ) : (
            filtered.map((item) => {
              const config = getCategoryConfig(item.category);

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline node icon / dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center transition-transform group-hover:scale-125 ${
                      item.isIdle ? 'bg-amber-400' : config.dot
                    }`}
                  />

                  {/* Card content */}
                  <div
                    className={`rounded-2xl p-4 transition-all duration-200 border ${
                      item.isIdle
                        ? 'bg-amber-500/5 border-amber-500/20'
                        : 'bg-slate-900/60 backdrop-blur-xl border-slate-800/80 hover:border-slate-700/80 shadow-md shadow-black/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 font-mono text-xs text-sky-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.time}</span>
                        {item.endTime && (
                          <span className="text-slate-400">→ {item.endTime}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {formatDuration(item.duration)}
                        </span>
                        {item.isIdle ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <Coffee className="w-3 h-3" />
                            Idle Break
                          </span>
                        ) : (
                          <Badge category={item.category} size="sm" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      {!item.isIdle && (
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                          alt={item.name}
                          className="w-4 h-4 rounded-xs shrink-0 mt-0.5"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {item.name} — <span className="font-normal text-slate-300">{item.title}</span>
                        </div>
                        {!item.isIdle && (
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {item.domain}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
