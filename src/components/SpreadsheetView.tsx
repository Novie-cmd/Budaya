import React, { useState } from 'react';
import {
  SanggarSeni,
  Seniman,
  CagarBudaya,
  KoleksiMuseum,
  MasterKecamatan,
  MasterDesa,
  MasterJenisSanggar,
  MasterJenisSeniman,
  MasterKategoriKoleksi,
  User,
  ActivityLog,
  Role,
} from '../types';
import { exportToExcel } from '../utils/spreadsheetExport';
import {
  Table,
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  Edit3,
  ExternalLink,
  X,
  Save,
} from 'lucide-react';

export type SheetTabName =
  | 'Master Kecamatan'
  | 'Master Desa'
  | 'Master Jenis Sanggar'
  | 'Master Jenis Seniman'
  | 'Master Koleksi'
  | 'Database Sanggar'
  | 'Database Seniman'
  | 'Database Cagar Budaya'
  | 'Database Koleksi Museum'
  | 'Rekap Kebudayaan'
  | 'Pengguna System'
  | 'Log Aktivitas';

interface SpreadsheetViewProps {
  currentUser: User;
  kecamatanList: MasterKecamatan[];
  desaList: MasterDesa[];
  jenisSanggarList: MasterJenisSanggar[];
  jenisSenimanList: MasterJenisSeniman[];
  kategoriKoleksiList: MasterKategoriKoleksi[];
  sanggarList: SanggarSeni[];
  senimanList: Seniman[];
  cagarList: CagarBudaya[];
  koleksiList: KoleksiMuseum[];
  userList: User[];
  activityLogs: ActivityLog[];
  onVerifyRecord: (entityType: 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi', id: string, status: 'Terverifikasi' | 'Ditolak') => void;
  onDeleteRecord: (entityType: 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi', id: string) => void;
  onViewDetail: (item: unknown, type: string) => void;
  onNavigateToForm: (type: 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi') => void;
  onUpdateSanggar?: (item: SanggarSeni) => void;
  onUpdateSeniman?: (item: Seniman) => void;
  onUpdateCagar?: (item: CagarBudaya) => void;
  onUpdateKoleksi?: (item: KoleksiMuseum) => void;
  onNavigateToMaster?: () => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  currentUser,
  kecamatanList,
  desaList,
  jenisSanggarList,
  jenisSenimanList,
  kategoriKoleksiList,
  sanggarList,
  senimanList,
  cagarList,
  koleksiList,
  userList,
  activityLogs,
  onVerifyRecord,
  onDeleteRecord,
  onViewDetail,
  onNavigateToForm,
  onUpdateSanggar,
  onUpdateSeniman,
  onUpdateCagar,
  onUpdateKoleksi,
  onNavigateToMaster,
}) => {
  const [activeSheet, setActiveSheet] = useState<SheetTabName>('Database Sanggar');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<
    | { type: 'Sanggar'; data: SanggarSeni }
    | { type: 'Seniman'; data: Seniman }
    | { type: 'Cagar'; data: CagarBudaya }
    | { type: 'Koleksi'; data: KoleksiMuseum }
    | null
  >(null);

  const sheetsList: { name: SheetTabName; count: number; iconName: string }[] = [
    { name: 'Database Sanggar', count: sanggarList.length, iconName: '🎪' },
    { name: 'Database Seniman', count: senimanList.length, iconName: '👤' },
    { name: 'Database Cagar Budaya', count: cagarList.length, iconName: '🏛️' },
    { name: 'Database Koleksi Museum', count: koleksiList.length, iconName: '🏺' },
    { name: 'Master Kecamatan', count: kecamatanList.length, iconName: '📍' },
    { name: 'Master Desa', count: desaList.length, iconName: '🏡' },
    { name: 'Master Jenis Sanggar', count: jenisSanggarList.length, iconName: '🎭' },
    { name: 'Master Jenis Seniman', count: jenisSenimanList.length, iconName: '🎨' },
    { name: 'Master Koleksi', count: kategoriKoleksiList.length, iconName: '📜' },
    { name: 'Rekap Kebudayaan', count: 4, iconName: '📈' },
    { name: 'Pengguna System', count: userList.length, iconName: '👥' },
    { name: 'Log Aktivitas', count: activityLogs.length, iconName: '📝' },
  ];

  const handleExportCurrentSheet = () => {
    let sheetData: Record<string, unknown>[] = [];
    if (activeSheet === 'Database Sanggar') sheetData = sanggarList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Database Seniman') sheetData = senimanList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Database Cagar Budaya') sheetData = cagarList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Database Koleksi Museum') sheetData = koleksiList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Master Kecamatan') sheetData = kecamatanList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Master Desa') sheetData = desaList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Master Jenis Sanggar') sheetData = jenisSanggarList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Master Jenis Seniman') sheetData = jenisSenimanList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Master Koleksi') sheetData = kategoriKoleksiList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Pengguna System') sheetData = userList as unknown as Record<string, unknown>[];
    else if (activeSheet === 'Log Aktivitas') sheetData = activityLogs as unknown as Record<string, unknown>[];

    exportToExcel([{ sheetName: activeSheet, data: sheetData }], `Export_${activeSheet.replace(/\s+/g, '_')}`);
  };

  const handleExportAllSheets = () => {
    exportToExcel(
      [
        { sheetName: 'Sanggar Seni', data: sanggarList as unknown as Record<string, unknown>[] },
        { sheetName: 'Seniman', data: senimanList as unknown as Record<string, unknown>[] },
        { sheetName: 'Cagar Budaya', data: cagarList as unknown as Record<string, unknown>[] },
        { sheetName: 'Koleksi Museum', data: koleksiList as unknown as Record<string, unknown>[] },
        { sheetName: 'Master Kecamatan', data: kecamatanList as unknown as Record<string, unknown>[] },
        { sheetName: 'Master Desa', data: desaList as unknown as Record<string, unknown>[] },
        { sheetName: 'Pengguna', data: userList as unknown as Record<string, unknown>[] },
        { sheetName: 'Activity Log', data: activityLogs as unknown as Record<string, unknown>[] },
      ],
      'Full_Spreadsheet_Kebudayaan'
    );
  };

  const isCanVerify = currentUser.role === 'Administrator' || currentUser.role === 'Verifikator';
  const isCanEdit = currentUser.role === 'Administrator' || currentUser.role === 'Operator Bidang';

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      
      {/* Top Header & Export Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">Antarmuka Database Spreadsheet</h2>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold rounded">
                Google Sheets Engine Linked
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tampilan lembar kerja (Spreadsheet Tab) sesuai struktur 13 Sheet Database Kebudayaan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari di sheet ini..."
              className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={handleExportCurrentSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Sheet Ini</span>
          </button>

          <button
            onClick={handleExportAllSheets}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Semua (.XLSX)</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Tabs Row (Bottom/Top Google Sheets style) */}
      <div className="bg-slate-900 rounded-xl p-1.5 border border-slate-800 shadow-md">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-1">
          {sheetsList.map((tab) => {
            const isActive = activeSheet === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveSheet(tab.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm ring-1 ring-amber-300'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.iconName}</span>
                <span>{tab.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950 text-amber-300 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Sheet Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Quick Add Row Action Bar for Cultural Entities */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <Table className="w-4 h-4 text-amber-500" />
            <span>Sheet: {activeSheet}</span>
          </div>

          {isCanEdit && activeSheet.startsWith('Database') && (
            <button
              onClick={() => {
                if (activeSheet === 'Database Sanggar') onNavigateToForm('Sanggar');
                if (activeSheet === 'Database Seniman') onNavigateToForm('Seniman');
                if (activeSheet === 'Database Cagar Budaya') onNavigateToForm('Cagar');
                if (activeSheet === 'Database Koleksi Museum') onNavigateToForm('Koleksi');
              }}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris Baru</span>
            </button>
          )}
        </div>

        {/* Data Grid Table View */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          
          {/* SHEET 1: Database Sanggar */}
          {activeSheet === 'Database Sanggar' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Nama Sanggar</th>
                  <th className="p-3 border-r border-slate-200">Jenis</th>
                  <th className="p-3 border-r border-slate-200">Berdiri</th>
                  <th className="p-3 border-r border-slate-200">Pimpinan</th>
                  <th className="p-3 border-r border-slate-200">Wilayah</th>
                  <th className="p-3 border-r border-slate-200">Anggota</th>
                  <th className="p-3 border-r border-slate-200">Status Active</th>
                  <th className="p-3 border-r border-slate-200">Verifikasi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sanggarList
                  .filter((s) => !searchQuery || JSON.stringify(s).toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-700">{s.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{s.namaSanggar}</td>
                      <td className="p-3">{s.jenisSanggar}</td>
                      <td className="p-3">{s.tahunBerdiri}</td>
                      <td className="p-3">{s.namaPimpinan}</td>
                      <td className="p-3">{s.kecamatan}, {s.desa}</td>
                      <td className="p-3">{s.jumlahAnggota} Org</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.statusAktif === 'Ya' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {s.statusAktif}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-max ${
                          s.statusVerifikasi === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-800' : s.statusVerifikasi === 'Ditolak' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.statusVerifikasi === 'Terverifikasi' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {s.statusVerifikasi === 'Menunggu Verifikasi' && <Clock className="w-3 h-3 text-amber-600" />}
                          {s.statusVerifikasi === 'Ditolak' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {s.statusVerifikasi}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1">
                        <button
                          onClick={() => onViewDetail(s, 'Sanggar')}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isCanVerify && s.statusVerifikasi === 'Menunggu Verifikasi' && (
                          <>
                            <button
                              onClick={() => onVerifyRecord('Sanggar', s.id, 'Terverifikasi')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded font-bold"
                              title="Setujui Verifikasi"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onVerifyRecord('Sanggar', s.id, 'Ditolak')}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded font-bold"
                              title="Tolak Verifikasi"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {isCanEdit && onUpdateSanggar && (
                          <button
                            onClick={() => setEditingItem({ type: 'Sanggar', data: { ...s } })}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                            title="Edit Data Sanggar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {isCanEdit && (
                          <button
                            onClick={() => onDeleteRecord('Sanggar', s.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Hapus Baris"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* SHEET 2: Database Seniman */}
          {activeSheet === 'Database Seniman' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">NIK</th>
                  <th className="p-3 border-r border-slate-200">Nama Lengkap</th>
                  <th className="p-3 border-r border-slate-200">Gender</th>
                  <th className="p-3 border-r border-slate-200">Jenis Seniman</th>
                  <th className="p-3 border-r border-slate-200">Sanggar</th>
                  <th className="p-3 border-r border-slate-200">Wilayah</th>
                  <th className="p-3 border-r border-slate-200">Sertifikasi</th>
                  <th className="p-3 border-r border-slate-200">Verifikasi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {senimanList
                  .filter((sn) => !searchQuery || JSON.stringify(sn).toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((sn) => (
                    <tr key={sn.id} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-700">{sn.id}</td>
                      <td className="p-3 font-mono">{sn.nik}</td>
                      <td className="p-3 font-semibold text-slate-900">{sn.namaLengkap}</td>
                      <td className="p-3">{sn.jenisKelamin}</td>
                      <td className="p-3">{sn.jenisSeniman}</td>
                      <td className="p-3">{sn.sanggar}</td>
                      <td className="p-3">{sn.kecamatan}, {sn.desa}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sn.sertifikasi === 'Ya' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {sn.sertifikasi}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sn.statusVerifikasi === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sn.statusVerifikasi}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1">
                        <button onClick={() => onViewDetail(sn, 'Seniman')} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        {isCanVerify && sn.statusVerifikasi === 'Menunggu Verifikasi' && (
                          <>
                            <button onClick={() => onVerifyRecord('Seniman', sn.id, 'Terverifikasi')} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => onVerifyRecord('Seniman', sn.id, 'Ditolak')} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {isCanEdit && onUpdateSeniman && (
                          <button
                            onClick={() => setEditingItem({ type: 'Seniman', data: { ...sn } })}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                            title="Edit Data Seniman"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {isCanEdit && (
                          <button onClick={() => onDeleteRecord('Seniman', sn.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* SHEET 3: Database Cagar Budaya */}
          {activeSheet === 'Database Cagar Budaya' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Nama Cagar</th>
                  <th className="p-3 border-r border-slate-200">Jenis</th>
                  <th className="p-3 border-r border-slate-200">Tingkat</th>
                  <th className="p-3 border-r border-slate-200">No. SK</th>
                  <th className="p-3 border-r border-slate-200">Wilayah</th>
                  <th className="p-3 border-r border-slate-200">Kondisi</th>
                  <th className="p-3 border-r border-slate-200">Kepemilikan</th>
                  <th className="p-3 border-r border-slate-200">Pengelola</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cagarList
                  .filter((c) => !searchQuery || JSON.stringify(c).toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-700">{c.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{c.namaCagar}</td>
                      <td className="p-3">{c.jenisCagar}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">{c.tingkat}</span></td>
                      <td className="p-3 font-mono text-[11px]">{c.nomorSk}</td>
                      <td className="p-3">{c.kecamatan}, {c.desa}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.kondisi}
                        </span>
                      </td>
                      <td className="p-3">{c.kepemilikan}</td>
                      <td className="p-3">{c.pengelola}</td>
                      <td className="p-3 text-center space-x-1">
                        <button onClick={() => onViewDetail(c, 'Cagar')} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        {isCanEdit && onUpdateCagar && (
                          <button
                            onClick={() => setEditingItem({ type: 'Cagar', data: { ...c } })}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                            title="Edit Data Cagar Budaya"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {isCanEdit && (
                          <button onClick={() => onDeleteRecord('Cagar', c.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* SHEET 4: Database Koleksi Museum */}
          {activeSheet === 'Database Koleksi Museum' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">No. Inventaris</th>
                  <th className="p-3 border-r border-slate-200">Nama Koleksi</th>
                  <th className="p-3 border-r border-slate-200">Kategori</th>
                  <th className="p-3 border-r border-slate-200">Asal Koleksi</th>
                  <th className="p-3 border-r border-slate-200">Kondisi</th>
                  <th className="p-3 border-r border-slate-200">Penyimpanan</th>
                  <th className="p-3 border-r border-slate-200">Barcode/QR</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {koleksiList
                  .filter((kl) => !searchQuery || JSON.stringify(kl).toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((kl) => (
                    <tr key={kl.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-purple-700">{kl.id}</td>
                      <td className="p-3 font-mono text-[11px]">{kl.nomorInventaris}</td>
                      <td className="p-3 font-semibold text-slate-900">{kl.namaKoleksi}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold">{kl.kategori}</span></td>
                      <td className="p-3">{kl.asalKoleksi}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          kl.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {kl.kondisi}
                        </span>
                      </td>
                      <td className="p-3">{kl.lokasiPenyimpanan}</td>
                      <td className="p-3 font-mono text-[10px]">{kl.barcodeQr}</td>
                      <td className="p-3 text-center space-x-1">
                        <button onClick={() => onViewDetail(kl, 'Koleksi')} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        {isCanEdit && onUpdateKoleksi && (
                          <button
                            onClick={() => setEditingItem({ type: 'Koleksi', data: { ...kl } })}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                            title="Edit Data Koleksi Museum"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {isCanEdit && (
                          <button onClick={() => onDeleteRecord('Koleksi', kl.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* Master Data Sheets standard display */}
          {activeSheet === 'Master Kecamatan' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Nama Kecamatan</th>
                  <th className="p-3">Kode Wilayah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {kecamatanList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{k.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{k.namaKecamatan}</td>
                    <td className="p-3 font-mono">{k.kodeWilayah || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === 'Master Desa' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Kecamatan</th>
                  <th className="p-3">Nama Desa / Kelurahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {desaList.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{d.id}</td>
                    <td className="p-3 font-semibold text-slate-800">{d.kecamatan}</td>
                    <td className="p-3">{d.namaDesa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === 'Master Jenis Sanggar' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Jenis Sanggar</th>
                  <th className="p-3">Keterangan Deskriptif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {jenisSanggarList.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{j.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{j.namaJenis}</td>
                    <td className="p-3">{j.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === 'Master Jenis Seniman' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Jenis Seniman</th>
                  <th className="p-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {jenisSenimanList.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{j.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{j.namaJenis}</td>
                    <td className="p-3">{j.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === 'Master Koleksi' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Kategori Koleksi</th>
                  <th className="p-3">Deskripsi Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {kategoriKoleksiList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{k.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{k.namaKategori}</td>
                    <td className="p-3">{k.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === 'Log Aktivitas' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-200">Waktu</th>
                  <th className="p-3 border-r border-slate-200">Pengguna</th>
                  <th className="p-3 border-r border-slate-200">Role</th>
                  <th className="p-3 border-r border-slate-200">Aksi</th>
                  <th className="p-3 border-r border-slate-200">Entitas</th>
                  <th className="p-3">Detail Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                    <td className="p-3 text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-semibold text-slate-800">{log.userName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded">{log.role}</span></td>
                    <td className="p-3 text-amber-700 font-bold">{log.action}</td>
                    <td className="p-3">{log.entity}</td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === 'Pengguna System' && (
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-bold">
                <tr>
                  <th className="p-3 border-r border-slate-200">ID</th>
                  <th className="p-3 border-r border-slate-200">Nama Pengguna</th>
                  <th className="p-3 border-r border-slate-200">Email</th>
                  <th className="p-3 border-r border-slate-200">Role Akses</th>
                  <th className="p-3 border-r border-slate-200">Jabatan / NIP</th>
                  <th className="p-3 border-r border-slate-200">Login Terakhir</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{u.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="p-3 text-blue-600">{u.email}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">{u.role}</span></td>
                    <td className="p-3">{u.jabatan} {u.nip ? `(${u.nip})` : ''}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{u.lastLogin}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === 'Rekap Kebudayaan' && (
            <div className="p-6 text-xs space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Ringkasan Tabulasi Rekapitulasi Kebudayaan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700">Rekapitulasi Entitas Utama</span>
                  <ul className="mt-2 space-y-1 text-slate-600">
                    <li>• Total Sanggar Seni: <strong>{sanggarList.length}</strong></li>
                    <li>• Total Seniman: <strong>{senimanList.length}</strong></li>
                    <li>• Total Cagar Budaya: <strong>{cagarList.length}</strong></li>
                    <li>• Total Koleksi Museum: <strong>{koleksiList.length}</strong></li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700">Rekapitulasi Verifikasi</span>
                  <ul className="mt-2 space-y-1 text-slate-600">
                    <li>• Terverifikasi: <strong>{sanggarList.filter(s=>s.statusVerifikasi==='Terverifikasi').length + senimanList.filter(s=>s.statusVerifikasi==='Terverifikasi').length}</strong></li>
                    <li>• Menunggu Verifikasi: <strong>{sanggarList.filter(s=>s.statusVerifikasi==='Menunggu Verifikasi').length + senimanList.filter(s=>s.statusVerifikasi==='Menunggu Verifikasi').length}</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Quick Edit Modal for Spreadsheet Records */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Edit Data {editingItem.type}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID Record: {editingItem.data.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM: Edit Sanggar */}
            {editingItem.type === 'Sanggar' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onUpdateSanggar) {
                    onUpdateSanggar(editingItem.data as SanggarSeni);
                  }
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Sanggar *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.namaSanggar}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, namaSanggar: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jenis Sanggar *</label>
                    <select
                      value={editingItem.data.jenisSanggar}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, jenisSanggar: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      {jenisSanggarList.map((js) => (
                        <option key={js.id} value={js.namaJenis}>
                          {js.namaJenis}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Pimpinan *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.namaPimpinan}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, namaPimpinan: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nomor HP</label>
                    <input
                      type="text"
                      value={editingItem.data.nomorHp}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, nomorHp: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kecamatan *</label>
                    <select
                      value={editingItem.data.kecamatan}
                      onChange={(e) => {
                        const newKec = e.target.value;
                        const matchingDesa = desaList.find((d) => d.kecamatan === newKec);
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            kecamatan: newKec,
                            desa: matchingDesa ? matchingDesa.namaDesa : '',
                          },
                        });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      {kecamatanList.map((k) => (
                        <option key={k.id} value={k.namaKecamatan}>
                          {k.namaKecamatan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Desa / Kelurahan *</label>
                    <select
                      value={editingItem.data.desa}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, desa: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      {desaList
                        .filter((d) => !editingItem.data.kecamatan || d.kecamatan === editingItem.data.kecamatan)
                        .map((d) => (
                          <option key={d.id} value={d.namaDesa}>
                            {d.namaDesa}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jumlah Anggota</label>
                    <input
                      type="number"
                      min="1"
                      value={editingItem.data.jumlahAnggota}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, jumlahAnggota: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Status Verifikasi</label>
                    <select
                      value={editingItem.data.statusVerifikasi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            statusVerifikasi: e.target.value as 'Terverifikasi' | 'Menunggu Verifikasi' | 'Ditolak',
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Terverifikasi">Terverifikasi</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={editingItem.data.alamat}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, alamat: e.target.value },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* FORM: Edit Seniman */}
            {editingItem.type === 'Seniman' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onUpdateSeniman) {
                    onUpdateSeniman(editingItem.data as Seniman);
                  }
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.namaLengkap}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, namaLengkap: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">NIK (16 Digit)</label>
                    <input
                      type="text"
                      value={editingItem.data.nik}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, nik: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jenis Seniman *</label>
                    <select
                      value={editingItem.data.jenisSeniman}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, jenisSeniman: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {jenisSenimanList.map((js) => (
                        <option key={js.id} value={js.namaJenis}>
                          {js.namaJenis}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Sanggar Naungan</label>
                    <input
                      type="text"
                      value={editingItem.data.sanggar}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, sanggar: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kecamatan</label>
                    <select
                      value={editingItem.data.kecamatan}
                      onChange={(e) => {
                        const newKec = e.target.value;
                        const matchingDesa = desaList.find((d) => d.kecamatan === newKec);
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            kecamatan: newKec,
                            desa: matchingDesa ? matchingDesa.namaDesa : '',
                          },
                        });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {kecamatanList.map((k) => (
                        <option key={k.id} value={k.namaKecamatan}>
                          {k.namaKecamatan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Desa / Kelurahan</label>
                    <select
                      value={editingItem.data.desa}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, desa: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {desaList
                        .filter((d) => !editingItem.data.kecamatan || d.kecamatan === editingItem.data.kecamatan)
                        .map((d) => (
                          <option key={d.id} value={d.namaDesa}>
                            {d.namaDesa}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nomor HP</label>
                    <input
                      type="text"
                      value={editingItem.data.nomorHp}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, nomorHp: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Sertifikasi Kompetensi</label>
                    <select
                      value={editingItem.data.sertifikasi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            sertifikasi: e.target.value as 'Ya' | 'Tidak',
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Ya">Ya (Tersertifikasi)</option>
                      <option value="Tidak">Tidak</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* FORM: Edit Cagar Budaya */}
            {editingItem.type === 'Cagar' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onUpdateCagar) {
                    onUpdateCagar(editingItem.data as CagarBudaya);
                  }
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Cagar Budaya *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.namaCagar}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, namaCagar: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jenis Cagar *</label>
                    <select
                      value={editingItem.data.jenisCagar}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            jenisCagar: e.target.value as 'Benda' | 'Bangunan' | 'Struktur' | 'Situs' | 'Kawasan',
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Situs">Situs</option>
                      <option value="Bangunan">Bangunan</option>
                      <option value="Struktur">Struktur</option>
                      <option value="Benda">Benda</option>
                      <option value="Kawasan">Kawasan</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tingkat Penetapan *</label>
                    <select
                      value={editingItem.data.tingkat}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            tingkat: e.target.value as 'Kabupaten' | 'Provinsi' | 'Nasional',
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Kabupaten">Kabupaten / Kota</option>
                      <option value="Provinsi">Provinsi NTB</option>
                      <option value="Nasional">Nasional</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nomor SK</label>
                    <input
                      type="text"
                      value={editingItem.data.nomorSk}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, nomorSk: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kondisi Saat Ini</label>
                    <select
                      value={editingItem.data.kondisi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            kondisi: e.target.value as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kepemilikan</label>
                    <input
                      type="text"
                      value={editingItem.data.kepemilikan}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, kepemilikan: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* FORM: Edit Koleksi Museum */}
            {editingItem.type === 'Koleksi' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onUpdateKoleksi) {
                    onUpdateKoleksi(editingItem.data as KoleksiMuseum);
                  }
                  setEditingItem(null);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Nama Koleksi *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.namaKoleksi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, namaKoleksi: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">No. Inventaris *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.data.nomorInventaris}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, nomorInventaris: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kategori Koleksi</label>
                    <select
                      value={editingItem.data.kategori}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, kategori: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {kategoriKoleksiList.map((kat) => (
                        <option key={kat.id} value={kat.namaKategori}>
                          {kat.namaKategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Kondisi</label>
                    <select
                      value={editingItem.data.kondisi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: {
                            ...editingItem.data,
                            kondisi: e.target.value as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Asal Koleksi</label>
                    <input
                      type="text"
                      value={editingItem.data.asalKoleksi}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, asalKoleksi: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lokasi Penyimpanan</label>
                    <input
                      type="text"
                      value={editingItem.data.lokasiPenyimpanan}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, lokasiPenyimpanan: e.target.value },
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
