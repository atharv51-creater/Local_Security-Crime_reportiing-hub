import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  AlertTriangle, 
  Plus, 
  Map, 
  ListFilter, 
  Users, 
  BarChart3, 
  Lock, 
  PhoneCall, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  Bot, 
  User, 
  Phone,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Activity,
  Sparkles,
  Wifi
} from 'lucide-react';
import { UserProfile } from '../types';
import { ThemeMode, soundFX } from '../utils/theme';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenSosModal: () => void;
  onOpen100Facility: () => void;
  onOpenAuthModal: () => void;
  currentUser: UserProfile;
  activeAlertsCount: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenSosModal,
  onOpen100Facility,
  onOpenAuthModal,
  currentUser,
  activeAlertsCount,
  theme,
  onToggleTheme
}) => {
  const isPolice = currentUser.role === 'police_authority';
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getIsMuted());
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  const handleTabClick = (tabId: string) => {
    soundFX.playClick();
    setActiveTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-2xl transition-colors duration-300">
      
      {/* Top Telemetry & Safety Ticker Ribbon */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-[11px] font-mono py-1 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between border-b border-blue-500/20">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none py-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-emerald-300">DEFCON 4: CITY STATUS NORMAL</span>
          </div>
          <span className="text-slate-400 hidden md:inline">|</span>
          <div className="flex items-center gap-1.5 shrink-0 text-slate-200">
            <Wifi className="w-3 h-3 text-blue-400 shrink-0" />
            <span>PCR FLEET: <b>18 PATROLS ACTIVE</b></span>
          </div>
          <span className="text-slate-400 hidden lg:inline">|</span>
          <div className="flex items-center gap-1.5 shrink-0 text-amber-300 hidden sm:flex">
            <Activity className="w-3 h-3 text-amber-400 shrink-0" />
            <span>DISPATCH AVG RESPONSE: <b>3.8 MINS</b></span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto pt-0.5 sm:pt-0">
          <span className="text-slate-300 font-bold bg-white/10 px-2 py-0.5 rounded text-[10px]">
            IST {currentTime || 'LIVE'}
          </span>
          <span className="text-[10px] text-blue-200 hidden xl:inline">
            ENCRYPTED DISPATCH FREQUENCY: 156.800 MHz
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => handleTabClick('feed')}>
            <div className="p-2.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/25 border border-blue-400/40 group-hover:scale-105 transition-transform duration-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SafeCity Hub
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-blue-200 dark:border-emerald-700/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Police Link
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Citizen Crime Reporting, 100 Dispatch & Legal Defense
            </p>
          </div>
        </div>

        {/* Action Bar & Theme / Audio Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          
          {/* 100 EMERGENCY CALL FACILITY BUTTON */}
          <button
            onClick={() => {
              soundFX.playEmergencyAlert();
              onOpen100Facility();
            }}
            className="py-2 px-3 sm:px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 dark:shadow-red-900/60 flex items-center gap-1.5 border border-red-400/60 transition active:scale-95 animate-pulse"
          >
            <Phone className="w-4 h-4 animate-bounce" />
            <span>100 Emergency Call</span>
          </button>

          {/* Quick File Incident Report Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenReportModal();
            }}
            className="py-2 px-3 sm:px-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">File Crime Report</span>
            <span className="sm:hidden">Report</span>
          </button>

          {/* Emergency Panic SOS */}
          <button
            onClick={() => {
              soundFX.playEmergencyAlert();
              onOpenSosModal();
            }}
            className="py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/80 dark:hover:bg-red-900/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-600/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Instant Siren & GPS Distress"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="hidden md:inline">SOS Alarm</span>
          </button>

          {/* THEME TOGGLE BUTTON (LIGHT / DARK) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* SOUND FX MUTE TOGGLE */}
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={isMuted ? 'Unmute UI Sound FX' : 'Mute UI Sound FX'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            )}
          </button>

          {/* User Auth Badge & Portal Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenAuthModal();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition font-bold ${
                isPolice
                  ? 'bg-amber-600 text-slate-950 shadow-md shadow-amber-900/40'
                  : 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              }`}
            >
              {isPolice ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="max-w-[110px] truncate">
                    {currentUser.badgeNumber || 'Police Desk'}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onOpenAuthModal();
              }}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-1.5 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold"
              title="Switch between Citizen & Police Authority Portal"
            >
              Switch
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Tabs with Smooth Horizontal Scrolling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1.5 pb-2.5 scrollbar-none text-xs font-semibold">
        {[
          { id: 'feed', label: 'Citizen Incident Feed', icon: ListFilter },
          { id: 'map', label: 'Live Google & Crime Map', icon: Map },
          { id: 'chatbot', label: 'Crime Laws AI Chatbot', icon: Bot, highlight: true },
          { id: 'lawyers', label: 'Lawyer Guidance & Chat', icon: Scale },
          ...(isPolice ? [{ id: 'police_admin', label: 'Police Authority Desk', icon: ShieldCheck, admin: true }] : []),
          { id: 'alerts', label: `Emergency Alerts (${activeAlertsCount})`, icon: Radio },
          { id: 'zones', label: 'Safety Zones & Patrols', icon: Users },
          { id: 'tracker', label: 'Case Tracker', icon: Lock },
          { id: 'analytics', label: 'Crime Analytics', icon: BarChart3 },
          { id: 'contacts', label: '100 & Emergency Helplines', icon: PhoneCall },
          { id: 'guides', label: 'Safety Handbook', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                tab.admin
                  ? isActive
                    ? 'bg-amber-600 text-slate-950 font-black shadow-lg shadow-amber-600/30'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/50 hover:bg-amber-200 dark:hover:bg-amber-900/60 font-bold'
                  : tab.highlight
                  ? isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                  : isActive
                  ? 'bg-blue-600 text-white dark:bg-blue-600/20 dark:text-blue-400 dark:border dark:border-blue-500/40 font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

    </header>
  );
};
