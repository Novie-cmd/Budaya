import React from 'react';
import { SanggarSeni, Seniman, CagarBudaya, KoleksiMuseum } from '../types';
import { X, MapPin, Award, FileText, QrCode, CheckCircle2, Clock, XCircle, Building2, Users, Landmark, Package } from 'lucide-react';

interface DetailModalsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: unknown;
  itemType: string;
}

export const DetailModals: React.FC<DetailModalsProps> = ({
  isOpen,
  onClose,
  selectedItem,
  itemType,
}) => {
  if (!isOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-4 text-xs text-slate-700">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sanggar Detail View */}
        {itemType === 'Sanggar' && (() => {
          const s = selectedItem as SanggarSeni;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-amber-700">{s.id}</span>
                  <h3 className="text-lg font-bold text-slate-900">{s.namaSanggar}</h3>
                  <p className="text-slate-500">{s.jenisSanggar} | Berdiri Tahun {s.tahunBerdiri}</p>
                </div>
              </div>

              {s.foto && (
                <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100">
                  <img src={s.foto} alt={s.namaSanggar} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium block">Pimpinan Sanggar:</span>
                  <strong className="text-slate-900">{s.namaPimpinan}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Kontak / HP:</span>
                  <strong className="text-slate-900">{s.nomorHp} ({s.email || '-'})</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Lokasi Wilayah:</span>
                  <strong className="text-slate-900">{s.alamat}, {s.desa}, {s.kecamatan}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Koordinat GPS:</span>
                  <strong className="text-slate-900 font-mono">{s.latitude}, {s.longitude}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Jumlah Anggota:</span>
                  <strong className="text-slate-900">{s.jumlahAnggota} Orang</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Status Verifikasi:</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">{s.statusVerifikasi}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Prestasi Sanggar:</span>
                <p className="p-3 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">{s.prestasi || 'Aktif membina kesenian tradisional daerah'}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Dokumen Legalitas:</span>
                <span className="font-mono text-slate-600 bg-slate-100 p-2 rounded block">{s.dokumenLegalitas}</span>
              </div>
            </div>
          );
        })()}

        {/* Seniman Detail View */}
        {itemType === 'Seniman' && (() => {
          const sn = selectedItem as Seniman;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700">{sn.id}</span>
                  <h3 className="text-lg font-bold text-slate-900">{sn.namaLengkap}</h3>
                  <p className="text-slate-500">{sn.jenisSeniman} - {sn.sanggar}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium block">NIK (16 Digit):</span>
                  <strong className="text-slate-900 font-mono">{sn.nik}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Gender & TTL:</span>
                  <strong className="text-slate-900">{sn.jenisKelamin}, {sn.tempatLahir} ({sn.tanggalLahir})</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Keahlian Utama:</span>
                  <strong className="text-slate-900">{sn.keahlian}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Sertifikasi Profesi:</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">{sn.sertifikasi}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Cagar Budaya Detail View */}
        {itemType === 'Cagar' && (() => {
          const c = selectedItem as CagarBudaya;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-blue-700">{c.id}</span>
                  <h3 className="text-lg font-bold text-slate-900">{c.namaCagar}</h3>
                  <p className="text-slate-500">{c.jenisCagar} | Tingkat {c.tingkat}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-medium block">Nomor SK Penetapan:</span>
                  <strong className="text-slate-900 font-mono">{c.nomorSk}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Kondisi & Pengelola:</span>
                  <strong className="text-slate-900">{c.kondisi} | {c.pengelola}</strong>
                </div>
              </div>
              <p className="p-3 bg-blue-50 text-blue-950 rounded-lg">{c.deskripsi}</p>
            </div>
          );
        })()}

        {/* Koleksi Museum Detail View */}
        {itemType === 'Koleksi' && (() => {
          const kl = selectedItem as KoleksiMuseum;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-purple-700">{kl.id}</span>
                  <h3 className="text-lg font-bold text-slate-900">{kl.namaKoleksi}</h3>
                  <p className="text-slate-500">Kategori: {kl.kategori} | No. Inv: {kl.nomorInventaris}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">KODE QR / BARCODE ASSET:</span>
                  <strong className="text-amber-400 text-sm">{kl.barcodeQr}</strong>
                </div>
                <div className="p-2 bg-white text-slate-950 rounded-lg">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
