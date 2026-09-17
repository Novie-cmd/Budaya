import React from 'react';
import { Role, User } from '../types';
import { Database, Shield, Search, RefreshCw, CheckCircle2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (newRole: Role) => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  onNavigateToSearch: () => void;
  onSyncSheets: () => void;
  isSyncing: boolean;
  lastSynced: string;
  onResetDefault?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  globalSearch,
  onGlobalSearchChange,
  onNavigateToSearch,
  onSyncSheets,
  isSyncing,
  lastSynced,
  onResetDefault,
}) => {
  const roleColors: Record<Role, string> = {
    Administrator: 'bg-rose-100 text-rose-800 border-rose-300',
    'Operator Bidang': 'bg-blue-100 text-blue-800 border-blue-300',
    Verifikator: 'bg-amber-100 text-amber-800 border-amber-300',
    Pimpinan: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & System Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md ring-2 ring-amber-400/30">
              <Database className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100">
                  SI-BUDAYA <span className="text-amber-400 text-xs font-normal px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">Spreadsheet-Engine v2.4</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Sistem Informasi & Dashboard Pendataan Kebudayaan Daerah
              </p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => onGlobalSearchChange(e.target.value)}
                onFocus={onNavigateToSearch}
                placeholder="Cari Sanggar, Seniman, Cagar Budaya, Koleksi, Kecamatan..."
                className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-xs rounded-lg pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Right Action Controls: Sync, Auto-Save Status, Reset, & Role Switcher */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 text-xs">
            
            {/* Auto-Save Persistent Status Badge */}
            <div
              title="Perubahan data & hasil edit disimpan otomatis di browser (LocalStorage)"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded-lg text-[11px] font-medium shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Tersimpan Otomatis</span>
            </div>

            {/* Reset to Default Data Button */}
            {onResetDefault && (
              <button
                onClick={onResetDefault}
                title="Atur ulang seluruh data ke setelan bawaan sistem"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 rounded-lg border border-slate-700 hover:border-rose-800/60 transition-colors text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset Default</span>
              </button>
            )}

            {/* Sync Button */}
            <button
              onClick={onSyncSheets}
              disabled={isSyncing}
              title={`Terakhir sinkron: ${lastSynced}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Sheets</span>
            </button>

            {/* Role Simulator Dropdown */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 leading-none">Simulasi Role:</span>
                <select
                  value={currentUser.role}
                  onChange={(e) => onRoleChange(e.target.value as Role)}
                  className="bg-transparent text-amber-300 font-semibold text-xs focus:outline-none cursor-pointer py-0.5"
                >
                  <option value="Administrator" className="bg-slate-900 text-slate-100">Administrator</option>
                  <option value="Operator Bidang" className="bg-slate-900 text-slate-100">Operator Bidang</option>
                  <option value="Verifikator" className="bg-slate-900 text-slate-100">Verifikator</option>
                  <option value="Pimpinan" className="bg-slate-900 text-slate-100">Pimpinan</option>
                </select>
              </div>
            </div>

            {/* Active User Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-slate-200 font-medium leading-none text-xs">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{currentUser.jabatan}</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
