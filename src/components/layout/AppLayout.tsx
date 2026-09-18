import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TrackingStatusModal } from '../common/TrackingStatusModal';
import { ExtensionPopupModal } from '../common/ExtensionPopupModal';
import { PrivacyModal } from '../common/PrivacyModal';
import { DateRangeOption } from '../../types';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('today');
  const [dateOffset, setDateOffset] = useState(0);

  // Modals
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Derive date label
  const getDateLabel = () => {
    if (selectedRange === 'today') {
      if (dateOffset === 0) return 'Today, Sep 10';
      if (dateOffset === -1) return 'Yesterday, Sep 9';
      return `${Math.abs(dateOffset)} days ago`;
    }
    if (selectedRange === 'yesterday') return 'Yesterday, Sep 9';
    if (selectedRange === 'week') return 'Week 37, 2026';
    return 'September 2026';
  };

  const handlePrevDate = () => setDateOffset((prev) => prev - 1);
  const handleNextDate = () => setDateOffset((prev) => Math.min(0, prev + 1));

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex">
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

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
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
