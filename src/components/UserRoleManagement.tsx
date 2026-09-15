import React, { useState } from 'react';
import { User, Role } from '../types';
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Pencil,
  Trash2,
  AlertTriangle,
  Search,
  Check,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';

interface UserRoleManagementProps {
  currentUser: User;
  userList: User[];
  onRoleChange: (newRole: Role) => void;
  onAddUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserRoleManagement: React.FC<UserRoleManagementProps> = ({
  currentUser,
  userList,
  onRoleChange,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('Operator Bidang');
  const [newUserJabatan, setNewUserJabatan] = useState('Staf Pendataan Kebudayaan');
  const [newUserNip, setNewUserNip] = useState('');
  const [newUserStatus, setNewUserStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Edit User State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<Role>('Operator Bidang');
  const [editJabatan, setEditJabatan] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editStatus, setEditStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Delete User State
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Search & Toast State
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const roleMatrix: { role: Role; color: string; desc: string; permissions: string[] }[] = [
    {
      role: 'Administrator',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: 'Akses penuh kelola seluruh data, pengguna, master data, dan pengaturan sistem.',
      permissions: ['Kelola Seluruh Data', 'Tambah/Edit/Hapus Pengguna', 'Verifikasi Data', 'Ekspor & Cetak Laporan', 'Pengaturan Master Data'],
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

  // Handler: Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newUser: User = {
      id: `USR-0${userList.length + 1}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      jabatan: newUserJabatan.trim(),
      nip: newUserNip.trim() || undefined,
      lastLogin: 'Belum Pernah',
      status: newUserStatus,
    };
    onAddUser(newUser);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserNip('');
    setNewUserJabatan('Staf Pendataan Kebudayaan');
    setNewUserRole('Operator Bidang');
    setNewUserStatus('Aktif');
    showToast(`Akun pengguna ${newUser.name} berhasil ditambahkan.`);
  };

  // Handler: Open Edit Modal
  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditJabatan(u.jabatan);
    setEditNip(u.nip || '');
    setEditStatus(u.status);
  };

  // Handler: Save Edit User
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim() || !editEmail.trim()) return;

    const updated: User = {
      ...editingUser,
      name: editName.trim(),
      email: editEmail.trim(),
      role: editRole,
      jabatan: editJabatan.trim(),
      nip: editNip.trim() || undefined,
      status: editStatus,
    };

    onUpdateUser(updated);
    showToast(`Akun ${updated.name} berhasil diperbarui.`);
    setEditingUser(null);
  };

  // Handler: Confirm Delete User
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    const deletedName = deletingUser.name;
    onDeleteUser(deletingUser.id);
    setDeletingUser(null);
    showToast(`Akun pengguna ${deletedName} telah dihapus.`);
  };

  // Check delete constraints
  const isDeletingSelf = deletingUser ? deletingUser.id === currentUser.id : false;
  const isOnlyAdmin =
    deletingUser &&
    deletingUser.role === 'Administrator' &&
    userList.filter((u) => u.role === 'Administrator').length <= 1;

  // Filter user list
  const filteredUsers = userList.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.jabatan.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  const isAdmin = currentUser.role === 'Administrator';

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
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Manajemen Hak Akses Pengguna (Role Security)</h2>
            <p className="text-xs text-slate-500">
              Kelola akun, edit data hak akses, dan hapus pengguna untuk 4 Role: Administrator, Operator Bidang, Verifikator, & Pimpinan
            </p>
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

      {/* Permission Notice when non-admin */}
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Saat ini Anda login sebagai <strong>{currentUser.role}</strong> (mode baca/terbatas). Untuk menambahkan, mengedit, atau menghapus akun pengguna, silakan beralih ke role <strong>Administrator</strong> pada dropdown di kanan atas.
            </span>
          </div>
          <button
            onClick={() => onRoleChange('Administrator')}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 ml-2"
          >
            Beralih ke Administrator
          </button>
        </div>
      )}

      {/* User Table Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-sm text-slate-800">
              Daftar Akun Pengguna Terdaftar ({filteredUsers.length} Akun)
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari akun pengguna..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-56"
              />
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Akun</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nama Lengkap</th>
                <th className="p-3">Email Akun</th>
                <th className="p-3">Role Akses</th>
                <th className="p-3">Jabatan & NIP</th>
                <th className="p-3">Login Terakhir</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ditemukan data pengguna yang sesuai pencarian "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <tr key={u.id} className={`hover:bg-slate-50 ${isCurrent ? 'bg-indigo-50/40' : ''}`}>
                      <td className="p-3 font-mono font-bold text-indigo-700">
                        {u.id}
                        {isCurrent && (
                          <span className="block text-[9px] font-sans text-indigo-600 font-bold">
                            (Anda)
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {u.name}
                      </td>
                      <td className="p-3 text-blue-600 font-mono">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 font-bold rounded-lg border text-[11px] ${
                            u.role === 'Administrator'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : u.role === 'Operator Bidang'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : u.role === 'Verifikator'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{u.jabatan}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.nip || 'Non-PNS'}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{u.lastLogin}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 font-bold rounded text-[10px] ${
                            u.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {u.status === 'Aktif' ? (
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <UserX className="w-3 h-3 text-slate-500" />
                          )}
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            title="Edit data akun pengguna"
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeletingUser(u)}
                            title="Hapus akun pengguna"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-800">Tambah Akun Pengguna Baru</h3>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lalu Hendra Kusuma, S.Sos."
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Email Akun *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hendra@ntbprov.go.id"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Role Hak Akses</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as Role)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Operator Bidang">Operator Bidang</option>
                    <option value="Verifikator">Verifikator</option>
                    <option value="Pimpinan">Pimpinan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Status Akun</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Jabatan / Unit Kerja</label>
                <input
                  type="text"
                  placeholder="e.g. Pamong Budaya Ahli Muda"
                  value={newUserJabatan}
                  onChange={(e) => setNewUserJabatan(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">NIP (Opsional)</label>
                <input
                  type="text"
                  placeholder="e.g. 19850612 201001 1 004 atau kosongkan bila Non-PNS"
                  value={newUserNip}
                  onChange={(e) => setNewUserNip(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800">Edit Akun Pengguna</h3>
                  <p className="text-[11px] text-slate-500">ID: {editingUser.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Email Akun *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Role Hak Akses</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as Role)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Operator Bidang">Operator Bidang</option>
                    <option value="Verifikator">Verifikator</option>
                    <option value="Pimpinan">Pimpinan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Status Akun</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Jabatan / Unit Kerja</label>
                <input
                  type="text"
                  value={editJabatan}
                  onChange={(e) => setEditJabatan(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">NIP</label>
                <input
                  type="text"
                  placeholder="Kosongkan jika Non-PNS"
                  value={editNip}
                  onChange={(e) => setEditNip(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {editingUser.id === currentUser.id && (
                <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Catatan: Mengubah data akun ini akan otomatis memperbarui identitas sesi login Anda saat ini.
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Konfirmasi Hapus Akun</h3>
                <p className="text-xs text-slate-500">Tindakan ini akan menghapus akun dari sistem hak akses.</p>
              </div>
            </div>

            {/* Target Details */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Pengguna:</span>
                <span className="font-mono font-bold text-slate-800">{deletingUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="font-bold text-slate-800">{deletingUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Akun:</span>
                <span className="font-mono text-blue-600">{deletingUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role Akses:</span>
                <span className="font-bold text-slate-800">{deletingUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jabatan:</span>
                <span className="text-slate-700">{deletingUser.jabatan}</span>
              </div>
            </div>

            {/* Warnings if self or only admin */}
            {isDeletingSelf ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Tidak Dapat Menghapus Akun Sendiri</strong>
                  Akun ini sedang Anda gunakan untuk login saat ini. Untuk menghapus akun ini, login menggunakan akun Administrator lain terlebih dahulu.
                </div>
              </div>
            ) : isOnlyAdmin ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Administrator Terakhir</strong>
                  Sistem membutuhkan minimal 1 akun Administrator aktif agar sistem dapat terus dikelola.
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Apakah Anda yakin ingin menghapus akun pengguna <strong>{deletingUser.name}</strong>? Pengguna ini tidak akan dapat login lagi ke sistem.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingSelf || !!isOnlyAdmin}
                onClick={handleConfirmDelete}
                className={`px-4 py-2 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  isDeletingSelf || isOnlyAdmin
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-sm'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
