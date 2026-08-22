import React, { useState, useRef, useEffect } from 'react';
import { CrimeLawEntry, LawyerProfile } from '../types';
import { CRIME_LAWS_KNOWLEDGE_BASE } from '../data/crimeLawsData';
import { LAWYERS_DIRECTORY } from '../data/lawyersData';
import { 
  Scale, 
  Send, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Gavel, 
  CornerDownRight, 
  PhoneCall, 
  Bot, 
  User,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  matchedLaw?: CrimeLawEntry;
  suggestedLawyer?: LawyerProfile;
}

interface CrimeLawsChatbotProps {
  onOpenLawyerConsultation?: (lawyer: LawyerProfile) => void;
  onOpen100Facility?: () => void;
}

export const CrimeLawsChatbot: React.FC<CrimeLawsChatbotProps> = ({
  onOpenLawyerConsultation,
  onOpen100Facility
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      text: 'Hello! I am your SafeCity Legal Crime Assistant. I provide structured legal intelligence on Criminal Laws, Bharatiya Nyaya Sanhita (BNS 2023), Indian Penal Code (IPC), IT Act 2000, POCSO, Motor Vehicles Act, statutory punishments, bail provisions, and verified advocate recommendations.\n\nAsk about any crime, legal sections, bail rights, or procedure to file Zero-FIR.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'acts_index'>('chat');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const findBestMatchingLaw = (query: string): CrimeLawEntry | null => {
    const q = query.toLowerCase().trim();
    
    // Direct keyword match
    for (const law of CRIME_LAWS_KNOWLEDGE_BASE) {
      if (law.keywords.some((k) => q.includes(k.toLowerCase())) || q.includes(law.crimeName.toLowerCase())) {
        return law;
      }
    }

    // Secondary scan on sections or definition
    for (const law of CRIME_LAWS_KNOWLEDGE_BASE) {
      if (
        (law.sections.ipcSection && law.sections.ipcSection.toLowerCase().includes(q)) ||
        (law.sections.bnsSection && law.sections.bnsSection.toLowerCase().includes(q)) ||
        (law.sections.itActSection && law.sections.itActSection.toLowerCase().includes(q)) ||
        law.definition.toLowerCase().includes(q)
      ) {
        return law;
      }
    }

    return null;
  };

  const getRecommendedLawyer = (law: CrimeLawEntry | null): LawyerProfile => {
    if (!law) return LAWYERS_DIRECTORY[0];
    if (law.id.includes('cyber')) return LAWYERS_DIRECTORY[2] || LAWYERS_DIRECTORY[0];
    if (law.id.includes('women') || law.id.includes('domestic') || law.id.includes('pocso')) return LAWYERS_DIRECTORY[1] || LAWYERS_DIRECTORY[0];
    if (law.id.includes('traffic') || law.id.includes('assault')) return LAWYERS_DIRECTORY[3] || LAWYERS_DIRECTORY[0];
    return LAWYERS_DIRECTORY[0];
  };

  const handleSend = (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query) return;

    soundFX.playClick();

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      soundFX.playSuccessChime();
      const matchedLaw = findBestMatchingLaw(query);
      const recommendedLawyer = getRecommendedLawyer(matchedLaw);

      let botResponseText = '';

      if (matchedLaw) {
        botResponseText = `⚖️ **Legal Analysis for: ${matchedLaw.crimeName}**\n\n` +
          `• **Statutory Act**: ${matchedLaw.applicableAct}\n` +
          `• **Key Sections**: ${matchedLaw.sections.bnsSection || ''} ${matchedLaw.sections.ipcSection ? `| ${matchedLaw.sections.ipcSection}` : ''} ${matchedLaw.sections.itActSection ? `| ${matchedLaw.sections.itActSection}` : ''}\n\n` +
          `📖 **Legal Definition**:\n${matchedLaw.definition}\n\n` +
          `🔒 **Statutory Punishment**:\n${matchedLaw.punishment}\n\n` +
          `⚖️ **Legal Nature**:\n• Bail Status: ${matchedLaw.bailable}\n• Offence Type: ${matchedLaw.cognizable}\n• Jurisdiction / Triable by: ${matchedLaw.courtTriableBy}`;
      } else {
        botResponseText = `I have analyzed your query regarding "${query}". Under criminal jurisprudence, offences are codified under the Bharatiya Nyaya Sanhita (BNS 2023) and specific special acts (IT Act 2000, POCSO, Domestic Violence Act, MV Act).\n\nIf you are facing an ongoing threat or urgent crime, please use the **100 Emergency Call Facility** or consult a certified criminal advocate below for case advisory.`;
      }

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedLaw: matchedLaw || undefined,
        suggestedLawyer: recommendedLawyer
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const samplePrompts = [
    'What is the punishment for Cyber Fraud & Online UPI Scams under IT Act?',
    'What is the legal section for Eve-Teasing and Stalking?',
    'What are my rights to file a Zero FIR if police refuse to lodge complaint?',
    'What is the punishment for Hit and Run under the new BNS Act?',
    'What is the law and punishment for House Burglary & Theft?',
    'What is the penalty for Assault and Physical Grievous Hurt?'
  ];

  const filteredLaws = CRIME_LAWS_KNOWLEDGE_BASE.filter(
    (l) =>
      l.crimeName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.applicableAct.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (l.sections.ipcSection && l.sections.ipcSection.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (l.sections.bnsSection && l.sections.bnsSection.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/25 border border-blue-400/30">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Crime Laws & Acts AI Legal Advisor</h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded-full">
                BNS 2023 & IPC UPDATED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query any crime, statutory sections, legal punishments, bail rules, and consult verified criminal defense advocates
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('chat');
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" /> Legal AI Chat
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              setActiveTab('acts_index');
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'acts_index'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Acts & Sections Index
          </button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Interactive Chat Box */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl flex flex-col h-[650px] transition-colors">
            
            {/* Quick Sample Prompts Ribbon */}
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Frequently Asked Legal Questions:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] font-medium bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600'
                        : 'bg-gradient-to-tr from-indigo-700 to-blue-600 border border-blue-400/40'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-line font-normal">{msg.text}</div>

                    {/* Actionable Legal Breakdown Card */}
                    {msg.matchedLaw && (
                      <div className="mt-3 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-slate-700 dark:text-slate-300 shadow-sm">
                        <div className="flex items-center justify-between text-[11px] border-b border-slate-100 dark:border-slate-800 pb-1.5 font-bold">
                          <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <Gavel className="w-3.5 h-3.5" /> Citizen Immediate Action Checklist:
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">Bail: {msg.matchedLaw.bailable}</span>
                        </div>

                        <ul className="space-y-1 text-[11px]">
                          {msg.matchedLaw.immediateCitizenAction.map((act, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                              <span>{act}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Need professional courtroom defense or police escort?
                          </span>
                          {msg.suggestedLawyer && (
                            <button
                              onClick={() => {
                                soundFX.playClick();
                                onOpenLawyerConsultation?.(msg.suggestedLawyer!);
                              }}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow transition"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Consult {msg.suggestedLawyer.name} ({msg.suggestedLawyer.currency}{msg.suggestedLawyer.consultationFee})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] opacity-60 text-right">{msg.timestamp}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                  <Bot className="w-4 h-4 text-blue-500 animate-spin" />
                  <span>Analyzing criminal jurisprudence database...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about offences, sections (e.g. BNS 106, IPC 420), bail, punishments..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" /> Ask Law AI
              </button>
            </form>
          </div>

          {/* Right Column: Quick Law Reference & 100 Dispatch Card */}
          <div className="space-y-4">
            
            {/* Quick Emergency 100 Dispatch Banner */}
            <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 rounded-3xl p-5 text-white shadow-lg shadow-red-600/20 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
                <h3 className="text-sm font-black uppercase tracking-wider">Crime in Progress?</h3>
              </div>
              <p className="text-xs text-red-100 leading-relaxed">
                Legal advice is for rights protection. If you or someone is in immediate physical danger, dial 100 control room immediately.
              </p>
              <button
                onClick={() => {
                  soundFX.playEmergencyAlert();
                  onOpen100Facility?.();
                }}
                className="w-full py-2.5 bg-white text-red-700 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:bg-red-50 transition"
              >
                <Phone className="w-4 h-4" /> Open 100 Emergency Call Facility
              </button>
            </div>

            {/* Zero-FIR Rights Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm dark:shadow-xl">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-FIR Statutory Mandate</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Section 173 BNSS / Sec 154 CrPC</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Any police station in India is legally obligated to register an FIR for a cognizable offence, regardless of jurisdiction. Refusal to file is punishable under Sec 199 BNS.
              </p>
            </div>

            {/* Verified Advocates Available */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm dark:shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-500" /> Duty Advocates on Call ({LAWYERS_DIRECTORY.length})
              </h4>
              <div className="space-y-2">
                {LAWYERS_DIRECTORY.slice(0, 3).map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{lawyer.name}</span>
                      <span className="text-[10px] text-slate-500">{lawyer.specialization[0]} • {lawyer.experienceYears} yrs</span>
                    </div>
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        onOpenLawyerConsultation?.(lawyer);
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] shadow"
                    >
                      Book ({lawyer.currency}{lawyer.consultationFee})
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Acts Index View */}
      {activeTab === 'acts_index' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search across BNS, IPC, IT Act, POCSO, sections, or keywords..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLaws.map((law) => (
              <div
                key={law.id}
                className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm dark:shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{law.applicableAct}</span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {law.sections.bnsSection || law.sections.ipcSection}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{law.crimeName}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{law.definition}</p>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs space-y-1 border border-slate-200 dark:border-slate-800">
                    <div><b>Statutory Punishment:</b> <span className="text-amber-700 dark:text-amber-300">{law.punishment}</span></div>
                    <div><b>Bail:</b> <span className="font-mono text-slate-600 dark:text-slate-400">{law.bailable}</span></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{law.courtTriableBy}</span>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveTab('chat');
                      handleSend(`Explain detailed legal consequences and case law for ${law.crimeName}`);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                  >
                    Ask AI Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
