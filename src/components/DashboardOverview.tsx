import React from 'react';
import {
  SanggarSeni,
  Seniman,
  CagarBudaya,
  KoleksiMuseum,
  MasterKecamatan,
  MasterDesa,
  CulturalFilters,
} from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Building2,
  Users,
  Landmark,
  Package,
  MapPin,
  Home,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface DashboardOverviewProps {
  sanggarList: SanggarSeni[];
  senimanList: Seniman[];
  cagarList: CagarBudaya[];
  koleksiList: KoleksiMuseum[];
  kecamatanList: MasterKecamatan[];
  desaList: MasterDesa[];
  filters: CulturalFilters;
  onFilterChange: (newFilters: CulturalFilters) => void;
  onNavigateToForm: (type: 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi') => void;
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  sanggarList,
  senimanList,
  cagarList,
  koleksiList,
  kecamatanList,
  desaList,
  filters,
  onFilterChange,
  onNavigateToForm,
}) => {
  // Apply global filters
  const filterRecord = <T extends { kecamatan?: string; desa?: string; statusVerifikasi?: string }>(
    item: T,
    yearVal?: number
  ) => {
    if (filters.kecamatan && item.kecamatan !== filters.kecamatan) return false;
    if (filters.desa && item.desa !== filters.desa) return false;
    if (filters.statusVerifikasi && filters.statusVerifikasi !== 'Semua' && item.statusVerifikasi !== filters.statusVerifikasi) return false;
    if (filters.tahun && yearVal && yearVal.toString() !== filters.tahun) return false;
    return true;
  };

  const filteredSanggar = sanggarList.filter((item) => filterRecord(item, item.tahunBerdiri));
  const filteredSeniman = senimanList.filter((item) => filterRecord(item));
  const filteredCagar = cagarList.filter((item) => filterRecord(item, item.tahunPenetapan));
  const filteredKoleksi = koleksiList.filter((item) => filterRecord(item, item.tahunPerolehan));

  // Count Stats
  const totalSanggar = filteredSanggar.length;
  const totalSeniman = filteredSeniman.length;
  const totalCagar = filteredCagar.length;
  const totalKoleksi = filteredKoleksi.length;
  const totalKecamatan = kecamatanList.length;

  const filteredDesaList = filters.kecamatan
    ? desaList.filter((d) => d.kecamatan === filters.kecamatan)
    : desaList;
  const totalDesa = filteredDesaList.length;

  // Chart Data Preparation
  // 1. Sanggar per Kecamatan
  const sanggarPerKecamatanMap: Record<string, number> = {};
  kecamatanList.forEach((k) => (sanggarPerKecamatanMap[k.namaKecamatan] = 0));
  filteredSanggar.forEach((s) => {
    if (s.kecamatan) {
      sanggarPerKecamatanMap[s.kecamatan] = (sanggarPerKecamatanMap[s.kecamatan] || 0) + 1;
    }
  });
  const sanggarPerKecamatanData = Object.keys(sanggarPerKecamatanMap).map((k) => ({
    kecamatan: k,
    jumlah: sanggarPerKecamatanMap[k],
  }));

  // 2. Jenis Sanggar Distribution
  const jenisSanggarMap: Record<string, number> = {};
  filteredSanggar.forEach((s) => {
    jenisSanggarMap[s.jenisSanggar] = (jenisSanggarMap[s.jenisSanggar] || 0) + 1;
  });
  const jenisSanggarData = Object.keys(jenisSanggarMap).map((j) => ({
    name: j,
    value: jenisSanggarMap[j],
  }));

  // 3. Jenis Seniman
  const jenisSenimanMap: Record<string, number> = {};
  filteredSeniman.forEach((sn) => {
    jenisSenimanMap[sn.jenisSeniman] = (jenisSenimanMap[sn.jenisSeniman] || 0) + 1;
  });
  const jenisSenimanData = Object.keys(jenisSenimanMap).map((j) => ({
    name: j,
    jumlah: jenisSenimanMap[j],
  }));

  // 4. Status Cagar Budaya / Kondisi
  const kondisiCagarMap: Record<string, number> = {};
  filteredCagar.forEach((c) => {
    kondisiCagarMap[c.kondisi] = (kondisiCagarMap[c.kondisi] || 0) + 1;
  });
  const kondisiCagarData = Object.keys(kondisiCagarMap).map((k) => ({
    name: k,
    value: kondisiCagarMap[k],
  }));

  // 5. Kategori Koleksi Museum
  const kategoriKoleksiMap: Record<string, number> = {};
  filteredKoleksi.forEach((kl) => {
    kategoriKoleksiMap[kl.kategori] = (kategoriKoleksiMap[kl.kategori] || 0) + 1;
  });
  const kategoriKoleksiData = Object.keys(kategoriKoleksiMap).map((kt) => ({
    name: kt,
    jumlah: kategoriKoleksiMap[kt],
  }));

  // 6. Trend Data Per Tahun
  const trendMap: Record<string, { tahun: string; sanggar: number; cagar: number; koleksi: number }> = {
    '2018': { tahun: '2018', sanggar: 1, cagar: 1, koleksi: 0 },
    '2020': { tahun: '2020', sanggar: 0, cagar: 0, koleksi: 1 },
    '2021': { tahun: '2021', sanggar: 0, cagar: 1, koleksi: 1 },
    '2022': { tahun: '2022', sanggar: 1, cagar: 0, koleksi: 1 },
    '2023': { tahun: '2023', sanggar: 1, cagar: 1, koleksi: 1 },
    '2024': { tahun: '2024', sanggar: 1, cagar: 1, koleksi: 1 },
  };
  const trendData = Object.values(trendMap);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Interactive Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm border-b border-slate-100 pb-2">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Filter Data Kebudayaan (Slicer Dashboard)</span>
          {(filters.kecamatan || filters.desa || filters.tahun || filters.statusVerifikasi !== 'Semua') && (
            <button
              onClick={() =>
                onFilterChange({
                  kecamatan: '',
                  desa: '',
                  tahun: '',
                  jenisData: 'Semua',
                  statusVerifikasi: 'Semua',
                  searchQuery: '',
                })
              }
              className="ml-auto text-xs text-rose-600 hover:underline font-normal"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          {/* Kecamatan Filter */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Kecamatan</label>
            <select
              value={filters.kecamatan}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  kecamatan: e.target.value,
                  desa: '', // reset dependent desa
                })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 text-slate-800"
            >
              <option value="">Semua Kecamatan</option>
              {kecamatanList.map((k) => (
                <option key={k.id} value={k.namaKecamatan}>
                  {k.namaKecamatan}
                </option>
              ))}
            </select>
          </div>

          {/* Desa Filter (Dependent) */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Desa/Kelurahan</label>
            <select
              value={filters.desa}
              onChange={(e) => onFilterChange({ ...filters, desa: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 text-slate-800"
            >
              <option value="">Semua Desa</option>
              {filteredDesaList.map((d) => (
                <option key={d.id} value={d.namaDesa}>
                  {d.namaDesa} ({d.kecamatan})
                </option>
              ))}
            </select>
          </div>

          {/* Tahun Filter */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Tahun Data</label>
            <select
              value={filters.tahun}
              onChange={(e) => onFilterChange({ ...filters, tahun: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 text-slate-800"
            >
              <option value="">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2018">2018</option>
            </select>
          </div>

          {/* Jenis Data Filter */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Entitas Kebudayaan</label>
            <select
              value={filters.jenisData}
              onChange={(e) => onFilterChange({ ...filters, jenisData: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 text-slate-800"
            >
              <option value="Semua">Semua Entitas</option>
              <option value="Sanggar">Sanggar Seni</option>
              <option value="Seniman">Seniman</option>
              <option value="Cagar Budaya">Cagar Budaya</option>
              <option value="Koleksi Museum">Koleksi Museum</option>
            </select>
          </div>

          {/* Status Verifikasi */}
          <div>
            <label className="block text-slate-600 font-medium mb-1">Status Verifikasi</label>
            <select
              value={filters.statusVerifikasi}
              onChange={(e) => onFilterChange({ ...filters, statusVerifikasi: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 text-slate-800"
            >
              <option value="Semua">Semua Status</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

        </div>
      </div>

      {/* Section 1: Summary Cards (6 Main Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Sanggar */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Total Sanggar</p>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">{totalSanggar}</h3>
              <p className="text-[10px] text-amber-700 mt-0.5">Sanggar Seni Aktif</p>
            </div>
            <div className="p-2 bg-amber-500/20 text-amber-700 rounded-lg group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={() => onNavigateToForm('Sanggar')}
            className="mt-3 text-[11px] text-amber-800 font-semibold hover:underline flex items-center gap-1"
          >
            + Input Sanggar
          </button>
        </div>

        {/* Seniman */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Total Seniman</p>
              <h3 className="text-2xl font-bold text-emerald-950 mt-1">{totalSeniman}</h3>
              <p className="text-[10px] text-emerald-700 mt-0.5">Praktisi & Maestro</p>
            </div>
            <div className="p-2 bg-emerald-500/20 text-emerald-700 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={() => onNavigateToForm('Seniman')}
            className="mt-3 text-[11px] text-emerald-800 font-semibold hover:underline flex items-center gap-1"
          >
            + Input Seniman
          </button>
        </div>

        {/* Cagar Budaya */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Cagar Budaya</p>
              <h3 className="text-2xl font-bold text-blue-950 mt-1">{totalCagar}</h3>
              <p className="text-[10px] text-blue-700 mt-0.5">Situs & Bangunan</p>
            </div>
            <div className="p-2 bg-blue-500/20 text-blue-700 rounded-lg group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={() => onNavigateToForm('Cagar')}
            className="mt-3 text-[11px] text-blue-800 font-semibold hover:underline flex items-center gap-1"
          >
            + Input Cagar
          </button>
        </div>

        {/* Koleksi Museum */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">Koleksi Museum</p>
              <h3 className="text-2xl font-bold text-purple-950 mt-1">{totalKoleksi}</h3>
              <p className="text-[10px] text-purple-700 mt-0.5">Benda Inventaris</p>
            </div>
            <div className="p-2 bg-purple-500/20 text-purple-700 rounded-lg group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={() => onNavigateToForm('Koleksi')}
            className="mt-3 text-[11px] text-purple-800 font-semibold hover:underline flex items-center gap-1"
          >
            + Input Koleksi
          </button>
        </div>

        {/* Total Kecamatan */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Kecamatan</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalKecamatan}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Wilayah Terdata</p>
            </div>
            <div className="p-2 bg-slate-200 text-slate-700 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">Master Wilayah</div>
        </div>

        {/* Total Desa */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">Desa / Kel.</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalDesa}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Kelurahan Terdata</p>
            </div>
            <div className="p-2 bg-slate-200 text-slate-700 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">Master Desa</div>
        </div>

      </div>

      {/* Section 2: Charts Grid (6 Interactive Looker-style charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Jumlah Sanggar per Kecamatan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            Jumlah Sanggar per Kecamatan
          </h4>
          <p className="text-xs text-slate-500 mb-4">Distribusi sebaran sanggar seni di wilayah kabupaten</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sanggarPerKecamatanData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="kecamatan" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="jumlah" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Sanggar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Jenis Sanggar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Proporsi Jenis Sanggar Seni
          </h4>
          <p className="text-xs text-slate-500 mb-4">Kategori cabang seni sanggar terdaftar</p>
          <div className="h-60 w-full flex items-center justify-center">
            {jenisSanggarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jenisSanggarData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {jenisSanggarData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">Tidak ada data untuk filter ini</p>
            )}
          </div>
        </div>

        {/* Chart 3: Jenis Seniman */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            Profesi / Jenis Seniman
          </h4>
          <p className="text-xs text-slate-500 mb-4">Jumlah seniman berdasarkan bidang keahlian</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jenisSenimanData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="jumlah" fill="#10b981" radius={[0, 4, 4, 0]} name="Seniman" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Kondisi Cagar Budaya */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-purple-500" />
            Kondisi Cagar Budaya
          </h4>
          <p className="text-xs text-slate-500 mb-4">Status kelayakan fisik situs & bangunan cagar budaya</p>
          <div className="h-60 w-full flex items-center justify-center">
            {kondisiCagarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kondisiCagarData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {kondisiCagarData.map((entry) => {
                      let color = '#10b981'; // Baik
                      if (entry.name === 'Rusak Ringan') color = '#f59e0b';
                      if (entry.name === 'Rusak Berat') color = '#ef4444';
                      return <Cell key={entry.name} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">Tidak ada data untuk filter ini</p>
            )}
          </div>
        </div>

        {/* Chart 5: Kategori Koleksi Museum */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Package className="w-4 h-4 text-rose-500" />
            Kategori Koleksi Museum
          </h4>
          <p className="text-xs text-slate-500 mb-4">Klasifikasi koleksi inventaris museum daerah</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kategoriKoleksiData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="jumlah" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Koleksi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Pertambahan Data per Tahun */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Grafik Pertambahan Data per Tahun
          </h4>
          <p className="text-xs text-slate-500 mb-4">Tren pendaftaran entitas kebudayaan 2018 - 2024</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tahun" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="sanggar" stroke="#f59e0b" name="Sanggar" strokeWidth={2} />
                <Line type="monotone" dataKey="cagar" stroke="#3b82f6" name="Cagar Budaya" strokeWidth={2} />
                <Line type="monotone" dataKey="koleksi" stroke="#ec4899" name="Koleksi Museum" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
