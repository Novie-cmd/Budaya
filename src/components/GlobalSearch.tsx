import React, { useState } from 'react';
import { SanggarSeni, Seniman, CagarBudaya, KoleksiMuseum } from '../types';
import { Search, Building2, Users, Landmark, Package, MapPin, Eye, ExternalLink } from 'lucide-react';

interface GlobalSearchProps {
  sanggarList: SanggarSeni[];
  senimanList: Seniman[];
  cagarList: CagarBudaya[];
  koleksiList: KoleksiMuseum[];
  initialSearchQuery?: string;
  onViewDetail: (item: unknown, type: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  sanggarList,
  senimanList,
  cagarList,
  koleksiList,
  initialSearchQuery = '',
  onViewDetail,
}) => {
  const [query, setQuery] = useState(initialSearchQuery);
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<'Semua' | 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi'>('Semua');

  const qLower = query.toLowerCase().trim();

  // Filter Functions
  const filteredSanggar = sanggarList.filter((s) => {
    if (selectedEntityFilter !== 'Semua' && selectedEntityFilter !== 'Sanggar') return false;
    if (!qLower) return true;
    return (
      s.namaSanggar.toLowerCase().includes(qLower) ||
      s.namaPimpinan.toLowerCase().includes(qLower) ||
      s.kecamatan.toLowerCase().includes(qLower) ||
      s.desa.toLowerCase().includes(qLower) ||
      s.jenisSanggar.toLowerCase().includes(qLower)
    );
  });

  const filteredSeniman = senimanList.filter((sn) => {
    if (selectedEntityFilter !== 'Semua' && selectedEntityFilter !== 'Seniman') return false;
    if (!qLower) return true;
    return (
      sn.namaLengkap.toLowerCase().includes(qLower) ||
      sn.jenisSeniman.toLowerCase().includes(qLower) ||
      sn.kecamatan.toLowerCase().includes(qLower) ||
      sn.desa.toLowerCase().includes(qLower) ||
      sn.sanggar.toLowerCase().includes(qLower)
    );
  });

  const filteredCagar = cagarList.filter((c) => {
    if (selectedEntityFilter !== 'Semua' && selectedEntityFilter !== 'Cagar') return false;
    if (!qLower) return true;
    return (
      c.namaCagar.toLowerCase().includes(qLower) ||
      c.jenisCagar.toLowerCase().includes(qLower) ||
      c.kecamatan.toLowerCase().includes(qLower) ||
      c.desa.toLowerCase().includes(qLower) ||
      c.nomorSk.toLowerCase().includes(qLower)
    );
  });

  const filteredKoleksi = koleksiList.filter((kl) => {
    if (selectedEntityFilter !== 'Semua' && selectedEntityFilter !== 'Koleksi') return false;
    if (!qLower) return true;
    return (
      kl.namaKoleksi.toLowerCase().includes(qLower) ||
      kl.kategori.toLowerCase().includes(qLower) ||
      kl.nomorInventaris.toLowerCase().includes(qLower) ||
      kl.barcodeQr.toLowerCase().includes(qLower)
    );
  });

  const totalResults = filteredSanggar.length + filteredSeniman.length + filteredCagar.length + filteredKoleksi.length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Search Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Pencarian Terpadu Data Kebudayaan</h2>
          <p className="text-xs text-slate-500">
            Cari lintas entitas berdasarkan Nama Sanggar, Seniman, Cagar Budaya, Koleksi Museum, Kecamatan, atau Desa
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci pencarian (e.g. Mataram, Gendang Beleq, Taman Narmada, Wayang Sasak, Songket)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedEntityFilter('Semua')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                selectedEntityFilter === 'Semua' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({totalResults})
            </button>
            <button
              onClick={() => setSelectedEntityFilter('Sanggar')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                selectedEntityFilter === 'Sanggar' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sanggar ({filteredSanggar.length})
            </button>
            <button
              onClick={() => setSelectedEntityFilter('Seniman')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                selectedEntityFilter === 'Seniman' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Seniman ({filteredSeniman.length})
            </button>
            <button
              onClick={() => setSelectedEntityFilter('Cagar')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                selectedEntityFilter === 'Cagar' ? 'bg-blue-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cagar Budaya ({filteredCagar.length})
            </button>
            <button
              onClick={() => setSelectedEntityFilter('Koleksi')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors whitespace-nowrap ${
                selectedEntityFilter === 'Koleksi' ? 'bg-purple-500 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Koleksi ({filteredKoleksi.length})
            </button>
          </div>
        </div>
      </div>

      {/* Results Container Grid */}
      <div className="space-y-6">
        
        {/* Sanggar Results */}
        {filteredSanggar.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2 border-b border-amber-200 pb-1">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Sanggar Seni ({filteredSanggar.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSanggar.map((s) => (
                <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-amber-700 font-bold">{s.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{s.namaSanggar}</h4>
                      <p className="text-xs text-slate-500">{s.jenisSanggar} | Berdiri: {s.tahunBerdiri}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">
                      {s.kecamatan}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Pimpinan: <strong>{s.namaPimpinan}</strong></p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500">{s.jumlahAnggota} Anggota</span>
                    <button
                      onClick={() => onViewDetail(s, 'Sanggar')}
                      className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seniman Results */}
        {filteredSeniman.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 border-b border-emerald-200 pb-1">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Seniman & Budayawan ({filteredSeniman.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSeniman.map((sn) => (
                <div key={sn.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-700 font-bold">{sn.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{sn.namaLengkap}</h4>
                      <p className="text-xs text-slate-500">{sn.jenisSeniman} | {sn.sanggar}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                      {sn.kecamatan}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Keahlian: {sn.keahlian}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-mono text-[11px] text-slate-500">NIK: {sn.nik}</span>
                    <button
                      onClick={() => onViewDetail(sn, 'Seniman')}
                      className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cagar Budaya Results */}
        {filteredCagar.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 border-b border-blue-200 pb-1">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>Cagar Budaya ({filteredCagar.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCagar.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-blue-700 font-bold">{c.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{c.namaCagar}</h4>
                      <p className="text-xs text-slate-500">{c.jenisCagar} | {c.tingkat}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded">
                      SK: {c.nomorSk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{c.deskripsi}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500">{c.kecamatan}, {c.desa}</span>
                    <button
                      onClick={() => onViewDetail(c, 'Cagar')}
                      className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Koleksi Museum Results */}
        {filteredKoleksi.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-purple-800 flex items-center gap-2 border-b border-purple-200 pb-1">
              <Package className="w-4 h-4 text-purple-600" />
              <span>Koleksi Museum ({filteredKoleksi.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredKoleksi.map((kl) => (
                <div key={kl.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-purple-700 font-bold">{kl.id}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{kl.namaKoleksi}</h4>
                      <p className="text-xs text-slate-500">Kategori: {kl.kategori}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded font-mono">
                      {kl.nomorInventaris}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Lokasi: {kl.lokasiPenyimpanan}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-mono text-[10px] text-slate-400">{kl.barcodeQr}</span>
                    <button
                      onClick={() => onViewDetail(kl, 'Koleksi')}
                      className="text-purple-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalResults === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <p className="text-base font-semibold">Tidak ditemukan data kebudayaan untuk kata kunci "{query}"</p>
            <p className="text-xs mt-1 text-slate-400">Coba ubah kata kunci atau pilih filter entitas lain.</p>
          </div>
        )}

      </div>

    </div>
  );
};
