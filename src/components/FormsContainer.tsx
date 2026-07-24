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
  Role,
} from '../types';
import { generateNextId, validateNik } from '../utils/idGenerator';
import {
  Building2,
  Users,
  Landmark,
  Package,
  Save,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
  Sparkles,
  Link2,
} from 'lucide-react';

interface FormsContainerProps {
  currentRole: Role;
  kecamatanList: MasterKecamatan[];
  desaList: MasterDesa[];
  jenisSanggarList: MasterJenisSanggar[];
  jenisSenimanList: MasterJenisSeniman[];
  kategoriKoleksiList: MasterKategoriKoleksi[];
  sanggarList: SanggarSeni[];
  senimanList: Seniman[];
  cagarList: CagarBudaya[];
  koleksiList: KoleksiMuseum[];
  onAddSanggar: (data: SanggarSeni) => void;
  onAddSeniman: (data: Seniman) => void;
  onAddCagar: (data: CagarBudaya) => void;
  onAddKoleksi: (data: KoleksiMuseum) => void;
  initialActiveForm?: 'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi';
}

export const FormsContainer: React.FC<FormsContainerProps> = ({
  currentRole,
  kecamatanList,
  desaList,
  jenisSanggarList,
  jenisSenimanList,
  kategoriKoleksiList,
  sanggarList,
  senimanList,
  cagarList,
  koleksiList,
  onAddSanggar,
  onAddSeniman,
  onAddCagar,
  onAddKoleksi,
  initialActiveForm = 'Sanggar',
}) => {
  const [activeFormTab, setActiveFormTab] = useState<'Sanggar' | 'Seniman' | 'Cagar' | 'Koleksi'>(initialActiveForm);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States for Sanggar
  const [sanggarForm, setSanggarForm] = useState({
    namaSanggar: '',
    jenisSanggar: jenisSanggarList[0]?.namaJenis || 'Tari',
    tahunBerdiri: 2020,
    namaPimpinan: '',
    nomorHp: '',
    email: '',
    alamat: '',
    kecamatan: kecamatanList[0]?.namaKecamatan || '',
    desa: desaList[0]?.namaDesa || '',
    latitude: -7.9678,
    longitude: 110.6012,
    jumlahAnggota: 20,
    statusAktif: 'Ya' as 'Ya' | 'Tidak',
    prestasi: '',
    foto: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&auto=format&fit=crop&q=80',
    dokumenLegalitas: 'SK Kemenkumham Terdaftar No. 102/2022',
  });

  // Form States for Seniman
  const [senimanForm, setSenimanForm] = useState({
    nik: '3403011508900005',
    namaLengkap: '',
    jenisKelamin: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    tempatLahir: 'Gunungkidul',
    tanggalLahir: '1990-08-15',
    jenisSeniman: jenisSenimanList[0]?.namaJenis || 'Penari',
    keahlian: '',
    sanggar: 'Mandiri',
    nomorHp: '',
    email: '',
    alamat: '',
    kecamatan: kecamatanList[0]?.namaKecamatan || '',
    desa: desaList[0]?.namaDesa || '',
    pendidikan: 'S1 Seni',
    prestasi: '',
    sertifikasi: 'Ya' as 'Ya' | 'Tidak',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  });

  // Form States for Cagar Budaya
  const [cagarForm, setCagarForm] = useState({
    namaCagar: '',
    jenisCagar: 'Bangunan' as 'Benda' | 'Bangunan' | 'Struktur' | 'Situs' | 'Kawasan',
    tingkat: 'Kabupaten' as 'Nasional' | 'Provinsi' | 'Kabupaten',
    tahunPenetapan: 2022,
    nomorSk: 'SK.Bupati/GK/102/2022',
    alamat: '',
    kecamatan: kecamatanList[0]?.namaKecamatan || '',
    desa: desaList[0]?.namaDesa || '',
    latitude: -7.9500,
    longitude: 110.6100,
    kondisi: 'Baik' as 'Baik' | 'Rusak Ringan' | 'Rusak Berat',
    kepemilikan: 'Pemerintah' as 'Pemerintah' | 'Masyarakat',
    pengelola: 'Dinas Kebudayaan',
    deskripsi: '',
    foto: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=500&auto=format&fit=crop&q=80',
    dokumen: 'SK_Penetapan_Cagar.pdf',
  });

  // Form States for Koleksi Museum
  const [koleksiForm, setKoleksiForm] = useState({
    nomorInventaris: 'INV/MUSEUM/ARK/2024/009',
    namaKoleksi: '',
    kategori: kategoriKoleksiList[0]?.namaKategori || 'Arkeologi',
    asalKoleksi: 'Hibah Masyarakat',
    tahunPerolehan: 2024,
    bahan: 'Logam / Perunggu',
    ukuran: '30 cm x 15 cm',
    kondisi: 'Baik' as 'Baik' | 'Cukup' | 'Rusak',
    lokasiPenyimpanan: 'Ruang Pamer Utama',
    nilaiHistoris: 'Benda peninggalan bersejarah',
    deskripsi: '',
    foto: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500&auto=format&fit=crop&q=80',
    barcodeQr: 'QR-KLM-NEW-2024',
  });

  // Handle Sanggar Submit
  const handleSubmitSanggar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sanggarForm.namaSanggar) {
      setErrorMessage('Nama Sanggar wajib diisi!');
      return;
    }
    const nextId = generateNextId('SGR', sanggarList.map((s) => s.id));
    const now = new Date().toISOString().split('T')[0];
    onAddSanggar({
      id: nextId,
      ...sanggarForm,
      statusVerifikasi: 'Menunggu Verifikasi',
      createdAt: now,
      updatedAt: now,
    });
    setSuccessMessage(`Berhasil menyimpan Sanggar Seni baru dengan ID: ${nextId}`);
    setErrorMessage(null);
  };

  // Handle Seniman Submit
  const handleSubmitSeniman = (e: React.FormEvent) => {
    e.preventDefault();
    const nikCheck = validateNik(senimanForm.nik);
    if (!nikCheck.isValid) {
      setErrorMessage(nikCheck.message || 'NIK tidak valid!');
      return;
    }
    if (!senimanForm.namaLengkap) {
      setErrorMessage('Nama Lengkap Seniman wajib diisi!');
      return;
    }
    const nextId = generateNextId('SNM', senimanList.map((s) => s.id));
    const now = new Date().toISOString().split('T')[0];
    onAddSeniman({
      id: nextId,
      ...senimanForm,
      statusVerifikasi: 'Menunggu Verifikasi',
      createdAt: now,
      updatedAt: now,
    });
    setSuccessMessage(`Berhasil menyimpan data Seniman baru dengan ID: ${nextId}`);
    setErrorMessage(null);
  };

  // Handle Cagar Submit
  const handleSubmitCagar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cagarForm.namaCagar) {
      setErrorMessage('Nama Cagar Budaya wajib diisi!');
      return;
    }
    const nextId = generateNextId('CGB', cagarList.map((c) => c.id));
    const now = new Date().toISOString().split('T')[0];
    onAddCagar({
      id: nextId,
      ...cagarForm,
      statusVerifikasi: 'Terverifikasi',
      createdAt: now,
      updatedAt: now,
    });
    setSuccessMessage(`Berhasil menyimpan Cagar Budaya baru dengan ID: ${nextId}`);
    setErrorMessage(null);
  };

  // Handle Koleksi Submit
  const handleSubmitKoleksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!koleksiForm.namaKoleksi) {
      setErrorMessage('Nama Koleksi Museum wajib diisi!');
      return;
    }
    const nextId = generateNextId('KLM', koleksiList.map((k) => k.id));
    const now = new Date().toISOString().split('T')[0];
    onAddKoleksi({
      id: nextId,
      ...koleksiForm,
      barcodeQr: `QR-${nextId}-${koleksiForm.namaKoleksi.toUpperCase().replace(/\s+/g, '-')}`,
      statusVerifikasi: 'Terverifikasi',
      createdAt: now,
      updatedAt: now,
    });
    setSuccessMessage(`Berhasil menyimpan Benda Koleksi Museum baru dengan ID: ${nextId}`);
    setErrorMessage(null);
  };

  const isRestricted = currentRole === 'Pimpinan';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      
      {/* Header Notification */}
      {isRestricted && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Anda saat ini berada dalam mode <strong>Pimpinan (Read-Only)</strong>. Anda dapat melihat struktur formulir, namun pengubahan data disimulasikan melalui Role Administrator/Operator.
          </span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 font-bold hover:underline">
            Tutup
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 p-4 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-700 font-bold hover:underline">
            Tutup
          </button>
        </div>
      )}

      {/* Form Tabs Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveFormTab('Sanggar'); setSuccessMessage(null); setErrorMessage(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeFormTab === 'Sanggar' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>3. Form Sanggar Seni</span>
        </button>

        <button
          onClick={() => { setActiveFormTab('Seniman'); setSuccessMessage(null); setErrorMessage(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeFormTab === 'Seniman' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. Form Seniman</span>
        </button>

        <button
          onClick={() => { setActiveFormTab('Cagar'); setSuccessMessage(null); setErrorMessage(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeFormTab === 'Cagar' ? 'bg-blue-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>5. Form Cagar Budaya</span>
        </button>

        <button
          onClick={() => { setActiveFormTab('Koleksi'); setSuccessMessage(null); setErrorMessage(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeFormTab === 'Koleksi' ? 'bg-purple-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>6. Form Koleksi Museum</span>
        </button>
      </div>

      {/* FORM 1: Sanggar Seni */}
      {activeFormTab === 'Sanggar' && (
        <form onSubmit={handleSubmitSanggar} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Formulir Pendataan Sanggar Seni</h3>
              <p className="text-xs text-slate-500">Isi kelengkapan profil organisasi sanggar seni daerah</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs rounded-lg">
              ID Otomatis: {generateNextId('SGR', sanggarList.map((s) => s.id))}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Sanggar *</label>
              <input
                type="text"
                required
                value={sanggarForm.namaSanggar}
                onChange={(e) => setSanggarForm({ ...sanggarForm, namaSanggar: e.target.value })}
                placeholder="Contoh: Sanggar Tari Sekar Kencana"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Sanggar</label>
              <select
                value={sanggarForm.jenisSanggar}
                onChange={(e) => setSanggarForm({ ...sanggarForm, jenisSanggar: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {jenisSanggarList.map((j) => (
                  <option key={j.id} value={j.namaJenis}>{j.namaJenis}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Berdiri</label>
              <input
                type="number"
                value={sanggarForm.tahunBerdiri}
                onChange={(e) => setSanggarForm({ ...sanggarForm, tahunBerdiri: parseInt(e.target.value) || 2020 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Pimpinan / Ketua</label>
              <input
                type="text"
                value={sanggarForm.namaPimpinan}
                onChange={(e) => setSanggarForm({ ...sanggarForm, namaPimpinan: e.target.value })}
                placeholder="Nama Lengkap Pimpinan"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor HP / WhatsApp</label>
              <input
                type="text"
                value={sanggarForm.nomorHp}
                onChange={(e) => setSanggarForm({ ...sanggarForm, nomorHp: e.target.value })}
                placeholder="0812xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Sanggar</label>
              <input
                type="email"
                value={sanggarForm.email}
                onChange={(e) => setSanggarForm({ ...sanggarForm, email: e.target.value })}
                placeholder="sanggar@domain.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sanggar</label>
              <input
                type="text"
                value={sanggarForm.alamat}
                onChange={(e) => setSanggarForm({ ...sanggarForm, alamat: e.target.value })}
                placeholder="Jl. / RT / RW / Dusun"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
              <select
                value={sanggarForm.kecamatan}
                onChange={(e) => setSanggarForm({ ...sanggarForm, kecamatan: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {kecamatanList.map((k) => (
                  <option key={k.id} value={k.namaKecamatan}>{k.namaKecamatan}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Desa / Kelurahan</label>
              <select
                value={sanggarForm.desa}
                onChange={(e) => setSanggarForm({ ...sanggarForm, desa: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {desaList
                  .filter((d) => !sanggarForm.kecamatan || d.kecamatan === sanggarForm.kecamatan)
                  .map((d) => (
                    <option key={d.id} value={d.namaDesa}>{d.namaDesa}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={sanggarForm.latitude}
                onChange={(e) => setSanggarForm({ ...sanggarForm, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={sanggarForm.longitude}
                onChange={(e) => setSanggarForm({ ...sanggarForm, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jumlah Anggota (Orang)</label>
              <input
                type="number"
                value={sanggarForm.jumlahAnggota}
                onChange={(e) => setSanggarForm({ ...sanggarForm, jumlahAnggota: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Keaktifan Organisasi</label>
              <select
                value={sanggarForm.statusAktif}
                onChange={(e) => setSanggarForm({ ...sanggarForm, statusAktif: e.target.value as 'Ya' | 'Tidak' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Ya">Aktif (Ya)</option>
                <option value="Tidak">Tidak Aktif (Tidak)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Prestasi & Rekam Jejak Kesenian</label>
              <textarea
                rows={2}
                value={sanggarForm.prestasi}
                onChange={(e) => setSanggarForm({ ...sanggarForm, prestasi: e.target.value })}
                placeholder="Penghargaan festival, penampilan daerah, atau tingkat nasional"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Link Foto Dokumentasi</label>
              <input
                type="url"
                value={sanggarForm.foto}
                onChange={(e) => setSanggarForm({ ...sanggarForm, foto: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isRestricted}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Sanggar (Otomatis ke Database Sheet)</span>
            </button>
          </div>
        </form>
      )}

      {/* FORM 2: Seniman */}
      {activeFormTab === 'Seniman' && (
        <form onSubmit={handleSubmitSeniman} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Formulir Pendataan Seniman & Budayawan</h3>
              <p className="text-xs text-slate-500">Pendataan NIK, bidang keahlian, dan sanggar naungan</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-bold text-xs rounded-lg">
              ID Otomatis: {generateNextId('SNM', senimanList.map((s) => s.id))}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit) *</label>
              <input
                type="text"
                maxLength={16}
                required
                value={senimanForm.nik}
                onChange={(e) => setSenimanForm({ ...senimanForm, nik: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={senimanForm.namaLengkap}
                onChange={(e) => setSenimanForm({ ...senimanForm, namaLengkap: e.target.value })}
                placeholder="Gelar & Nama Lengkap"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
              <select
                value={senimanForm.jenisKelamin}
                onChange={(e) => setSenimanForm({ ...senimanForm, jenisKelamin: e.target.value as 'Laki-laki' | 'Perempuan' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Seniman</label>
              <select
                value={senimanForm.jenisSeniman}
                onChange={(e) => setSenimanForm({ ...senimanForm, jenisSeniman: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {jenisSenimanList.map((j) => (
                  <option key={j.id} value={j.namaJenis}>{j.namaJenis}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                type="date"
                value={senimanForm.tanggalLahir}
                onChange={(e) => setSenimanForm({ ...senimanForm, tanggalLahir: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sanggar Naungan</label>
              <select
                value={senimanForm.sanggar}
                onChange={(e) => setSenimanForm({ ...senimanForm, sanggar: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Mandiri">Mandiri (Independen)</option>
                {sanggarList.map((s) => (
                  <option key={s.id} value={s.namaSanggar}>{s.namaSanggar}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Spesialisasi / Keahlian Utama</label>
              <input
                type="text"
                value={senimanForm.keahlian}
                onChange={(e) => setSenimanForm({ ...senimanForm, keahlian: e.target.value })}
                placeholder="Contoh: Penata Tari Klasik, Pengendhang Campursari"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sertifikasi Profesi Seni</label>
              <select
                value={senimanForm.sertifikasi}
                onChange={(e) => setSenimanForm({ ...senimanForm, sertifikasi: e.target.value as 'Ya' | 'Tidak' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Ya">Tersertifikasi (Ya)</option>
                <option value="Tidak">Belum Sertifikasi (Tidak)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
              <select
                value={senimanForm.kecamatan}
                onChange={(e) => setSenimanForm({ ...senimanForm, kecamatan: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {kecamatanList.map((k) => (
                  <option key={k.id} value={k.namaKecamatan}>{k.namaKecamatan}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isRestricted}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Seniman</span>
            </button>
          </div>
        </form>
      )}

      {/* FORM 3: Cagar Budaya */}
      {activeFormTab === 'Cagar' && (
        <form onSubmit={handleSubmitCagar} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Formulir Inventarisasi Cagar Budaya</h3>
              <p className="text-xs text-slate-500">Pendataan situs, cagar budaya, dan nomor SK Penetapan</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold text-xs rounded-lg">
              ID Otomatis: {generateNextId('CGB', cagarList.map((c) => c.id))}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Cagar Budaya *</label>
              <input
                type="text"
                required
                value={cagarForm.namaCagar}
                onChange={(e) => setCagarForm({ ...cagarForm, namaCagar: e.target.value })}
                placeholder="Contoh: Candi Risan / Gua Braholo"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Cagar</label>
              <select
                value={cagarForm.jenisCagar}
                onChange={(e) => setCagarForm({ ...cagarForm, jenisCagar: e.target.value as unknown as typeof cagarForm.jenisCagar })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Benda">Benda</option>
                <option value="Bangunan">Bangunan</option>
                <option value="Struktur">Struktur</option>
                <option value="Situs">Situs</option>
                <option value="Kawasan">Kawasan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tingkat Penetapan SK</label>
              <select
                value={cagarForm.tingkat}
                onChange={(e) => setCagarForm({ ...cagarForm, tingkat: e.target.value as 'Nasional' | 'Provinsi' | 'Kabupaten' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Nasional">Nasional</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Kabupaten">Kabupaten</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor SK Penetapan</label>
              <input
                type="text"
                value={cagarForm.nomorSk}
                onChange={(e) => setCagarForm({ ...cagarForm, nomorSk: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kondisi Fisik</label>
              <select
                value={cagarForm.kondisi}
                onChange={(e) => setCagarForm({ ...cagarForm, kondisi: e.target.value as 'Baik' | 'Rusak Ringan' | 'Rusak Berat' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kepemilikan</label>
              <select
                value={cagarForm.kepemilikan}
                onChange={(e) => setCagarForm({ ...cagarForm, kepemilikan: e.target.value as 'Pemerintah' | 'Masyarakat' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Pemerintah">Pemerintah</option>
                <option value="Masyarakat">Masyarakat</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat Nilai Cagar Budaya</label>
              <textarea
                rows={2}
                value={cagarForm.deskripsi}
                onChange={(e) => setCagarForm({ ...cagarForm, deskripsi: e.target.value })}
                placeholder="Latar belakang sejarah dan keunikan arsitektur"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isRestricted}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Cagar Budaya</span>
            </button>
          </div>
        </form>
      )}

      {/* FORM 4: Koleksi Museum */}
      {activeFormTab === 'Koleksi' && (
        <form onSubmit={handleSubmitKoleksi} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Formulir Inventaris Benda Koleksi Museum</h3>
              <p className="text-xs text-slate-500">Pencatatan nomor inventaris, kategori, dan QR Barcode</p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-900 border border-purple-300 font-mono font-bold text-xs rounded-lg">
              ID Otomatis: {generateNextId('KLM', koleksiList.map((k) => k.id))}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Inventaris *</label>
              <input
                type="text"
                required
                value={koleksiForm.nomorInventaris}
                onChange={(e) => setKoleksiForm({ ...koleksiForm, nomorInventaris: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Koleksi *</label>
              <input
                type="text"
                required
                value={koleksiForm.namaKoleksi}
                onChange={(e) => setKoleksiForm({ ...koleksiForm, namaKoleksi: e.target.value })}
                placeholder="Contoh: Keris Mataram Luk 9"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori Koleksi</label>
              <select
                value={koleksiForm.kategori}
                onChange={(e) => setKoleksiForm({ ...koleksiForm, kategori: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                {kategoriKoleksiList.map((k) => (
                  <option key={k.id} value={k.namaKategori}>{k.namaKategori}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi Penyimpanan</label>
              <input
                type="text"
                value={koleksiForm.lokasiPenyimpanan}
                onChange={(e) => setKoleksiForm({ ...koleksiForm, lokasiPenyimpanan: e.target.value })}
                placeholder="Ruang Pamer A / Etalase 3"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bahan Pembuatan</label>
              <input
                type="text"
                value={koleksiForm.bahan}
                onChange={(e) => setKoleksiForm({ ...koleksiForm, bahan: e.target.value })}
                placeholder="Perunggu, Besi, Porselen"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kondisi Barang</label>
              <select
                value={koleksiForm.kondisi}
                onChange={(e) => setKoleksiForm({ ...koleksiForm, kondisi: e.target.value as 'Baik' | 'Cukup' | 'Rusak' })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="Baik">Baik</option>
                <option value="Cukup">Cukup</option>
                <option value="Rusak">Rusak</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isRestricted}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Koleksi Museum</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
