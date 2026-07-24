import React, { useState } from 'react';
import { SanggarSeni, Seniman, CagarBudaya, KoleksiMuseum } from '../types';
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
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Building2,
  Users,
  Landmark,
  Package,
  Award,
  BarChart2,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  sanggarList: SanggarSeni[];
  senimanList: Seniman[];
  cagarList: CagarBudaya[];
  koleksiList: KoleksiMuseum[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  sanggarList,
  senimanList,
  cagarList,
  koleksiList,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sanggar' | 'seniman' | 'cagar' | 'museum'>('sanggar');

  // Colors
  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

  // Calculations for Sanggar
  const sanggarAktifCount = sanggarList.filter((s) => s.statusAktif === 'Ya').length;
  const totalAnggotaSanggar = sanggarList.reduce((acc, s) => acc + (s.jumlahAnggota || 0), 0);
  const avgAnggota = sanggarList.length > 0 ? Math.round(totalAnggotaSanggar / sanggarList.length) : 0;

  // Calculations for Seniman
  const totalSeniman = senimanList.length;
  const certifiedSenimanCount = senimanList.filter((sn) => sn.sertifikasi === 'Ya').length;
  
  // Age distribution for Seniman
  const currentYear = new Date().getFullYear();
  let under30 = 0,
    age30to50 = 0,
    above50 = 0;
  senimanList.forEach((sn) => {
    if (sn.tanggalLahir) {
      const birthYear = new Date(sn.tanggalLahir).getFullYear();
      const age = currentYear - birthYear;
      if (age < 30) under30++;
      else if (age <= 50) age30to50++;
      else above50++;
    }
  });
  const ageData = [
    { name: '< 30 Tahun (Muda)', value: under30 },
    { name: '30 - 50 Tahun (Produktif)', value: age30to50 },
    { name: '> 50 Tahun (Maestro)', value: above50 },
  ];

  // Cagar Budaya Penetapan
  const tingkatCagarMap: Record<string, number> = {};
  cagarList.forEach((c) => {
    tingkatCagarMap[c.tingkat] = (tingkatCagarMap[c.tingkat] || 0) + 1;
  });
  const tingkatCagarData = Object.keys(tingkatCagarMap).map((t) => ({ name: t, value: tingkatCagarMap[t] }));

  // Museum Condition
  const kondisiMuseumMap: Record<string, number> = {};
  koleksiList.forEach((k) => {
    kondisiMuseumMap[k.kondisi] = (kondisiMuseumMap[k.kondisi] || 0) + 1;
  });
  const kondisiMuseumData = Object.keys(kondisiMuseumMap).map((k) => ({ name: k, value: kondisiMuseumMap[k] }));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Sub-tab Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-800">Analitik Kebudayaan Deep-Dive</h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('sanggar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'sanggar' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Sanggar Seni
          </button>
          <button
            onClick={() => setActiveSubTab('seniman')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'seniman' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Seniman
          </button>
          <button
            onClick={() => setActiveSubTab('cagar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'cagar' ? 'bg-blue-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            Cagar Budaya
          </button>
          <button
            onClick={() => setActiveSubTab('museum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeSubTab === 'museum' ? 'bg-purple-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Museum
          </button>
        </div>
      </div>

      {/* Tab 1: Sanggar Seni Analytics */}
      {activeSubTab === 'sanggar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-amber-800">Jumlah Sanggar Aktif</span>
              <h3 className="text-3xl font-bold text-amber-950 mt-1">{sanggarAktifCount} / {sanggarList.length}</h3>
              <p className="text-xs text-amber-700 mt-1">Status Keaktifan Organisasi</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-emerald-800">Total Anggota Terdaftar</span>
              <h3 className="text-3xl font-bold text-emerald-950 mt-1">{totalAnggotaSanggar} Org</h3>
              <p className="text-xs text-emerald-700 mt-1">Siswa & Pengurus Sanggar</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-blue-800">Rata-rata Anggota / Sanggar</span>
              <h3 className="text-3xl font-bold text-blue-950 mt-1">{avgAnggota} Org</h3>
              <p className="text-xs text-blue-700 mt-1">Kapasitas Organisasi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Daftar Sanggar Teraktif & Prestasi</h4>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {sanggarList.map((s) => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800">{s.namaSanggar}</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                        {s.jenisSanggar}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">Pimpinan: {s.namaPimpinan} | {s.jumlahAnggota} Anggota</p>
                    <p className="text-emerald-700 text-[11px] mt-0.5 font-medium flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600" />
                      {s.prestasi || 'Aktif membina seni tradisional'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Sebaran Sanggar Berdasarkan Kecamatan</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sanggarList.map((s) => ({ name: s.kecamatan, value: 1 }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {sanggarList.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Seniman Analytics */}
      {activeSubTab === 'seniman' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-emerald-800">Total Seniman Terdata</span>
              <h3 className="text-3xl font-bold text-emerald-950 mt-1">{totalSeniman} Orang</h3>
              <p className="text-xs text-emerald-700 mt-1">Terverifikasi di database</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-blue-800">Seniman Tersertifikasi</span>
              <h3 className="text-3xl font-bold text-blue-950 mt-1">{certifiedSenimanCount} Orang</h3>
              <p className="text-xs text-blue-700 mt-1">Memiliki Sertifikat Profesi Seni</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-purple-800">Rasio Gender Seniman</span>
              <h3 className="text-xl font-bold text-purple-950 mt-1">
                L: {senimanList.filter((s) => s.jenisKelamin === 'Laki-laki').length} | P: {senimanList.filter((s) => s.jenisKelamin === 'Perempuan').length}
              </h3>
              <p className="text-xs text-purple-700 mt-1">Proporsi Gender Praktisi Seni</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Demografi Umur Seniman</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      <Cell fill="#10b981" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Distribusi Seniman per Sanggar</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
                {senimanList.map((sn) => (
                  <div key={sn.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">{sn.namaLengkap}</div>
                      <div className="text-slate-500 text-[11px]">{sn.jenisSeniman} - {sn.sanggar}</div>
                    </div>
                    {sn.sertifikasi === 'Ya' ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Sertifikasi
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px]">Non-Sertifikat</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cagar Budaya Analytics */}
      {activeSubTab === 'cagar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Tingkat Penetapan SK Cagar Budaya</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tingkatCagarData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Status Kepemilikan & Pengelola</h4>
              <div className="space-y-3">
                {cagarList.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{c.namaCagar}</span>
                      <span className="text-blue-600">{c.tingkat}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-1">
                      SK: {c.nomorSk} | Kepemilikan: {c.kepemilikan}
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Pengelola: <strong>{c.pengelola}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Museum Analytics */}
      {activeSubTab === 'museum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-purple-800">Total Koleksi Inventaris</span>
              <h3 className="text-3xl font-bold text-purple-950 mt-1">{koleksiList.length} Unit</h3>
              <p className="text-xs text-purple-700 mt-1">Memiliki QR Code & Barcode</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-emerald-800">Koleksi Kondisi Baik</span>
              <h3 className="text-3xl font-bold text-emerald-950 mt-1">
                {koleksiList.filter((k) => k.kondisi === 'Baik').length} Unit
              </h3>
              <p className="text-xs text-emerald-700 mt-1">Siap untuk pameran publik</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-amber-800">Lokasi Penyimpanan</span>
              <h3 className="text-3xl font-bold text-amber-950 mt-1">
                {Array.from(new Set(koleksiList.map((k) => k.lokasiPenyimpanan))).length} Ruang
              </h3>
              <p className="text-xs text-amber-700 mt-1">Gudang & Ruang Pamer Museum</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Kondisi Koleksi Museum</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={kondisiMuseumData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Barcode / QR Code Inventory Preview</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
                {koleksiList.map((kl) => (
                  <div key={kl.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{kl.namaKoleksi}</div>
                      <div className="text-slate-500 text-[11px]">No Inv: {kl.nomorInventaris}</div>
                    </div>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-300 font-mono text-[10px] text-slate-700">
                      <QrCode className="w-4 h-4 text-slate-900" />
                      <span>{kl.barcodeQr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
