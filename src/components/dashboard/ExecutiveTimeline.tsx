import React, { useState } from 'react';
import { MoreHorizontal, Clock } from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { formatDuration } from '../../utils/formatters';

interface TimelineBlock {
  id: string;
  startHour: number; // e.g. 8.0 = 8:00 am
  endHour: number; // e.g. 10.75 = 10:45 am
  title: string;
  category: 'focus' | 'meeting' | 'break' | 'idle';
  color: string;
  app: string;
  durationSeconds: number;
}

export const ExecutiveTimeline: React.FC = () => {
  const service = useTimeTracking();
  const timelineItems = service.getTimeline();
  const [activeSession, setActiveSession] = useState<TimelineBlock | null>(null);
  const [hoveredSession, setHoveredSession] = useState<TimelineBlock | null>(null);

  // Time range: 6:00 am to 6:00 pm (12 hours)
  const startDayHour = 6;
  const endDayHour = 18;
  const totalHours = endDayHour - startDayHour; // 12

  // Convert real timeline items into visual timeline blocks between 6am and 6pm
  const blocks: TimelineBlock[] = React.useMemo(() => {
    return timelineItems.map((item) => {
      // Parse hour from item.time string (e.g. "09:30 AM", "10:15 AM")
      let startH = 9;
      try {
        const parts = item.time.split(/[:\s]/);
        if (parts.length >= 2) {
          let h = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) || 0;
          const isPM = item.time.toUpperCase().includes('PM');
          if (isPM && h < 12) h += 12;
          if (!isPM && h === 12) h = 0;
          startH = h + m / 60;
        }
      } catch {
        startH = 9;
      }

      // Clamp between 6am and 6pm
      const durationH = Math.max(0.1, item.duration / 3600);
      const clampedStart = Math.max(startDayHour, Math.min(endDayHour - 0.2, startH));
      const clampedEnd = Math.min(endDayHour, clampedStart + durationH);

      const color =
        item.category === 'productive'
          ? '#38BDF8'
          : item.category === 'distracting'
          ? '#F43F5E'
          : '#4EECD3';

      return {
        id: item.id,
        startHour: clampedStart,
        endHour: clampedEnd,
        title: item.title || item.name,
        category: item.category === 'productive' ? 'focus' : 'idle',
        color,
        app: item.domain,
        durationSeconds: item.duration,
      };
    });
  }, [timelineItems]);

  const ticks = [
    '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm',
    '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm'
  ];

  const formatHourString = (hourNum: number) => {
    const whole = Math.floor(hourNum);
    const mins = Math.round((hourNum - whole) * 60);
    const period = whole >= 12 ? 'pm' : 'am';
    const displayHour = whole > 12 ? whole - 12 : whole === 0 ? 12 : whole;
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
      </div>

      {/* Visual Timeline Bar Container */}
      <div className="relative pt-2 pb-1">
        {/* Timeline Bar Track */}
        <div className="relative h-16 sm:h-20 w-full rounded-xl bg-[#131418] border border-[#2B2F3A] overflow-hidden flex items-center justify-center">
          {/* Subtle hour grid lines */}
          <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
            {ticks.map((_, i) => (
              <div key={i} className="h-full w-px bg-slate-600" />
            ))}
          </div>

          {blocks.length === 0 ? (
            <div className="text-slate-500 text-xs font-medium z-10 px-4 text-center">
              No activity recorded today yet. Browsing activity between 6:00 AM and 6:00 PM will appear here.
            </div>
          ) : (
            blocks.map((block) => {
              const leftPct = ((block.startHour - startDayHour) / totalHours) * 100;
              const widthPct = Math.max(1.5, ((block.endHour - block.startHour) / totalHours) * 100);
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
            })
          )}
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

      {/* Session Details Modal */}
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
                  {formatDuration(activeSession.durationSeconds)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Domain:</span>
                <span className="text-slate-200 font-mono">{activeSession.app}</span>
              </div>
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
