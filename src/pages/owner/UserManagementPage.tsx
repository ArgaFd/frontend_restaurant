import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { userAPI } from '../../services/api';

// Type definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      const formattedUsers = (response.data.data || []).map((userData: any) => ({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status || 'active'
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedUserId(null);
    setFormData({ name: '', email: '', password: '', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setIsEditing(true);
    setSelectedUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't show password
      status: user.status.toLowerCase()
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEditing && selectedUserId) {
        // Prepare update data (only send password if provided)
        const updateData: any = { ...formData };
        if (!updateData.password) delete updateData.password;

        await userAPI.update(selectedUserId, updateData);
        alert('Pengguna berhasil diupdate');
      } else {
        await userAPI.create(formData);
        alert('Pengguna baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      alert('Gagal menyimpan pengguna: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await userAPI.delete(userId);
        alert('Pengguna berhasil dihapus');
        fetchUsers();
      } catch (error: any) {
        alert('Gagal menghapus pengguna: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition"
          >
            <FiPlus className="mr-2" /> Tambah Staf
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-2 text-gray-500">Memuat data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nama</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-medium text-gray-900">{u.name}</td>
                    <td className="py-4 px-4 text-gray-600">{u.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {u.role === 'owner' ? 'Owner' : 'Staff'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(u)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><FiEdit2 /></button>
                        {String(u.id) !== currentUser?.id && (
                          <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><FiTrash2 /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">Tidak ada data ditemukan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-bold">{isEditing ? 'Edit Staf' : 'Tambah Staf Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Nama staf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  disabled={isEditing}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 text-gray-500"
                  placeholder="email@staf.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {isEditing && <span className="text-xs text-gray-500 font-normal">(Kosongkan jika tidak ingin ganti)</span>}
                </label>
                <input
                  type="password"
                  required={!isEditing}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Min. 6 karakter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;