import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Globe,
  Layers,
  Activity,
  History as HistoryIcon,
  Settings,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useTimeTracking } from '../../hooks/useTimeTracking';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenTrackingModal: () => void;
  onOpenPopupModal: () => void;
  onOpenPrivacyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenTrackingModal,
  onOpenPopupModal,
  onOpenPrivacyModal,
}) => {
  const service = useTimeTracking();
  const status = service.getTrackingStatus();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/today', label: 'Today', icon: Calendar },
    { to: '/websites', label: 'Websites', icon: Globe },
    { to: '/tabs', label: 'Tabs', icon: Layers },
    { to: '/productivity', label: 'Productivity', icon: Activity },
    { to: '/history', label: 'History', icon: HistoryIcon },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Collapse Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-bold text-base text-white tracking-tight block truncate">
                  Browser Time
                </span>
                <span className="text-[10px] text-sky-400 font-mono block -mt-0.5">
                  v2.4.0 · Chrome &amp; Firefox
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors hidden md:block"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Compact Extension Popup Preview Launcher */}
        <div className="px-3 mt-4">
          <button
            type="button"
            onClick={onOpenPopupModal}
            className={`w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center transition-all cursor-pointer ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
            title="Preview 360x500 Browser Action Extension Popup"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              {!collapsed && <span>Extension Popup</span>}
            </span>
            {!collapsed && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Footer / Tracking Status & Quick Privacy */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Tracking Status Indicator Button */}
        <button
          type="button"
          onClick={onOpenTrackingModal}
          className={`w-full p-2.5 rounded-xl border transition-all text-left flex items-center cursor-pointer ${
            status.isActive
              ? 'bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/30'
              : 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/30'
          } ${collapsed ? 'justify-center' : 'justify-between'}`}
          title="Click to view & pause tracking"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                status.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {status.isActive ? 'Tracking Active' : 'Tracking Paused'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {status.currentDomain}
                </div>
              </div>
            )}
          </div>
        </button>

        {/* Privacy badge */}
        {!collapsed && (
          <button
            type="button"
            onClick={onOpenPrivacyModal}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] text-slate-400 hover:text-slate-300 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local telemetry · Zero cloud</span>
          </button>
        )}
      </div>
    </aside>
  );
};
