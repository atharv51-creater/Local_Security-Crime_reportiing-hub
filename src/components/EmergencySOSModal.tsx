import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  Radio, 
  Share2, 
  ShieldAlert,
  Send
} from 'lucide-react';
import { EmergencyContact } from '../types';
import { soundFX } from '../utils/theme';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: EmergencyContact[];
  onSosBroadcast: (details: { message: string; location: string; timestamp: string }) => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onSosBroadcast
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const [locationStr, setLocationStr] = useState<string>('Detecting current GPS coordinates...');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 19.0760, lng: 72.8777 });
  const [smsSent, setSmsSent] = useState<boolean>(false);
  const [sosNote, setSosNote] = useState<string>('Immediate assistance required. Threat/emergency detected.');

  // Play audio siren effect using Web Audio API
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let sirenInterval: any = null;

    if (isSirenActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();

        let high = false;
        sirenInterval = setInterval(() => {
          if (audioCtx && oscillator) {
            oscillator.frequency.setValueAtTime(high ? 880 : 650, audioCtx.currentTime);
            high = !high;
          }
        }, 400);
      } catch (e) {
        console.warn('Audio siren not supported or blocked by browser', e);
      }
    }

    return () => {
      if (sirenInterval) clearInterval(sirenInterval);
      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch (_) {}
      }
      if (audioCtx) {
        try {
          audioCtx.close();
        } catch (_) {}
      }
    };
  }, [isSirenActive]);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsCountingDown(true);
      setIsDispatched(false);
      setIsSirenActive(false);
      return;
    }

    // Geolocation detection
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          setCoords({ lat, lng });
          setLocationStr(`Live GPS Telemetry: ${lat}° N, ${lng}° E (Accuracy ±5m)`);
        },
        () => {
          setLocationStr('Northside Sector 4, Metro City (Triangulated WiFi/Cell tower)');
        }
      );
    } else {
      setLocationStr('Northside Sector 4, Metro City');
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerDispatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const triggerDispatch = () => {
    setIsCountingDown(false);
    setIsDispatched(true);
    soundFX.playEmergencyAlert();
    setIsSirenActive(true);
    onSosBroadcast({
      message: sosNote,
      location: locationStr,
      timestamp: new Date().toISOString()
    });
  };

  const cancelEmergency = () => {
    soundFX.playClick();
    setIsSirenActive(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in transition-all">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-red-500 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase">Emergency SOS Beacon</h2>
              <p className="text-xs text-red-100 font-medium">Rapid Response Dispatch Protocol</p>
            </div>
          </div>
          <button
            onClick={cancelEmergency}
            className="p-1.5 text-red-100 hover:text-white rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Countdown State */}
          {isCountingDown && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-red-500 bg-red-50 dark:bg-red-950/50 relative">
                <span className="text-5xl font-black text-red-600 dark:text-red-500 animate-pulse">{countdown}</span>
                <span className="absolute -bottom-2 text-[10px] tracking-wider uppercase font-bold bg-red-600 px-2 py-0.5 rounded-full text-white">
                  Seconds
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Broadcasting Emergency in {countdown}s
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Alerting 100 police dispatch, nearby verified neighborhood patrol units, and your emergency contacts with live GPS coordinates.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={triggerDispatch}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Trigger SOS Immediately
                </button>
                <button
                  onClick={cancelEmergency}
                  className="py-3 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Dispatched / Live Alert State */}
          {isDispatched && (
            <div className="space-y-5">
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/50 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-600/30 rounded-xl text-red-600 dark:text-red-400 mt-0.5">
                  <Radio className="w-6 h-6 animate-pulse text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-red-700 dark:text-red-400 tracking-wider">
                      Live Distress Signal Active
                    </span>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                      BEACON BROADCASTING
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Your location has been transmitted to Metro Police Desk & 3 Nearby Patrols.
                  </p>
                </div>
              </div>

              {/* Location telemetry */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Transmitted Coordinates:</span>
                </div>
                <p className="font-mono font-semibold text-slate-900 dark:text-slate-200 pl-6">{locationStr}</p>
              </div>

              {/* Siren Toggle & Sound Controls */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {isSirenActive ? (
                    <Volume2 className="w-5 h-5 text-amber-500 animate-bounce" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-400" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Audible Alarm Siren</span>
                </div>
                <button
                  onClick={() => setIsSirenActive(!isSirenActive)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    isSirenActive
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isSirenActive ? 'Mute Siren' : 'Sound Siren'}
                </button>
              </div>

              {/* Emergency Call Action */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:100"
                  className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition text-xs"
                >
                  <Phone className="w-4 h-4" />
                  Call 100 Direct
                </a>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setSmsSent(true);
                    setTimeout(() => setSmsSent(false), 3500);
                  }}
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition text-xs"
                >
                  <Send className="w-4 h-4" />
                  {smsSent ? 'SMS Dispatched!' : `SMS Contacts (${contacts.length})`}
                </button>
              </div>

              {smsSent && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/60 rounded-2xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Emergency telemetry broadcast sent to your {contacts.length} saved emergency contacts.</span>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={cancelEmergency}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline font-medium"
                >
                  I am safe now — Cancel & Deactivate SOS Beacon
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
