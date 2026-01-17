import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUsers, FiCoffee, FiBarChart2, FiLogOut, FiMenu, FiHome, FiX, FiPlus, FiActivity, FiTrendingUp, FiEdit2, FiTrash2 } from 'react-icons/fi';
import logo from '../../assets/Logo.svg';
// Link removed as we use tab state
import UserManagementPage from './UserManagementPage';
import MenuManagementPage from './MenuManagementPage';
import ReportsPage from './ReportsPage';
import { menuAPI, reportAPI, orderAPI } from '../../services/api';

const ManagementDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    menuCount: 0,
    currSales: 0,
    growth: 0,
    recentActivity: [] as any[]
  });

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      await menuAPI.getCategories();
      // State removed as it is handled by the Modal component
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && ['dashboard', 'users', 'menu', 'reports'].includes(path)) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/owner/${tabId}`);
  };

  const fetchStats = async () => {
    try {
      // 1. Menu Count
      const menuRes = await menuAPI.getAll();
      const menuCount = menuRes.data.data.items.length;

      // 2. Today's Sales
      const today = new Date().toISOString().split('T')[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split('T')[0];

      let todaySales = 0;
      let yesterdaySales = 0;

      try {
        const [todayRes, yesterdayRes] = await Promise.all([
          reportAPI.getDailyReport(today),
          reportAPI.getDailyReport(yesterday)
        ]);
        todaySales = todayRes.data.data.summary.totalRevenue || 0;
        yesterdaySales = yesterdayRes.data.data.summary.totalRevenue || 0;
      } catch (e) {
        console.warn('Failed to fetch daily report', e);
      }

      // Calculate Growth
      let growth = 0;
      if (yesterdaySales > 0) {
        growth = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
      } else if (todaySales > 0) {
        growth = 100;
      }

      // 3. Recent Activity (Orders)
      const orderRes = await orderAPI.getAll({ limit: 5 });
      const recentOrders = orderRes.data.data || [];

      setStats({
        menuCount,
        currSales: todaySales,
        growth: Number(growth.toFixed(1)),
        recentActivity: recentOrders.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
      fetchCategories();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'users', label: 'Manajemen Pengguna', icon: <FiUsers /> },
    { id: 'menu', label: 'Manajemen Menu', icon: <FiCoffee /> },
    { id: 'reports', label: 'Laporan', icon: <FiBarChart2 /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="p-6 space-y-8">
          {/* Header Removed (Moved to TopBar) */}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Removed Total Users as requested */}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Menu</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.menuCount}</p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <FiTrendingUp className="mr-1" />
                    <span>Active items</span>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <span className="text-green-600 text-xl"><FiCoffee /></span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Penjualan Hari Ini</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    Rp {stats.currSales.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <FiBarChart2 className="mr-1" />
                    <span>Daily Revenue</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <span className="text-blue-600 text-xl"><FiActivity /></span>
                </div>
              </div>
            </div>

            {/* Growth Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pertumbuhan</p>
                  <p className={`text-3xl font-bold mt-1 ${stats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.growth >= 0 ? '+' : ''}{stats.growth}%
                  </p>
                  <div className="flex items-center mt-2 text-sm text-indigo-600">
                    <FiTrendingUp className="mr-1" />
                    <span>vs Yesterday</span>
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-full">
                  <span className="text-indigo-600 text-xl"><FiTrendingUp /></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleTabChange('users')} className="p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 text-left transition-all group">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 w-fit group-hover:scale-110 transition-transform"><FiUsers size={20} /></div>
                  <span className="font-bold text-sm block mt-4">Tambah User</span>
                </button>
                <button onClick={() => handleTabChange('menu')} className="p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 text-left transition-all group">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600 w-fit group-hover:scale-110 transition-transform"><FiCoffee size={20} /></div>
                  <span className="font-bold text-sm block mt-4">Tambah Menu</span>
                </button>
                <button onClick={() => handleTabChange('reports')} className="p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 text-left transition-all group">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 w-fit group-hover:scale-110 transition-transform"><FiBarChart2 size={20} /></div>
                  <span className="font-bold text-sm block mt-4">Lihat Laporan</span>
                </button>
                <button onClick={() => setIsCatModalOpen(true)} className="p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 text-left transition-all group">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-600 w-fit group-hover:scale-110 transition-transform"><FiPlus size={20} /></div>
                  <span className="font-bold text-sm block mt-4">Buat Kategori</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {stats.recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 italic font-medium">Belum ada aktivitas.</p>
                ) : (
                  stats.recentActivity.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900">Order #{order.id}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Category Management Modal */}
          {isCatModalOpen && (
            <CategoryManagementModal
              onClose={() => setIsCatModalOpen(false)}
              onRefresh={() => fetchCategories()}
            />
          )}

        </div>;
      case 'users':
        return <UserManagementPage />;
      case 'menu':
        return <MenuManagementPage />;
      case 'reports':
        return <ReportsPage />;
      default:
        return null; // Should not trigger
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden transition-colors duration-300">
      {/* Sidebar - Desktop: Tetap di kiri, Mobile: Overlay */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>

        <div className="flex items-center gap-3 px-8 h-20 border-b border-gray-50">
          <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-contain transform scale-125" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight uppercase">POS<span className="text-indigo-600"> SO</span></span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); navigate(`/owner/${tab.id}`); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all relative group ${activeTab === tab.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {activeTab === tab.id && (
                <div className="absolute left-0 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
              )}
              <span className={`text-lg ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}

          <div className="pt-8 mt-8 border-t border-gray-100">
            <div className="flex items-center gap-4 px-4 py-4 bg-gray-50 rounded-2xl">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black uppercase text-sm border-2 border-white shadow-sm">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-gray-900 truncate">{user?.name}</span>
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">{user?.role} Access</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <FiLogOut className="text-lg" /> Logout Akun
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-30 flex-shrink-0 shadow-sm shadow-gray-100/50">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 bg-gray-100 rounded-lg">
              <FiMenu size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-900">{user?.name}</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">{user?.role} Access</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm overflow-hidden p-1.5">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const CategoryManagementModal = ({ onClose, onRefresh }: { onClose: () => void, onRefresh: () => void }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editCatId, setEditCatId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', subcategories: '', icon: '🍴' });
  const iconOptions = ['🍜', '🥤', '🍰', '🍿', '🍱', '🍔', '🍕', '🍳', '🥗', '🍦', '☕', '🍹', '🍴', '🔥', '✨'];
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'category' | 'subcategory', id: number, name: string, parentId?: number } | null>(null);
  const [affectedMenus, setAffectedMenus] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await menuAPI.getCategories();
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subcats = formData.subcategories.split(',').map(s => s.trim()).filter(Boolean);
      if (editCatId) {
        await menuAPI.updateCategory(String(editCatId), { name: formData.name, subcategories: subcats, icon: formData.icon });
      } else {
        await menuAPI.createCategory({ name: formData.name, subcategories: subcats, icon: formData.icon });
      }
      setIsAdding(false);
      setEditCatId(null);
      setFormData({ name: '', subcategories: '', icon: '🍴' });
      loadCategories();
      onRefresh();
    } catch (error: any) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const checkAffectedMenus = async (catName: string, subName?: string) => {
    try {
      const menuRes = await menuAPI.getAll();
      const allMenus = menuRes.data.data.items;
      const affected = allMenus.filter((m: any) =>
        m.category === catName && (!subName || m.subcategory === subName)
      );
      setAffectedMenus(affected);
    } catch (error) {
      console.error('Error checking affected menus:', error);
    }
  };

  const initiateDelete = async (type: 'category' | 'subcategory', id: number, name: string, catName: string, subName?: string) => {
    await checkAffectedMenus(catName, subName);
    setConfirmDelete({ type, id, name, parentId: id });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'category') {
        await menuAPI.deleteCategory(String(confirmDelete.id));
      } else {
        // For subcategory, confirmDelete.id is the parent category ID
        await menuAPI.removeSubcategory(String(confirmDelete.id), confirmDelete.name);
      }
      setConfirmDelete(null);
      loadCategories();
      onRefresh();
    } catch (error: any) {
      alert('Gagal menghapus: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">Kelola Kategori & Sub-Kategori</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isAdding && !editCatId ? (
            <div className="space-y-4">
              <button
                onClick={() => setIsAdding(true)}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition flex items-center justify-center gap-2"
              >
                <FiPlus /> Tambah Kategori Baru
              </button>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Memuat kategori...</div>
              ) : (
                <div className="divide-y">
                  {categories.map((cat) => (
                    <div key={cat.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl bg-gray-50 p-2 rounded-lg">{cat.icon || '🍴'}</span>
                          <h4 className="font-bold text-gray-900 capitalize">{cat.name}</h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditCatId(cat.id);
                              setFormData({ name: cat.name, subcategories: cat.subcategories.join(', '), icon: cat.icon || '🍴' });
                            }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => initiateDelete('category', cat.id, cat.name, cat.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.subcategories.map((sub: string) => (
                          <div key={sub} className="group flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                            {sub}
                            <button
                              onClick={() => initiateDelete('subcategory', cat.id, sub, cat.name, sub)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <FiX size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: SeaFood"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                  <div className="text-3xl h-[42px] flex items-center justify-center bg-gray-50 border rounded-lg">
                    {formData.icon}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl p-2 rounded-lg transition-all ${formData.icon === icon
                        ? 'bg-indigo-600 text-white scale-110 shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Kategori (Opsional)</label>
                <input
                  type="text"
                  value={formData.subcategories}
                  onChange={e => setFormData({ ...formData, subcategories: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Pedas, Goreng, Rebus (Pisahkan dengan koma)"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setEditCatId(null); }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <h4 className="text-xl font-black text-gray-900 mb-2">Hapus {confirmDelete.type === 'category' ? 'Kategori' : 'Sub-Kategori'}?</h4>
            <p className="text-gray-600 mb-4">
              Apakah anda yakin menghapus {confirmDelete.type === 'category' ? 'kategori' : 'sub-kategori'}{' '}
              <span className="font-bold text-red-600">"{confirmDelete.name}"</span>?
            </p>

            {affectedMenus.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
                <p className="text-xs font-bold text-red-700 uppercase mb-2 italic">Menu yang akan ikut terhapus:</p>
                <div className="flex flex-wrap gap-2">
                  {affectedMenus.map(m => (
                    <span key={m.id} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-gray-500 font-bold">Batal</button>
              <button onClick={handleDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg font-black hover:bg-red-700 shadow-lg shadow-red-200">
                Ya, Hapus Semuanya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementDashboard;
