import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  TableProperties,
  FilePlus,
  SlidersHorizontal,
  Search,
  Printer,
  Users,
  Code2
} from 'lucide-react';

export type MainTab =
  | 'dashboard'
  | 'analytics'
  | 'spreadsheet'
  | 'forms'
  | 'master'
  | 'search'
  | 'reports'
  | 'users'
  | 'script';

interface NavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  pendingVerificationsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingVerificationsCount,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'analytics', label: 'Dashboard Analitik', icon: BarChart3 },
    {
      id: 'spreadsheet',
      label: 'Database Sheet',
      icon: TableProperties,
      badge: pendingVerificationsCount > 0 ? `${pendingVerificationsCount}` : undefined,
    },
    { id: 'forms', label: 'Form Input Data', icon: FilePlus },
    { id: 'master', label: 'Master Data', icon: SlidersHorizontal },
    { id: 'search', label: 'Pencarian Terpadu', icon: Search },
    { id: 'reports', label: 'Pusat Laporan', icon: Printer },
    { id: 'users', label: 'Hak Akses', icon: Users },
    { id: 'script', label: 'Apps Script', icon: Code2 },
  ];

  return (
    <nav className="bg-slate-800 text-slate-300 border-b border-slate-700/80 shadow-inner">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as MainTab)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm ring-1 ring-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-900 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
