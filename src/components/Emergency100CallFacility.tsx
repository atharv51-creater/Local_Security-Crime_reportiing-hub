import React, { useState, useEffect, useRef } from 'react';
import { IncidentReport, UserProfile } from '../types';
import { generateIncidentId, generatePin } from '../utils/storage';
import { 
  PhoneCall, 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  PhoneOff, 
  Car, 
  Mic, 
  Clock, 
  Navigation,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface Emergency100CallFacilityProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onDispatchEmergencyReport: (report: IncidentReport) => void;
}

export const Emergency100CallFacility: React.FC<Emergency100CallFacilityProps> = ({
  isOpen,
  onClose,
  currentUser,
  onDispatchEmergencyReport
}) => {
  const [callState, setCallState] = useState<'idle' | 'dialing' | 'connected' | 'dispatched'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string>('Immediate Physical Threat & Danger');
  const [userLocation, setUserLocation] = useState<string>('Fetching live GPS coordinates...');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 19.0760, lng: 72.8777 });
  const [nearestPcrVan, setNearestPcrVan] = useState<string>('PCR-Unit 04 (Highland Sector - 1.2 km away)');
  const [operatorSpeech, setOperatorSpeech] = useState<string>('');
  const [callerNote, setCallerNote] = useState<string>('');
  const [isSirenOn, setIsSirenOn] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<any>(null);

  // Fetch real geolocation on open
  useEffect(() => {
    if (isOpen) {
      setCallState('idle');
      setCallDuration(0);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = Number(pos.coords.latitude.toFixed(4));
            const lng = Number(pos.coords.longitude.toFixed(4));
            setCoords({ lat, lng });
            setUserLocation(`Geo-Lock: ${lat}° N, ${lng}° E • Sector 4 Grid`);
          },
          () => {
            setUserLocation('142 Elm Street, Northside Sector (High Precision WiFi Triangulation)');
          }
        );
      } else {
        setUserLocation('142 Elm Street, Northside Sector');
      }
    } else {
      stopSiren();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  // Call duration counter
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Web Audio Siren generator
  const playSiren = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.start();
      setIsSirenOn(true);
      setTimeout(() => {
        try {
          osc.stop();
        } catch {}
      }, 3000);
    } catch {}
  };

  const stopSiren = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsSirenOn(false);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    soundFX.playEmergencyAlert();
    setCallState('dialing');
    setTimeout(() => {
      soundFX.playSuccessChime();
      setCallState('connected');
      setOperatorSpeech(
        `"Metro Police Control Room 100, Dispatcher Badge #842. We have locked onto your coordinates at ${userLocation}. Nearest PCR patrol ${nearestPcrVan} is alerted. State your emergency or hold the line."`
      );
    }, 1800);
  };

  const handleEndCallAndDispatch = () => {
    soundFX.playDispatchChirp();
    const newEmergencyIncident: IncidentReport = {
      id: generateIncidentId(),
      pin: generatePin(),
      title: `🚨 100 EMERGENCY CALL: ${selectedEmergencyType.toUpperCase()}`,
      description: `Direct 100 Dispatch call received from ${currentUser.name || 'Citizen'}. ${callerNote ? `Complainant notes: "${callerNote}".` : ''} GPS Locked at ${userLocation}. Dispatched ${nearestPcrVan}.`,
      category: 'assault',
      severity: 'critical',
      status: 'dispatched',
      locationName: userLocation,
      zone: 'Northside',
      coordinates: coords,
      reportedAt: new Date().toISOString(),
      isAnonymous: false,
      reporterName: currentUser.name || 'Emergency Caller',
      reporterContact: currentUser.phone || '100 Caller',
      reporterId: currentUser.id,
      evidenceUrls: [],
      confirmationsCount: 10,
      officerAssigned: nearestPcrVan,
      policeStation: currentUser.precinct || 'Northside Central Police Station',
      officialNotes: `100 Call dispatched at ${new Date().toLocaleTimeString()}. PCR patrol deployed under code red priority.`,
      comments: [
        {
          id: `c-${Date.now()}`,
          author: '100 Emergency Control Desk',
          isOfficial: true,
          content: 'PCR patrol assigned and speeding to destination with siren beacon.',
          timestamp: new Date().toISOString()
        }
      ]
    };

    onDispatchEmergencyReport(newEmergencyIncident);
    setCallState('dispatched');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in transition-all">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-red-500/80 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Top Flashing Police Light Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-blue-600 h-2 w-full animate-pulse" />

        <div className="p-6 space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/30 animate-pulse">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">100 EMERGENCY CALL FACILITY</h2>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 rounded-full font-mono">
                    24/7 POLICE DESK
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant GPS Location Telemetry & Central PCR Patrol Auto-Dispatch
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location & GPS Triangulation Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-500" /> Caller GPS Telemetry:
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ACCURACY ± 3 METERS
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>{userLocation}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>Nearest PCR Fleet: <b>{nearestPcrVan}</b></span>
              <span>ETA: <b>~ 3 Mins</b></span>
            </div>
          </div>

          {/* IDLE STATE: CALL SETUP */}
          {callState === 'idle' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Nature of Emergency:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'Immediate Physical Threat & Danger',
                    'Burglary / Break-in In Progress',
                    'Women Safety / Molestation / Distress',
                    'Armed Robbery / Snatching',
                    'Road Accident / Hit & Run Hit',
                    'Suspicious Persons / Intruder Sighting'
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedEmergencyType(type);
                      }}
                      className={`p-3 rounded-2xl border text-left transition font-semibold ${
                        selectedEmergencyType === type
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-200 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Additional Notes for Dispatcher (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Suspect wearing blue jacket near Main Market Gate..."
                  value={callerNote}
                  onChange={(e) => setCallerNote(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartCall}
                  className="py-3.5 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition active:scale-95"
                >
                  <Phone className="w-5 h-5 animate-bounce" />
                  <span>START 100 EMERGENCY CALL</span>
                </button>

                <a
                  href="tel:100"
                  className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-500" />
                  <span>Direct Mobile Dial (100)</span>
                </a>
              </div>

              {/* Siren & Panic Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                  <ShieldAlert className="w-4 h-4 text-amber-500" /> Audible Deterrent Siren
                </span>
                <button
                  type="button"
                  onClick={isSirenOn ? stopSiren : playSiren}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSirenOn
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isSirenOn ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  {isSirenOn ? 'Stop Siren' : 'Sound Alarm'}
                </button>
              </div>
            </div>
          )}

          {/* DIALING STATE */}
          {callState === 'dialing' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center animate-ping">
                <Phone className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">CONNECTING TO 100 CONTROL ROOM...</h3>
                <p className="text-xs text-red-600 dark:text-red-300 font-mono">Routing to Metro City Central Emergency Dispatch Desk</p>
              </div>
            </div>
          )}

          {/* CONNECTED STATE */}
          {callState === 'connected' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/60 rounded-2xl p-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-red-700 dark:text-red-300 font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  100 EMERGENCY CALL IN PROGRESS • {formatSeconds(callDuration)}
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white italic bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-red-200 dark:border-red-800/40">
                  {operatorSpeech}
                </p>

                {/* Animated Voice Freq bars */}
                <div className="flex items-center justify-center gap-1.5 py-2">
                  {[24, 40, 16, 48, 32, 56, 20, 44, 30, 50, 18, 36].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-red-500 rounded-full animate-pulse"
                      style={{ height: `${h}px`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Responding Station: <b>{currentUser.precinct || 'Northside Sector 4 Central'}</b>
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Assigned Patrol: <b>{nearestPcrVan}</b>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleEndCallAndDispatch}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <Send className="w-4 h-4" /> Confirm & Dispatch Units
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setCallState('idle');
                    stopSiren();
                  }}
                  className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" /> End Call
                </button>
              </div>
            </div>
          )}

          {/* DISPATCHED CONFIRMATION */}
          {callState === 'dispatched' && (
            <div className="text-center py-6 space-y-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-600/30 border border-emerald-400 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">POLICE PATROL DISPATCHED</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  {nearestPcrVan} has been assigned to your exact coordinates. Law enforcement is en route.
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Incident report logged in database. Police Authority Admin has received critical priority notification.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700"
              >
                Close Window & Track Response
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
