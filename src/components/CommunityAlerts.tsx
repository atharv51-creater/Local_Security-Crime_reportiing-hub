import React, { useState } from 'react';
import { CommunityAlert } from '../types';
import { 
  AlertTriangle, 
  Radio, 
  Megaphone, 
  Plus, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  X, 
  Share2, 
  BellRing,
  Send,
  AlertOctagon,
  ShieldCheck
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface CommunityAlertsProps {
  alerts: CommunityAlert[];
  currentUserRole: 'citizen' | 'warden' | 'officer';
  onAddAlert: (alert: CommunityAlert) => void;
  onDismissAlert?: (id: string) => void;
}

export const CommunityAlerts: React.FC<CommunityAlertsProps> = ({
  alerts,
  currentUserRole,
  onAddAlert,
  onDismissAlert
}) => {
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [copiedAlertId, setCopiedAlertId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'danger' | 'warning' | 'advisory' | 'amber_alert'>('warning');
  const [zone, setZone] = useState<string>('Northside');
  const [actionRequired, setActionRequired] = useState<string>('Exercise caution and lock perimeter gates.');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    soundFX.playEmergencyAlert();

    const newAlert: CommunityAlert = {
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      type: alertType,
      message: message.trim(),
      zone,
      issuedBy: currentUserRole === 'officer' 
        ? 'Central Metro Precinct Dispatch' 
        : 'Zone Safety Watch Command',
      issuedAt: new Date().toISOString(),
      isActive: true,
      actionRequired: actionRequired.trim()
    };

    onAddAlert(newAlert);
    setShowBroadcastModal(false);
    setTitle('');
    setMessage('');
    setActionRequired('');
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/80',
          badge: 'bg-red-600 text-white',
          icon: <AlertOctagon className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 animate-pulse" />,
          titleColor: 'text-red-900 dark:text-red-300'
        };
      case 'amber_alert':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/80',
          badge: 'bg-amber-500 text-slate-950 font-black',
          icon: <BellRing className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />,
          titleColor: 'text-amber-900 dark:text-amber-300'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-500/80',
          badge: 'bg-orange-600 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 shrink-0" />,
          titleColor: 'text-orange-900 dark:text-orange-300'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/80',
          badge: 'bg-blue-600 text-white',
          icon: <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />,
          titleColor: 'text-blue-900 dark:text-blue-300'
        };
    }
  };

  const handleShare = (alert: CommunityAlert) => {
    soundFX.playClick();
    const text = `🚨 [SAFECITY ALERT] ${alert.title}\nSector: ${alert.zone}\nInstructions: ${alert.actionRequired}`;
    navigator.clipboard.writeText(text);
    setCopiedAlertId(alert.id);
    setTimeout(() => setCopiedAlertId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/25">
            <Radio className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Emergency Broadcasts & Citizen Bulletins</h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 rounded-full">
                LIVE FREQUENCY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified danger advisories and neighborhood alerts broadcasted by Metro Police Desk & Area Wardens
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            setShowBroadcastModal(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition"
        >
          <Plus className="w-4 h-4" /> Issue Broadcast Bulletin
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const style = getAlertStyles(alert.type);
          return (
            <div
              key={alert.id}
              className={`p-6 rounded-3xl border ${style.bg} space-y-4 shadow-sm dark:shadow-lg transition flex flex-col md:flex-row md:items-start justify-between gap-4`}
            >
              <div className="flex items-start gap-4 flex-1">
                {style.icon}

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${style.badge}`}>
                      {alert.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                      {alert.zone} Sector
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(alert.issuedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className={`text-base font-black ${style.titleColor}`}>
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="p-3 bg-white/70 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Required Action: <b className="text-slate-900 dark:text-white">{alert.actionRequired}</b>
                    </span>
                    <span className="text-[10px] text-slate-500 italic">
                      Issued by: {alert.issuedBy}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                <button
                  onClick={() => handleShare(alert)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedAlertId === alert.id ? 'Copied' : 'Share Alert'}
                </button>

                {onDismissAlert && (
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl text-xs"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500" />
                Broadcast Community Safety Bulletin
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Alert Level</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { val: 'danger', label: 'Danger / Lockdown' },
                    { val: 'warning', label: 'Warning / Caution' },
                    { val: 'amber_alert', label: 'Missing / Amber' },
                    { val: 'advisory', label: 'Public Advisory' }
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      type="button"
                      onClick={() => setAlertType(lvl.val as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold ${
                        alertType === lvl.val
                          ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-700 dark:text-red-300'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Sector Zone</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Northside">Northside Sector</option>
                  <option value="Downtown">Downtown Central</option>
                  <option value="Riverdale">Riverdale District</option>
                  <option value="West End">West End Suburbs</option>
                  <option value="Tech Park">Tech Park</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Bulletin Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash Warning: Suspicious armed individuals reported"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Details / Specific Advisory *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details, suspect physical indicators, perimeter guidelines..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Citizen Directives</label>
                <input
                  type="text"
                  placeholder="e.g. Stay indoors, verify delivery agents, call 100 on sighting"
                  value={actionRequired}
                  onChange={(e) => setActionRequired(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-red-500/25 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Transmit Emergency Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
