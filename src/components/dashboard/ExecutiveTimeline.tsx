import React, { useState } from 'react';
import { MoreHorizontal, Clock, Calendar, CheckCircle2, Video, Coffee } from 'lucide-react';

interface TimelineBlock {
  id: string;
  startHour: number; // e.g. 8.0 = 8:00 am
  endHour: number; // e.g. 10.75 = 10:45 am
  title: string;
  category: 'focus' | 'meeting' | 'break' | 'idle';
  color: string;
  app: string;
  notes?: string;
}

export const ExecutiveTimeline: React.FC = () => {
  const [activeSession, setActiveSession] = useState<TimelineBlock | null>(null);
  const [hoveredSession, setHoveredSession] = useState<TimelineBlock | null>(null);

  // Time range: 6:00 am to 6:00 pm (12 hours)
  const startDayHour = 6;
  const endDayHour = 18;
  const totalHours = endDayHour - startDayHour; // 12

  // Sessions accurately matching the blocks in the screenshot
  const blocks: TimelineBlock[] = [
    {
      id: 'b1',
      startHour: 8.0,
      endHour: 10.7,
      title: 'Deep Focus - UI & System Architecture',
      category: 'focus',
      color: '#38BDF8', // Cyan / Sky blue
      app: 'Figma & VS Code',
      notes: 'Focused wireframing and design token alignment',
    },
    {
      id: 'b2',
      startHour: 10.7,
      endHour: 11.2,
      title: 'Weekly Product Alignment Sync',
      category: 'meeting',
      color: '#3B82F6', // Royal blue
      app: 'Google Meet',
      notes: 'Review sprint deliverables with team',
    },
    {
      id: 'b3',
      startHour: 11.2,
      endHour: 13.0,
      title: 'Design Exploration & Prototyping',
      category: 'focus',
      color: '#4EECD3', // Mint
      app: 'Figma',
      notes: 'Created interactive prototype flows',
    },
    {
      id: 'b4',
      startHour: 14.0,
      endHour: 16.25,
      title: 'Component Engineering & Verification',
      category: 'focus',
      color: '#38BDF8', // Sky blue
      app: 'GitHub & Chrome',
      notes: 'Implemented state service and unit verification',
    },
    {
      id: 'b5',
      startHour: 16.25,
      endHour: 16.85,
      title: 'Client Catchup & Feedback Review',
      category: 'meeting',
      color: '#3B82F6', // Royal blue
      app: 'Zoom',
      notes: 'Walkthrough analytics dashboard milestone',
    },
    {
      id: 'b6',
      startHour: 16.85,
      endHour: 17.5,
      title: 'Sprint Wrap-up & Slack Comms',
      category: 'focus',
      color: '#4EECD3', // Mint
      app: 'Slack & Notion',
      notes: 'Organized daily recap and documented tickets',
    },
  ];

  const ticks = [
    '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm',
    '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm'
  ];

  const formatHourString = (hourNum: number) => {
    const whole = Math.floor(hourNum);
    const mins = Math.round((hourNum - whole) * 60);
    const period = whole >= 12 ? 'pm' : 'am';
    const displayHour = whole > 12 ? whole - 12 : whole;
    return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="p-5 lg:p-6 rounded-3xl bg-[#1A1C23] border border-[#2B2F3A] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-white tracking-tight">
            Timeline
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            Continuous activity stream (6:00 AM – 6:00 PM)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setActiveSession(blocks[0])}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#252830] transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Timeline Bar Container */}
      <div className="relative pt-2 pb-1">
        {/* Timeline Bar Track (matches the recessed dark bar in screenshot) */}
        <div className="relative h-16 sm:h-20 w-full rounded-xl bg-[#131418] border border-[#2B2F3A] overflow-hidden">
          {/* Subtle hour grid lines */}
          <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
            {ticks.map((_, i) => (
              <div key={i} className="h-full w-px bg-slate-600" />
            ))}
          </div>

          {/* Idle / Break background slots */}
          {/* 1:00pm - 2:00pm Lunch break block */}
          <div
            className="absolute top-0 bottom-0 bg-[#1E2026]/80 flex items-center justify-center pointer-events-none"
            style={{
              left: `${((13.0 - startDayHour) / totalHours) * 100}%`,
              width: `${(1.0 / totalHours) * 100}%`,
            }}
          >
            <span className="text-[10px] text-slate-500 font-medium hidden md:inline">Lunch Break</span>
          </div>

          {/* Activity Session Blocks */}
          {blocks.map((block) => {
            const leftPct = ((block.startHour - startDayHour) / totalHours) * 100;
            const widthPct = ((block.endHour - block.startHour) / totalHours) * 100;
            const isHovered = hoveredSession?.id === block.id;

            return (
              <div
                key={block.id}
                onClick={() => setActiveSession(block)}
                onMouseEnter={() => setHoveredSession(block)}
                onMouseLeave={() => setHoveredSession(null)}
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  backgroundColor: block.color,
                }}
                className={`absolute top-1 bottom-1 rounded-sm cursor-pointer transition-all duration-150 ${
                  isHovered ? 'brightness-110 shadow-lg scale-y-105 z-20' : 'opacity-95 z-10'
                }`}
              />
            );
          })}
        </div>

        {/* Hover Tooltip Float */}
        {hoveredSession && (
          <div
            className="absolute -top-12 z-30 pointer-events-none transition-all duration-100"
            style={{
              left: `${Math.min(
                85,
                Math.max(5, ((hoveredSession.startHour - startDayHour) / totalHours) * 100)
              )}%`,
            }}
          >
            <div className="bg-[#0f1115] border border-slate-700 text-white px-3 py-1.5 rounded-xl shadow-xl text-xs whitespace-nowrap flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: hoveredSession.color }}
              />
              <span className="font-bold">{hoveredSession.title}</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {formatHourString(hoveredSession.startHour)} – {formatHourString(hoveredSession.endHour)}
              </span>
            </div>
          </div>
        )}

        {/* Tick Marks & Hour Labels underneath */}
        <div className="flex justify-between items-center mt-2.5 px-1 text-[10px] sm:text-xs text-slate-400 font-medium font-mono select-none overflow-x-auto">
          {ticks.map((tick) => (
            <span key={tick} className="shrink-0 text-center">
              {tick}
            </span>
          ))}
        </div>
      </div>

      {/* Session Details Modal when clicking any block */}
      {activeSession && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveSession(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#1A1C23] border border-[#2B2F3A] p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: activeSession.color }}
                />
                <h4 className="text-base font-bold text-white">
                  {activeSession.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveSession(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Time Range:</span>
                <span className="font-mono text-white font-medium">
                  {formatHourString(activeSession.startHour)} – {formatHourString(activeSession.endHour)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-mono text-white font-medium">
                  {Math.round((activeSession.endHour - activeSession.startHour) * 60)} minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="capitalize font-semibold text-[#38E1C2]">
                  {activeSession.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Applications:</span>
                <span className="text-slate-200">{activeSession.app}</span>
              </div>
              {activeSession.notes && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Notes:</span>
                  <p className="text-slate-200 bg-[#131418] p-2.5 rounded-xl border border-slate-800">
                    {activeSession.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveSession(null)}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
