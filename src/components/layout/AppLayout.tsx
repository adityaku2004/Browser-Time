import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TrackingStatusModal } from '../common/TrackingStatusModal';
import { ExtensionPopupModal } from '../common/ExtensionPopupModal';
import { PrivacyModal } from '../common/PrivacyModal';
import { DateRangeOption } from '../../types';
import { Menu } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('today');
  const [dateOffset, setDateOffset] = useState(0);
  const location = useLocation();

  // Modals
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Derive date label
  const getDateLabel = () => {
    if (selectedRange === 'today') {
      if (dateOffset === 0) return 'Today, May 22';
      if (dateOffset === -1) return 'Yesterday, May 21';
      return `${Math.abs(dateOffset)} days ago`;
    }
    if (selectedRange === 'yesterday') return 'Yesterday, May 21';
    if (selectedRange === 'week') return 'Week 21, 2025';
    return 'May 2025';
  };

  const handlePrevDate = () => setDateOffset((prev) => prev - 1);
  const handleNextDate = () => setDateOffset((prev) => Math.min(0, prev + 1));

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#16181D] text-slate-100 flex">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
        onOpenPopupModal={() => setIsPopupModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* On non-dashboard pages, render traditional header */}
        {!isDashboard ? (
          <Header
            selectedRange={selectedRange}
            onChangeRange={setSelectedRange}
            onPrevDate={handlePrevDate}
            onNextDate={handleNextDate}
            dateLabel={getDateLabel()}
            onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
            onOpenPopupModal={() => setIsPopupModalOpen(true)}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
            onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          />
        ) : (
          /* On Dashboard, small mobile-only bar for drawer toggle */
          <div className="md:hidden flex items-center justify-between p-3 border-b border-[#23262F] bg-[#16181D]">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl bg-[#1E2026] border border-[#2B2F3A] text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-white">Browser Time</span>
            <button
              type="button"
              onClick={() => setIsPopupModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-[#1E2026] border border-[#2B2F3A] text-xs text-[#4EECD3]"
            >
              Popup
            </button>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-7 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Interactive Global Modals */}
      <TrackingStatusModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
      <ExtensionPopupModal
        isOpen={isPopupModalOpen}
        onClose={() => setIsPopupModalOpen(false)}
      />
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
