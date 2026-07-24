import React, { useState } from 'react';
import {
  Role,
  User,
  ActivityLog,
  CulturalFilters,
  SanggarSeni,
  Seniman,
  CagarBudaya,
  KoleksiMuseum,
  MasterKecamatan,
  MasterDesa,
  MasterJenisSanggar,
  MasterJenisSeniman,
  MasterKategoriKoleksi,
} from './types';
import {
  INITIAL_KECAMATAN,
  INITIAL_DESA,
  INITIAL_JENIS_SANGGAR,
  INITIAL_JENIS_SENIMAN,
  INITIAL_KATEGORI_KOLEKSI,
  INITIAL_SANGGAR,
  INITIAL_SENIMAN,
  INITIAL_CAGAR_BUDAYA,
  INITIAL_KOLEKSI_MUSEUM,
  INITIAL_USERS,
  INITIAL_LOGS,
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation, MainTab } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SpreadsheetView } from './components/SpreadsheetView';
import { FormsContainer } from './components/FormsContainer';
import { MasterDataManagement } from './components/MasterDataManagement';
import { GlobalSearch } from './components/GlobalSearch';
import { ReportCenter } from './components/ReportCenter';
import { UserRoleManagement } from './components/UserRoleManagement';
import { AppsScriptSimulator } from './components/AppsScriptSimulator';
import { DetailModals } from './components/DetailModals';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [formType, setFormType] = useState<'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi'>('Sanggar');

  // Master Data State
  const [kecamatanList, setKecamatanList] = useState<MasterKecamatan[]>(INITIAL_KECAMATAN);
  const [desaList, setDesaList] = useState<MasterDesa[]>(INITIAL_DESA);
  const [jenisSanggarList, setJenisSanggarList] = useState<MasterJenisSanggar[]>(INITIAL_JENIS_SANGGAR);
  const [jenisSenimanList, setJenisSenimanList] = useState<MasterJenisSeniman[]>(INITIAL_JENIS_SENIMAN);
  const [kategoriKoleksiList, setKategoriKoleksiList] = useState<MasterKategoriKoleksi[]>(INITIAL_KATEGORI_KOLEKSI);

  // Cultural Entities Database State
  const [sanggarList, setSanggarList] = useState<SanggarSeni[]>(INITIAL_SANGGAR);
  const [senimanList, setSenimanList] = useState<Seniman[]>(INITIAL_SENIMAN);
  const [cagarList, setCagarList] = useState<CagarBudaya[]>(INITIAL_CAGAR_BUDAYA);
  const [koleksiList, setKoleksiList] = useState<KoleksiMuseum[]>(INITIAL_KOLEKSI_MUSEUM);

  // User & Log State
  const [userList, setUserList] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default Administrator
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('2026-07-23 22:45');

  // Global Filter State
  const [filters, setFilters] = useState<CulturalFilters>({
    kecamatan: '',
    desa: '',
    tahun: '',
    jenisData: 'Semua',
    statusVerifikasi: 'Semua',
    searchQuery: '',
  });

  // Modal Inspection State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<unknown>(null);
  const [selectedDetailType, setSelectedDetailType] = useState<string>('Sanggar');

  // Helper to log user activities
  const logActivity = (
    action: string,
    entity: 'Sanggar' | 'Seniman' | 'Cagar Budaya' | 'Koleksi Museum' | 'Master Data' | 'Sistem',
    details: string
  ) => {
    const newLog: ActivityLog = {
      id: `LOG-00${activityLogs.length + 1}`,
      timestamp: new Date().toLocaleString('id-ID'),
      userName: currentUser.name,
      role: currentUser.role,
      action,
      entity,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Role Switch Handler
  const handleRoleChange = (newRole: Role) => {
    const foundUser = userList.find((u) => u.role === newRole) || {
      id: 'USR-TEMP',
      name: `Pengguna (${newRole})`,
      email: `${newRole.toLowerCase()}@kebudayaan.go.id`,
      role: newRole,
      jabatan: `Role ${newRole}`,
      lastLogin: 'Baru Saja',
      status: 'Aktif' as const,
    };
    setCurrentUser(foundUser);
    logActivity('Ganti Role Simulasi', 'Sistem', `Beralih ke hak akses role ${newRole}`);
  };

  // Sync Sheets Trigger
  const handleSyncSheets = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowStr = new Date().toLocaleString('id-ID');
      setLastSynced(nowStr);
      logActivity('Sinkronisasi Google Sheets', 'Sistem', 'Memperbarui data dengan Google Drive Spreadsheet Engine');
    }, 1000);
  };

  // CRUD Handlers for Cultural Data
  const handleAddSanggar = (item: SanggarSeni) => {
    setSanggarList((prev) => [item, ...prev]);
    logActivity('Tambah Sanggar Seni', 'Sanggar', `Menambahkan Sanggar ${item.namaSanggar} (${item.id})`);
  };

  const handleAddSeniman = (item: Seniman) => {
    setSenimanList((prev) => [item, ...prev]);
    logActivity('Tambah Seniman', 'Seniman', `Menambahkan Seniman ${item.namaLengkap} (${item.id})`);
  };

  const handleAddCagar = (item: CagarBudaya) => {
    setCagarList((prev) => [item, ...prev]);
    logActivity('Tambah Cagar Budaya', 'Cagar Budaya', `Menambahkan Cagar Budaya ${item.namaCagar} (${item.id})`);
  };

  const handleAddKoleksi = (item: KoleksiMuseum) => {
    setKoleksiList((prev) => [item, ...prev]);
    logActivity('Tambah Koleksi Museum', 'Koleksi Museum', `Menambahkan Koleksi ${item.namaKoleksi} (${item.id})`);
  };

  // Verification Handler
  const handleVerifyRecord = (
    entityType: 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi',
    id: string,
    status: 'Terverifikasi' | 'Ditolak'
  ) => {
    if (entityType === 'Sanggar') {
      setSanggarList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statusVerifikasi: status } : s))
      );
      logActivity('Verifikasi Data', 'Sanggar', `Mengubah status Sanggar ${id} menjadi ${status}`);
    } else if (entityType === 'Seniman') {
      setSenimanList((prev) =>
        prev.map((sn) => (sn.id === id ? { ...sn, statusVerifikasi: status } : sn))
      );
      logActivity('Verifikasi Data', 'Seniman', `Mengubah status Seniman ${id} menjadi ${status}`);
    }
  };

  // Delete Record Handler
  const handleDeleteRecord = (
    entityType: 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi',
    id: string
  ) => {
    if (entityType === 'Sanggar') {
      setSanggarList((prev) => prev.filter((s) => s.id !== id));
      logActivity('Hapus Data', 'Sanggar', `Menghapus baris record Sanggar ID ${id}`);
    } else if (entityType === 'Seniman') {
      setSenimanList((prev) => prev.filter((sn) => sn.id !== id));
      logActivity('Hapus Data', 'Seniman', `Menghapus baris record Seniman ID ${id}`);
    } else if (entityType === 'Cagar') {
      setCagarList((prev) => prev.filter((c) => c.id !== id));
      logActivity('Hapus Data', 'Cagar Budaya', `Menghapus baris record Cagar ID ${id}`);
    } else if (entityType === 'Koleksi') {
      setKoleksiList((prev) => prev.filter((kl) => kl.id !== id));
      logActivity('Hapus Data', 'Koleksi Museum', `Menghapus baris record Koleksi ID ${id}`);
    }
  };

  // Master Data Add/Delete
  const handleAddKecamatan = (item: MasterKecamatan) => {
    setKecamatanList((prev) => [...prev, item]);
    logActivity('Tambah Master Kecamatan', 'Master Data', `Menambahkan Master Kecamatan ${item.namaKecamatan}`);
  };

  const handleAddDesa = (item: MasterDesa) => {
    setDesaList((prev) => [...prev, item]);
    logActivity('Tambah Master Desa', 'Master Data', `Menambahkan Master Desa ${item.namaDesa} (${item.kecamatan})`);
  };

  const handleAddJenisSanggar = (item: MasterJenisSanggar) => {
    setJenisSanggarList((prev) => [...prev, item]);
    logActivity('Tambah Master Jenis Sanggar', 'Master Data', `Menambahkan Jenis Sanggar ${item.namaJenis}`);
  };

  const handleAddJenisSeniman = (item: MasterJenisSeniman) => {
    setJenisSenimanList((prev) => [...prev, item]);
    logActivity('Tambah Master Jenis Seniman', 'Master Data', `Menambahkan Jenis Seniman ${item.namaJenis}`);
  };

  const handleAddKategoriKoleksi = (item: MasterKategoriKoleksi) => {
    setKategoriKoleksiList((prev) => [...prev, item]);
    logActivity('Tambah Master Kategori Koleksi', 'Master Data', `Menambahkan Kategori Koleksi ${item.namaKategori}`);
  };

  const handleDeleteMaster = (
    type: 'kecamatan' | 'desa' | 'sanggar' | 'seniman' | 'koleksi',
    id: string
  ) => {
    if (type === 'kecamatan') setKecamatanList((prev) => prev.filter((k) => k.id !== id));
    if (type === 'desa') setDesaList((prev) => prev.filter((d) => d.id !== id));
    if (type === 'sanggar') setJenisSanggarList((prev) => prev.filter((j) => j.id !== id));
    if (type === 'seniman') setJenisSenimanList((prev) => prev.filter((j) => j.id !== id));
    if (type === 'koleksi') setKategoriKoleksiList((prev) => prev.filter((k) => k.id !== id));
    logActivity('Hapus Master Item', 'Master Data', `Menghapus master item ID ${id}`);
  };

  // Inspect Modal Trigger
  const handleViewDetail = (item: unknown, type: string) => {
    setSelectedDetailItem(item);
    setSelectedDetailType(type);
    setIsDetailModalOpen(true);
  };

  // Pending Verifications Count
  const pendingCount =
    sanggarList.filter((s) => s.statusVerifikasi === 'Menunggu Verifikasi').length +
    senimanList.filter((sn) => sn.statusVerifikasi === 'Menunggu Verifikasi').length;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col antialiased">
      
      {/* Header Bar */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        globalSearch={filters.searchQuery}
        onGlobalSearchChange={(val) => setFilters({ ...filters, searchQuery: val })}
        onNavigateToSearch={() => setActiveTab('search')}
        onSyncSheets={handleSyncSheets}
        isSyncing={isSyncing}
        lastSynced={lastSynced}
      />

      {/* Main Navigation Tab Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingVerificationsCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            sanggarList={sanggarList}
            senimanList={senimanList}
            cagarList={cagarList}
            koleksiList={koleksiList}
            kecamatanList={kecamatanList}
            desaList={desaList}
            filters={filters}
            onFilterChange={setFilters}
            onNavigateToForm={(type) => {
              setFormType(type);
              setActiveTab('forms');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            sanggarList={sanggarList}
            senimanList={senimanList}
            cagarList={cagarList}
            koleksiList={koleksiList}
          />
        )}

        {activeTab === 'spreadsheet' && (
          <SpreadsheetView
            currentUser={currentUser}
            kecamatanList={kecamatanList}
            desaList={desaList}
            jenisSanggarList={jenisSanggarList}
            jenisSenimanList={jenisSenimanList}
            kategoriKoleksiList={kategoriKoleksiList}
            sanggarList={sanggarList}
            senimanList={senimanList}
            cagarList={cagarList}
            koleksiList={koleksiList}
            userList={userList}
            activityLogs={activityLogs}
            onVerifyRecord={handleVerifyRecord}
            onDeleteRecord={handleDeleteRecord}
            onViewDetail={handleViewDetail}
            onNavigateToForm={(type) => {
              setFormType(type);
              setActiveTab('forms');
            }}
          />
        )}

        {activeTab === 'forms' && (
          <FormsContainer
            currentRole={currentUser.role}
            kecamatanList={kecamatanList}
            desaList={desaList}
            jenisSanggarList={jenisSanggarList}
            jenisSenimanList={jenisSenimanList}
            kategoriKoleksiList={kategoriKoleksiList}
            sanggarList={sanggarList}
            senimanList={senimanList}
            cagarList={cagarList}
            koleksiList={koleksiList}
            onAddSanggar={handleAddSanggar}
            onAddSeniman={handleAddSeniman}
            onAddCagar={handleAddCagar}
            onAddKoleksi={handleAddKoleksi}
            initialActiveForm={formType}
          />
        )}

        {activeTab === 'master' && (
          <MasterDataManagement
            currentRole={currentUser.role}
            kecamatanList={kecamatanList}
            desaList={desaList}
            jenisSanggarList={jenisSanggarList}
            jenisSenimanList={jenisSenimanList}
            kategoriKoleksiList={kategoriKoleksiList}
            onAddKecamatan={handleAddKecamatan}
            onAddDesa={handleAddDesa}
            onAddJenisSanggar={handleAddJenisSanggar}
            onAddJenisSeniman={handleAddJenisSeniman}
            onAddKategoriKoleksi={handleAddKategoriKoleksi}
            onDeleteMaster={handleDeleteMaster}
          />
        )}

        {activeTab === 'search' && (
          <GlobalSearch
            sanggarList={sanggarList}
            senimanList={senimanList}
            cagarList={cagarList}
            koleksiList={koleksiList}
            initialSearchQuery={filters.searchQuery}
            onViewDetail={handleViewDetail}
          />
        )}

        {activeTab === 'reports' && (
          <ReportCenter
            sanggarList={sanggarList}
            senimanList={senimanList}
            cagarList={cagarList}
            koleksiList={koleksiList}
            kecamatanList={kecamatanList}
          />
        )}

        {activeTab === 'users' && (
          <UserRoleManagement
            currentUser={currentUser}
            userList={userList}
            onRoleChange={handleRoleChange}
            onAddUser={(nu) => setUserList((prev) => [...prev, nu])}
          />
        )}

        {activeTab === 'script' && (
          <AppsScriptSimulator
            activityLogs={activityLogs}
            onTriggerAction={logActivity}
          />
        )}
      </main>

      {/* Detail Inspection Modal */}
      <DetailModals
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        selectedItem={selectedDetailItem}
        itemType={selectedDetailType}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 Dinas Kebudayaan - Dashboard Pendataan Kebudayaan Daerah Berbasis Spreadsheet
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Google Sheets Cloud Linked</span>
            <span>•</span>
            <span>Google Apps Script V8 Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
