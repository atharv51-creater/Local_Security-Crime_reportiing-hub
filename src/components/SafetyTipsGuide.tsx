import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Home, 
  Moon, 
  Smartphone, 
  Eye, 
  Lock, 
  CheckSquare, 
  AlertOctagon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundFX } from '../utils/theme';

export const SafetyTipsGuide: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    soundFX.playClick();
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl flex items-center gap-4 transition-colors">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Community Safety & Crime Prevention Handbook</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Actionable security protocols vetted by municipal law enforcement and neighborhood watch councils
          </p>
        </div>
      </div>

      {/* Grid of Security Guide Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Home Defense Checklist */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-500" />
            Home & Perimeter Burglary Defense
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 'h1', text: 'Ensure deadbolts have at least 1-inch throw bolt on all exterior entry doors.' },
              { id: 'h2', text: 'Trim shrubbery around windows and front porch to eliminate blind spots for prowlers.' },
              { id: 'h3', text: 'Install smart motion-activated LED floodlights on rear alleys and garage driveways.' },
              { id: 'h4', text: 'Keep garage side doors padlocked and disengage automatic opener when away on travel.' },
              { id: 'h5', text: 'Never leave spare keys hidden under flowerpots or doormats.' }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                  checkedItems[item.id]
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  checkedItems[item.id] ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}>
                  {checkedItems[item.id] && '✓'}
                </div>
                <span className="leading-relaxed font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Solo Walking & Night Travel */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-500" />
            Night Commuting & Walking Safety
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 'n1', text: 'Stick to well-lit major avenues; avoid dim shortcuts through alleyways and parks.' },
              { id: 'n2', text: 'Keep one earbud out so you remain fully alert to approaching footsteps or bicycles.' },
              { id: 'n3', text: 'Share your live trip location with a trusted contact when walking home after 10 PM.' },
              { id: 'n4', text: 'If you suspect you are being followed, cross the street toward open convenience stores or safe havens.' },
              { id: 'n5', text: 'Keep emergency SOS trigger pre-configured on your lock screen for 1-touch broadcast.' }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                  checkedItems[item.id]
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  checkedItems[item.id] ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}>
                  {checkedItems[item.id] && '✓'}
                </div>
                <span className="leading-relaxed font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Safety & Cyber Scam Defense */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-500" />
            Digital & Cyber Fraud Defense
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 'c1', text: 'Never share OTPs, UPI PINs, or banking passwords with anyone claiming to be bank or police personnel.' },
              { id: 'c2', text: 'Beware of fake parcel delivery or electricity disconnection SMS links.' },
              { id: 'c3', text: 'Enable Two-Factor Authentication (2FA) via authenticator app across all social and email accounts.' },
              { id: 'c4', text: 'Immediately dial 1930 for National Cyber Crime Reporting in case of online banking fraud.' }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                  checkedItems[item.id]
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  checkedItems[item.id] ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}>
                  {checkedItems[item.id] && '✓'}
                </div>
                <span className="leading-relaxed font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Rights at Police Station */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            Citizen Legal Rights under BNS / CrPC
          </h3>

          <div className="space-y-2.5 text-xs">
            {[
              { id: 'l1', text: 'Free Copy of FIR: Every complainant is legally entitled to a zero-cost copy of the registered First Information Report.' },
              { id: 'l2', text: 'Zero FIR Provision: An FIR can be registered at ANY police station regardless of jurisdictional boundaries.' },
              { id: 'l3', text: 'Arrest Memo Rights: Arresting officer must prepare an arrest memo with time, reason, and signature of a local witness.' },
              { id: 'l4', text: 'Right to Legal Counsel: You have an inviolable right to consult and be defended by a legal practitioner of your choice (Article 22(1)).' }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                  checkedItems[item.id]
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  checkedItems[item.id] ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}>
                  {checkedItems[item.id] && '✓'}
                </div>
                <span className="leading-relaxed font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
