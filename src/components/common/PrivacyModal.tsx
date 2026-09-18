import React from 'react';
import { ShieldCheck, HardDrive, UserX, CloudOff, EyeOff, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Privacy Architecture
              </h3>
              <p className="text-xs text-slate-400">Zero-knowledge local telemetry</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200 leading-relaxed font-medium">
          "Your browsing data stays on your device. We believe productivity insights should empower you without compromising your personal digital privacy."
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <HardDrive className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">Local-Only Tracking</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All tab durations, domain classifications, and timestamps are held exclusively inside your browser's local sandbox storage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <UserX className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">No Account Required</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Zero logins, zero passwords, and zero user identifiers. Your statistics are never linked to any personal email or identity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <CloudOff className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">No Browsing History Uploaded</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Full URLs, page queries, and session content are never sent across the network to any analytics or advertising server.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <EyeOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">Pause Anytime &amp; Exclude Domains</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Quickly pause monitoring with a single click or blacklist sensitive banking, healthcare, or internal company domains.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
