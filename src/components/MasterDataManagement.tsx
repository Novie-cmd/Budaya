import React, { useState } from 'react';
import {
  MasterKecamatan,
  MasterDesa,
  MasterJenisSanggar,
  MasterJenisSeniman,
  MasterKategoriKoleksi,
  Role,
} from '../types';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Pencil,
  MapPin,
  Home,
  Music,
  Palette,
  Package,
  Search,
  Check,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';

interface MasterDataManagementProps {
  currentRole: Role;
  kecamatanList: MasterKecamatan[];
  desaList: MasterDesa[];
  jenisSanggarList: MasterJenisSanggar[];
  jenisSenimanList: MasterJenisSeniman[];
  kategoriKoleksiList: MasterKategoriKoleksi[];
  onAddKecamatan: (item: MasterKecamatan) => void;
  onAddDesa: (item: MasterDesa) => void;
  onAddJenisSanggar: (item: MasterJenisSanggar) => void;
  onAddJenisSeniman: (item: MasterJenisSeniman) => void;
  onAddKategoriKoleksi: (item: MasterKategoriKoleksi) => void;
  onEditKecamatan: (item: MasterKecamatan) => void;
  onEditDesa: (item: MasterDesa) => void;
  onEditJenisSanggar: (item: MasterJenisSanggar) => void;
  onEditJenisSeniman: (item: MasterJenisSeniman) => void;
  onEditKategoriKoleksi: (item: MasterKategoriKoleksi) => void;
  onDeleteMaster: (
    type: 'kecamatan' | 'desa' | 'sanggar' | 'seniman' | 'koleksi',
    id: string
  ) => void;
}

type EditState =
  | { type: 'kecamatan'; id: string; namaKecamatan: string; kodeWilayah: string }
  | { type: 'desa'; id: string; kecamatan: string; namaDesa: string }
  | { type: 'sanggar'; id: string; namaJenis: string; keterangan: string }
  | { type: 'seniman'; id: string; namaJenis: string; keterangan: string }
  | { type: 'koleksi'; id: string; namaKategori: string; keterangan: string }
  | null;

type DeleteState = {
  type: 'kecamatan' | 'desa' | 'sanggar' | 'seniman' | 'koleksi';
  id: string;
  name: string;
  extra?: string;
} | null;

export const MasterDataManagement: React.FC<MasterDataManagementProps> = ({
  currentRole,
  kecamatanList,
  desaList,
  jenisSanggarList,
  jenisSenimanList,
  kategoriKoleksiList,
  onAddKecamatan,
  onAddDesa,
  onAddJenisSanggar,
  onAddJenisSeniman,
  onAddKategoriKoleksi,
  onEditKecamatan,
  onEditDesa,
  onEditJenisSanggar,
  onEditJenisSeniman,
  onEditKategoriKoleksi,
  onDeleteMaster,
}) => {
  const [activeMasterTab, setActiveMasterTab] = useState<
    'kecamatan' | 'desa' | 'sanggar' | 'seniman' | 'koleksi'
  >('kecamatan');

  // Input States for Adding
  const [newKecamatanName, setNewKecamatanName] = useState('');
  const [newKecamatanKode, setNewKecamatanKode] = useState('');

  const [selectedKecamatanForDesa, setSelectedKecamatanForDesa] = useState(
    kecamatanList[0]?.namaKecamatan || ''
  );
  const [newDesaName, setNewDesaName] = useState('');

  const [newJenisSanggarName, setNewJenisSanggarName] = useState('');
  const [newJenisSanggarKet, setNewJenisSanggarKet] = useState('');

  const [newJenisSenimanName, setNewJenisSenimanName] = useState('');
  const [newJenisSenimanKet, setNewJenisSenimanKet] = useState('');

  const [newKategoriKoleksiName, setNewKategoriKoleksiName] = useState('');
  const [newKategoriKoleksiKet, setNewKategoriKoleksiKet] = useState('');

  // Search & Dialog States
  const [searchQuery, setSearchQuery] = useState('');
  const [editState, setEditState] = useState<EditState>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isCanEdit = currentRole === 'Administrator' || currentRole === 'Operator Bidang';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add Item Submit Handlers
  const handleCreateKecamatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKecamatanName.trim()) return;
    const nextNum = kecamatanList.length + 1;
    const item: MasterKecamatan = {
      id: `KEC-${String(nextNum).padStart(2, '0')}`,
      namaKecamatan: newKecamatanName.trim(),
      kodeWilayah: newKecamatanKode.trim() || `52.01.${String(nextNum).padStart(2, '0')}`,
    };
    onAddKecamatan(item);
    setNewKecamatanName('');
    setNewKecamatanKode('');
    showToast(`Master Kecamatan "${item.namaKecamatan}" berhasil ditambahkan.`);
  };

  const handleCreateDesa = (e: React.FormEvent) => {
    e.preventDefault();
    const kec = selectedKecamatanForDesa || kecamatanList[0]?.namaKecamatan;
    if (!newDesaName.trim() || !kec) return;
    const nextNum = desaList.length + 1;
    const item: MasterDesa = {
      id: `DES-${String(nextNum).padStart(3, '0')}`,
      kecamatan: kec,
      namaDesa: newDesaName.trim(),
    };
    onAddDesa(item);
    setNewDesaName('');
    showToast(`Master Desa "${item.namaDesa}" (${item.kecamatan}) berhasil ditambahkan.`);
  };

  const handleCreateJenisSanggar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJenisSanggarName.trim()) return;
    const nextNum = jenisSanggarList.length + 1;
    const item: MasterJenisSanggar = {
      id: `JSN-${String(nextNum).padStart(2, '0')}`,
      namaJenis: newJenisSanggarName.trim(),
      keterangan: newJenisSanggarKet.trim(),
    };
    onAddJenisSanggar(item);
    setNewJenisSanggarName('');
    setNewJenisSanggarKet('');
    showToast(`Master Jenis Sanggar "${item.namaJenis}" berhasil ditambahkan.`);
  };

  const handleCreateJenisSeniman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJenisSenimanName.trim()) return;
    const nextNum = jenisSenimanList.length + 1;
    const item: MasterJenisSeniman = {
      id: `JSM-${String(nextNum).padStart(2, '0')}`,
      namaJenis: newJenisSenimanName.trim(),
      keterangan: newJenisSenimanKet.trim(),
    };
    onAddJenisSeniman(item);
    setNewJenisSenimanName('');
    setNewJenisSenimanKet('');
    showToast(`Master Jenis Seniman "${item.namaJenis}" berhasil ditambahkan.`);
  };

  const handleCreateKategoriKoleksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKategoriKoleksiName.trim()) return;
    const nextNum = kategoriKoleksiList.length + 1;
    const item: MasterKategoriKoleksi = {
      id: `KTG-${String(nextNum).padStart(2, '0')}`,
      namaKategori: newKategoriKoleksiName.trim(),
      keterangan: newKategoriKoleksiKet.trim(),
    };
    onAddKategoriKoleksi(item);
    setNewKategoriKoleksiName('');
    setNewKategoriKoleksiKet('');
    showToast(`Master Kategori Koleksi "${item.namaKategori}" berhasil ditambahkan.`);
  };

  // Open Edit Modals
  const openEditKecamatan = (k: MasterKecamatan) => {
    setEditState({
      type: 'kecamatan',
      id: k.id,
      namaKecamatan: k.namaKecamatan,
      kodeWilayah: k.kodeWilayah || '',
    });
  };

  const openEditDesa = (d: MasterDesa) => {
    setEditState({
      type: 'desa',
      id: d.id,
      kecamatan: d.kecamatan,
      namaDesa: d.namaDesa,
    });
  };

  const openEditSanggar = (j: MasterJenisSanggar) => {
    setEditState({
      type: 'sanggar',
      id: j.id,
      namaJenis: j.namaJenis,
      keterangan: j.keterangan || '',
    });
  };

  const openEditSeniman = (s: MasterJenisSeniman) => {
    setEditState({
      type: 'seniman',
      id: s.id,
      namaJenis: s.namaJenis,
      keterangan: s.keterangan || '',
    });
  };

  const openEditKoleksi = (k: MasterKategoriKoleksi) => {
    setEditState({
      type: 'koleksi',
      id: k.id,
      namaKategori: k.namaKategori,
      keterangan: k.keterangan || '',
    });
  };

  // Save Edit Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editState) return;

    if (editState.type === 'kecamatan') {
      if (!editState.namaKecamatan.trim()) return;
      onEditKecamatan({
        id: editState.id,
        namaKecamatan: editState.namaKecamatan.trim(),
        kodeWilayah: editState.kodeWilayah.trim(),
      });
      showToast(`Master Kecamatan "${editState.namaKecamatan}" berhasil diperbarui.`);
    } else if (editState.type === 'desa') {
      if (!editState.namaDesa.trim() || !editState.kecamatan) return;
      onEditDesa({
        id: editState.id,
        kecamatan: editState.kecamatan,
        namaDesa: editState.namaDesa.trim(),
      });
      showToast(`Master Desa "${editState.namaDesa}" berhasil diperbarui.`);
    } else if (editState.type === 'sanggar') {
      if (!editState.namaJenis.trim()) return;
      onEditJenisSanggar({
        id: editState.id,
        namaJenis: editState.namaJenis.trim(),
        keterangan: editState.keterangan.trim(),
      });
      showToast(`Master Jenis Sanggar "${editState.namaJenis}" berhasil diperbarui.`);
    } else if (editState.type === 'seniman') {
      if (!editState.namaJenis.trim()) return;
      onEditJenisSeniman({
        id: editState.id,
        namaJenis: editState.namaJenis.trim(),
        keterangan: editState.keterangan.trim(),
      });
      showToast(`Master Jenis Seniman "${editState.namaJenis}" berhasil diperbarui.`);
    } else if (editState.type === 'koleksi') {
      if (!editState.namaKategori.trim()) return;
      onEditKategoriKoleksi({
        id: editState.id,
        namaKategori: editState.namaKategori.trim(),
        keterangan: editState.keterangan.trim(),
      });
      showToast(`Master Kategori Koleksi "${editState.namaKategori}" berhasil diperbarui.`);
    }

    setEditState(null);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = () => {
    if (!deleteState) return;
    onDeleteMaster(deleteState.type, deleteState.id);
    showToast(`Master item "${deleteState.name}" telah dihapus.`);
    setDeleteState(null);
  };

  // Filtered Lists for Active Tab
  const q = searchQuery.toLowerCase().trim();

  const filteredKecamatan = kecamatanList.filter(
    (k) =>
      k.namaKecamatan.toLowerCase().includes(q) ||
      k.id.toLowerCase().includes(q) ||
      (k.kodeWilayah && k.kodeWilayah.toLowerCase().includes(q))
  );

  const filteredDesa = desaList.filter(
    (d) =>
      d.namaDesa.toLowerCase().includes(q) ||
      d.kecamatan.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q)
  );

  const filteredSanggar = jenisSanggarList.filter(
    (s) =>
      s.namaJenis.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.keterangan && s.keterangan.toLowerCase().includes(q))
  );

  const filteredSeniman = jenisSenimanList.filter(
    (s) =>
      s.namaJenis.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.keterangan && s.keterangan.toLowerCase().includes(q))
  );

  const filteredKoleksi = kategoriKoleksiList.filter(
    (k) =>
      k.namaKategori.toLowerCase().includes(q) ||
      k.id.toLowerCase().includes(q) ||
      (k.keterangan && k.keterangan.toLowerCase().includes(q))
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-lg">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Menu Master Data Kebudayaan</h2>
            <p className="text-xs text-slate-500">
              Kelola, tambah, edit, dan hapus master data wilayah (Kecamatan/Desa), jenis sanggar, jenis seniman, dan kategori koleksi
            </p>
          </div>
        </div>

        {!isCanEdit && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Mode Baca (Role {currentRole}). Login sebagai Admin/Operator untuk menambah/mengedit.</span>
          </div>
        )}
      </div>

      {/* Master Sub Tabs */}
      <div className="bg-slate-900 rounded-xl p-1.5 border border-slate-800 shadow-md">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveMasterTab('kecamatan');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'kecamatan'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>A. Master Kecamatan ({kecamatanList.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveMasterTab('desa');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'desa'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>B. Master Desa/Kelurahan ({desaList.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveMasterTab('sanggar');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'sanggar'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>C. Jenis Sanggar ({jenisSanggarList.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveMasterTab('seniman');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'seniman'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>D. Jenis Seniman ({jenisSenimanList.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveMasterTab('koleksi');
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'koleksi'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>E. Kategori Koleksi ({kategoriKoleksiList.length})</span>
          </button>
        </div>
      </div>

      {/* Content Area: Form Input + Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Add Item */}
        {isCanEdit ? (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              <span>
                Tambah Master{' '}
                {activeMasterTab === 'kecamatan'
                  ? 'Kecamatan'
                  : activeMasterTab === 'desa'
                  ? 'Desa / Kelurahan'
                  : activeMasterTab === 'sanggar'
                  ? 'Jenis Sanggar'
                  : activeMasterTab === 'seniman'
                  ? 'Jenis Seniman'
                  : 'Kategori Koleksi'}
              </span>
            </h3>

            {activeMasterTab === 'kecamatan' && (
              <form onSubmit={handleCreateKecamatan} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Kecamatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={newKecamatanName}
                    onChange={(e) => setNewKecamatanName(e.target.value)}
                    placeholder="Contoh: Narmada"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Wilayah
                  </label>
                  <input
                    type="text"
                    value={newKecamatanKode}
                    onChange={(e) => setNewKecamatanKode(e.target.value)}
                    placeholder="Contoh: 52.01.07"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kecamatan</span>
                </button>
              </form>
            )}

            {activeMasterTab === 'desa' && (
              <form onSubmit={handleCreateDesa} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pilih Kecamatan *
                  </label>
                  <select
                    value={selectedKecamatanForDesa}
                    onChange={(e) => setSelectedKecamatanForDesa(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {kecamatanList.map((k) => (
                      <option key={k.id} value={k.namaKecamatan}>
                        {k.namaKecamatan} ({k.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Desa / Kelurahan *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDesaName}
                    onChange={(e) => setNewDesaName(e.target.value)}
                    placeholder="Contoh: Lembar Selatan"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Desa</span>
                </button>
              </form>
            )}

            {activeMasterTab === 'sanggar' && (
              <form onSubmit={handleCreateJenisSanggar} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Sanggar *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJenisSanggarName}
                    onChange={(e) => setNewJenisSanggarName(e.target.value)}
                    placeholder="Contoh: Seni Musik Gendang Beleq"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={newJenisSanggarKet}
                    onChange={(e) => setNewJenisSanggarKet(e.target.value)}
                    placeholder="Deskripsi singkat bidang sanggar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jenis Sanggar</span>
                </button>
              </form>
            )}

            {activeMasterTab === 'seniman' && (
              <form onSubmit={handleCreateJenisSeniman} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Seniman / Profesi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJenisSenimanName}
                    onChange={(e) => setNewJenisSenimanName(e.target.value)}
                    placeholder="Contoh: Dalang Wayang Sasak"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={newJenisSenimanKet}
                    onChange={(e) => setNewJenisSenimanKet(e.target.value)}
                    placeholder="Deskripsi keahlian / profesi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jenis Seniman</span>
                </button>
              </form>
            )}

            {activeMasterTab === 'koleksi' && (
              <form onSubmit={handleCreateKategoriKoleksi} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Koleksi Museum *
                  </label>
                  <input
                    type="text"
                    required
                    value={newKategoriKoleksiName}
                    onChange={(e) => setNewKategoriKoleksiName(e.target.value)}
                    placeholder="Contoh: Naskah Kuno / Filologi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={newKategoriKoleksiKet}
                    onChange={(e) => setNewKategoriKoleksiKet(e.target.value)}
                    placeholder="Deskripsi kategori koleksi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kategori Koleksi</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-xs text-slate-500 flex flex-col items-center justify-center text-center space-y-2 h-fit">
            <AlertCircle className="w-8 h-8 text-slate-400" />
            <p className="font-semibold text-slate-700">Mode Baca Terbatas</p>
            <p>Pengubahan dan penambahan master data memerlukan role Operator Bidang atau Administrator.</p>
          </div>
        )}

        {/* Right Column: Data Table Grid with Search & Action */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <span>Daftar Master Item</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[10px]">
                {activeMasterTab.toUpperCase()}
              </span>
            </div>

            {/* Quick Search in Master List */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari master item..."
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-48 sm:w-56"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            {/* Table: Kecamatan */}
            {activeMasterTab === 'kecamatan' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nama Kecamatan</th>
                    <th className="p-3">Kode Wilayah</th>
                    {isCanEdit && <th className="p-3 text-center w-32">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredKecamatan.length === 0 ? (
                    <tr>
                      <td colSpan={isCanEdit ? 4 : 3} className="p-8 text-center text-slate-500">
                        Tidak ada data kecamatan {searchQuery ? `sesuai "${searchQuery}"` : ''}.
                      </td>
                    </tr>
                  ) : (
                    filteredKecamatan.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700">{k.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{k.namaKecamatan}</td>
                        <td className="p-3 font-mono text-slate-600">{k.kodeWilayah || '-'}</td>
                        {isCanEdit && (
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditKecamatan(k)}
                                title="Edit Kecamatan"
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteState({
                                    type: 'kecamatan',
                                    id: k.id,
                                    name: k.namaKecamatan,
                                    extra: k.kodeWilayah,
                                  })
                                }
                                title="Hapus Kecamatan"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Table: Desa */}
            {activeMasterTab === 'desa' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Kecamatan</th>
                    <th className="p-3">Nama Desa / Kelurahan</th>
                    {isCanEdit && <th className="p-3 text-center w-32">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredDesa.length === 0 ? (
                    <tr>
                      <td colSpan={isCanEdit ? 4 : 3} className="p-8 text-center text-slate-500">
                        Tidak ada data desa {searchQuery ? `sesuai "${searchQuery}"` : ''}.
                      </td>
                    </tr>
                  ) : (
                    filteredDesa.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700">{d.id}</td>
                        <td className="p-3 font-semibold text-slate-800">{d.kecamatan}</td>
                        <td className="p-3 text-slate-900">{d.namaDesa}</td>
                        {isCanEdit && (
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditDesa(d)}
                                title="Edit Desa"
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteState({
                                    type: 'desa',
                                    id: d.id,
                                    name: d.namaDesa,
                                    extra: `Kec. ${d.kecamatan}`,
                                  })
                                }
                                title="Hapus Desa"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Table: Jenis Sanggar */}
            {activeMasterTab === 'sanggar' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Jenis Sanggar</th>
                    <th className="p-3">Keterangan</th>
                    {isCanEdit && <th className="p-3 text-center w-32">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSanggar.length === 0 ? (
                    <tr>
                      <td colSpan={isCanEdit ? 4 : 3} className="p-8 text-center text-slate-500">
                        Tidak ada data jenis sanggar {searchQuery ? `sesuai "${searchQuery}"` : ''}.
                      </td>
                    </tr>
                  ) : (
                    filteredSanggar.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700">{j.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{j.namaJenis}</td>
                        <td className="p-3 text-slate-600">{j.keterangan || '-'}</td>
                        {isCanEdit && (
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditSanggar(j)}
                                title="Edit Jenis Sanggar"
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteState({
                                    type: 'sanggar',
                                    id: j.id,
                                    name: j.namaJenis,
                                    extra: j.keterangan,
                                  })
                                }
                                title="Hapus Jenis Sanggar"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Table: Jenis Seniman */}
            {activeMasterTab === 'seniman' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Jenis Seniman / Profesi</th>
                    <th className="p-3">Keterangan</th>
                    {isCanEdit && <th className="p-3 text-center w-32">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSeniman.length === 0 ? (
                    <tr>
                      <td colSpan={isCanEdit ? 4 : 3} className="p-8 text-center text-slate-500">
                        Tidak ada data jenis seniman {searchQuery ? `sesuai "${searchQuery}"` : ''}.
                      </td>
                    </tr>
                  ) : (
                    filteredSeniman.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700">{s.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{s.namaJenis}</td>
                        <td className="p-3 text-slate-600">{s.keterangan || '-'}</td>
                        {isCanEdit && (
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditSeniman(s)}
                                title="Edit Jenis Seniman"
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteState({
                                    type: 'seniman',
                                    id: s.id,
                                    name: s.namaJenis,
                                    extra: s.keterangan,
                                  })
                                }
                                title="Hapus Jenis Seniman"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Table: Kategori Koleksi */}
            {activeMasterTab === 'koleksi' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Kategori Koleksi</th>
                    <th className="p-3">Keterangan</th>
                    {isCanEdit && <th className="p-3 text-center w-32">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredKoleksi.length === 0 ? (
                    <tr>
                      <td colSpan={isCanEdit ? 4 : 3} className="p-8 text-center text-slate-500">
                        Tidak ada data kategori koleksi {searchQuery ? `sesuai "${searchQuery}"` : ''}.
                      </td>
                    </tr>
                  ) : (
                    filteredKoleksi.map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700">{k.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{k.namaKategori}</td>
                        <td className="p-3 text-slate-600">{k.keterangan || '-'}</td>
                        {isCanEdit && (
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openEditKoleksi(k)}
                                title="Edit Kategori Koleksi"
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteState({
                                    type: 'koleksi',
                                    id: k.id,
                                    name: k.namaKategori,
                                    extra: k.keterangan,
                                  })
                                }
                                title="Hapus Kategori Koleksi"
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit Master Item Modal */}
      {editState && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800">
                    Edit Master{' '}
                    {editState.type === 'kecamatan'
                      ? 'Kecamatan'
                      : editState.type === 'desa'
                      ? 'Desa / Kelurahan'
                      : editState.type === 'sanggar'
                      ? 'Jenis Sanggar'
                      : editState.type === 'seniman'
                      ? 'Jenis Seniman'
                      : 'Kategori Koleksi'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {editState.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditState(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              {/* Kecamatan Form */}
              {editState.type === 'kecamatan' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Kecamatan *
                    </label>
                    <input
                      type="text"
                      required
                      value={editState.namaKecamatan}
                      onChange={(e) =>
                        setEditState({ ...editState, namaKecamatan: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kode Wilayah
                    </label>
                    <input
                      type="text"
                      value={editState.kodeWilayah}
                      onChange={(e) =>
                        setEditState({ ...editState, kodeWilayah: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Desa Form */}
              {editState.type === 'desa' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pilih Kecamatan *
                    </label>
                    <select
                      value={editState.kecamatan}
                      onChange={(e) =>
                        setEditState({ ...editState, kecamatan: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {kecamatanList.map((k) => (
                        <option key={k.id} value={k.namaKecamatan}>
                          {k.namaKecamatan} ({k.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Desa / Kelurahan *
                    </label>
                    <input
                      type="text"
                      required
                      value={editState.namaDesa}
                      onChange={(e) =>
                        setEditState({ ...editState, namaDesa: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Sanggar Form */}
              {editState.type === 'sanggar' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jenis Sanggar *
                    </label>
                    <input
                      type="text"
                      required
                      value={editState.namaJenis}
                      onChange={(e) =>
                        setEditState({ ...editState, namaJenis: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      rows={3}
                      value={editState.keterangan}
                      onChange={(e) =>
                        setEditState({ ...editState, keterangan: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* Seniman Form */}
              {editState.type === 'seniman' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jenis Seniman / Profesi *
                    </label>
                    <input
                      type="text"
                      required
                      value={editState.namaJenis}
                      onChange={(e) =>
                        setEditState({ ...editState, namaJenis: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      rows={3}
                      value={editState.keterangan}
                      onChange={(e) =>
                        setEditState({ ...editState, keterangan: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* Koleksi Form */}
              {editState.type === 'koleksi' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kategori Koleksi Museum *
                    </label>
                    <input
                      type="text"
                      required
                      value={editState.namaKategori}
                      onChange={(e) =>
                        setEditState({ ...editState, namaKategori: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      rows={3}
                      value={editState.keterangan}
                      onChange={(e) =>
                        setEditState({ ...editState, keterangan: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditState(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteState && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Konfirmasi Hapus Master</h3>
                <p className="text-xs text-slate-500">Tindakan ini akan menghapus data dari master sistem.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori Master:</span>
                <span className="font-bold text-slate-800 uppercase">{deleteState.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID Item:</span>
                <span className="font-mono font-bold text-amber-700">{deleteState.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Item:</span>
                <span className="font-bold text-slate-900">{deleteState.name}</span>
              </div>
              {deleteState.extra && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Keterangan/Wilayah:</span>
                  <span className="text-slate-700">{deleteState.extra}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus master <strong>{deleteState.name}</strong> ({deleteState.id})? Data yang terkait dengan master ini di tabel kebudayaan tetap ada namun master ini tidak lagi muncul di pilihan dropdown data baru.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteState(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Master</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
