export type Role = 'Administrator' | 'Operator Bidang' | 'Verifikator' | 'Pimpinan';

export type VerificationStatus = 'Terverifikasi' | 'Menunggu Verifikasi' | 'Ditolak';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  jabatan: string;
  nip?: string;
  lastLogin: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  role: Role;
  action: string;
  entity: 'Sanggar' | 'Seniman' | 'Cagar Budaya' | 'Koleksi Museum' | 'Master Data' | 'Sistem';
  details: string;
}

// Master Data Types
export interface MasterKecamatan {
  id: string;
  namaKecamatan: string;
  kodeWilayah?: string;
}

export interface MasterDesa {
  id: string;
  kecamatan: string;
  namaDesa: string;
}

export interface MasterJenisSanggar {
  id: string;
  namaJenis: string;
  keterangan?: string;
}

export interface MasterJenisSeniman {
  id: string;
  namaJenis: string;
  keterangan?: string;
}

export interface MasterKategoriKoleksi {
  id: string;
  namaKategori: string;
  keterangan?: string;
}

// Cultural Entity Types
export interface SanggarSeni {
  id: string; // e.g. SGR-001
  namaSanggar: string;
  jenisSanggar: string;
  tahunBerdiri: number;
  namaPimpinan: string;
  nomorHp: string;
  email: string;
  alamat: string;
  kecamatan: string;
  desa: string;
  latitude: number;
  longitude: number;
  jumlahAnggota: number;
  statusAktif: 'Ya' | 'Tidak';
  prestasi: string;
  foto: string;
  dokumenLegalitas: string;
  statusVerifikasi: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Seniman {
  id: string; // e.g. SNM-001
  nik: string;
  namaLengkap: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  jenisSeniman: string;
  keahlian: string;
  sanggar: string; // ID / Nama Sanggar or Mandiri
  nomorHp: string;
  email: string;
  alamat: string;
  kecamatan: string;
  desa: string;
  pendidikan: string;
  prestasi: string;
  sertifikasi: 'Ya' | 'Tidak';
  foto: string;
  statusVerifikasi: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CagarBudaya {
  id: string; // e.g. CGB-001
  namaCagar: string;
  jenisCagar: 'Benda' | 'Bangunan' | 'Struktur' | 'Situs' | 'Kawasan' | 'Candi';
  tingkat: 'Nasional' | 'Provinsi' | 'Kabupaten';
  tahunPenetapan: number;
  nomorSk: string;
  alamat: string;
  kecamatan: string;
  desa: string;
  latitude: number;
  longitude: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  kepemilikan: 'Pemerintah' | 'Masyarakat' | 'Masyarakat Adat' | 'Swasta';
  pengelola: string;
  deskripsi: string;
  foto: string;
  dokumen: string;
  statusVerifikasi: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface KoleksiMuseum {
  id: string; // e.g. KLM-001
  nomorInventaris: string;
  namaKoleksi: string;
  kategori: string; // Arkeologi, Etnografi, Numismatik, etc.
  asalKoleksi: string;
  tahunPerolehan: number;
  bahan: string;
  ukuran: string;
  kondisi: 'Baik' | 'Cukup' | 'Rusak';
  lokasiPenyimpanan: string;
  nilaiHistoris: string;
  deskripsi: string;
  foto: string;
  barcodeQr: string;
  statusVerifikasi: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

// Global Filter Interface
export interface CulturalFilters {
  kecamatan: string;
  desa: string;
  tahun: string;
  jenisData: string; // 'Semua' | 'Sanggar' | 'Seniman' | 'Cagar Budaya' | 'Koleksi'
  statusVerifikasi: string; // 'Semua' | 'Terverifikasi' | 'Menunggu Verifikasi' | 'Ditolak'
  searchQuery: string;
}
