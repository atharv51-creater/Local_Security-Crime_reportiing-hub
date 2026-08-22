import React, { useState } from 'react';
import { 
  MapPin, 
  Flame, 
  Layers, 
  Shield, 
  Plus, 
  Minus, 
  RotateCcw, 
  Eye, 
  Compass, 
  AlertTriangle, 
  Building2, 
  Hospital, 
  ShieldAlert,
  ChevronRight,
  Info,
  Car,
  Navigation
} from 'lucide-react';
import { IncidentReport, SafetyZone } from '../types';
import { soundFX } from '../utils/theme';

interface IncidentMapProps {
  incidents: IncidentReport[];
  zones: SafetyZone[];
  onSelectIncident: (incident: IncidentReport) => void;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  zones,
  onSelectIncident
}) => {
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showSafeHavens, setShowSafeHavens] = useState<boolean>(true);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePin, setActivePin] = useState<IncidentReport | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map coordinates projection helpers:
  const getX = (lng: number) => {
    const minLng = -74.015;
    const maxLng = -73.970;
    const pct = ((lng - minLng) / (maxLng - minLng)) * 100;
    return Math.max(8, Math.min(92, pct));
  };

  const getY = (lat: number) => {
    const minLat = 40.710;
    const maxLat = 40.750;
    const pct = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return Math.max(8, Math.min(92, pct));
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedZone !== 'all' && inc.zone !== selectedZone) return false;
    if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
    return true;
  });

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-500 text-white ring-red-400';
      case 'high': return 'bg-orange-500 text-white ring-orange-400';
      case 'medium': return 'bg-amber-500 text-slate-950 ring-amber-400';
      default: return 'bg-emerald-500 text-white ring-emerald-400';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'burglary': return '🚪';
      case 'theft': return '💰';
      case 'assault': return '⚠️';
      case 'vandalism': return '🔨';
      case 'cyber_scam': return '💻';
      case 'public_hazard': return '⚡';
      default: return '👁️';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Toolbar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm dark:shadow-xl transition-colors">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            Zone:
          </span>
          <select
            value={selectedZone}
            onChange={(e) => {
              soundFX.playClick();
              setSelectedZone(e.target.value);
            }}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-none font-medium"
          >
            <option value="all">All Sectors (Metro City)</option>
            <option value="Northside">Northside (84% Safe)</option>
            <option value="Downtown">Downtown (76% Safe)</option>
            <option value="Riverdale">Riverdale (91% Safe)</option>
            <option value="West End">West End (88% Safe)</option>
            <option value="Tech Park">Tech Park (93% Safe)</option>
          </select>

          <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider ml-2">Type:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              soundFX.playClick();
              setSelectedCategory(e.target.value);
            }}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:border-blue-500 focus:outline-none font-medium"
          >
            <option value="all">All Incident Types</option>
            <option value="burglary">Burglary & Break-ins</option>
            <option value="theft">Theft & Robbery</option>
            <option value="suspicious_activity">Suspicious Activity</option>
            <option value="assault">Assault & Violence</option>
            <option value="vandalism">Vandalism</option>
            <option value="cyber_scam">Cyber Scams</option>
            <option value="public_hazard">Public Hazards</option>
          </select>
        </div>

        {/* Layer Toggles & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playClick();
              setShowHeatmap(!showHeatmap);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
              showHeatmap
                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/50'
                : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Heatmap Layer
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              setShowSafeHavens(!showSafeHavens);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
              showSafeHavens
                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50'
                : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Safe Havens & PCR
          </button>

          <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden ml-1">
            <button
              onClick={() => {
                soundFX.playClick();
                setZoomLevel(Math.min(1.6, zoomLevel + 0.2));
              }}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1 text-slate-500 font-mono">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => {
                soundFX.playClick();
                setZoomLevel(Math.max(0.8, zoomLevel - 0.2));
              }}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border-l border-slate-200 dark:border-slate-800"
              title="Reset view"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full h-[540px] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl select-none transition-colors">
        
        {/* Subtle Map Grid Lines & Roads Canvas */}
        <div
          className="absolute inset-0 transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center'
          }}
        >
          {/* SVG Map Texture Layer */}
          <svg className="w-full h-full opacity-60 dark:opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated Metro River */}
            <path
              d="M 0,220 Q 250,260 500,200 T 1000,280"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="16"
              strokeOpacity="0.5"
            />

            {/* Major Arteries / Avenues */}
            <line x1="20%" y1="0" x2="20%" y2="100%" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeWidth="3" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeWidth="4" />
            <line x1="80%" y1="0" x2="80%" y2="100%" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeWidth="3" />
            <line x1="0" y1="35%" x2="100%" y2="35%" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeWidth="4" />
            <line x1="0" y1="65%" x2="100%" y2="65%" stroke="currentColor" className="text-slate-300 dark:text-slate-800" strokeWidth="3" />
          </svg>

          {/* Sector Zone Labels */}
          <div className="absolute top-[12%] left-[25%] text-[11px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase pointer-events-none bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
            NORTHSIDE SECTOR
          </div>
          <div className="absolute top-[48%] left-[45%] text-[11px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase pointer-events-none bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
            DOWNTOWN METRO
          </div>
          <div className="absolute top-[75%] left-[22%] text-[11px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase pointer-events-none bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
            WEST END SUBURBS
          </div>
          <div className="absolute top-[72%] left-[70%] text-[11px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase pointer-events-none bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
            RIVERDALE PROMENADE
          </div>
          <div className="absolute top-[18%] left-[75%] text-[11px] font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase pointer-events-none bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
            TECH PARK
          </div>

          {/* Heatmap Layer Overlays */}
          {showHeatmap && (
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
              {filteredIncidents.map((inc) => {
                const posX = getX(inc.coordinates.lng);
                const posY = getY(inc.coordinates.lat);
                const size = inc.severity === 'critical' ? 140 : inc.severity === 'high' ? 110 : 80;
                return (
                  <div
                    key={`heat-${inc.id}`}
                    className="absolute rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${posX}%`,
                      top: `${posY}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      background:
                        inc.severity === 'critical'
                          ? 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0) 70%)'
                          : inc.severity === 'high'
                          ? 'radial-gradient(circle, rgba(249,115,22,0.45) 0%, rgba(249,115,22,0) 70%)'
                          : 'radial-gradient(circle, rgba(234,179,8,0.35) 0%, rgba(234,179,8,0) 70%)'
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Safe Havens & Police Stations Markers */}
          {showSafeHavens && (
            <>
              <div className="absolute top-[30%] left-[30%] flex items-center gap-1 bg-blue-500/20 dark:bg-blue-900/60 border border-blue-400/60 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-xl text-[10px] font-bold shadow-md cursor-pointer hover:scale-105 transition">
                <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Sector 4 Police Station (24/7 Desk)</span>
              </div>

              <div className="absolute top-[55%] left-[52%] flex items-center gap-1 bg-blue-500/20 dark:bg-blue-900/60 border border-blue-400/60 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-xl text-[10px] font-bold shadow-md cursor-pointer hover:scale-105 transition">
                <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Downtown Police HQ & PCR Desk</span>
              </div>

              <div className="absolute top-[40%] left-[65%] flex items-center gap-1 bg-emerald-500/20 dark:bg-emerald-900/60 border border-emerald-400/60 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-xl text-[10px] font-bold shadow-md cursor-pointer hover:scale-105 transition">
                <Hospital className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>City Trauma Emergency Care</span>
              </div>
            </>
          )}

          {/* Interactive Incident Map Pins */}
          {filteredIncidents.map((inc) => {
            const posX = getX(inc.coordinates.lng);
            const posY = getY(inc.coordinates.lat);
            const isSelected = activePin?.id === inc.id;

            return (
              <div
                key={inc.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-150 z-20 group"
                style={{ left: `${posX}%`, top: `${posY}%` }}
                onClick={() => {
                  soundFX.playClick();
                  setActivePin(inc);
                }}
              >
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                    getSeverityBadgeColor(inc.severity)
                  } ${
                    isSelected
                      ? 'scale-125 ring-4 ring-white dark:ring-slate-900 z-30'
                      : 'hover:scale-110'
                  }`}
                >
                  <span className="text-xs">{getCategoryIcon(inc.category)}</span>
                </div>

                {inc.severity === 'critical' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Pin Popover Detail Card */}
        {activePin && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-2xl z-40 animate-in slide-in-from-bottom-3 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                    {activePin.id}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    activePin.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                  }`}>
                    {activePin.severity}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">{activePin.title}</h4>
              </div>

              <button
                onClick={() => setActivePin(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {activePin.description}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                {activePin.locationName}
              </span>
              <button
                onClick={() => onSelectIncident(activePin)}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5"
              >
                View Case Dossier <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
