import React, { useState } from 'react';
import { 
  IncidentReport, 
  CommunityAlert, 
  SafetyZone, 
  PatrolSchedule, 
  UserProfile, 
  IncidentStatus,
  LegalConsultationBooking
} from '../types';
import { generateFirNumber } from '../utils/storage';
import { 
  ShieldCheck, 
  Radio, 
  Car, 
  AlertTriangle, 
  FileText, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Volume2, 
  Phone, 
  Award, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Stamp,
  BadgeCheck,
  Check
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface PoliceAuthorityAdminDashboardProps {
  currentUser: UserProfile;
  incidents: IncidentReport[];
  alerts: CommunityAlert[];
  zones: SafetyZone[];
  patrols: PatrolSchedule[];
  consultations: LegalConsultationBooking[];
  onUpdateIncidentStatus: (incidentId: string, status: IncidentStatus, notes: string, officer?: string, firNumber?: string) => void;
  onBroadcastAlert: (alert: CommunityAlert) => void;
  onDeployPatrol: (patrol: PatrolSchedule) => void;
  onOpen100Facility?: () => void;
}

export const PoliceAuthorityAdminDashboard: React.FC<PoliceAuthorityAdminDashboardProps> = ({
  currentUser,
  incidents,
  alerts,
  zones,
  patrols,
  consultations,
  onUpdateIncidentStatus,
  onBroadcastAlert,
  onDeployPatrol,
  onOpen100Facility
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'incoming_reports' | 'sos_distress' | 'broadcast_alerts' | 'patrol_dispatch'>('incoming_reports');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(incidents[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Status Update modal/inline state
  const [newStatus, setNewStatus] = useState<IncidentStatus>(selectedIncident?.status || 'investigating');
  const [assignedOfficerInput, setAssignedOfficerInput] = useState<string>(selectedIncident?.officerAssigned || currentUser.name);
  const [policeNotesInput, setPoliceNotesInput] = useState<string>(selectedIncident?.officialNotes || '');
  const [firInput, setFirInput] = useState<string>(selectedIncident?.firNumber || '');
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // New Broadcast Alert Form
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertType, setAlertType] = useState<'danger' | 'warning' | 'advisory' | 'amber_alert'>('danger');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertZone, setAlertZone] = useState<string>('Northside Sector');
  const [alertAction, setAlertAction] = useState<string>('');
  const [alertSent, setAlertSent] = useState<boolean>(false);

  // Critical SOS list
  const sosIncidents = incidents.filter((i) => i.severity === 'critical' || i.title.includes('EMERGENCY') || i.title.includes('SOS'));

  const filteredIncidents = incidents.filter((i) => {
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesSearch =
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectIncident = (inc: IncidentReport) => {
    soundFX.playClick();
    setSelectedIncident(inc);
    setNewStatus(inc.status);
    setAssignedOfficerInput(inc.officerAssigned || currentUser.name);
    setPoliceNotesInput(inc.officialNotes || '');
    setFirInput(inc.firNumber || '');
  };

  const handleSaveInvestigationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;

    soundFX.playDispatchChirp();
    onUpdateIncidentStatus(
      selectedIncident.id,
      newStatus,
      policeNotesInput.trim(),
      assignedOfficerInput.trim(),
      firInput.trim()
    );

    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleAutoGenerateFir = () => {
    soundFX.playSuccessChime();
    const generated = generateFirNumber();
    setFirInput(generated);
    setNewStatus('fir_registered');
  };

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) return;

    soundFX.playEmergencyAlert();
    const newAlert: CommunityAlert = {
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      title: alertTitle.trim(),
      type: alertType,
      message: alertMessage.trim(),
      zone: alertZone,
      issuedBy: `${currentUser.name} (${currentUser.badgeNumber || 'Police HQ'})`,
      issuedAt: new Date().toISOString(),
      isActive: true,
      actionRequired: alertAction.trim() || 'Follow police safety advisory instructions.'
    };

    onBroadcastAlert(newAlert);
    setAlertSent(true);
    setAlertTitle('');
    setAlertMessage('');
    setAlertAction('');
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Police Command Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-amber-500 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/30 font-black border border-amber-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">POLICE AUTHORITY COMMAND & DISPATCH DESK</h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-amber-500 text-slate-950 rounded-full font-mono">
                BADGE: {currentUser.badgeNumber || 'POL-MH-8842'}
              </span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium mt-0.5">
              Officer: <b>{currentUser.name}</b> • Precinct: <b>{currentUser.precinct || 'Northside Sector 4 Central'}</b> • Frequency: <b>156.800 MHz</b>
            </p>
          </div>
        </div>

        {/* Quick Top Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFX.playEmergencyAlert();
              if (onOpen100Facility) onOpen100Facility();
            }}
            className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-red-900/50 animate-pulse"
          >
            <Radio className="w-4 h-4" /> 100 Hot Dispatch Line
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white dark:bg-slate-900/90 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-sm">
        {[
          { id: 'incoming_reports', label: `Citizen Crime Reports (${incidents.length})`, icon: FileText },
          { id: 'sos_distress', label: `Priority 1 SOS Alarms (${sosIncidents.length})`, icon: AlertTriangle },
          { id: 'broadcast_alerts', label: `Emergency Alerts Dispatcher (${alerts.length})`, icon: Radio },
          { id: 'patrol_dispatch', label: `Patrol Vans & Rosters (${patrols.length})`, icon: Car }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveAdminTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. CITIZEN CRIME REPORTS MASTER CONSOLE */}
      {activeAdminTab === 'incoming_reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Filterable Reports Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search & Filter */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search Case ID, category, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'dispatched', 'investigating', 'fir_registered', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      soundFX.playClick();
                      setStatusFilter(st);
                    }}
                    className={`px-2.5 py-1 rounded-lg uppercase text-[10px] font-bold transition whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => handleSelectIncident(inc)}
                  className={`p-4 rounded-3xl border cursor-pointer transition space-y-2 ${
                    selectedIncident?.id === inc.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                        {inc.id}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        inc.severity === 'critical' ? 'bg-red-600 text-white animate-pulse' :
                        inc.severity === 'high' ? 'bg-orange-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500">
                      {new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{inc.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{inc.locationName}</span>
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      Complainant: <b>{inc.isAnonymous ? '🛡️ Anonymous' : inc.reporterName}</b>
                    </span>
                    <span className={`font-bold uppercase ${
                      inc.status === 'resolved' ? 'text-emerald-600 dark:text-emerald-400' :
                      inc.status === 'fir_registered' ? 'text-indigo-600 dark:text-indigo-400' :
                      'text-amber-600 dark:text-amber-400'
                    }`}>
                      ● {inc.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Case Investigation & Action Console (7 cols) */}
          <div className="lg:col-span-7">
            {selectedIncident ? (
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-5">
                
                {/* Case Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                        {selectedIncident.id}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Sector: {selectedIncident.zone}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1.5">{selectedIncident.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {selectedIncident.locationName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block">
                      Secret PIN: <b className="text-slate-900 dark:text-white">{selectedIncident.pin}</b>
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Reported: {new Date(selectedIncident.reportedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Incident Description */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                    Citizen Complaint Statement:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedIncident.description}
                  </p>
                  
                  {selectedIncident.suspectDetails && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1 text-amber-800 dark:text-amber-200">
                      <b>Suspect Identifiers:</b> {selectedIncident.suspectDetails.description || 'None provided'}
                      {selectedIncident.suspectDetails.vehiclePlate && (
                        <div>Plate: <span className="font-mono text-slate-900 dark:text-white font-bold">{selectedIncident.suspectDetails.vehiclePlate}</span></div>
                      )}
                    </div>
                  )}

                  {!selectedIncident.isAnonymous && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Complainant: <b className="text-slate-900 dark:text-white">{selectedIncident.reporterName}</b></span>
                      <span>Contact: <b className="font-mono text-blue-600 dark:text-blue-400">{selectedIncident.reporterContact}</b></span>
                    </div>
                  )}
                </div>

                {/* POLICE ACTION & INVESTIGATION UPDATE FORM */}
                <form onSubmit={handleSaveInvestigationUpdate} className="space-y-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-amber-300 dark:border-amber-500/30">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Police Case Action & Status Disposition
                    </h4>
                    <span className="text-[10px] text-slate-500">Live sync with citizen dossier</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Investigation Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="under_review">Under Review</option>
                        <option value="dispatched">Dispatched (PCR Patrol En Route)</option>
                        <option value="investigating">Active Investigation</option>
                        <option value="fir_registered">FIR Officially Registered</option>
                        <option value="resolved">Case Resolved / Culprit Apprehended</option>
                        <option value="false_alarm">False Alarm / Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Assigned Responding Officer / PCR Van
                      </label>
                      <input
                        type="text"
                        value={assignedOfficerInput}
                        onChange={(e) => setAssignedOfficerInput(e.target.value)}
                        placeholder="e.g. Inspector Kulkarni / PCR-04"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* e-FIR Generation Row */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">
                        Official e-FIR Number:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. FIR/2026/NS-104"
                        value={firInput}
                        onChange={(e) => setFirInput(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-amber-600 dark:text-amber-300 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoGenerateFir}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" /> Generate Formal e-FIR
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                      Official Police Diary / Investigation Notes
                    </label>
                    <textarea
                      rows={3}
                      value={policeNotesInput}
                      onChange={(e) => setPoliceNotesInput(e.target.value)}
                      placeholder="Enter investigation progress, forensics collected, suspect detention logs..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {updateSuccess ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Case file updated & citizen notified!
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        Last modified by {currentUser.name}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                    >
                      <Send className="w-4 h-4" /> Save Investigation Record
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-slate-500 text-xs bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                Select an incident report from the left queue to open investigation dossier.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. SOS DISTRESS COMMAND VIEW */}
      {activeAdminTab === 'sos_distress' && (
        <div className="bg-white dark:bg-slate-900/90 border border-red-300 dark:border-red-500/50 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 rounded-2xl text-white animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">PRIORITY 1 EMERGENCY SOS DISTRESS QUEUE</h3>
                <p className="text-xs text-red-600 dark:text-red-300">
                  Real-time panic signals and 100 direct calls triggered by citizens requiring immediate PCR intervention
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {sosIncidents.map((sos) => (
              <div
                key={sos.id}
                className="p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/60 rounded-2xl flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white text-xs font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse">
                      🚨 LIVE PANIC SIGNAL
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{sos.id}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{sos.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{sos.description}</p>
                  <p className="text-xs text-red-600 dark:text-red-300 font-mono flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Coordinates: {sos.coordinates.lat}° N, {sos.coordinates.lng}° E ({sos.locationName})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${sos.reporterContact || '100'}`}
                    className="py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-emerald-500" /> Call Complainant
                  </a>

                  <button
                    onClick={() => {
                      soundFX.playDispatchChirp();
                      onUpdateIncidentStatus(
                        sos.id,
                        'dispatched',
                        'Urgent PCR Unit dispatched with siren priority.',
                        'PCR-Unit 01 & Highway Mobile Squad'
                      );
                    }}
                    className="py-2.5 px-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs shadow-lg shadow-red-600/30"
                  >
                    Dispatch Nearest Patrol Unit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BROADCAST ALERTS DISPATCHER */}
      {activeAdminTab === 'broadcast_alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Create Alert Form (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-500" />
              Broadcast Public Emergency Alert Bulletin
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transmit high-priority warnings, amber alerts, road closures, or cyber fraud notices directly to all citizen feeds
            </p>

            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Alert Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RED ALERT: Search for Hit-and-Run Suspect Vehicle"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Alert Severity Level</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="danger">Danger / Red Alert</option>
                    <option value="amber_alert">Amber Alert (Missing Person / Minor)</option>
                    <option value="warning">Warning (Hazard / Curfew)</option>
                    <option value="advisory">Advisory (Scam / Traffic Detour)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Target Sector Zone</label>
                  <select
                    value={alertZone}
                    onChange={(e) => setAlertZone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="All Sectors">All Sectors (City-Wide)</option>
                    <option value="Northside Sector">Northside Sector</option>
                    <option value="Downtown Central">Downtown Central</option>
                    <option value="Tech Park">Tech Park & Silicon Hub</option>
                    <option value="West End">West End Ring Road</option>
                    <option value="Riverdale">Riverdale Academic Zone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Bulletin Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide precise details, suspect descriptions, areas to avoid..."
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Recommended Citizen Action</label>
                <input
                  type="text"
                  placeholder="e.g. Keep doors locked; call 100 if vehicle is sighted."
                  value={alertAction}
                  onChange={(e) => setAlertAction(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {alertSent && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Emergency bulletin broadcasted!
                  </span>
                )}

                <button
                  type="submit"
                  className="ml-auto py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/30"
                >
                  <Send className="w-4 h-4" /> Broadcast Emergency Bulletin
                </button>
              </div>
            </form>
          </div>

          {/* Active Alerts List (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-500" />
              Active Broadcast Feed ({alerts.length})
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">{al.type}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{al.zone}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{al.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{al.message}</p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/90 font-medium">Action: {al.actionRequired}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. PATROL DISPATCH */}
      {activeAdminTab === 'patrol_dispatch' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-500" />
                Active PCR Patrol Units & Citizen Watch Deployment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage mobile PCR squad shifts and coordinate joint patrols with registered watch wardens
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patrols.map((pat) => (
              <div
                key={pat.id}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400">{pat.zone}</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {pat.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{pat.leader}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {pat.date} ({pat.timeSlot})
                  </p>

                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-1 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Enrolled Responders ({pat.volunteersEnrolled.length}/{pat.maxVolunteers}):</span>
                    <div className="flex flex-wrap gap-1">
                      {pat.volunteersEnrolled.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-800 dark:text-slate-200">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">Status: Active on Frequency</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">● V-DISPATCHED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
