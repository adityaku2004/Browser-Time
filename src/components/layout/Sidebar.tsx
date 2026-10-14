import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  PieChart,
  Box,
  UserCheck,
  History as HistoryIcon,
  TrendingUp,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
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
    { to: '/today', label: 'Today', icon: Clock },
    { to: '/productivity', label: 'Productivity', icon: PieChart },
    { to: '/websites', label: 'Websites', icon: Box },
    { to: '/tabs', label: 'Tabs', icon: UserCheck },
    { to: '/history', label: 'History', icon: TrendingUp },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#16181D] border-r border-[#2B2F3A] flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top: Logo & Main Navigation */}
      <div>
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-4.5 border-b border-[#23262F]">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Cyan Geometric Logo (matching screenshot) */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                <path
                  d="M10 6L18 14H10L2 6H10Z"
                  fill="#4EECD3"
                />
                <path
                  d="M18 14L26 22H18L10 14H18Z"
                  fill="#38BDF8"
                />
                <path
                  d="M26 22L34 30H26L18 22H26Z"
                  fill="#4EECD3"
                />
              </svg>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-bold text-base text-white tracking-tight block truncate">
                  Browser Time
                </span>
                <span className="text-[10px] text-[#4EECD3] font-mono block -mt-0.5">
                  Focus &amp; Analytics
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#23262F] transition-colors hidden md:block"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items (matches screenshot button aesthetic) */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#4EECD3] text-[#0c2420] shadow-md shadow-[#4EECD3]/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#23262F]/80'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4.5 h-4.5 shrink-0 stroke-[2.2]" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Compact Extension Popup Preview Launcher */}
        <div className="px-3 mt-3">
          <button
            type="button"
            onClick={onOpenPopupModal}
            className={`w-full py-2 px-3 rounded-2xl bg-[#1E2026] hover:bg-[#252830] border border-[#2B2F3A] text-slate-300 text-xs font-medium flex items-center transition-all ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
            title="Preview 360x500 Browser Extension Popup"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4EECD3]" />
              {!collapsed && <span>Extension Popup</span>}
            </span>
            {!collapsed && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Bottom Icons & User Profile Avatar (matching screenshot) */}
      <div className="p-3 border-t border-[#23262F] space-y-2">
        {/* Help & Settings Bar */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-around'} py-1`}>
          <button
            type="button"
            onClick={onOpenPrivacyModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#23262F] transition-colors"
            title="Privacy & Data Transparency"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `p-2 rounded-xl transition-colors ${
                isActive
                  ? 'bg-[#4EECD3] text-[#0c2420]'
                  : 'text-slate-400 hover:text-white hover:bg-[#23262F]'
              }`
            }
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </NavLink>
        </div>

        {/* User Avatar with Profile Card */}
        <div
          className={`flex items-center gap-3 p-2 rounded-2xl bg-[#1A1C23] border border-[#2B2F3A] ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/user_avatar_profile_1791727381738.jpg"
              alt="User Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#4EECD3]/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4EECD3] ring-2 ring-[#16181D]" />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                Aditya Udai
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Pro Member · Sync Active
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
