import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEFAULT_CITIZEN_USER, DEFAULT_POLICE_USER, saveCurrentUser } from '../utils/storage';
import { 
  ShieldAlert, 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound, 
  AlertCircle,
  X 
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'citizen'
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Citizen Form State
  const [citizenName, setCitizenName] = useState<string>('Atharv Ubale');
  const [citizenEmail, setCitizenEmail] = useState<string>('atharvubale51@gmail.com');
  const [citizenPhone, setCitizenPhone] = useState<string>('+91 98204 77190');
  const [citizenAddress, setCitizenAddress] = useState<string>('Northside Sector 4, Metro City');

  // Police Authority Form State
  const [officerName, setOfficerName] = useState<string>('Inspector Vikram Kulkarni');
  const [officerEmail, setOfficerEmail] = useState<string>('inspector.kulkarni@police.gov.in');
  const [badgeNumber, setBadgeNumber] = useState<string>('POL-MH-8842');
  const [precinct, setPrecinct] = useState<string>('Northside Sector 4 Central Police Station');
  const [designation, setDesignation] = useState<string>('Senior Inspector & Duty Desk In-Charge');
  const [passcode, setPasscode] = useState<string>('9988');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !citizenEmail.trim()) {
      setErrorMessage('Please provide name and email.');
      return;
    }

    soundFX.playSuccessChime();

    const user: UserProfile = {
      id: `usr-citizen-${Date.now()}`,
      name: citizenName.trim(),
      email: citizenEmail.trim(),
      phone: citizenPhone.trim() || '+91 98200 00000',
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      address: citizenAddress.trim() || 'Metro City',
      city: 'Metro City',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    saveCurrentUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handlePoliceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeNumber.trim() || !officerName.trim()) {
      setErrorMessage('Official Badge ID and Officer Name are mandatory for Police Authority login.');
      return;
    }

    soundFX.playSuccessChime();

    const user: UserProfile = {
      id: `pol-${badgeNumber.trim().replace(/\s+/g, '-').toLowerCase()}`,
      name: officerName.trim(),
      email: officerEmail.trim(),
      phone: '+91 22 2640 1000',
      role: 'police_authority',
      badgeNumber: badgeNumber.trim(),
      precinct: precinct.trim(),
      designation: designation.trim(),
      rank: 'Inspector of Police (Law & Order)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      address: precinct.trim(),
      city: 'Metro City',
      joinedDate: '2020-03-10'
    };

    saveCurrentUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    soundFX.playClick();
    if (role === 'citizen') {
      saveCurrentUser(DEFAULT_CITIZEN_USER);
      onLoginSuccess(DEFAULT_CITIZEN_USER);
    } else {
      saveCurrentUser(DEFAULT_POLICE_USER);
      onLoginSuccess(DEFAULT_POLICE_USER);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in transition-all">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 dark:bg-blue-600/30 border border-white/20 dark:border-blue-400/40 rounded-2xl text-white">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">SafeCity Hub Dual Gateways</h2>
                <p className="text-xs text-blue-100 dark:text-blue-200/80">
                  Select your authorization gateway to access security & emergency services
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual Portal Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-5 bg-black/20 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setSelectedRole('citizen');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedRole === 'citizen'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>1. Citizen Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setSelectedRole('police_authority');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedRole === 'police_authority'
                  ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>2. Police Authority (Admin)</span>
            </button>
          </div>
        </div>

        {/* Portal Forms */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-500/50 rounded-2xl text-xs text-red-700 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* CITIZEN LOGIN / REGISTRATION */}
          {selectedRole === 'citizen' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 rounded-2xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Citizens can file confidential crime reports, track e-FIRs, trigger 100 Emergency SOS, consult criminal lawyers, and query crime laws AI.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" /> Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atharv Ubale"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-500" /> Mobile / Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98204 77190"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Residential Sector / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Northside Sector 4, Metro City"
                  value={citizenAddress}
                  onChange={(e) => setCitizenAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition"
                >
                  <Lock className="w-4 h-4" /> Enter SafeCity Citizen Hub
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('citizen')}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Quick Demo Citizen
                </button>
              </div>
            </form>
          )}

          {/* POLICE AUTHORITY (ADMIN) LOGIN */}
          {selectedRole === 'police_authority' && (
            <form onSubmit={handlePoliceSubmit} className="space-y-4">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-500/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Official Law Enforcement Control Room: Receive citizens' crime reports in real-time, dispatch PCR units, register official e-FIRs, and broadcast city red alerts.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Officer Badge ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. POL-MH-8842"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-amber-400/60 font-mono rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Officer Name & Rank *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inspector Vikram Kulkarni"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Jurisdiction / Precinct *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Northside Sector 4 Central Station"
                    value={precinct}
                    onChange={(e) => setPrecinct(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Duty PIN / Access Code
                  </label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Official Police Email
                </label>
                <input
                  type="email"
                  placeholder="officer.name@police.gov.in"
                  value={officerEmail}
                  onChange={(e) => setOfficerEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition"
                >
                  <ShieldCheck className="w-4 h-4" /> Authenticate & Open Police Admin Desk
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('police_authority')}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Quick Demo Officer
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
