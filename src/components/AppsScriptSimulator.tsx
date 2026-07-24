import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { Code2, Play, RefreshCw, CheckCircle, ArrowRight, ShieldCheck, QrCode, Terminal, Sparkles } from 'lucide-react';

interface AppsScriptSimulatorProps {
  activityLogs: ActivityLog[];
  onTriggerAction: (actionName: string, entity: 'Sanggar' | 'Seniman' | 'Cagar Budaya' | 'Koleksi Museum' | 'Master Data' | 'Sistem', details: string) => void;
}

export const AppsScriptSimulator: React.FC<AppsScriptSimulatorProps> = ({
  activityLogs,
  onTriggerAction,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[GAS Engine] Google Apps Script V8 Runtime initialized.',
    '[GAS Engine] Connected to Google Sheets Spreadsheet ID: 1a2b3c4d5e6f_CULTURAL_DB',
    '[GAS Engine] Ready for automation triggers.',
  ]);

  const addConsoleLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    setConsoleLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 20)]);
  };

  const handleRunAutoId = () => {
    setIsRunning(true);
    addConsoleLog('Running function generateAutoIDs()...');
    setTimeout(() => {
      addConsoleLog('✔ Auto-ID sequence checked: Sanggar (SGR-005), Seniman (SNM-005), Cagar (CGB-005), Koleksi (KLM-005).');
      setIsRunning(false);
      onTriggerAction('Auto-ID Generator', 'Sistem', 'Memperbarui nomor urut ID entitas otomatis di Google Sheets');
    }, 800);
  };

  const handleSyncSheets = () => {
    setIsRunning(true);
    addConsoleLog('Running function syncSpreadsheetTabs()...');
    setTimeout(() => {
      addConsoleLog('✔ 13 Database Sheets synchronized with cloud cache.');
      setIsRunning(false);
      onTriggerAction('Sync Google Sheets', 'Sistem', 'Sinkronisasi 13 sheet database dengan Google Drive Cloud');
    }, 1000);
  };

  const handleValidateNikFormat = () => {
    setIsRunning(true);
    addConsoleLog('Running function validateNikAndSkFormat()...');
    setTimeout(() => {
      addConsoleLog('✔ All 16-digit NIKs validated against Dukcapil schema.');
      setIsRunning(false);
      onTriggerAction('Validasi Data NIK', 'Seniman', 'Memvalidasi 100% NIK seniman sesuai format 16 digit');
    }, 900);
  };

  const handleGenerateQRCodes = () => {
    setIsRunning(true);
    addConsoleLog('Running function generateQrBarcodeAssets()...');
    setTimeout(() => {
      addConsoleLog('✔ Barcode QR Codes generated for all Museum Collections.');
      setIsRunning(false);
      onTriggerAction('QR Code Generator', 'Koleksi Museum', 'Membuat QR Code inventaris untuk koleksi museum');
    }, 1100);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Alur Data & Simulator Google Apps Script</h2>
            <p className="text-xs text-slate-500">
              Arsitektur alur data otomatisasi pendataan kebudayaan berbasis Google Workspace & Spreadsheet
            </p>
          </div>
        </div>
      </div>

      {/* Section 12: Data Flow Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Bagan Alur Data Sistem (Data Flow Diagram)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <span className="font-bold text-amber-700">1. Master Data</span>
            <span className="text-[10px] text-slate-500 mt-1">Kecamatan, Desa, Jenis</span>
          </div>

          <div className="hidden sm:flex items-center justify-center text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <span className="font-bold text-emerald-700">2. Input Form</span>
            <span className="text-[10px] text-slate-500 mt-1">Apps Script / Web App</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <span className="font-bold text-blue-700">3. Spreadsheet DB</span>
            <span className="text-[10px] text-slate-500 mt-1">13 Database Sheets</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
            <span className="font-bold text-purple-700">4. Validasi Data</span>
            <span className="text-[10px] text-slate-500 mt-1">Role Verifikator</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center col-span-2 sm:col-span-1">
            <span className="font-bold text-rose-700">5. Dashboard & Laporan</span>
            <span className="text-[10px] text-slate-500 mt-1">Looker Studio / PDF</span>
          </div>

        </div>
      </div>

      {/* Interactive Script Run Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Run Macros Buttons */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
            Eksekusi Fungsi Otomatisasi Apps Script
          </h3>

          <div className="space-y-3">
            
            <button
              onClick={handleRunAutoId}
              disabled={isRunning}
              className="w-full p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-amber-600 group-hover:scale-125 transition-transform" />
                  <span>Jalankan Auto-ID Generator</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Generasi ID unik otomatis (SGR-xxx, SNM-xxx, CGB-xxx, KLM-xxx)</p>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">GAS Macro</span>
            </button>

            <button
              onClick={handleSyncSheets}
              disabled={isRunning}
              className="w-full p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-125 transition-transform" />
                  <span>Sinkronkan Google Sheets Cloud</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Sinkronkan perubahan 13 sheet dengan Google Drive Cloud</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded font-mono">Sync</span>
            </button>

            <button
              onClick={handleValidateNikFormat}
              disabled={isRunning}
              className="w-full p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 group-hover:scale-125 transition-transform" />
                  <span>Validasi Format NIK & SK</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Periksa keabsahan 16 digit NIK dan nomor SK Cagar Budaya</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">Validator</span>
            </button>

            <button
              onClick={handleGenerateQRCodes}
              disabled={isRunning}
              className="w-full p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-purple-600 group-hover:scale-125 transition-transform" />
                  <span>Generate QR Code Inventaris</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Buat QR Code otomatis untuk seluruh Benda Koleksi Museum</p>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">Asset QR</span>
            </button>

          </div>
        </div>

        {/* Live Terminal Output Console */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 shadow-inner space-y-3 font-mono text-xs text-slate-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-amber-400 font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Apps Script Output Console
              </span>
              <span className="text-[10px] text-slate-500">Live Logs</span>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto text-[11px]">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="text-emerald-400">
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-900 text-[10px] text-slate-500">
            Powered by Google Apps Script Execution API
          </div>
        </div>

      </div>

    </div>
  );
};
