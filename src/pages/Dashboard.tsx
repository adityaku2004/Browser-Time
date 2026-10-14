import React, { useState } from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { formatDuration } from '../utils/formatters';
import { Clock, CheckCircle2, AlertOctagon, Activity, ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';
import { FocusControlBar } from '../components/dashboard/FocusControlBar';
import { ExecutiveDateHeader, ExecutiveRange } from '../components/dashboard/ExecutiveDateHeader';
import { ExecutiveKpiCards } from '../components/dashboard/ExecutiveKpiCards';
import { ExecutiveDailySummary } from '../components/dashboard/ExecutiveDailySummary';
import { ExecutiveTimeline } from '../components/dashboard/ExecutiveTimeline';
import { ExecutiveBreakdownGrid } from '../components/dashboard/ExecutiveBreakdownGrid';

// Original analytics components preserved
import { StatCard } from '../components/common/StatCard';
import { ActivityHeatmap } from '../components/charts/ActivityHeatmap';
import { HourlyActivityChart } from '../components/charts/HourlyActivityChart';
import { ProductivityDonut } from '../components/charts/ProductivityDonut';
import { TopWebsitesCard } from '../components/dashboard/TopWebsitesCard';
import { ProductivityScoreCard } from '../components/dashboard/ProductivityScoreCard';
import { DistractionCard } from '../components/dashboard/DistractionCard';
import { InsightsCard } from '../components/dashboard/InsightsCard';

export const Dashboard: React.FC = () => {
  const service = useTimeTracking();
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  
  // Executive view controls (default to May 22, 2025 to match screenshot)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 4, 22));
  const [selectedRange, setSelectedRange] = useState<ExecutiveRange>('Day');
  const [showDeepAnalytics, setShowDeepAnalytics] = useState<boolean>(true);

  const summary = service.getDailySummary(selectedDate);
  const websites = service.getWebsites();
  const history = service.getDailyHistory();
  const hourly = service.getHourlyActivity();
  const scoreFactors = service.getScoreFactors();
  const insights = service.getInsights();

  const total = summary.totalTime || 1;
  const prodPct = Math.round((summary.productiveTime / total) * 100);
  const distPct = Math.round((summary.distractingTime / total) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Focus Bar (Power Toggle + 48:00 Timer + End Focus + Ambient Coffee Sound) */}
      <FocusControlBar />

      {/* 2. Executive Date Header (Today Nice Day ☀️, Date Title, Day/Week/Month/Year Switcher, < 📅 >) */}
      <ExecutiveDateHeader
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      {/* 3. Row 1: KPI Cards (Work Hours, Percent of Target in Mint, Focus Percent) + Daily Summary Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* Left: 3 KPI Metrics (Span 7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <ExecutiveKpiCards
            workHoursFormatted="7hr 30min"
            targetHoursFormatted="7hr 30min"
            targetPercent={90}
            focusPercent={80}
          />
        </div>

        {/* Right: Daily Summary - Today Donut Card (Span 5 cols) */}
        <div className="lg:col-span-5">
          <ExecutiveDailySummary
            focusPercent={50}
            breaksPercent={30}
            meetingPercent={20}
            focusDuration="5h 10 min"
            meetingDuration="1h 15 min"
            breaksDuration="1h 5 min"
          />
        </div>
      </div>

      {/* 4. Row 2: Visual 6am–6pm Continuous Timeline */}
      <ExecutiveTimeline />

      {/* 5. Row 3: Three-Column Breakdown Grid (Categories, Apps & Websites, Projects) */}
      <ExecutiveBreakdownGrid />

      {/* 6. Section Divider: Deep Analytics & 12-Week Browsing History (Preserving All Previous Contents) */}
      <div className="pt-6 border-t border-[#2B2F3A]/80">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Deep Analytics &amp; Browsing Telemetry
                <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Full Dataset
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                12-week GitHub-style heatmap, 24-hour activity curves, and domain productivity breakdown.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDeepAnalytics(!showDeepAnalytics)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1C23] hover:bg-[#23262F] border border-[#2B2F3A] text-xs font-semibold text-slate-300 transition-colors"
          >
            <span>{showDeepAnalytics ? 'Collapse Deep Telemetry' : 'Expand Deep Telemetry'}</span>
            {showDeepAnalytics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showDeepAnalytics && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                id="stat-total-time"
                title="Total Browsing Time"
                value={formatDuration(summary.totalTime)}
                subtitle="+12% vs yesterday"
                icon={Clock}
                iconColor="text-sky-400"
              />

              <StatCard
                id="stat-productive-time"
                title="Productive Time"
                value={formatDuration(summary.productiveTime)}
                subtitle={`${prodPct}% of active time`}
                icon={CheckCircle2}
                iconColor="text-emerald-400"
                progressPercent={prodPct}
                progressColor="emerald"
              />

              <StatCard
                id="stat-distraction-time"
                title="Distraction Time"
                value={formatDuration(summary.distractingTime)}
                subtitle={`${distPct}% of active time`}
                icon={AlertOctagon}
                iconColor="text-rose-400"
                progressPercent={distPct}
                progressColor="rose"
              />

              <StatCard
                id="stat-productivity-score"
                title="Productivity Score"
                value={`${summary.productivityScore} / 100`}
                subtitle="+6 points vs yesterday"
                icon={Activity}
                iconColor="text-emerald-400"
                scoreCircle
                statusBadge={summary.productivityScore >= 70 ? 'Good' : 'Moderate'}
                statusColor={
                  summary.productivityScore >= 70
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                }
              />
            </div>

            {/* Daily Activity Heatmap (12 Weeks) */}
            <ActivityHeatmap
              data={history}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date === selectedDate ? undefined : date)}
            />

            {/* Hourly Activity Chart */}
            <HourlyActivityChart data={hourly} />

            {/* Grid: Top Websites & Productivity Breakdown Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopWebsitesCard
                websites={websites}
                totalTime={summary.totalTime}
              />

              <ProductivityDonut
                productiveSeconds={summary.productiveTime}
                distractingSeconds={summary.distractingTime}
                neutralSeconds={summary.neutralTime}
                totalSeconds={summary.totalTime}
              />
            </div>

            {/* Grid: Productivity Score Factors & Distraction Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductivityScoreCard
                score={summary.productivityScore}
                factors={scoreFactors}
              />

              <DistractionCard
                distractingSeconds={summary.distractingTime}
                totalSeconds={summary.totalTime}
                websites={websites}
              />
            </div>

            {/* Automated Productivity Insights */}
            <InsightsCard insights={insights} />
          </div>
        )}
      </div>
    </div>
  );
};
