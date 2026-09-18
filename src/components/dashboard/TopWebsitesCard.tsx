import React from 'react';
import { WebsiteActivity } from '../../types';
import { formatDuration, getCategoryConfig } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Globe, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopWebsitesCardProps {
  websites: WebsiteActivity[];
  totalTime: number;
}

export const TopWebsitesCard: React.FC<TopWebsitesCardProps> = ({
  websites,
  totalTime,
}) => {
  const maxTime = websites.length > 0 ? websites[0].timeSpent : 1;

  return (
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 shadow-lg shadow-black/20 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Top Websites
          </h3>
          <Link
            to="/websites"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Websites ranked by active time spent today
        </p>

        <div className="space-y-3.5">
          {websites.slice(0, 5).map((site, index) => {
            const config = getCategoryConfig(site.category);
            const percentage = totalTime > 0 ? Math.round((site.timeSpent / totalTime) * 100) : 0;
            const barWidth = Math.min(100, Math.max(5, (site.timeSpent / maxTime) * 100));

            return (
              <div
                key={site.id}
                className="group p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400 w-4">
                      {index + 1}
                    </span>

                    {/* Favicon / Icon */}
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=64`}
                        alt={site.name}
                        className="w-4 h-4 rounded-xs"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <Globe className="w-3.5 h-3.5 text-slate-400 hidden group-hover:block" />
                    </div>

                    {/* Site Details */}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                        <span>{site.name}</span>
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-sky-400"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {site.domain}
                      </div>
                    </div>
                  </div>

                  {/* Time and Category */}
                  <div className="flex items-center gap-2.5 text-right shrink-0">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">
                        {formatDuration(site.timeSpent)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {percentage}% of total
                      </div>
                    </div>
                    <Badge category={site.category} size="sm" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: config.fill,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
