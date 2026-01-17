import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { UserRole } from '../types';
import { FiMenu, FiX, FiLogOut, FiHome, FiUsers, FiCoffee, FiList, FiDollarSign, FiPieChart } from 'react-icons/fi';

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  // Owner menu items
  {
    title: 'Dashboard',
    description: 'Ringkasan bisnis',
    icon: <FiHome size={20} />,
    link: '/owner/dashboard',
    color: 'from-purple-500 to-indigo-600',
    roles: ['owner']
  },
  {
    title: 'Manajemen Pengguna',
    description: 'Kelola akun karyawan',
    icon: <FiUsers size={20} />,
    link: '/owner/users',
    color: 'from-blue-500 to-cyan-600',
    roles: ['owner']
  },
  {
    title: 'Manajemen Menu',
    description: 'Kelola daftar menu',
    icon: <FiCoffee size={20} />,
    link: '/owner/menu',
    color: 'from-green-500 to-emerald-600',
    roles: ['owner']
  },
  // Staff menu items
  {
    title: 'Daftar Pesanan',
    description: 'Kelola pesanan aktif',
    icon: <FiList size={20} />,
    link: '/staff/orders',
    color: 'from-green-500 to-emerald-600',
    roles: ['staff']
  },
  {
    title: 'Pembayaran',
    description: 'Proses pembayaran',
    icon: <FiDollarSign size={20} />,
    link: '/staff/payments',
    color: 'from-yellow-500 to-orange-600',
    roles: ['staff']
  },
  // Shared menu items
  {
    title: 'Laporan',
    description: 'Lihat laporan',
    icon: <FiPieChart size={20} />,
    link: '/owner/reports',
    color: 'from-pink-500 to-rose-600',
    roles: ['owner']
  }
];

interface RoleBasedDashboardProps {
  userRole: UserRole;
  children?: React.ReactNode;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ userRole, children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(userRole)
  );

  // Redirect to appropriate dashboard based on user role
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(false);

    // Redirect to first menu item if at root
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      const firstMenuItem = filteredMenuItems[0];
      if (firstMenuItem) {
        navigate(firstMenuItem.link);
      }
    }
  }, [user, navigate, location.pathname, filteredMenuItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <div className="spinner-modern h-12 w-12"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar - overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
        <div className="relative flex flex-col w-64 h-full sidebar-modern shadow-2xl animate-slide-in-right">
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <span className="text-xl font-black text-white">Resto App</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              <FiX size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto scrollbar-modern px-3 py-4">
            {filteredMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${location.pathname === item.link
                    ? 'menu-item-active'
                    : 'menu-item-hover text-white/80'
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  {item.icon}
                </span>
                <span className="font-semibold">{item.title}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-white/90 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <FiLogOut size={20} />
              <span className="font-semibold">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - fixed */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 sidebar-modern shadow-xl">
          <div className="flex items-center h-16 px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg"></div>
              <span className="text-xl font-black text-white">Resto App</span>
            </div>
          </div>
          <div className="flex flex-col flex-grow overflow-y-auto">
            <nav className="flex-1 px-3 py-4 scrollbar-modern">
              {filteredMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${location.pathname === item.link
                      ? 'menu-item-active'
                      : 'menu-item-hover text-white/80'
                    }`}
                >
                  <span className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                    {item.icon}
                  </span>
                  <span className="font-semibold">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs font-medium text-white/60">{userRole === 'owner' ? 'Owner' : 'Staff'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-white/90 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <FiLogOut size={20} />
              <span className="font-semibold">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content - takes remaining space */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top header - glass morphism */}
        <header className="glass-card-light border-b border-white/20">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiMenu size={24} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {filteredMenuItems.find(item => item.link === location.pathname)?.title || 'Dashboard'}
                </h1>
                <p className="text-xs text-gray-500">
                  {filteredMenuItems.find(item => item.link === location.pathname)?.description || ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden md:block">
                  {user?.name || 'User'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors lg:hidden"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-modern">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;

