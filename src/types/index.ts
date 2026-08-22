export type IncidentCategory =
  | 'burglary'
  | 'theft'
  | 'vandalism'
  | 'suspicious_activity'
  | 'assault'
  | 'harassment'
  | 'traffic_hazard'
  | 'cyber_scam'
  | 'lost_found'
  | 'noise_disturbance'
  | 'public_hazard'
  | 'domestic_violence'
  | 'drug_narcotics'
  | 'extortion_fraud';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus =
  | 'under_review'
  | 'dispatched'
  | 'investigating'
  | 'fir_registered'
  | 'resolved'
  | 'false_alarm';

export interface IncidentComment {
  id: string;
  author: string;
  isOfficial?: boolean;
  content: string;
  timestamp: string;
}

export interface IncidentReport {
  id: string;
  pin: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  locationName: string;
  zone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reportedAt: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  reporterId?: string;
  firNumber?: string;
  suspectDetails?: {
    description?: string;
    vehiclePlate?: string;
    lastSeenHeading?: string;
    weaponsReported?: boolean;
  };
  evidenceUrls: string[];
  confirmationsCount: number;
  officerAssigned?: string;
  policeStation?: string;
  officialNotes?: string;
  comments: IncidentComment[];
}

export interface CommunityAlert {
  id: string;
  title: string;
  type: 'danger' | 'warning' | 'advisory' | 'amber_alert';
  message: string;
  zone: string;
  issuedBy: string;
  issuedAt: string;
  isActive: boolean;
  actionRequired: string;
}

export interface SafetyZone {
  id: string;
  name: string;
  safetyScore: number; // 0-100
  recentIncidentsCount: number;
  activePatrols: number;
  coordinates: { lat: number; lng: number };
  safeHavens: {
    name: string;
    type: 'police' | 'hospital' | 'fire_station' | 'community_post';
    address: string;
    phone: string;
    is24Hours: boolean;
    lat?: number;
    lng?: number;
  }[];
}

export interface PatrolSchedule {
  id: string;
  zone: string;
  leader: string;
  date: string;
  timeSlot: string;
  volunteersEnrolled: string[];
  maxVolunteers: number;
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationOrRole: string;
  phone: string;
  isPrimary?: boolean;
  category: 'national' | 'precinct' | 'personal' | 'medical';
}

// User and Auth Types
export type UserRole = 'citizen' | 'police_authority' | 'lawyer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  badgeNumber?: string;
  precinct?: string;
  designation?: string;
  rank?: string;
  avatar?: string;
  address?: string;
  city?: string;
  joinedDate: string;
}

// Lawyer Directory & Consultation
export interface LawyerProfile {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number; // e.g. 500 INR / $25
  currency: string;
  freeProBonoAvailable: boolean;
  barCouncilNumber: string;
  phone: string;
  email: string;
  bio: string;
  availability: string;
  avatar: string;
  languages: string[];
  city: string;
  address: string;
  courtPractice: string;
}

export interface LegalConsultationBooking {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  lawyerId: string;
  lawyerName: string;
  crimeCategory: string;
  topic: string;
  caseDescription: string;
  preferredDate: string;
  preferredTimeSlot: string;
  consultationMode: 'chat' | 'phone_call' | 'video_meet' | 'in_person';
  fee: number;
  paymentStatus: 'paid' | 'pay_at_consultation';
  status: 'pending' | 'confirmed' | 'in_consultation' | 'completed' | 'cancelled';
  createdAt: string;
  notesFromLawyer?: string;
}

export interface LawyerChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'citizen' | 'lawyer' | 'police' | 'system';
  text: string;
  timestamp: string;
  isLegalAdviceNotice?: boolean;
}

// Legal Crime Knowledge Base Item
export interface CrimeLawEntry {
  id: string;
  crimeName: string;
  keywords: string[];
  applicableAct: string; // e.g. IPC (Indian Penal Code) & BNS (Bharatiya Nyaya Sanhita)
  sections: {
    ipcSection?: string;
    bnsSection?: string;
    itActSection?: string;
    otherAct?: string;
  };
  definition: string;
  punishment: string;
  bailable: string;
  cognizable: string;
  courtTriableBy: string;
  reportingProcedure: string[];
  immediateCitizenAction: string[];
  suggestedLawyerSpecialization: string;
  emergencyHelpline: string;
}
