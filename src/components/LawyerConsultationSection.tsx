import React, { useState } from 'react';
import { LawyerProfile, LegalConsultationBooking, LawyerChatMessage, UserProfile } from '../types';
import { LAWYERS_DIRECTORY } from '../data/lawyersData';
import { generateBookingId } from '../utils/storage';
import { 
  UserCheck, 
  Scale, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Award, 
  Star, 
  ShieldCheck, 
  Video, 
  Plus, 
  Search,
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface LawyerConsultationSectionProps {
  currentUser: UserProfile;
  consultations: LegalConsultationBooking[];
  chatMessages: LawyerChatMessage[];
  onAddConsultation: (booking: LegalConsultationBooking) => void;
  onSendChatMessage: (message: LawyerChatMessage) => void;
  selectedLawyerForBooking?: LawyerProfile | null;
  onClearSelectedLawyer?: () => void;
}

export const LawyerConsultationSection: React.FC<LawyerConsultationSectionProps> = ({
  currentUser,
  consultations,
  chatMessages,
  onAddConsultation,
  onSendChatMessage,
  selectedLawyerForBooking,
  onClearSelectedLawyer
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'my_bookings' | 'live_chat'>('directory');
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(selectedLawyerForBooking || null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(!!selectedLawyerForBooking);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState<LegalConsultationBooking | null>(
    consultations[0] || null
  );

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  // Booking Form State
  const [topic, setTopic] = useState<string>('');
  const [caseDescription, setCaseDescription] = useState<string>('');
  const [crimeCategory, setCrimeCategory] = useState<string>('Cyber Fraud & Online Scam');
  const [preferredDate, setPreferredDate] = useState<string>('2026-08-25');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('11:00 AM - 11:30 AM');
  const [consultationMode, setConsultationMode] = useState<'chat' | 'phone_call' | 'video_meet' | 'in_person'>('chat');
  const [paymentOption, setPaymentOption] = useState<'paid' | 'pay_at_consultation'>('paid');

  // Chat input
  const [chatInput, setChatInput] = useState<string>('');

  const specialtiesList = [
    'all',
    'Criminal Defense',
    'Cyber Crime & IT Act',
    'Women Safety & Harassment',
    'POCSO Act',
    'Domestic Violence',
    'Hit and Run & MACT Claims',
    'Financial Fraud'
  ];

  const filteredLawyers = LAWYERS_DIRECTORY.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.specialization.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === 'all' || l.specialization.includes(selectedSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  const handleOpenBooking = (lawyer: LawyerProfile) => {
    soundFX.playClick();
    setSelectedLawyer(lawyer);
    setShowBookingModal(true);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLawyer || !topic.trim()) return;

    soundFX.playSuccessChime();

    const newBooking: LegalConsultationBooking = {
      id: generateBookingId(),
      citizenId: currentUser.id,
      citizenName: currentUser.name || 'Resident',
      citizenPhone: currentUser.phone || '+91 98200 00000',
      citizenEmail: currentUser.email || 'citizen@example.com',
      lawyerId: selectedLawyer.id,
      lawyerName: selectedLawyer.name,
      crimeCategory,
      topic: topic.trim(),
      caseDescription: caseDescription.trim() || 'Guidance requested for criminal trial and rights representation.',
      preferredDate,
      preferredTimeSlot,
      consultationMode,
      fee: selectedLawyer.consultationFee,
      paymentStatus: paymentOption,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notesFromLawyer: 'Consultation confirmed. Lawyer is available via the SafeCity in-app legal chat room.'
    };

    onAddConsultation(newBooking);

    // Initial greeting from lawyer in chat
    const initialLawyerGreeting: LawyerChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId: newBooking.id,
      senderId: selectedLawyer.id,
      senderName: selectedLawyer.name,
      senderRole: 'lawyer',
      text: `Hello ${currentUser.name || 'Sir/Madam'}, I have confirmed your appointment regarding "${topic}". Please share your FIR number, police station name, and any evidence documents here.`,
      timestamp: new Date().toISOString(),
      isLegalAdviceNotice: true
    };

    onSendChatMessage(initialLawyerGreeting);
    setSelectedBookingForChat(newBooking);
    setShowBookingModal(false);
    setActiveSubTab('live_chat');
    setTopic('');
    setCaseDescription('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedBookingForChat) return;

    soundFX.playClick();

    const userMessage: LawyerChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId: selectedBookingForChat.id,
      senderId: currentUser.id,
      senderName: currentUser.name || 'Citizen',
      senderRole: currentUser.role === 'police_authority' ? 'police' : 'citizen',
      text: chatInput.trim(),
      timestamp: new Date().toISOString()
    };

    onSendChatMessage(userMessage);
    setChatInput('');

    // Simulate smart lawyer response after a brief pause
    setTimeout(() => {
      soundFX.playSuccessChime();
      const lawyerReplies = [
        `Under relevant sections of Bharatiya Nyaya Sanhita (BNS) and CrPC, ensure that you demand an official stamped endorsement on your complaint copy.`,
        `I am reviewing the case timeline. If the investigating officer delays the FIR, we can file a direct formal grievance before the Superintendent of Police under Section 173(4) BNSS.`,
        `Please preserve all digital logs and receipts without editing, as they form admissible primary electronic evidence.`,
        `I will prepare the draft petition for your review before our scheduled session.`
      ];
      const randomReply = lawyerReplies[Math.floor(Math.random() * lawyerReplies.length)];

      const lawyerMsg: LawyerChatMessage = {
        id: `msg-${Date.now() + 1}`,
        bookingId: selectedBookingForChat.id,
        senderId: selectedBookingForChat.lawyerId,
        senderName: selectedBookingForChat.lawyerName,
        senderRole: 'lawyer',
        text: randomReply,
        timestamp: new Date().toISOString(),
        isLegalAdviceNotice: true
      };

      onSendChatMessage(lawyerMsg);
    }, 1200);
  };

  const currentChatMessages = chatMessages.filter(
    (m) => m.bookingId === selectedBookingForChat?.id
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-300 font-bold">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Verified Criminal Lawyer Guidance & Consultations</h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-full">
                BAR COUNCIL VETTED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent fees, instant consultation bookings, and confidential direct live chat for legal doubts & FIR guidance
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('directory');
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'directory'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" /> Lawyer Directory
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('my_bookings');
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'my_bookings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> My Bookings ({consultations.length})
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveSubTab('live_chat');
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'live_chat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Live Lawyer Chat
          </button>
        </div>
      </div>

      {/* 1. LAWYER DIRECTORY VIEW */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search lawyer by name, specialization (e.g. Cyber, Bail, POCSO)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {specialtiesList.map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedSpecialty(spec);
                  }}
                  className={`text-xs px-3 py-1 rounded-xl transition whitespace-nowrap capitalize ${
                    selectedSpecialty === spec
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Lawyers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 hover:border-amber-400/60 dark:hover:border-amber-500/40 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={lawyer.avatar}
                      alt={lawyer.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shrink-0 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-black text-slate-900 dark:text-white truncate">{lawyer.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{lawyer.rating}</span>
                          <span className="text-slate-400 font-normal">({lawyer.reviewCount})</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{lawyer.title}</p>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        Bar No: <span className="text-amber-700 dark:text-amber-300 font-bold">{lawyer.barCouncilNumber}</span>
                      </p>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {lawyer.specialization.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-indigo-50 dark:bg-slate-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/60 px-2.5 py-0.5 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lawyer.bio}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" /> Practice Court:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{lawyer.courtPractice}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Availability:
                      </span>
                      <span className="text-slate-900 dark:text-white">{lawyer.availability}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Consultation Fee</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {lawyer.currency}{lawyer.consultationFee} <span className="text-xs font-normal text-slate-400">/ 30 min</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${lawyer.phone.replace(/[^0-9+]/g, '')}`}
                      className="p-2.5 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                      title="Direct Phone"
                    >
                      <Phone className="w-4 h-4 text-emerald-500" />
                    </a>

                    <button
                      onClick={() => handleOpenBooking(lawyer)}
                      className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
                    >
                      <Calendar className="w-4 h-4" /> Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. MY BOOKINGS VIEW */}
      {activeSubTab === 'my_bookings' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Your Scheduled Legal Consultation Sessions
            </h3>

            {consultations.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Scale className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
                <p className="text-slate-500 text-xs">No active legal consultation bookings found.</p>
                <button
                  onClick={() => setActiveSubTab('directory')}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Browse Lawyer Directory
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                          {booking.id}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase">
                          {booking.crimeCategory}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          ● {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{booking.topic}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Consultant: <b>{booking.lawyerName}</b> • Scheduled on: <b>{booking.preferredDate} ({booking.preferredTimeSlot})</b>
                      </p>
                      {booking.notesFromLawyer && (
                        <p className="text-xs text-amber-800 dark:text-amber-200/90 italic pt-1">
                          Lawyer Note: "{booking.notesFromLawyer}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                          ₹{booking.fee} ({booking.paymentStatus === 'paid' ? 'Paid' : 'Pay at session'})
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                          Mode: {booking.consultationMode}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setSelectedBookingForChat(booking);
                          setActiveSubTab('live_chat');
                        }}
                        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <MessageSquare className="w-4 h-4" /> Open Chat Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. LIVE LAWYER CHAT SECTION */}
      {activeSubTab === 'live_chat' && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Cases / Channels Sidebar */}
          <div className="space-y-3 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Active Consultation Cases
            </h3>

            <div className="space-y-2">
              {consultations.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedBookingForChat(b);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1 ${
                    selectedBookingForChat?.id === b.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-700 dark:text-amber-400">{b.lawyerName}</span>
                    <span className="font-mono text-slate-500">{b.id}</span>
                  </div>
                  <p className="text-xs font-semibold truncate">{b.topic}</p>
                  <p className="text-[10px] text-slate-400">{b.preferredDate} • {b.preferredTimeSlot}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 flex flex-col h-[560px] bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            {selectedBookingForChat ? (
              <>
                {/* Chat Top bar */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-500" />
                      {selectedBookingForChat.lawyerName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Topic: {selectedBookingForChat.topic} • Case ID: {selectedBookingForChat.id}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    ADVOCATE ONLINE
                  </span>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
                  {currentChatMessages.map((msg) => {
                    const isMe = msg.senderRole === (currentUser.role === 'police_authority' ? 'police' : 'citizen');
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                          {msg.senderName} ({msg.senderRole.toUpperCase()})
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1 ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                          {msg.isLegalAdviceNotice && (
                            <div className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Privileged Legal Counsel Opinion
                            </div>
                          )}
                          <span className="text-[9px] opacity-60 block text-right">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Form */}
                <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your crime/case doubt, evidence details, or legal question..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Select a consultation case from the left panel to begin legal consultation.
              </div>
            )}
          </div>

        </div>
      )}

      {/* BOOKING MODAL */}
      {showBookingModal && selectedLawyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedLawyer.avatar}
                  alt={selectedLawyer.name}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Book Legal Consultation</h3>
                  <p className="text-xs text-amber-600 dark:text-amber-300 font-semibold">{selectedLawyer.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  onClearSelectedLawyer?.();
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">Crime Category *</label>
                <select
                  value={crimeCategory}
                  onChange={(e) => setCrimeCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Cyber Fraud & Online Scam">Cyber Fraud & Online Scam (1930 / IT Act)</option>
                  <option value="Theft, Snatching & Burglary">Theft, Snatching & Burglary</option>
                  <option value="Women Safety, Stalking & Harassment">Women Safety, Stalking & Harassment</option>
                  <option value="Assault & Grievous Hurt">Assault & Grievous Hurt</option>
                  <option value="Hit and Run & Road Accident">Hit and Run & Road Accident (MACT)</option>
                  <option value="Domestic Violence & Cruelty">Domestic Violence & Cruelty</option>
                  <option value="Bail & Anticipatory Bail Rights">Bail & Anticipatory Bail Rights</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">Case Subject / Query Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent advice on filing Zero FIR for unauthorized bank debit"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">Case Brief & Evidence Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly state facts, police station involved, FIR number if logged..."
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">Preferred Time Slot</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                    <option value="05:30 PM - 06:00 PM">05:30 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Consultation Fee</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {selectedLawyer.currency}{selectedLawyer.consultationFee}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('paid')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                      paymentOption === 'paid' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Pay Online Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentOption('pay_at_consultation')}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                      paymentOption === 'pay_at_consultation' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Pay on Consult
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20"
                >
                  Confirm & Open Lawyer Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
