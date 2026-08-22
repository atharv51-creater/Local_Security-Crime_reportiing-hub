import React, { useState } from 'react';
import { IncidentReport } from '../types';
import { 
  Search, 
  Lock, 
  ShieldCheck, 
  FileText, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  ChevronRight 
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface CaseTrackerProps {
  incidents: IncidentReport[];
  onAddWitnessNote: (incidentId: string, note: string) => void;
}

export const CaseTracker: React.FC<CaseTrackerProps> = ({ incidents, onAddWitnessNote }) => {
  const [caseIdInput, setCaseIdInput] = useState<string>('CR-2026-0801');
  const [pinInput, setPinInput] = useState<string>('8492');
  const [matchedReport, setMatchedReport] = useState<IncidentReport | null>(incidents[0] || null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [supplementalNote, setSupplementalNote] = useState<string>('');
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setNoteSuccess(false);

    const found = incidents.find(
      (inc) =>
        inc.id.trim().toLowerCase() === caseIdInput.trim().toLowerCase() &&
        inc.pin.trim() === pinInput.trim()
    );

    if (found) {
      soundFX.playSuccessChime();
      setMatchedReport(found);
    } else {
      soundFX.playEmergencyAlert();
      setMatchedReport(null);
      setSearchError('Invalid Case ID or Secret PIN. Please verify your reference numbers.');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedReport || !supplementalNote.trim()) return;

    soundFX.playSuccessChime();
    onAddWitnessNote(matchedReport.id, supplementalNote.trim());
    setSupplementalNote('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Search Bar Box */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-2xl">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Confidential Case & e-FIR Tracker</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access real-time investigation logs and officer responses using your confidential Case ID & PIN
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Case Reference ID</label>
            <input
              type="text"
              placeholder="e.g. CR-2026-0801"
              value={caseIdInput}
              onChange={(e) => setCaseIdInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Secret 4-Digit PIN</label>
            <input
              type="password"
              placeholder="••••"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-xs text-white shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Retrieve Case Dossier
            </button>
          </div>
        </form>

        {searchError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            {searchError}
          </div>
        )}
      </div>

      {/* Case Details View */}
      {matchedReport && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  {matchedReport.id}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Category: {matchedReport.category.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{matchedReport.title}</h3>
            </div>

            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                matchedReport.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                matchedReport.status === 'investigating' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' :
                'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
              }`}>
                ● Status: {matchedReport.status.replace('_', ' ')}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Lodged on {new Date(matchedReport.reportedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Investigation Milestone Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Investigation Progression Timeline
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Incident Logged & Geo-Tagged</p>
                <p className="text-[11px] text-slate-500">Report registered by intake portal at {matchedReport.locationName}</p>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Duty Officer / PCR Assigned</p>
                <p className="text-[11px] text-slate-500">
                  {matchedReport.officerAssigned ? `Primary Unit: ${matchedReport.officerAssigned}` : 'Assigned to Northside Patrol Desk'}
                </p>
              </div>

              <div className="relative">
                <span className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${matchedReport.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Active Case Assessment & Evidence Review</p>
                <p className="text-[11px] text-slate-500">{matchedReport.officialNotes || 'Awaiting additional forensic evidence review.'}</p>
              </div>
            </div>
          </div>

          {/* Supplemental Witness Information Submission */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Add Supplemental Testimony or Evidence to This Case
            </h4>
            <p className="text-[11px] text-slate-500">
              Have you noticed new security footage, suspect vehicles, or additional damage? Append it directly to the investigating officer's log.
            </p>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter additional witness details, CCTV links..."
                value={supplementalNote}
                onChange={(e) => setSupplementalNote(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Append Note
              </button>
            </form>

            {noteSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Supplemental log securely appended to case file.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
