import React, { useState } from 'react';
import { MoreHorizontal, SquarePen, Check, X } from 'lucide-react';

interface CategoryItem {
  percent: number;
  label: string;
  duration: string;
  color: string;
}

interface AppItem {
  percent: number;
  label: string;
  duration: string;
  color: string;
}

interface ProjectItem {
  percent: number;
  label: string;
  duration: string;
  color: string;
}

export const ExecutiveBreakdownGrid: React.FC = () => {
  // Editable state
  const [categories, setCategories] = useState<CategoryItem[]>([
    { percent: 64, label: 'Design', duration: '3h 52 min', color: '#38BDF8' },
    { percent: 17, label: 'Video Conferencing', duration: '45 min', color: '#3B82F6' },
    { percent: 10, label: 'Productivity', duration: '17 min', color: '#4EECD3' },
    { percent: 10, label: 'Messaging', duration: '15 min', color: '#2DD4BF' },
  ]);

  const [apps, setApps] = useState<AppItem[]>([
    { percent: 59, label: 'Figma', duration: '2h 46 min', color: '#38BDF8' },
    { percent: 16, label: 'Chrome', duration: '43 min', color: '#3B82F6' },
    { percent: 8, label: 'Slack', duration: '20 min', color: '#818CF8' },
    { percent: 5, label: 'Spotify', duration: '15 min', color: '#10B981' },
  ]);

  const [projects, setProjects] = useState<ProjectItem[]>([
    { percent: 45, label: 'Alialearn', duration: '2h 46 min', color: '#38BDF8' },
    { percent: 30, label: 'Riide', duration: '43 min', color: '#38BDF8' },
    { percent: 20, label: 'Postcredit', duration: '20 min', color: '#38BDF8' },
    { percent: 5, label: 'Samsa', duration: '15 min', color: '#2B4158' },
  ]);

  // Quick edit modal
  const [editingTarget, setEditingTarget] = useState<{
    type: 'category' | 'app' | 'project';
    index: number;
    label: string;
    duration: string;
  } | null>(null);

  const handleSaveEdit = () => {
    if (!editingTarget) return;
    const { type, index, label, duration } = editingTarget;
    if (type === 'category') {
      const updated = [...categories];
      updated[index] = { ...updated[index], label, duration };
      setCategories(updated);
    } else if (type === 'app') {
      const updated = [...apps];
      updated[index] = { ...updated[index], label, duration };
      setApps(updated);
    } else {
      const updated = [...projects];
      updated[index] = { ...updated[index], label, duration };
      setProjects(updated);
    }
    setEditingTarget(null);
  };

  // Helper circular ring component
  const CircularProgressRing = ({ percent, color }: { percent: number; color: string }) => {
    const radius = 10;
    const c = 2 * Math.PI * radius; // ~62.8
    const dash = (percent / 100) * c;
    return (
      <svg className="w-6 h-6 -rotate-90 shrink-0" viewBox="0 0 28 28">
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke="#2B2F3A"
          strokeWidth="3"
        />
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {/* 1. Categories Card */}
      <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Categories
            </h3>
            <button
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {categories.map((cat, idx) => (
              <div
                key={cat.label}
                className="flex items-center justify-between text-xs sm:text-sm group hover:bg-[#23262F]/40 p-1.5 -mx-1.5 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium text-slate-300 w-9 text-left">
                    {cat.percent}%
                  </span>
                  <CircularProgressRing percent={cat.percent} color={cat.color} />
                  <span className="font-medium text-slate-200">
                    {cat.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-slate-400">
                    {cat.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTarget({
                        type: 'category',
                        index: idx,
                        label: cat.label,
                        duration: cat.duration,
                      })
                    }
                    className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
                    title="Edit category"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Apps & Websites Card */}
      <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Apps & Websites
            </h3>
            <button
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {apps.map((app, idx) => (
              <div
                key={app.label}
                className="flex items-center justify-between text-xs sm:text-sm group hover:bg-[#23262F]/40 p-1.5 -mx-1.5 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-medium text-slate-300 w-9 text-left">
                    {app.percent}%
                  </span>
                  <CircularProgressRing percent={app.percent} color={app.color} />
                  <span className="font-medium text-slate-200">
                    {app.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-slate-400">
                    {app.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTarget({
                        type: 'app',
                        index: idx,
                        label: app.label,
                        duration: app.duration,
                      })
                    }
                    className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
                    title="Edit application"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Projects Card */}
      <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Projects
            </h3>
            <button
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {projects.map((proj, idx) => (
              <div
                key={proj.label}
                className="flex items-center justify-between text-xs sm:text-sm group hover:bg-[#23262F]/40 p-1.5 -mx-1.5 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-3">
                  <span className="font-mono font-medium text-slate-300 w-9 text-left shrink-0">
                    {proj.percent}%
                  </span>
                  <span className="font-medium text-slate-200 truncate w-24">
                    {proj.label}
                  </span>
                  {/* Linear Progress Bar */}
                  <div className="flex-1 h-2 rounded-full bg-[#23262F] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${proj.percent}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-medium text-slate-400">
                    {proj.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTarget({
                        type: 'project',
                        index: idx,
                        label: proj.label,
                        duration: proj.duration,
                      })
                    }
                    className="p-1 text-slate-500 hover:text-slate-200 transition-colors"
                    title="Edit project"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline Edit Modal */}
      {editingTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#1A1C23] border border-[#2B2F3A] p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white capitalize">
                Edit {editingTarget.type}
              </h4>
              <button
                type="button"
                onClick={() => setEditingTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  value={editingTarget.label}
                  onChange={(e) =>
                    setEditingTarget({ ...editingTarget, label: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#23262F] text-slate-100 border border-slate-700/60 focus:outline-hidden focus:border-[#38E1C2]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Duration</label>
                <input
                  type="text"
                  value={editingTarget.duration}
                  onChange={(e) =>
                    setEditingTarget({ ...editingTarget, duration: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#23262F] text-slate-100 border border-slate-700/60 focus:outline-hidden focus:border-[#38E1C2]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setEditingTarget(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-[#23262F] text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-xl bg-[#38E1C2] text-[#0a1c18] font-bold text-xs hover:bg-[#2dd4bf] flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
