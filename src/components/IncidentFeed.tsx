import React, { useState } from 'react';
import { 
  IncidentReport, 
  IncidentCategory, 
  IncidentSeverity, 
  IncidentStatus 
} from '../types';
import { 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageSquare, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Share2, 
  Image as ImageIcon,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Copy,
  Check,
  Radio,
  FileCheck2,
  Phone
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface IncidentFeedProps {
  incidents: IncidentReport[];
  onConfirmIncident: (id: string) => void;
  onAddComment: (incidentId: string, comment: string, author: string, isOfficial?: boolean) => void;
  onUpdateStatus?: (incidentId: string, status: IncidentStatus, notes: string) => void;
  currentUserRole: 'citizen' | 'warden' | 'officer';
  selectedIncidentModal?: IncidentReport | null;
  onClearSelectedModal?: () => void;
}

export const IncidentFeed: React.FC<IncidentFeedProps> = ({
  incidents,
  onConfirmIncident,
  onAddComment,
  onUpdateStatus,
  currentUserRole,
  selectedIncidentModal,
  onClearSelectedModal
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Expanded comments card state
  const [expandedComments, setExpandedComments] = useState<{ [id: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [id: string]: string }>({});
  const [authorInputs, setAuthorInputs] = useState<{ [id: string]: string }>({});

  const [copiedCaseId, setCopiedCaseId] = useState<string | null>(null);

  const toggleComments = (id: string) => {
    soundFX.playClick();
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentSubmit = (incidentId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[incidentId];
    if (!commentText || !commentText.trim()) return;

    const author = authorInputs[incidentId]?.trim() || 
      (currentUserRole === 'officer' ? 'Precinct Desk Officer' : currentUserRole === 'warden' ? 'Zone Watch Captain' : 'Community Resident');

    onAddComment(incidentId, commentText.trim(), author, currentUserRole === 'officer' || currentUserRole === 'warden');
    setCommentInputs((prev) => ({ ...prev, [incidentId]: '' }));
    soundFX.playSuccessChime();
  };

  const handleCopyCase = (id: string) => {
    soundFX.playClick();
    navigator.clipboard.writeText(id);
    setCopiedCaseId(id);
    setTimeout(() => setCopiedCaseId(null), 2500);
  };

  const filteredIncidents = incidents.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;
    if (selectedZone !== 'all' && item.zone !== selectedZone) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
    }
    return true;
  });

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            🚨 Critical Threat
          </span>
        );
      case 'high':
        return (
          <span className="bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            High Urgency
          </span>
        );
      case 'medium':
        return (
          <span className="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Medium Risk
          </span>
        );
      default:
        return (
          <span className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Low Risk
          </span>
        );
    }
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'dispatched':
        return (
          <span className="bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            🚨 Units Dispatched
          </span>
        );
      case 'investigating':
        return (
          <span className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            🔍 Under Investigation
          </span>
        );
      case 'fir_registered':
        return (
          <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 text-[10px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            📜 e-FIR Registered
          </span>
        );
      case 'resolved':
        return (
          <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            ✅ Case Resolved
          </span>
        );
      case 'false_alarm':
        return (
          <span className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
            False Alarm
          </span>
        );
      default:
        return (
          <span className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
            ⏳ Intake Review
          </span>
        );
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header Bar with Card Elevation */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search reports, Case IDs, street names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="burglary">Burglary / Break-in</option>
              <option value="theft">Theft / Snatching</option>
              <option value="suspicious_activity">Suspicious Activity</option>
              <option value="assault">Assault / Violence</option>
              <option value="vandalism">Vandalism</option>
              <option value="cyber_scam">Cyber Scams (1930)</option>
              <option value="traffic_hazard">Hit-and-Run / Traffic</option>
              <option value="public_hazard">Public Hazards</option>
            </select>

            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Sectors</option>
              <option value="Northside">Northside Sector</option>
              <option value="Downtown">Downtown Central</option>
              <option value="Riverdale">Riverdale Academic</option>
              <option value="West End">West End Suburb</option>
              <option value="Tech Park">Tech Park Silicon</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical (Priority 1)</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="under_review">Intake Review</option>
              <option value="dispatched">Dispatched</option>
              <option value="investigating">Investigating</option>
              <option value="fir_registered">FIR Registered</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 font-medium">
            <span>Showing <b className="text-slate-900 dark:text-white font-bold">{filteredIncidents.length}</b> verified community reports</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed Synced
            </span>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      {filteredIncidents.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
          <ShieldAlert className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Reports Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or switch to another neighborhood sector.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const isExpanded = !!expandedComments[incident.id];
            const isCritical = incident.severity === 'critical';

            return (
              <div
                key={incident.id}
                className={`bg-white dark:bg-slate-900/90 transition-all border rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 text-slate-800 dark:text-slate-200 ${
                  isCritical
                    ? 'border-red-300 dark:border-red-500/50 shadow-red-500/5 dark:shadow-red-950/40'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-500/40'
                }`}
              >
                {/* Top Row: Meta, Status & Badges */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCopyCase(incident.id)}
                      className="group font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition"
                      title="Click to copy Case ID"
                    >
                      <span>{incident.id}</span>
                      {copiedCaseId === incident.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>

                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}

                    {incident.firNumber && (
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 rounded-md">
                        {incident.firNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTimeAgo(incident.reportedAt)}</span>
                  </div>
                </div>

                {/* Main Body */}
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    {incident.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {incident.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {incident.locationName} ({incident.zone} Sector)
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      Assigned: <b>{incident.officerAssigned || 'Precinct Station Desk'}</b>
                    </span>
                    <span>
                      Complainant: <b>{incident.isAnonymous ? '🛡️ Anonymous Citizen' : incident.reporterName}</b>
                    </span>
                  </div>
                </div>

                {/* Suspect Identifiers if available */}
                {incident.suspectDetails && (incident.suspectDetails.description || incident.suspectDetails.vehiclePlate) && (
                  <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-3.5 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" /> Suspect Identifiers & Vehicle Data:
                    </span>
                    <p className="text-xs">{incident.suspectDetails.description}</p>
                    {incident.suspectDetails.vehiclePlate && (
                      <div className="font-mono text-xs font-bold pt-0.5">
                        Vehicle Plate: <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">{incident.suspectDetails.vehiclePlate}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Official Police Notes if available */}
                {incident.officialNotes && (
                  <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-3.5 text-xs space-y-1 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-blue-700 dark:text-blue-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> Official Police Station Log:
                      </span>
                      {incident.firNumber && (
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          COGNIZABLE RECORD
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                      "{incident.officialNotes}"
                    </p>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {/* Eyewitness Confirm Button */}
                    <button
                      onClick={() => {
                        soundFX.playSuccessChime();
                        onConfirmIncident(incident.id);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                      <span>Confirm / Eyewitness</span>
                      <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                        {incident.confirmationsCount}
                      </span>
                    </button>

                    {/* Toggle Comments Button */}
                    <button
                      onClick={() => toggleComments(incident.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Witness Notes ({incident.comments?.length || 0})</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCase(incident.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1"
                      title="Share Case Dossier"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Comments Accordion */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {incident.comments && incident.comments.length > 0 ? (
                        incident.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className={`p-3 rounded-2xl text-xs space-y-1 ${
                              comment.isOfficial
                                ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-950 dark:text-blue-200'
                                : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold flex items-center gap-1">
                                {comment.isOfficial ? (
                                  <>
                                    <ShieldCheck className="w-3 h-3 text-blue-500" />
                                    <span className="text-blue-600 dark:text-blue-400">{comment.author} (Official)</span>
                                  </>
                                ) : (
                                  <span>{comment.author}</span>
                                )}
                              </span>
                              <span className="text-slate-400 text-[10px]">
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="leading-snug">{comment.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic text-center py-2">
                          No witness remarks yet. Post the first statement below.
                        </p>
                      )}
                    </div>

                    {/* Post Comment Form */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(incident.id, e)}
                      className="flex gap-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder="Add witness statement, suspect sighting, or tip..."
                        value={commentInputs[incident.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [incident.id]: e.target.value })
                        }
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/20"
                      >
                        <Send className="w-3.5 h-3.5" /> Post
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
