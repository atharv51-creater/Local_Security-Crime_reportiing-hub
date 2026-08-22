import React, { useState, useEffect } from 'react';
import { 
  IncidentReport, 
  CommunityAlert, 
  SafetyZone, 
  PatrolSchedule, 
  EmergencyContact,
  IncidentStatus,
  UserProfile,
  LawyerProfile,
  LegalConsultationBooking,
  LawyerChatMessage
} from './types';
import { 
  getStoredIncidents, 
  saveIncidents, 
  getStoredAlerts, 
  saveAlerts, 
  getStoredPatrols, 
  savePatrols, 
  getStoredContacts, 
  saveContacts, 
  getCurrentUser, 
  saveCurrentUser,
  getStoredConsultations,
  saveConsultations,
  getStoredChatMessages,
  saveChatMessages,
  DEFAULT_CITIZEN_USER,
  DEFAULT_POLICE_USER
} from './utils/storage';
import { SAFETY_ZONES } from './data/mockData';
import { Header } from './components/Header';
import { IncidentFeed } from './components/IncidentFeed';
import { IncidentMap } from './components/IncidentMap';
import { CommunityAlerts } from './components/CommunityAlerts';
import { SafetyZonesPatrol } from './components/SafetyZonesPatrol';
import { CrimeAnalytics } from './components/CrimeAnalytics';
import { CaseTracker } from './components/CaseTracker';
import { EmergencyContacts } from './components/EmergencyContacts';
import { SafetyTipsGuide } from './components/SafetyTipsGuide';
import { ReportIncidentModal } from './components/ReportIncidentModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { AuthModal } from './components/AuthModal';
import { Emergency100CallFacility } from './components/Emergency100CallFacility';
import { CrimeLawsChatbot } from './components/CrimeLawsChatbot';
import { LawyerConsultationSection } from './components/LawyerConsultationSection';
import { PoliceAuthorityAdminDashboard } from './components/PoliceAuthorityAdminDashboard';
import { 
  ShieldCheck, 
  Bell, 
  X, 
  AlertCircle, 
  PhoneCall, 
  Radio, 
  Scale, 
  UserCheck,
  Building2,
  Lock,
  Phone,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ThemeMode, getStoredTheme, applyTheme, soundFX } from './utils/theme';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_CITIZEN_USER);
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());

  // Core Data Lists
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [alerts, setAlerts] = useState<CommunityAlert[]>([]);
  const [patrols, setPatrols] = useState<PatrolSchedule[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [consultations, setConsultations] = useState<LegalConsultationBooking[]>([]);
  const [chatMessages, setChatMessages] = useState<LawyerChatMessage[]>([]);

  // Modals & Panels
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [is100FacilityOpen, setIs100FacilityOpen] = useState<boolean>(false);

  // Selected lawyer for booking from Chatbot or Directory
  const [selectedLawyerForBooking, setSelectedLawyerForBooking] = useState<LawyerProfile | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    desc: string;
    type?: 'info' | 'success' | 'alert';
  } | null>(null);

  // Initialize theme on mount
  useEffect(() => {
    const currentTheme = getStoredTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);

    setCurrentUser(getCurrentUser());
    setIncidents(getStoredIncidents());
    setAlerts(getStoredAlerts());
    setPatrols(getStoredPatrols());
    setContacts(getStoredContacts());
    setConsultations(getStoredConsultations());
    setChatMessages(getStoredChatMessages());
  }, []);

  const handleToggleTheme = () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    soundFX.playThemeSwitch(newTheme === 'light');
    showToast(
      newTheme === 'light' ? 'Light Theme Activated' : 'Dark Cyber Theme Activated',
      `Switched interface display to ${newTheme} mode.`,
      'info'
    );
  };

  const showToast = (title: string, desc: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Auth login handler
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    soundFX.playSuccessChime();
    if (user.role === 'police_authority') {
      setActiveTab('police_admin');
      showToast('Police Officer Authenticated', `Welcome Officer ${user.name}. Central dispatch desk linked.`, 'success');
    } else {
      setActiveTab('feed');
      showToast('Citizen Portal Active', `Welcome ${user.name}. Security & reporting services ready.`, 'success');
    }
  };

  // Incident Handlers
  const handleAddIncident = (newReport: IncidentReport) => {
    const updated = [newReport, ...incidents];
    setIncidents(updated);
    saveIncidents(updated);
    soundFX.playSuccessChime();
    showToast('Crime Report Logged', `Case ID ${newReport.id} registered and transmitted to Police Admin.`, 'success');
  };

  const handleConfirmIncident = (id: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === id) {
        return { ...inc, confirmationsCount: inc.confirmationsCount + 1 };
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    soundFX.playClick();
    showToast('Incident Confirmed', 'Your eyewitness verification has been added.', 'success');
  };

  const handleAddComment = (incidentId: string, content: string, author: string, isOfficial?: boolean) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        const newComments = [
          ...(inc.comments || []),
          {
            id: `c-${Date.now()}`,
            author,
            isOfficial,
            content,
            timestamp: new Date().toISOString()
          }
        ];
        return { ...inc, comments: newComments };
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    soundFX.playClick();
    showToast('Update Logged', 'Remark added to case dossier.', 'info');
  };

  const handleUpdateStatus = (
    incidentId: string, 
    newStatus: IncidentStatus, 
    notes: string, 
    officer?: string, 
    firNumber?: string
  ) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: newStatus,
          officialNotes: notes || inc.officialNotes,
          officerAssigned: officer || inc.officerAssigned,
          firNumber: firNumber || inc.firNumber
        };
      }
      return inc;
    });
    setIncidents(updated);
    saveIncidents(updated);
    soundFX.playDispatchChirp();
    showToast('Investigation Updated', `Case ${incidentId} marked as ${newStatus.toUpperCase()}`, 'info');
  };

  const handleAddWitnessNote = (incidentId: string, note: string) => {
    handleAddComment(incidentId, `[Complainant Statement] ${note}`, currentUser.name || 'Complainant', false);
  };

  // Broadcast Alert Handlers
  const handleAddAlert = (newAlert: CommunityAlert) => {
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveAlerts(updated);
    soundFX.playEmergencyAlert();
    showToast('Emergency Bulletin Broadcasted', `Alert transmitted: ${newAlert.title}`, 'alert');
  };

  const handleDismissAlert = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
    soundFX.playClick();
    showToast('Alert Deactivated', 'Bulletin removed from active priority ticker.', 'info');
  };

  // Patrol Handlers
  const handleJoinPatrol = (patrolId: string, volunteerName: string) => {
    const updated = patrols.map((p) => {
      if (p.id === patrolId) {
        if (!p.volunteersEnrolled.includes(volunteerName)) {
          return {
            ...p,
            volunteersEnrolled: [...p.volunteersEnrolled, volunteerName]
          };
        }
      }
      return p;
    });
    setPatrols(updated);
    savePatrols(updated);
    soundFX.playSuccessChime();
    showToast('Patrol Roster Updated', `Enrolled in watch shift.`, 'success');
  };

  const handleAddPatrol = (newPat: PatrolSchedule) => {
    const updated = [newPat, ...patrols];
    setPatrols(updated);
    savePatrols(updated);
    soundFX.playClick();
    showToast('Patrol Scheduled', `Shift active for ${newPat.zone}.`, 'success');
  };

  // Emergency Contact Handlers
  const handleAddContact = (newContact: EmergencyContact) => {
    const updated = [...contacts, newContact];
    setContacts(updated);
    saveContacts(updated);
    soundFX.playClick();
    showToast('Contact Saved', `${newContact.name} added to hotline list.`, 'success');
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveContacts(updated);
    soundFX.playClick();
    showToast('Contact Removed', 'Emergency contact removed.', 'info');
  };

  // Consultations & Chat Handlers
  const handleAddConsultation = (booking: LegalConsultationBooking) => {
    const updated = [booking, ...consultations];
    setConsultations(updated);
    saveConsultations(updated);
    soundFX.playSuccessChime();
    showToast('Legal Session Booked', `Appointment confirmed with ${booking.lawyerName}.`, 'success');
  };

  const handleSendChatMessage = (message: LawyerChatMessage) => {
    const updated = [...chatMessages, message];
    setChatMessages(updated);
    saveChatMessages(updated);
    soundFX.playClick();
  };

  const handleOpenLawyerBookingFromChatbot = (lawyer: LawyerProfile) => {
    setSelectedLawyerForBooking(lawyer);
    setActiveTab('lawyers');
    soundFX.playClick();
  };

  // Emergency SOS Broadcast
  const handleSosBroadcast = (details: { message: string; location: string; timestamp: string }) => {
    const sosReport: IncidentReport = {
      id: `CR-SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      pin: '0000',
      title: '🚨 EMERGENCY SOS PANIC BEACON ACTIVATED',
      description: `Immediate panic distress triggered by resident ${currentUser.name}. Location telemetry: ${details.location}. Emergency PCR Van requested.`,
      category: 'assault',
      severity: 'critical',
      status: 'dispatched',
      locationName: details.location,
      zone: 'Northside',
      coordinates: { lat: 19.0760, lng: 72.8777 },
      reportedAt: details.timestamp,
      isAnonymous: false,
      reporterName: currentUser.name,
      reporterContact: currentUser.phone,
      reporterId: currentUser.id,
      evidenceUrls: [],
      confirmationsCount: 15,
      officerAssigned: 'ALL PCR PATROL UNITS (PRIORITY 1)',
      policeStation: 'Northside Sector 4 Central Police Station',
      officialNotes: 'Immediate Code 1 emergency distress signal. Patrol dispatched.',
      comments: []
    };

    const updated = [sosReport, ...incidents];
    setIncidents(updated);
    saveIncidents(updated);
    soundFX.playEmergencyAlert();
    showToast('SOS ALARM BROADCASTED', 'Emergency coordinates transmitted to 100 Police Control Room & PCR Patrols.', 'alert');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white bg-grid-pattern transition-colors duration-300">
      
      {/* Top Header & Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpen100Facility={() => setIs100FacilityOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        activeAlertsCount={alerts.filter((a) => a.isActive).length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 1. CITIZEN INCIDENT FEED */}
        {activeTab === 'feed' && (
          <IncidentFeed
            incidents={incidents}
            onConfirmIncident={handleConfirmIncident}
            onAddComment={handleAddComment}
            onUpdateStatus={(id, status, notes) => handleUpdateStatus(id, status, notes)}
            currentUserRole={currentUser.role === 'police_authority' ? 'officer' : 'citizen'}
          />
        )}

        {/* 2. LIVE GOOGLE & CRIME MAP */}
        {activeTab === 'map' && (
          <IncidentMap
            incidents={incidents}
            zones={SAFETY_ZONES}
            onSelectIncident={(inc) => {
              setActiveTab('feed');
            }}
          />
        )}

        {/* 3. CRIME LAWS AI CHATBOT (ACTS & PUNISHMENTS) */}
        {activeTab === 'chatbot' && (
          <CrimeLawsChatbot
            onOpenLawyerConsultation={handleOpenLawyerBookingFromChatbot}
            onOpen100Facility={() => setIs100FacilityOpen(true)}
          />
        )}

        {/* 4. LAWYER GUIDANCE & CHAT SECTION */}
        {activeTab === 'lawyers' && (
          <LawyerConsultationSection
            currentUser={currentUser}
            consultations={consultations}
            chatMessages={chatMessages}
            onAddConsultation={handleAddConsultation}
            onSendChatMessage={handleSendChatMessage}
            selectedLawyerForBooking={selectedLawyerForBooking}
            onClearSelectedLawyer={() => setSelectedLawyerForBooking(null)}
          />
        )}

        {/* 5. POLICE AUTHORITY ADMIN COMMAND DESK */}
        {activeTab === 'police_admin' && (
          <PoliceAuthorityAdminDashboard
            currentUser={currentUser}
            incidents={incidents}
            alerts={alerts}
            zones={SAFETY_ZONES}
            patrols={patrols}
            consultations={consultations}
            onUpdateIncidentStatus={handleUpdateStatus}
            onBroadcastAlert={handleAddAlert}
            onDeployPatrol={handleAddPatrol}
            onOpen100Facility={() => setIs100FacilityOpen(true)}
          />
        )}

        {/* 6. COMMUNITY ALERTS */}
        {activeTab === 'alerts' && (
          <CommunityAlerts
            alerts={alerts}
            currentUserRole={currentUser.role === 'police_authority' ? 'officer' : 'citizen'}
            onAddAlert={handleAddAlert}
            onDismissAlert={handleDismissAlert}
          />
        )}

        {/* 7. SAFETY ZONES & PATROLS */}
        {activeTab === 'zones' && (
          <SafetyZonesPatrol
            zones={SAFETY_ZONES}
            patrols={patrols}
            onJoinPatrol={handleJoinPatrol}
            onAddPatrol={handleAddPatrol}
            currentUserRole={currentUser.role === 'police_authority' ? 'officer' : 'citizen'}
          />
        )}

        {/* 8. CASE TRACKER */}
        {activeTab === 'tracker' && (
          <CaseTracker
            incidents={incidents}
            onAddWitnessNote={handleAddWitnessNote}
          />
        )}

        {/* 9. CRIME ANALYTICS */}
        {activeTab === 'analytics' && (
          <CrimeAnalytics
            incidents={incidents}
            zones={SAFETY_ZONES}
          />
        )}

        {/* 10. 100 & EMERGENCY HOTLINE DIRECTORY */}
        {activeTab === 'contacts' && (
          <EmergencyContacts
            contacts={contacts}
            onAddContact={handleAddContact}
            onDeleteContact={handleDeleteContact}
          />
        )}

        {/* 11. SAFETY HANDBOOK */}
        {activeTab === 'guides' && (
          <SafetyTipsGuide />
        )}
      </main>

      {/* Footer with Human-crafted details & emergency hot-links */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md py-8 text-xs text-slate-500 dark:text-slate-400 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">SafeCity Hub Central Emergency Network</span>
                <p className="text-[11px] text-slate-500">Citizen Protection, Legal Rights Transparency & 100 Dispatch</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFX.playEmergencyAlert();
                  setIs100FacilityOpen(true);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-600/20"
              >
                <Phone className="w-3.5 h-3.5" /> Direct 100 Call
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab('chatbot');
                }}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-500" /> BNS / IPC Laws
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] gap-2 text-slate-500">
            <p>
              © 2026 SafeCity Command & Civic Protection Authority. Zero-FIR mandate enacted under Section 173 BNSS / Section 154 CrPC.
            </p>
            <div className="flex items-center gap-4">
              <span>National Cyber Helpline: <b>1930</b></span>
              <span>Women Helpline: <b>1090</b></span>
              <span>Childline: <b>1098</b></span>
            </div>
          </div>
        </div>
      </footer>

      {/* REPORT INCIDENT MODAL */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddIncident}
      />

      {/* EMERGENCY SOS PANIC MODAL */}
      <EmergencySOSModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        contacts={contacts}
        onSosBroadcast={handleSosBroadcast}
      />

      {/* 100 EMERGENCY CALL FACILITY */}
      <Emergency100CallFacility
        isOpen={is100FacilityOpen}
        onClose={() => setIs100FacilityOpen(false)}
        currentUser={currentUser}
        onDispatchEmergencyReport={handleAddIncident}
      />

      {/* DUAL AUTH MODAL (CITIZEN & POLICE AUTHORITY) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={currentUser.role}
      />

      {/* TOAST POPUP NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in max-w-sm">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md transition-all ${
            toastMessage.type === 'alert'
              ? 'bg-red-900/95 dark:bg-red-950/95 border-red-500 text-white shadow-red-900/40'
              : toastMessage.type === 'success'
              ? 'bg-emerald-800/95 dark:bg-emerald-950/95 border-emerald-500 text-white shadow-emerald-900/40'
              : 'bg-white/95 dark:bg-slate-900/95 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-xl'
          }`}>
            <Bell className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-bold">{toastMessage.title}</h4>
              <p className="text-[11px] opacity-90 leading-snug">{toastMessage.desc}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
