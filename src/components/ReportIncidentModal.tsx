import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Lock, 
  MapPin, 
  Camera, 
  FileText, 
  User, 
  AlertOctagon, 
  CheckCircle2, 
  Copy,
  Info,
  Car,
  Clock,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { IncidentCategory, IncidentReport, IncidentSeverity } from '../types';
import { generateIncidentId, generatePin } from '../utils/storage';
import { soundFX } from '../utils/theme';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: IncidentReport) => void;
}

const CATEGORY_OPTIONS: { value: IncidentCategory; label: string; icon: string; desc: string }[] = [
  { value: 'theft', label: 'Theft / Snatching', icon: '💰', desc: 'Pickpocketing, vehicle theft, stolen items' },
  { value: 'burglary', label: 'Burglary / Break-in', icon: '🚪', desc: 'Forced entry into homes, shops, garages' },
  { value: 'suspicious_activity', label: 'Suspicious Activity', icon: '👁️', desc: 'Prowlers, loitering, scouting properties' },
  { value: 'assault', label: 'Assault / Violence', icon: '⚠️', desc: 'Physical altercation, battery, threat' },
  { value: 'vandalism', label: 'Vandalism / Damage', icon: '🔨', desc: 'Property destruction, graffiti, broken glass' },
  { value: 'harassment', label: 'Harassment / Stalking', icon: '🛑', desc: 'Verbal threats, following, intimidation' },
  { value: 'cyber_scam', label: 'Cyber Crime / 1930', icon: '💻', desc: 'UPI frauds, phishing, online scamming' },
  { value: 'traffic_hazard', label: 'Hit & Run / Traffic', icon: '🚗', desc: 'Dangerous driving, vehicle hit & run' },
  { value: 'public_hazard', label: 'Public Safety Hazard', icon: '⚡', desc: 'Downed wires, gas leaks, open manholes' },
  { value: 'noise_disturbance', label: 'Noise / Public Nuisance', icon: '📢', desc: 'Late night loud gatherings, disturbance' },
  { value: 'lost_found', label: 'Missing Person / Item', icon: '🔍', desc: 'Lost child, elderly person, pet, valuables' }
];

const SEVERITY_LEVELS: { value: IncidentSeverity; label: string; color: string; desc: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30', desc: 'Non-urgent info / minor concern' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30', desc: 'Active disruption or property risk' },
  { value: 'high', label: 'High', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30', desc: 'Substantial crime / safety threat' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30', desc: 'Immediate danger / active emergency' },
];

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [step, setStep] = useState<number>(1);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<IncidentCategory>('suspicious_activity');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [zone, setZone] = useState<string>('Northside');
  const [locationName, setLocationName] = useState<string>('Highland Ave & 5th St');
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterContact, setReporterContact] = useState<string>('');
  
  // Suspect Details
  const [suspectDescription, setSuspectDescription] = useState<string>('');
  const [vehiclePlate, setVehiclePlate] = useState<string>('');
  const [lastSeenHeading, setLastSeenHeading] = useState<string>('');
  const [weaponsReported, setWeaponsReported] = useState<boolean>(false);

  // Evidence
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);

  // Generated Result
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddSampleEvidence = (url: string) => {
    soundFX.playClick();
    if (!evidenceUrls.includes(url)) {
      setEvidenceUrls([...evidenceUrls, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newId = generateIncidentId();
    const newPin = generatePin();

    const report: IncidentReport = {
      id: newId,
      pin: newPin,
      title: title.trim(),
      description: description.trim(),
      category,
      severity,
      status: 'under_review',
      locationName: locationName.trim() || 'Sector 4 Northside',
      zone,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      reportedAt: new Date().toISOString(),
      isAnonymous,
      reporterName: isAnonymous ? undefined : (reporterName.trim() || 'Local Resident'),
      reporterContact: isAnonymous ? undefined : reporterContact.trim(),
      suspectDetails: (suspectDescription || vehiclePlate || lastSeenHeading) ? {
        description: suspectDescription.trim(),
        vehiclePlate: vehiclePlate.trim(),
        lastSeenHeading: lastSeenHeading.trim(),
        weaponsReported: weaponsReported
      } : undefined,
      evidenceUrls,
      confirmationsCount: 1,
      officerAssigned: 'Northside Central Precinct Desk',
      policeStation: 'Northside Sector 4 Central Police Station',
      officialNotes: 'Report logged into the SafeCity civic repository. Assigned to duty desk.',
      comments: []
    };

    soundFX.playSuccessChime();
    onSubmitReport(report);
    setSubmittedReport(report);
    setStep(3);
  };

  const resetAndClose = () => {
    soundFX.playClick();
    setStep(1);
    setTitle('');
    setDescription('');
    setIsAnonymous(false);
    setSubmittedReport(null);
    setEvidenceUrls([]);
    onClose();
  };

  const handleCopyCredentials = () => {
    if (!submittedReport) return;
    soundFX.playClick();
    const creds = `SafeCity Crime Report:\nCase ID: ${submittedReport.id}\nSecret PIN: ${submittedReport.pin}\nLocation: ${submittedReport.locationName}\nStatus: Intake Review`;
    navigator.clipboard.writeText(creds);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in transition-all">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-500/25">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">File Official Crime / Incident Report</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 3 • Transmitted directly to Police Authority & Community Feed</p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
              {/* Anonymous Toggle */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-500" /> Anonymous Whistleblower Protection
                  </span>
                  <p className="text-[11px] text-slate-500">Your name, IP, and contact will be completely stripped from public record</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Complainant Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Contact Phone / Email</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98200 12345"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Crime Category Grid */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Select Crime Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setCategory(cat.value);
                      }}
                      className={`p-2.5 rounded-2xl border text-left flex items-start gap-2.5 transition ${
                        category === cat.value
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-200 shadow-sm font-bold'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs truncate">{cat.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Headline / Summary *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Attempted vehicle break-in on Elm Street"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Detailed Account *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what occurred, time of event, suspect actions, weapons if seen..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Location & Severity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Neighborhood Sector & Landmark *</label>
                  <div className="space-y-2">
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Northside">Northside Sector</option>
                      <option value="Downtown">Downtown Central</option>
                      <option value="Riverdale">Riverdale District</option>
                      <option value="West End">West End Suburbs</option>
                      <option value="Tech Park">Tech Park Innovation Zone</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Street address (e.g. 142 Elm St)"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Threat Severity Level *</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SEVERITY_LEVELS.map((sev) => (
                      <button
                        key={sev.value}
                        type="button"
                        onClick={() => {
                          soundFX.playClick();
                          setSeverity(sev.value);
                        }}
                        className={`p-2 rounded-xl border text-left transition ${
                          severity === sev.value
                            ? `${sev.color} ring-2 ring-blue-500 font-black shadow-sm`
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <p className="text-xs">{sev.label}</p>
                        <p className="text-[10px] opacity-75 truncate">{sev.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next CTA */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !description.trim()}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Continue to Suspect & Evidence →
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Suspect Information */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Suspect Description & Identifiers (Optional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Appearance / Clothing / Physical traits</label>
                    <input
                      type="text"
                      placeholder="e.g. Male, 6ft, dark hoodie, red shoes"
                      value={suspectDescription}
                      onChange={(e) => setSuspectDescription(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Vehicle Plate / Color / Make</label>
                    <input
                      type="text"
                      placeholder="e.g. Silver sedan, plate ending in 884"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Direction of Escape</label>
                    <input
                      type="text"
                      placeholder="e.g. Fled towards Metro Station Gate 2"
                      value={lastSeenHeading}
                      onChange={(e) => setLastSeenHeading(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={weaponsReported}
                        onChange={(e) => setWeaponsReported(e.target.checked)}
                        className="w-4 h-4 rounded text-red-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      />
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Weapons observed or suspected
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sample CCTV Evidence Attachments */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-500" />
                    Attach Photos & Evidence Captures ({evidenceUrls.length})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddSampleEvidence('https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=60')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium hover:border-blue-500"
                  >
                    + Attach CCTV Snapshot
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSampleEvidence('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium hover:border-blue-500"
                  >
                    + Attach Broken Lock Photo
                  </button>
                </div>
              </div>

              {/* Submission CTAs */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  ← Back to Details
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Submit Report to Police Desk
                </button>
              </div>
            </form>
          )}

          {step === 3 && submittedReport && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-600/30 border border-emerald-400 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">CRIME REPORT TRANSMITTED</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your complaint has been successfully registered and linked to the Central Police Authority Desk.
                </p>
              </div>

              {/* Dossier Credentials Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Case ID:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{submittedReport.id}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Secret Verification PIN:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{submittedReport.pin}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Responding Station:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{submittedReport.policeStation}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedPin ? 'Credentials Copied!' : 'Copy Case ID & PIN'}
                </button>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20"
                >
                  Done & View Feed
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
