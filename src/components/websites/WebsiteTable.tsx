import React, { useState } from 'react';
import { WebsiteActivity, ProductivityCategory } from '../../types';
import { formatDuration, getCategoryConfig } from '../../utils/formatters';
import { Search, Plus, Trash2, ShieldBan, ShieldCheck } from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';

interface WebsiteTableProps {
  websites: WebsiteActivity[];
}

export const WebsiteTable: React.FC<WebsiteTableProps> = ({ websites }) => {
  const service = useTimeTracking();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductivityCategory>('all');
  const [sortBy, setSortBy] = useState<'time' | 'timeLeast' | 'name' | 'productivity'>('time');
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newDomainCategory, setNewDomainCategory] = useState<ProductivityCategory>('productive');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Filter
  const filtered = websites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || site.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'time') return b.timeSpent - a.timeSpent;
    if (sortBy === 'timeLeast') return a.timeSpent - b.timeSpent;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'productivity') {
      const rank = { productive: 3, neutral: 2, distracting: 1 };
      return rank[b.category] - rank[a.category];
    }
    return 0;
  });

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    service.addDomain(newDomainInput, newDomainCategory);
    setNewDomainInput('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Controls: Search, Category Filters, Sorting, Add Domain */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Pills & Sort Select */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {(['all', 'productive', 'neutral', 'distracting'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  categoryFilter === cat
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-hidden focus:border-sky-500 cursor-pointer"
          >
            <option value="time">Sort: Most Time</option>
            <option value="timeLeast">Sort: Least Time</option>
            <option value="name">Sort: Name</option>
            <option value="productivity">Sort: Productivity</option>
          </select>

          <button
            type="button"
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Domain</span>
          </button>
        </div>
      </div>

      {/* Inline Add Domain Form */}
      {isAddOpen && (
        <form
          onSubmit={handleAddDomain}
          className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/40 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-150"
        >
          <input
            type="text"
            placeholder="e.g. news.ycombinator.com"
            value={newDomainInput}
            onChange={(e) => setNewDomainInput(e.target.value)}
            className="flex-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-400"
            autoFocus
          />
          <select
            value={newDomainCategory}
            onChange={(e) => setNewDomainCategory(e.target.value as ProductivityCategory)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200"
          >
            <option value="productive">Productive</option>
            <option value="neutral">Neutral</option>
            <option value="distracting">Distracting</option>
          </select>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table Container */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Website</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Today</th>
                <th className="py-3.5 px-4">This Week</th>
                <th className="py-3.5 px-4">Average / Day</th>
                <th className="py-3.5 px-4">Visits</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No websites match the selected filter.
                  </td>
                </tr>
              ) : (
                sorted.map((site) => {
                  const config = getCategoryConfig(site.category);
                  return (
                    <tr
                      key={site.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Website column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
                            alt={site.name}
                            className="w-5 h-5 rounded-xs"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{site.name}</span>
                              {site.excluded && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-xs bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  Excluded
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {site.domain}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Interactive Category Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={site.category}
                          onChange={(e) =>
                            service.updateWebsiteCategory(
                              site.domain,
                              e.target.value as ProductivityCategory
                            )
                          }
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer focus:outline-hidden ${config.bgLight} ${config.border} ${config.text}`}
                        >
                          <option value="productive" className="bg-slate-900 text-emerald-400">
                            Productive
                          </option>
                          <option value="neutral" className="bg-slate-900 text-amber-400">
                            Neutral
                          </option>
                          <option value="distracting" className="bg-slate-900 text-rose-400">
                            Distracting
                          </option>
                        </select>
                      </td>

                      {/* Today */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {formatDuration(site.timeSpent)}
                      </td>

                      {/* This Week */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {formatDuration(site.timeSpentWeek)}
                      </td>

                      {/* Average / Day */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {formatDuration(site.averageDailyTime)}
                      </td>

                      {/* Visits */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {site.visits}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => service.toggleExcludeDomain(site.domain)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              site.excluded
                                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                            }`}
                            title={site.excluded ? 'Resume tracking domain' : 'Exclude domain'}
                          >
                            {site.excluded ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldBan className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => service.removeDomain(site.domain)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Remove from tracking list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
