import React, { useState } from 'react';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { formatDuration } from '../utils/formatters';
import { Clock, CheckCircle2, AlertOctagon, Activity } from 'lucide-react';
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
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Time */}
        <StatCard
          id="stat-total-time"
          title="Total Browsing Time"
          value={formatDuration(summary.totalTime)}
          subtitle="+12% vs yesterday"
          icon={Clock}
          iconColor="text-sky-400"
        />

        {/* Card 2: Productive Time */}
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

        {/* Card 3: Distraction Time */}
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

        {/* Card 4: Productivity Score */}
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

      {/* Daily Activity Heatmap */}
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
  );
};
