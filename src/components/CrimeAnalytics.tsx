import React from 'react';
import { IncidentReport, SafetyZone } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  PieChart, 
  Activity,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface CrimeAnalyticsProps {
  incidents: IncidentReport[];
  zones: SafetyZone[];
}

export const CrimeAnalytics: React.FC<CrimeAnalyticsProps> = ({ incidents, zones }) => {
  // Aggregate statistics
  const totalIncidents = incidents.length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;
  const investigatingCount = incidents.filter(i => i.status === 'investigating' || i.status === 'dispatched').length;
  const anonymousCount = incidents.filter(i => i.isAnonymous).length;
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedCount / totalIncidents) * 100) : 75;

  // Category counts
  const categoryMap: { [key: string]: number } = {};
  incidents.forEach(inc => {
    categoryMap[inc.category] = (categoryMap[inc.category] || 0) + 1;
  });

  const categoriesSorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Hourly distribution simulation
  const hourlyData = [
    { label: '00:00 - 04:00 (Night)', count: 6, risk: 'High', color: 'bg-rose-500' },
    { label: '04:00 - 08:00 (Dawn)', count: 2, risk: 'Low', color: 'bg-emerald-500' },
    { label: '08:00 - 12:00 (Morning)', count: 3, risk: 'Low', color: 'bg-blue-500' },
    { label: '12:00 - 16:00 (Afternoon)', count: 4, risk: 'Medium', color: 'bg-yellow-500' },
    { label: '16:00 - 20:00 (Evening)', count: 9, risk: 'High', color: 'bg-orange-500' },
    { label: '20:00 - 24:00 (Late Night)', count: 12, risk: 'Critical', color: 'bg-red-600' },
  ];

  return (
    <div className="space-y-6">
      
      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl space-y-1 transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-500" /> Total Logged Reports
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalIncidents}</p>
          <p className="text-[11px] text-slate-500">Past 30 days active network</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl space-y-1 transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-500" /> Active Inquiries
          </span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{investigatingCount}</p>
          <p className="text-[11px] text-slate-500">Assigned to sector patrol units</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl space-y-1 transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Clearance Rate
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{resolutionRate}%</p>
          <p className="text-[11px] text-slate-500">Community resolution index</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl space-y-1 transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-purple-500" /> Anonymous Tips
          </span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{anonymousCount}</p>
          <p className="text-[11px] text-slate-500">Encrypted identity reports</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Crime Breakdown by Category */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Incidents by Crime Category
            </h3>
            <span className="text-xs text-slate-500 font-mono">30-Day Velocity</span>
          </div>

          <div className="space-y-3">
            {categoriesSorted.map(([category, count]) => {
              const percentage = totalIncidents > 0 ? Math.round((count / totalIncidents) * 100) : 0;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time of Day Vulnerability Distribution */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Temporal Vulnerability & Peak Crime Hours
            </h3>
            <span className="text-xs text-slate-500 font-mono">Night Vigil Focus</span>
          </div>

          <div className="space-y-3">
            {hourlyData.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900 dark:text-white block">{h.label}</span>
                  <span className="text-[10px] text-slate-500">Incident Frequency: {h.count} logged</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${h.color}`}>
                  {h.risk} Risk
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
