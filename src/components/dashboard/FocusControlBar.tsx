import React, { useState, useEffect } from 'react';
import {
  Power,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
  Coffee,
  CloudRain,
  Wind,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { ambientSound } from '../../utils/soundGenerator';
import { useTimeTracking } from '../../hooks/useTimeTracking';

export const FocusControlBar: React.FC = () => {
  const service = useTimeTracking();
  const status = service.getTrackingStatus();

  // Focus timer state (default 48 minutes = 2880s to match screenshot exactly)
  const [focusRemainingSeconds, setFocusRemainingSeconds] = useState(48 * 60);
  const [initialFocusSeconds, setInitialFocusSeconds] = useState(50 * 60);
  const [isFocusActive, setIsFocusActive] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);

  // Audio state
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [selectedSound, setSelectedSound] = useState('Coffee Shop');
  const [volume, setVolume] = useState(0.5);

  // Timer countdown
  useEffect(() => {
    if (!isFocusActive) return;
    const interval = setInterval(() => {
      setFocusRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsFocusActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFocusActive]);

  const formatTimerDigits = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerProgress = Math.max(0, Math.min(1, focusRemainingSeconds / initialFocusSeconds));
  const strokeDashoffset = 88 * (1 - timerProgress);

  const handleToggleSound = () => {
    const playing = ambientSound.toggle(selectedSound);
    setIsSoundPlaying(playing);
  };

  const handleSelectSound = (soundName: string) => {
    setSelectedSound(soundName);
    ambientSound.play(soundName);
    setIsSoundPlaying(true);
    setIsSoundMenuOpen(false);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSound.setVolume(newVol);
  };

  const handleSetFocusDuration = (mins: number) => {
    const secs = mins * 60;
    setInitialFocusSeconds(secs);
    setFocusRemainingSeconds(secs);
    setIsFocusActive(true);
    setIsDropdownOpen(false);
  };

  const soundOptions = [
    { name: 'Coffee Shop', icon: Coffee, desc: 'Warm café ambiance' },
    { name: 'Lofi Rain', icon: CloudRain, desc: 'Soothing window rainfall' },
    { name: 'Deep Drone', icon: Radio, desc: '432Hz binaural focus' },
    { name: 'White Noise', icon: Wind, desc: 'Gentle steady mask' },
  ];

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-4 py-2">
      {/* Left: Power Toggle + Circular Countdown + End Focus Dropdown */}
      <div className="flex items-center gap-3">
        {/* Power Button */}
        <button
          type="button"
          onClick={() => service.toggleTracking()}
          title={status.isActive ? 'Tracking is active. Click to pause.' : 'Tracking is paused. Click to resume.'}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border ${
            status.isActive
              ? 'bg-[#1b222c] border-[#38E1C2]/40 text-[#38E1C2] shadow-[0_0_15px_rgba(56,225,194,0.18)] hover:border-[#38E1C2]'
              : 'bg-[#1a1c23] border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-500'
          }`}
        >
          <Power className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Focus Timer Bar (matches screenshot) */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1A1C23] border border-[#2B2F3A] shadow-inner">
          {/* Circular SVG Ring */}
          <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="13.5"
                fill="none"
                stroke="#2B2F3A"
                strokeWidth="2.8"
              />
              <circle
                cx="16"
                cy="16"
                r="13.5"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.8"
                strokeDasharray="85"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
          </div>

          {/* Time digits & label */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#38BDF8] tracking-tight">
              {formatTimerDigits(focusRemainingSeconds)}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Focus Time Remaining
            </span>
          </div>
        </div>

        {/* End Focus Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E2026] hover:bg-[#252830] border border-[#2B2F3A] text-xs font-medium text-slate-200 transition-colors"
          >
            <span>{isFocusActive ? 'End Focus' : 'Start Focus'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-[#16181D] border border-[#2B2F3A] shadow-2xl p-2 z-50 text-xs">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Preset Durations
              </div>
              <button
                type="button"
                onClick={() => handleSetFocusDuration(25)}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#23262F] text-slate-200 flex items-center justify-between"
              >
                <span>25 min (Pomodoro)</span>
                {focusRemainingSeconds === 25 * 60 && <CheckCircle2 className="w-3.5 h-3.5 text-[#38E1C2]" />}
              </button>
              <button
                type="button"
                onClick={() => handleSetFocusDuration(48)}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#23262F] text-slate-200 flex items-center justify-between"
              >
                <span>48 min (Deep Focus)</span>
                {focusRemainingSeconds === 48 * 60 && <CheckCircle2 className="w-3.5 h-3.5 text-[#38E1C2]" />}
              </button>
              <button
                type="button"
                onClick={() => handleSetFocusDuration(60)}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#23262F] text-slate-200 flex items-center justify-between"
              >
                <span>60 min (Extended Flow)</span>
                {focusRemainingSeconds === 60 * 60 && <CheckCircle2 className="w-3.5 h-3.5 text-[#38E1C2]" />}
              </button>
              <div className="h-px bg-[#2B2F3A] my-1" />
              <button
                type="button"
                onClick={() => {
                  setIsFocusActive(!isFocusActive);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#23262F] text-amber-300"
              >
                {isFocusActive ? 'Pause Timer' : 'Resume Timer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFocusRemainingSeconds(0);
                  setIsFocusActive(false);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#23262F] text-rose-400"
              >
                End Focus Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Ambient Sound Widget (Coffee Shop ▶ 🔊) */}
      <div className="flex items-center gap-2 relative">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1A1C23] border border-[#2B2F3A] shadow-sm hover:border-slate-600 transition-colors">
          {/* Avatar / Cup icon */}
          <div className="w-6 h-6 rounded-full bg-[#2A2E39] flex items-center justify-center text-slate-300">
            <Coffee className="w-3.5 h-3.5 text-amber-300" />
          </div>

          {/* Sound Name Button */}
          <button
            type="button"
            onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
            className="text-xs font-medium text-slate-200 hover:text-white flex items-center gap-1"
          >
            <span>{selectedSound}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isSoundPlaying ? 'Pause sound' : 'Play ambient audio'}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            {isSoundPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[#38E1C2]" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-slate-300 ml-0.5" />
            )}
          </button>

          {/* Volume button */}
          <button
            type="button"
            onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.5)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-white"
            title={volume === 0 ? 'Unmute' : 'Mute'}
          >
            {volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Sound Picker Dropdown */}
        {isSoundMenuOpen && (
          <div className="absolute right-0 top-11 w-64 rounded-2xl bg-[#16181D] border border-[#2B2F3A] shadow-2xl p-2.5 z-50 text-xs">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Ambient Focus Soundscapes
            </div>
            <div className="space-y-1 my-1">
              {soundOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedSound === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => handleSelectSound(opt.name)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-[#23262F] text-[#38E1C2]' : 'hover:bg-[#1E2026] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-200">{opt.name}</div>
                        <div className="text-[10px] text-slate-500">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && isSoundPlaying && (
                      <span className="w-2 h-2 rounded-full bg-[#38E1C2] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-[#2B2F3A] my-2" />
            <div className="px-2 py-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#38E1C2] h-1.5 bg-[#2B2F3A] rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
