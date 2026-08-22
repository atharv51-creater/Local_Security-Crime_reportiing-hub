import { 
  IncidentReport, 
  CommunityAlert, 
  PatrolSchedule, 
  EmergencyContact, 
  UserProfile, 
  LegalConsultationBooking, 
  LawyerChatMessage 
} from '../types';
import { INITIAL_INCIDENTS, INITIAL_ALERTS, INITIAL_PATROLS, EMERGENCY_CONTACTS } from '../data/mockData';
import { INITIAL_CONSULTATIONS, INITIAL_CHAT_MESSAGES } from '../data/lawyersData';

const INCIDENTS_KEY = 'safecity_incidents_v2';
const ALERTS_KEY = 'safecity_alerts_v2';
const PATROLS_KEY = 'safecity_patrols_v2';
const CONTACTS_KEY = 'safecity_contacts_v2';
const CURRENT_USER_KEY = 'safecity_current_user_v2';
const CONSULTATIONS_KEY = 'safecity_consultations_v2';
const CHAT_MESSAGES_KEY = 'safecity_lawyer_chats_v2';

export const DEFAULT_CITIZEN_USER: UserProfile = {
  id: 'usr-citizen-101',
  name: 'Atharv Ubale',
  email: 'atharvubale51@gmail.com',
  phone: '+91 98204 77190',
  role: 'citizen',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  address: 'Apartment 4B, Metro Green Enclave, Northside',
  city: 'Metro City',
  joinedDate: '2026-01-15'
};

export const DEFAULT_POLICE_USER: UserProfile = {
  id: 'pol-officer-501',
  name: 'Inspector Vikram Kulkarni',
  email: 'inspector.kulkarni@police.gov.in',
  phone: '+91 22 2640 1000',
  role: 'police_authority',
  badgeNumber: 'POL-MH-8842',
  precinct: 'Northside Sector 4 Central Police Station',
  designation: 'Senior Inspector & Night Desk In-Charge',
  rank: 'Inspector of Police (Law & Order)',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  address: 'Sector 4 Police Headquarters, Northside',
  city: 'Metro City',
  joinedDate: '2020-03-10'
};

export function getStoredIncidents(): IncidentReport[] {
  try {
    const data = localStorage.getItem(INCIDENTS_KEY);
    if (!data) {
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load incidents', e);
    return INITIAL_INCIDENTS;
  }
}

export function saveIncidents(incidents: IncidentReport[]): void {
  try {
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  } catch (e) {
    console.error('Failed to save incidents', e);
  }
}

export function getStoredAlerts(): CommunityAlert[] {
  try {
    const data = localStorage.getItem(ALERTS_KEY);
    if (!data) {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ALERTS;
  }
}

export function saveAlerts(alerts: CommunityAlert[]): void {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts', e);
  }
}

export function getStoredPatrols(): PatrolSchedule[] {
  try {
    const data = localStorage.getItem(PATROLS_KEY);
    if (!data) {
      localStorage.setItem(PATROLS_KEY, JSON.stringify(INITIAL_PATROLS));
      return INITIAL_PATROLS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PATROLS;
  }
}

export function savePatrols(patrols: PatrolSchedule[]): void {
  try {
    localStorage.setItem(PATROLS_KEY, JSON.stringify(patrols));
  } catch (e) {
    console.error('Failed to save patrols', e);
  }
}

export function getStoredContacts(): EmergencyContact[] {
  try {
    const data = localStorage.getItem(CONTACTS_KEY);
    if (!data) {
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(EMERGENCY_CONTACTS));
      return EMERGENCY_CONTACTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return EMERGENCY_CONTACTS;
  }
}

export function saveContacts(contacts: EmergencyContact[]): void {
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save contacts', e);
  }
}

export function getCurrentUser(): UserProfile {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEFAULT_CITIZEN_USER));
    return DEFAULT_CITIZEN_USER;
  } catch {
    return DEFAULT_CITIZEN_USER;
  }
}

export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function getStoredConsultations(): LegalConsultationBooking[] {
  try {
    const data = localStorage.getItem(CONSULTATIONS_KEY);
    if (!data) {
      localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(INITIAL_CONSULTATIONS));
      return INITIAL_CONSULTATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CONSULTATIONS;
  }
}

export function saveConsultations(bookings: LegalConsultationBooking[]): void {
  try {
    localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings', e);
  }
}

export function getStoredChatMessages(): LawyerChatMessage[] {
  try {
    const data = localStorage.getItem(CHAT_MESSAGES_KEY);
    if (!data) {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(INITIAL_CHAT_MESSAGES));
      return INITIAL_CHAT_MESSAGES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CHAT_MESSAGES;
  }
}

export function saveChatMessages(messages: LawyerChatMessage[]): void {
  try {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages', e);
  }
}

export function generateIncidentId(): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `CR-2026-${randNum}`;
}

export function generateFirNumber(): string {
  const randNum = Math.floor(100 + Math.random() * 900);
  return `FIR/2026/NS-${randNum}`;
}

export function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateBookingId(): string {
  return `BK-${Math.floor(1000 + Math.random() * 9000)}`;
}
