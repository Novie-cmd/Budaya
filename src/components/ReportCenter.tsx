import React, { useState } from 'react';
import {
  SanggarSeni,
  Seniman,
  CagarBudaya,
  KoleksiMuseum,
  MasterKecamatan,
} from '../types';
import { triggerPrintReport, exportToExcel } from '../utils/spreadsheetExport';
import { Printer, FileSpreadsheet, FileText, Download, CheckCircle2, Building2, Users, Landmark, Package } from 'lucide-react';

interface ReportCenterProps {
  sanggarList: SanggarSeni[];
  senimanList: Seniman[];
  cagarList: CagarBudaya[];
  koleksiList: KoleksiMuseum[];
  kecamatanList: MasterKecamatan[];
}

export const ReportCenter: React.FC<ReportCenterProps> = ({
  sanggarList,
  senimanList,
  cagarList,
  koleksiList,
  kecamatanList,
}) => {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('Semua');

  // Print Handlers for each required report format
  const handlePrintSanggarReport = () => {
    const data = selectedKecamatan === 'Semua' ? sanggarList : sanggarList.filter(s => s.kecamatan === selectedKecamatan);
    const tableRows = data.map((s, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td><strong>${s.id}</strong></td>
        <td>${s.namaSanggar}</td>
        <td>${s.jenisSanggar}</td>
        <td>${s.tahunBerdiri}</td>
        <td>${s.namaPimpinan}</td>
        <td>${s.kecamatan}, ${s.desa}</td>
        <td style="text-align:center;">${s.jumlahAnggota} Org</td>
        <td>${s.statusVerifikasi}</td>
      </tr>
    `).join('');

    const html = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID Sanggar</th>
            <th>Nama Sanggar Seni</th>
            <th>Jenis</th>
            <th>Berdiri</th>
            <th>Pimpinan</th>
            <th>Wilayah</th>
            <th>Anggota</th>
            <th>Verifikasi</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
    triggerPrintReport(`LAPORAN PENDATAAN SANGGAR SENI ${selectedKecamatan.toUpperCase()}`, html);
  };

  const handlePrintSenimanReport = () => {
    const data = selectedKecamatan === 'Semua' ? senimanList : senimanList.filter(s => s.kecamatan === selectedKecamatan);
    const tableRows = data.map((sn, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td><strong>${sn.id}</strong></td>
        <td>${sn.nik}</td>
        <td>${sn.namaLengkap}</td>
        <td>${sn.jenisSeniman}</td>
        <td>${sn.sanggar}</td>
        <td>${sn.kecamatan}, ${sn.desa}</td>
        <td style="text-align:center;">${sn.sertifikasi}</td>
      </tr>
    `).join('');

    const html = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID Seniman</th>
            <th>NIK</th>
            <th>Nama Lengkap</th>
            <th>Jenis Seniman</th>
            <th>Sanggar Naungan</th>
            <th>Wilayah</th>
            <th>Sertifikasi</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
    triggerPrintReport(`LAPORAN PENDATAAN SENIMAN & BUDAYAWAN`, html);
  };

  const handlePrintCagarReport = () => {
    const data = selectedKecamatan === 'Semua' ? cagarList : cagarList.filter(c => c.kecamatan === selectedKecamatan);
    const tableRows = data.map((c, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td><strong>${c.id}</strong></td>
        <td>${c.namaCagar}</td>
        <td>${c.jenisCagar}</td>
        <td>${c.tingkat}</td>
        <td>${c.nomorSk}</td>
        <td>${c.kecamatan}, ${c.desa}</td>
        <td>${c.kondisi}</td>
        <td>${c.pengelola}</td>
      </tr>
    `).join('');

    const html = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID Cagar</th>
            <th>Nama Cagar Budaya</th>
            <th>Jenis</th>
            <th>Tingkat SK</th>
            <th>Nomor SK</th>
            <th>Wilayah</th>
            <th>Kondisi</th>
            <th>Pengelola</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
    triggerPrintReport(`LAPORAN INVENTARISASI CAGAR BUDAYA`, html);
  };

  const handlePrintMuseumReport = () => {
    const tableRows = koleksiList.map((kl, idx) => `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td><strong>${kl.nomorInventaris}</strong></td>
        <td>${kl.namaKoleksi}</td>
        <td>${kl.kategori}</td>
        <td>${kl.asalKoleksi}</td>
        <td>${kl.kondisi}</td>
        <td>${kl.lokasiPenyimpanan}</td>
        <td>${kl.barcodeQr}</td>
      </tr>
    `).join('');

    const html = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>No. Inventaris</th>
            <th>Nama Koleksi Museum</th>
            <th>Kategori</th>
            <th>Asal Koleksi</th>
            <th>Kondisi</th>
            <th>Lokasi Simpan</th>
            <th>Kode QR</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
    triggerPrintReport(`LAPORAN INVENTARIS BENDA KOLEKSI MUSEUM`, html);
  };

  const handlePrintRekapKecamatan = () => {
    const tableRows = kecamatanList.map((k, idx) => {
      const sanggarCount = sanggarList.filter(s => s.kecamatan === k.namaKecamatan).length;
      const senimanCount = senimanList.filter(s => s.kecamatan === k.namaKecamatan).length;
      const cagarCount = cagarList.filter(c => c.kecamatan === k.namaKecamatan).length;
      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><strong>${k.namaKecamatan}</strong></td>
          <td style="text-align:center;">${sanggarCount}</td>
          <td style="text-align:center;">${senimanCount}</td>
          <td style="text-align:center;">${cagarCount}</td>
          <td style="text-align:center;"><strong>${sanggarCount + senimanCount + cagarCount}</strong></td>
        </tr>
      `;
    }).join('');

    const html = `
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kecamatan</th>
            <th>Jumlah Sanggar</th>
            <th>Jumlah Seniman</th>
            <th>Jumlah Cagar Budaya</th>
            <th>Total Entitas</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
    triggerPrintReport(`REKAPITULASI PENDATAAN KEBUDAYAAN PER KECAMATAN`, html);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 text-rose-800 rounded-xl">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Pusat Laporan & Cetak Kebudayaan</h2>
            <p className="text-xs text-slate-500">Cetak laporan resmi berformat Kop Surat Dinas Kebudayaan (PDF, Excel, & Print)</p>
          </div>
        </div>

        {/* Filter Kecamatan selector */}
        <div className="flex items-center gap-2 text-xs">
          <label className="font-semibold text-slate-700">Filter Wilayah Laporan:</label>
          <select
            value={selectedKecamatan}
            onChange={(e) => setSelectedKecamatan(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-800"
          >
            <option value="Semua">Semua Kecamatan</option>
            {kecamatanList.map((k) => (
              <option key={k.id} value={k.namaKecamatan}>{k.namaKecamatan}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Data Sanggar Seni */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">1. Laporan Sanggar Seni</h3>
              <p className="text-[11px] text-slate-500">{sanggarList.length} sanggar terdaftar</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Laporan profil sanggar seni, pimpinan, nomor HP, dan keanggotaan</p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handlePrintSanggarReport}
              className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak PDF / Print
            </button>
            <button
              onClick={() => exportToExcel([{ sheetName: 'Sanggar Seni', data: sanggarList as unknown as Record<string, unknown>[] }], 'Laporan_Sanggar')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300"
              title="Ekspor Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Card 2: Data Seniman */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">2. Laporan Seniman</h3>
              <p className="text-[11px] text-slate-500">{senimanList.length} seniman terdata</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Daftar NIK seniman, profesi, keahlian, sanggar, dan status sertifikasi</p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handlePrintSenimanReport}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak PDF / Print
            </button>
            <button
              onClick={() => exportToExcel([{ sheetName: 'Seniman', data: senimanList as unknown as Record<string, unknown>[] }], 'Laporan_Seniman')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300"
              title="Ekspor Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Card 3: Data Cagar Budaya */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">3. Laporan Cagar Budaya</h3>
              <p className="text-[11px] text-slate-500">{cagarList.length} situs cagar budaya</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Inventarisasi situs, bangunan, nomor SK penetapan, dan pengelola</p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handlePrintCagarReport}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak PDF / Print
            </button>
            <button
              onClick={() => exportToExcel([{ sheetName: 'Cagar Budaya', data: cagarList as unknown as Record<string, unknown>[] }], 'Laporan_Cagar')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300"
              title="Ekspor Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Card 4: Data Koleksi Museum */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">4. Laporan Koleksi Museum</h3>
              <p className="text-[11px] text-slate-500">{koleksiList.length} benda inventaris</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Inventaris nomor registrasi, asal, lokasi penyimpanan, dan barcode QR</p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handlePrintMuseumReport}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak PDF / Print
            </button>
            <button
              onClick={() => exportToExcel([{ sheetName: 'Koleksi Museum', data: koleksiList as unknown as Record<string, unknown>[] }], 'Laporan_Museum')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300"
              title="Ekspor Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Card 5: Rekap Kecamatan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">5. Rekap Wilayah Kecamatan</h3>
              <p className="text-[11px] text-slate-500">Matriks perbandingan entitas</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Matriks rekapitulasi jumlah sanggar, seniman, dan cagar budaya per kecamatan</p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handlePrintRekapKecamatan}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Rekap
            </button>
          </div>
        </div>

        {/* Card 6: Rekap Tahunan & Statistik */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">6 & 7. Buku Statistik Kebudayaan</h3>
              <p className="text-[11px] text-slate-500">Ekspor Laporan Komprehensif</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">Seluruh database kebudayaan digabung ke dalam satu dokumen Excel Multi-Sheet</p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => exportToExcel([
                { sheetName: 'Sanggar', data: sanggarList as unknown as Record<string, unknown>[] },
                { sheetName: 'Seniman', data: senimanList as unknown as Record<string, unknown>[] },
                { sheetName: 'Cagar Budaya', data: cagarList as unknown as Record<string, unknown>[] },
                { sheetName: 'Museum', data: koleksiList as unknown as Record<string, unknown>[] },
              ], 'Buku_Statistik_Kebudayaan_Kabupaten')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Download Buku Statistik (.XLSX)
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
