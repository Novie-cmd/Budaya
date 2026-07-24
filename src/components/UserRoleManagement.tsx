import React, { useState } from 'react';
import { User, Role } from '../types';
import { Shield, UserCheck, Lock, CheckCircle2, AlertCircle, Plus, Users } from 'lucide-react';

interface UserRoleManagementProps {
  currentUser: User;
  userList: User[];
  onRoleChange: (newRole: Role) => void;
  onAddUser: (newUser: User) => void;
}

export const UserRoleManagement: React.FC<UserRoleManagementProps> = ({
  currentUser,
  userList,
  onRoleChange,
  onAddUser,
}) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('Operator Bidang');
  const [newUserJabatan, setNewUserJabatan] = useState('Staf Pendataan Kebudayaan');

  const roleMatrix: { role: Role; color: string; desc: string; permissions: string[] }[] = [
    {
      role: 'Administrator',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: 'Akses penuh kelola seluruh data, pengguna, master data, dan pengaturan sistem.',
      permissions: ['Kelola Seluruh Data', 'Tambah/Hapus Pengguna', 'Verifikasi Data', 'Ekspor & Cetak Laporan', 'Pengaturan Master Data'],
    },
    {
      role: 'Operator Bidang',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      desc: 'Input, ubah, dan hapus data kebudayaan (Sanggar, Seniman, Cagar, Museum).',
      permissions: ['Tambah Data Kebudayaan', 'Ubah Data Kebudayaan', 'Hapus Data Kebudayaan', 'Kelola Master Data', 'Ekspor Laporan'],
    },
    {
      role: 'Verifikator',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'Memeriksa, memvalidasi, serta menyetujui atau menolak data kebudayaan yang masuk.',
      permissions: ['Verifikasi Data Menunggu', 'Validasi Kelengkapan NIK/SK', 'Memberi Status Ditolak/Disetujui', 'Melihat Dashboard & Laporan'],
    },
    {
      role: 'Pimpinan',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Akses eksekutif untuk melihat dashboard analitik, rekapitulasi, dan mencetak laporan.',
      permissions: ['Lihat Dashboard Executive', 'Lihat Analitik Deep-Dive', 'Cetak Laporan PDF & Excel', 'Mode Read-Only Aman'],
    },
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const newUser: User = {
      id: `USR-0${userList.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      jabatan: newUserJabatan,
      lastLogin: 'Baru Saja',
      status: 'Aktif',
    };
    onAddUser(newUser);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Manajemen Hak Akses Pengguna (Role Security)</h2>
            <p className="text-xs text-slate-500">Matriks hak akses 4 Role Pengguna: Administrator, Operator Bidang, Verifikator, & Pimpinan</p>
          </div>
        </div>

        {/* Quick Role Switcher Banner */}
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 flex items-center gap-3 text-xs">
          <span className="text-slate-400">Pilih Role Simulasi:</span>
          <select
            value={currentUser.role}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg focus:outline-none cursor-pointer"
          >
            <option value="Administrator">Administrator</option>
            <option value="Operator Bidang">Operator Bidang</option>
            <option value="Verifikator">Verifikator</option>
            <option value="Pimpinan">Pimpinan</option>
          </select>
        </div>
      </div>

      {/* Role Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roleMatrix.map((rm) => (
          <div key={rm.role} className={`rounded-xl p-5 border shadow-sm ${rm.color} bg-opacity-30`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm uppercase tracking-wide">{rm.role}</span>
              {currentUser.role === rm.role && (
                <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-bold text-[10px]">
                  ROLE AKTIF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 mt-2">{rm.desc}</p>
            <div className="mt-4 pt-3 border-t border-slate-300/60 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Cakupan Izin:</span>
              {rm.permissions.map((p, idx) => (
                <div key={idx} className="text-[11px] text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Table Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-sm text-slate-800">Daftar Akun Pengguna Terdaftar (Sheet Pengguna)</h3>
          </div>
          {currentUser.role === 'Administrator' && (
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Akun Pengguna</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nama Lengkap</th>
                <th className="p-3">Email Akun</th>
                <th className="p-3">Role Akses</th>
                <th className="p-3">Jabatan & NIP</th>
                <th className="p-3">Login Terakhir</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-700">{u.id}</td>
                  <td className="p-3 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3 text-blue-600 font-mono">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <div>{u.jabatan}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.nip || 'Non-PNS'}</div>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{u.lastLogin}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-2">
              Tambah Pengguna Baru
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Role Akses</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Operator Bidang">Operator Bidang</option>
                  <option value="Verifikator">Verifikator</option>
                  <option value="Pimpinan">Pimpinan</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Jabatan / Unit Kerja</label>
                <input
                  type="text"
                  value={newUserJabatan}
                  onChange={(e) => setNewUserJabatan(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
