import React, { useState } from 'react';
import { EmergencyContact } from '../types';
import { 
  Phone, 
  Plus, 
  ShieldAlert, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  User, 
  HeartHandshake, 
  Building2, 
  PhoneCall,
  X
} from 'lucide-react';
import { soundFX } from '../utils/theme';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({
  contacts,
  onAddContact,
  onDeleteContact
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [category, setCategory] = useState<'personal' | 'precinct' | 'medical'>('personal');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    soundFX.playSuccessChime();

    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: name.trim(),
      relationOrRole: role.trim() || 'Emergency Contact',
      phone: phone.trim(),
      category
    };

    onAddContact(newContact);
    setShowAddModal(false);
    setName('');
    setRole('');
    setPhone('');
  };

  const copyNumber = (id: string, num: string) => {
    soundFX.playClick();
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/25">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Emergency Services & Direct Hotline Directory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One-touch rapid dialing for law enforcement, rescue agencies, and personal emergency circle
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundFX.playClick();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition"
        >
          <Plus className="w-4 h-4" /> Add Personal Contact
        </button>
      </div>

      {/* Grid of Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-3xl border transition space-y-3 flex flex-col justify-between ${
              c.isPrimary
                ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-500/60 shadow-sm dark:shadow-lg'
                : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400/50'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.name}</h3>
                {c.isPrimary && (
                  <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                    PRIORITY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{c.relationOrRole}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{c.phone}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyNumber(c.id, c.phone)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs"
                  title="Copy Phone Number"
                >
                  {copiedId === c.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <a
                  href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>

                {!c.isPrimary && (
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      onDeleteContact(c.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl text-xs"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <User className="w-5 h-5" /> Add Emergency Circle Contact
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atharv Ubale (Family)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Relationship / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Brother / Emergency Contact"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98200 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-xs text-white shadow-md shadow-blue-500/25"
                >
                  Save Emergency Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
