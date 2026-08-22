import React, { useState } from 'react';
import { SafetyZone, PatrolSchedule } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Building, 
  Phone, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  AlertCircle,
  Activity,
  X
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface SafetyZonesPatrolProps {
  zones: SafetyZone[];
  patrols: PatrolSchedule[];
  onJoinPatrol: (patrolId: string, volunteerName: string) => void;
  onAddPatrol: (patrol: PatrolSchedule) => void;
  currentUserRole: 'citizen' | 'warden' | 'officer';
}

export const SafetyZonesPatrol: React.FC<SafetyZonesPatrolProps> = ({
  zones,
  patrols,
  onJoinPatrol,
  onAddPatrol,
  currentUserRole
}) => {
  const [selectedZone, setSelectedZone] = useState<SafetyZone>(zones[0]);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  
  // New patrol state
  const [newZone, setNewZone] = useState<string>('Northside');
  const [newLeader, setNewLeader] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('Tonight');
  const [newTimeSlot, setNewTimeSlot] = useState<string>('20:00 - 22:00');
  const [newMaxVolunteers, setNewMaxVolunteers] = useState<number>(4);

  const handleCreatePatrol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeader.trim()) return;

    soundFX.playSuccessChime();

    const newPat: PatrolSchedule = {
      id: `pat-${Date.now()}`,
      zone: newZone,
      leader: newLeader.trim(),
      date: newDate,
      timeSlot: newTimeSlot,
      volunteersEnrolled: [newLeader.trim()],
      maxVolunteers: newMaxVolunteers,
      status: 'upcoming'
    };

    onAddPatrol(newPat);
    setShowScheduleModal(false);
    setNewLeader('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 80) return 'text-blue-700 dark:text-blue-400 border-blue-500 bg-blue-50 dark:bg-blue-950/40';
    if (score >= 70) return 'text-amber-700 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40';
    return 'text-rose-700 dark:text-rose-400 border-rose-500 bg-rose-50 dark:bg-rose-950/40';
  };

  return (
    <div className="space-y-6">
      
      {/* Sector Safety Scores Overview */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              Neighborhood Watch Sectors & Safety Index
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live algorithmic safety ratings based on 30-day crime velocity and volunteer patrol frequency
            </p>
          </div>
        </div>

        {/* Zone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {zones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedZone(zone);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition relative ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-400/30 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{zone.name}</h3>
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-black text-xs ${getScoreColor(zone.safetyScore)}`}>
                    {zone.safetyScore}%
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <p>Recent Reports: <b className="text-slate-800 dark:text-slate-200">{zone.recentIncidentsCount}</b></p>
                  <p>Active Patrols: <b className="text-emerald-600 dark:text-emerald-400">{zone.activePatrols} units</b></p>
                  <p>Safe Havens: <b className="text-slate-800 dark:text-slate-200">{zone.safeHavens.length} locations</b></p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Zone Details (Safe Havens + Patrol Schedules) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Safe Havens Card */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-500" />
              {selectedZone.name} Safe Havens & Emergency Posts
            </h3>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-300 dark:border-emerald-800">
              {selectedZone.safeHavens.length} Available
            </span>
          </div>

          <div className="space-y-3">
            {selectedZone.safeHavens.map((haven, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{haven.name}</span>
                    {haven.is24Hours && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50 px-2 py-0.5 rounded-full font-bold">
                        24/7 OPEN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {haven.address}
                  </p>
                </div>

                <a
                  href={`tel:${haven.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  Call Post
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Patrol Schedules */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Community Patrol Rosters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Neighborhood resident volunteer walking shifts</p>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setShowScheduleModal(true);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow transition"
            >
              <Plus className="w-3.5 h-3.5" /> Organize Shift
            </button>
          </div>

          <div className="space-y-3">
            {patrols.map((patrol) => {
              const isFull = patrol.volunteersEnrolled.length >= patrol.maxVolunteers;
              return (
                <div
                  key={patrol.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{patrol.zone} Sector Patrol</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        patrol.status === 'in_progress' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {patrol.status === 'in_progress' ? '● In Progress Now' : 'Upcoming'}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {patrol.date} ({patrol.timeSlot})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <p>Leader: <b className="text-slate-800 dark:text-slate-200">{patrol.leader}</b></p>
                    <p>
                      Volunteers: <b className="text-blue-600 dark:text-blue-400">{patrol.volunteersEnrolled.length}/{patrol.maxVolunteers}</b>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex -space-x-1 overflow-hidden">
                      {patrol.volunteersEnrolled.map((vol, i) => (
                        <span
                          key={i}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center"
                          title={vol}
                        >
                          {vol.slice(0, 2).toUpperCase()}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const name = prompt('Enter your name to enroll in this patrol shift:');
                        if (name) {
                          soundFX.playSuccessChime();
                          onJoinPatrol(patrol.id, name);
                        }
                      }}
                      disabled={isFull}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isFull
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isFull ? 'Roster Full' : 'Volunteer for Shift'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Organize Patrol Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" /> Schedule New Neighborhood Patrol
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatrol} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Target Sector</label>
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Northside">Northside Sector</option>
                  <option value="Downtown">Downtown Central</option>
                  <option value="Riverdale">Riverdale District</option>
                  <option value="West End">West End Suburbs</option>
                  <option value="Tech Park">Tech Park</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Patrol Leader Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atharv Ubale (Watch Captain)"
                  value={newLeader}
                  onChange={(e) => setNewLeader(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Date</label>
                  <select
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Tonight">Tonight</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Saturday Night">Saturday Night</option>
                    <option value="Sunday Night">Sunday Night</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Time Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. 21:00 - 23:30"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-xs text-white shadow-md shadow-blue-500/25"
                >
                  Register Patrol Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
