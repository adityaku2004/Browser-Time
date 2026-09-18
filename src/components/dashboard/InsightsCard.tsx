import React from 'react';
import { ProductivityInsight } from '../../types';
import { Zap, Sun, Code, Repeat, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

interface InsightsCardProps {
  insights: ProductivityInsight[];
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-sky-400" />;
      case 'Code':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'Repeat':
        return <Repeat className="w-4 h-4 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Productivity Insights</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated intelligence synthesized from your daily browsing patterns
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          5 Insights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(insight.icon)}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{insight.title}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        ))}

        {/* Actionable recommendation card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-sky-950/30 to-slate-900/60 border border-sky-800/40 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-900/50 border border-sky-700/60 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-sky-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-sky-200">Recommended Action</div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Block YouTube during 9:00 AM - 12:00 PM to protect your 52m morning peak focus block.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
