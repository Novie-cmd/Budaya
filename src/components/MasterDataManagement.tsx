import React, { useState } from 'react';
import {
  MasterKecamatan,
  MasterDesa,
  MasterJenisSanggar,
  MasterJenisSeniman,
  MasterKategoriKoleksi,
  Role,
} from '../types';
import { SlidersHorizontal, Plus, Trash2, Edit3, MapPin, Home, Music, Palette, Package } from 'lucide-react';

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
  onDeleteMaster: (type: 'kecamatan' | 'desa' | 'sanggar' | 'seniman' | 'koleksi', id: string) => void;
}

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
  onDeleteMaster,
}) => {
  const [activeMasterTab, setActiveMasterTab] = useState<'kecamatan' | 'desa' | 'sanggar' | 'seniman' | 'koleksi'>('kecamatan');

  // Input States
  const [newKecamatanName, setNewKecamatanName] = useState('');
  const [newKecamatanKode, setNewKecamatanKode] = useState('');

  const [selectedKecamatanForDesa, setSelectedKecamatanForDesa] = useState(kecamatanList[0]?.namaKecamatan || '');
  const [newDesaName, setNewDesaName] = useState('');

  const [newJenisSanggarName, setNewJenisSanggarName] = useState('');
  const [newJenisSanggarKet, setNewJenisSanggarKet] = useState('');

  const [newJenisSenimanName, setNewJenisSenimanName] = useState('');
  const [newJenisSenimanKet, setNewJenisSenimanKet] = useState('');

  const [newKategoriKoleksiName, setNewKategoriKoleksiName] = useState('');
  const [newKategoriKoleksiKet, setNewKategoriKoleksiKet] = useState('');

  const isCanEdit = currentRole === 'Administrator' || currentRole === 'Operator Bidang';

  // Submit Handlers
  const handleCreateKecamatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKecamatanName) return;
    const nextNum = kecamatanList.length + 1;
    onAddKecamatan({
      id: `KEC-${String(nextNum).padStart(2, '0')}`,
      namaKecamatan: newKecamatanName,
      kodeWilayah: newKecamatanKode || `34.03.${String(nextNum).padStart(2, '0')}`,
    });
    setNewKecamatanName('');
    setNewKecamatanKode('');
  };

  const handleCreateDesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesaName || !selectedKecamatanForDesa) return;
    const nextNum = desaList.length + 1;
    onAddDesa({
      id: `DES-${String(nextNum).padStart(3, '0')}`,
      kecamatan: selectedKecamatanForDesa,
      namaDesa: newDesaName,
    });
    setNewDesaName('');
  };

  const handleCreateJenisSanggar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJenisSanggarName) return;
    const nextNum = jenisSanggarList.length + 1;
    onAddJenisSanggar({
      id: `JSN-${String(nextNum).padStart(2, '0')}`,
      namaJenis: newJenisSanggarName,
      keterangan: newJenisSanggarKet,
    });
    setNewJenisSanggarName('');
    setNewJenisSanggarKet('');
  };

  const handleCreateJenisSeniman = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJenisSenimanName) return;
    const nextNum = jenisSenimanList.length + 1;
    onAddJenisSeniman({
      id: `JSM-${String(nextNum).padStart(2, '0')}`,
      namaJenis: newJenisSenimanName,
      keterangan: newJenisSenimanKet,
    });
    setNewJenisSenimanName('');
    setNewJenisSenimanKet('');
  };

  const handleCreateKategoriKoleksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKategoriKoleksiName) return;
    const nextNum = kategoriKoleksiList.length + 1;
    onAddKategoriKoleksi({
      id: `KTG-${String(nextNum).padStart(2, '0')}`,
      namaKategori: newKategoriKoleksiName,
      keterangan: newKategoriKoleksiKet,
    });
    setNewKategoriKoleksiName('');
    setNewKategoriKoleksiKet('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-lg">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Menu Master Data Kebudayaan</h2>
            <p className="text-xs text-slate-500">Kelola master wilayah, jenis sanggar, profesi seniman, dan kategori museum</p>
          </div>
        </div>
      </div>

      {/* Master Sub Tabs */}
      <div className="bg-slate-900 rounded-xl p-1.5 border border-slate-800 shadow-md">
        <div className="flex space-x-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveMasterTab('kecamatan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'kecamatan' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>A. Master Kecamatan</span>
          </button>
          <button
            onClick={() => setActiveMasterTab('desa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'desa' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>B. Master Desa/Kelurahan</span>
          </button>
          <button
            onClick={() => setActiveMasterTab('sanggar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'sanggar' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>C. Jenis Sanggar</span>
          </button>
          <button
            onClick={() => setActiveMasterTab('seniman')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'seniman' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>D. Jenis Seniman</span>
          </button>
          <button
            onClick={() => setActiveMasterTab('koleksi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeMasterTab === 'koleksi' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>E. Kategori Koleksi Museum</span>
          </button>
        </div>
      </div>

      {/* Content Area: Form Input + Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Add Item */}
        {isCanEdit ? (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              <span>Tambah Master Baru</span>
            </h3>

            {activeMasterTab === 'kecamatan' && (
              <form onSubmit={handleCreateKecamatan} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Kecamatan *</label>
                  <input
                    type="text"
                    required
                    value={newKecamatanName}
                    onChange={(e) => setNewKecamatanName(e.target.value)}
                    placeholder="Contoh: Semanu"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Wilayah</label>
                  <input
                    type="text"
                    value={newKecamatanKode}
                    onChange={(e) => setNewKecamatanKode(e.target.value)}
                    placeholder="34.03.07"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  + Tambah Kecamatan
                </button>
              </form>
            )}

            {activeMasterTab === 'desa' && (
              <form onSubmit={handleCreateDesa} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Kecamatan *</label>
                  <select
                    value={selectedKecamatanForDesa}
                    onChange={(e) => setSelectedKecamatanForDesa(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    {kecamatanList.map((k) => (
                      <option key={k.id} value={k.namaKecamatan}>{k.namaKecamatan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Desa / Kelurahan *</label>
                  <input
                    type="text"
                    required
                    value={newDesaName}
                    onChange={(e) => setNewDesaName(e.target.value)}
                    placeholder="Contoh: Pacarejo"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  + Tambah Desa
                </button>
              </form>
            )}

            {activeMasterTab === 'sanggar' && (
              <form onSubmit={handleCreateJenisSanggar} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Sanggar *</label>
                  <input
                    type="text"
                    required
                    value={newJenisSanggarName}
                    onChange={(e) => setNewJenisSanggarName(e.target.value)}
                    placeholder="Contoh: Seni Pertunjukan Wayang"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan</label>
                  <input
                    type="text"
                    value={newJenisSanggarKet}
                    onChange={(e) => setNewJenisSanggarKet(e.target.value)}
                    placeholder="Deskripsi singkat"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  + Tambah Jenis Sanggar
                </button>
              </form>
            )}

            {activeMasterTab === 'seniman' && (
              <form onSubmit={handleCreateJenisSeniman} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Seniman / Profesi *</label>
                  <input
                    type="text"
                    required
                    value={newJenisSenimanName}
                    onChange={(e) => setNewJenisSenimanName(e.target.value)}
                    placeholder="Contoh: Pesinden / Penata Rias"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan</label>
                  <input
                    type="text"
                    value={newJenisSenimanKet}
                    onChange={(e) => setNewJenisSenimanKet(e.target.value)}
                    placeholder="Deskripsi singkat"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  + Tambah Jenis Seniman
                </button>
              </form>
            )}

            {activeMasterTab === 'koleksi' && (
              <form onSubmit={handleCreateKategoriKoleksi} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Koleksi Museum *</label>
                  <input
                    type="text"
                    required
                    value={newKategoriKoleksiName}
                    onChange={(e) => setNewKategoriKoleksiName(e.target.value)}
                    placeholder="Contoh: Naskah Kuno / Filologi"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keterangan</label>
                  <input
                    type="text"
                    value={newKategoriKoleksiKet}
                    onChange={(e) => setNewKategoriKoleksiKet(e.target.value)}
                    placeholder="Deskripsi singkat"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  + Tambah Kategori Koleksi
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-xs text-slate-500 flex items-center justify-center">
            <span>Mode Read-Only: Pengubahan master data memerlukan role Operator atau Administrator.</span>
          </div>
        )}

        {/* Right Column: Data Table Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
            Daftar Master Item ({activeMasterTab.toUpperCase()})
          </div>

          <div className="overflow-x-auto max-h-[400px]">
            {activeMasterTab === 'kecamatan' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nama Kecamatan</th>
                    <th className="p-3">Kode Wilayah</th>
                    {isCanEdit && <th className="p-3 text-center">Hapus</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kecamatanList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-amber-700">{k.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{k.namaKecamatan}</td>
                      <td className="p-3 font-mono">{k.kodeWilayah}</td>
                      {isCanEdit && (
                        <td className="p-3 text-center">
                          <button onClick={() => onDeleteMaster('kecamatan', k.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeMasterTab === 'desa' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Kecamatan</th>
                    <th className="p-3">Nama Desa</th>
                    {isCanEdit && <th className="p-3 text-center">Hapus</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {desaList.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-amber-700">{d.id}</td>
                      <td className="p-3 font-semibold">{d.kecamatan}</td>
                      <td className="p-3">{d.namaDesa}</td>
                      {isCanEdit && (
                        <td className="p-3 text-center">
                          <button onClick={() => onDeleteMaster('desa', d.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeMasterTab === 'sanggar' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Jenis Sanggar</th>
                    <th className="p-3">Keterangan</th>
                    {isCanEdit && <th className="p-3 text-center">Hapus</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {jenisSanggarList.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-amber-700">{j.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{j.namaJenis}</td>
                      <td className="p-3">{j.keterangan || '-'}</td>
                      {isCanEdit && (
                        <td className="p-3 text-center">
                          <button onClick={() => onDeleteMaster('sanggar', j.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeMasterTab === 'seniman' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Jenis Seniman</th>
                    <th className="p-3">Keterangan</th>
                    {isCanEdit && <th className="p-3 text-center">Hapus</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {jenisSenimanList.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-amber-700">{j.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{j.namaJenis}</td>
                      <td className="p-3">{j.keterangan || '-'}</td>
                      {isCanEdit && (
                        <td className="p-3 text-center">
                          <button onClick={() => onDeleteMaster('seniman', j.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeMasterTab === 'koleksi' && (
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Kategori Koleksi</th>
                    <th className="p-3">Keterangan</th>
                    {isCanEdit && <th className="p-3 text-center">Hapus</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kategoriKoleksiList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-amber-700">{k.id}</td>
                      <td className="p-3 font-semibold text-slate-900">{k.namaKategori}</td>
                      <td className="p-3">{k.keterangan || '-'}</td>
                      {isCanEdit && (
                        <td className="p-3 text-center">
                          <button onClick={() => onDeleteMaster('koleksi', k.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
