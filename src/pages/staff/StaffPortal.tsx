import React, { useState, useEffect } from 'react';
import logo from '../../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiLogOut, FiMenu, FiX, FiRefreshCcw,
  FiClock, FiSearch,
  FiPrinter, FiUser, FiCalendar,
  FiFileText, FiAlertCircle,
  FiHome, FiDollarSign, FiShoppingBag, FiCreditCard
} from 'react-icons/fi';
import { orderAPI, paymentAPI } from '../../services/api';
import { useLocation } from 'react-router-dom';

interface OrderItem {
  id?: number;
  menuId?: number;
  name: string;
  quantity: number;
  price: number;
  unitPrice?: number;
}

interface Order {
  id: string;
  tableNumber: number;
  customerName: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const StaffPortal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'payments'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filtering & Search
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Receipt & Decision State
  const [showAcceptanceOption, setShowAcceptanceOption] = useState<{ order: Order } | null>(null);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'orders' || path === 'payments' || path === 'dashboard') {
      setActiveTab(path as any);
    }
  }, [location.pathname]);

  const handleTabChange = (tab: 'dashboard' | 'orders' | 'payments') => {
    setActiveTab(tab);
    navigate(`/staff/${tab}`);
  };

  const loadAllData = async () => {
    try {
      const [orderRes, paymentRes] = await Promise.all([
        orderAPI.getAll(),
        paymentAPI.getAll()
      ]);

      // Normalize Orders
      const rawOrders = (orderRes.data.data as any)?.items || orderRes.data.data || [];
      const normalizedOrders = rawOrders.map((o: any) => ({
        ...o,
        id: String(o.id),
        tableNumber: o.tableNumber || o.table_number,
        customerName: o.customerName || o.customer_name,
        totalAmount: Number(o.totalAmount || o.total_amount || 0),
        paymentMethod: o.paymentMethod || 'manual',
        createdAt: o.createdAt || o.created_at,
        items: (o.items || []).map((it: any) => ({
          ...it,
          name: it.name || it.product_name || it.menu_name || it.itemName || it.menu_item_name || 'Produk Tidak Diketahui',
          price: Number(it.price || it.unitPrice || 0),
          quantity: Number(it.quantity || 0)
        }))
      }));

      // Normalize Payments
      const rawPayments = paymentRes.data.data?.payments || paymentRes.data.data || [];

      setOrders(normalizedOrders);
      setPayments(rawPayments);
    } catch (error) {
      console.error('Failed to load portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(parseInt(orderId), newStatus);
      loadAllData();
    } catch (error) {
      alert('Gagal update status: ' + error);
    }
  };

  const handleAcceptOrder = (order: Order) => {
    // If QRIS -> Auto receipt
    if (order.paymentMethod === 'qris' || order.status === 'paid' || order.paymentMethod?.includes('qris')) {
      handleAcceptWithReceipt(order);
    } else {
      // If manual -> Option
      setShowAcceptanceOption({ order });
    }
  };

  const handleAcceptWithReceipt = async (order: Order) => {
    await handleUpdateStatus(order.id, 'accepted');
    setSelectedOrderForReceipt({ ...order, status: 'accepted' });
    setIsReceiptModalOpen(true);
    setShowAcceptanceOption(null);
  };

  const handleAcceptOnly = async (order: Order) => {
    await handleUpdateStatus(order.id, 'accepted');
    setShowAcceptanceOption(null);
  };

  const handleConfirmPayment = async (paymentId: number) => {
    try {
      await paymentAPI.updateStatus(paymentId, 'paid');
      loadAllData();
    } catch (error) {
      alert('Gagal konfirmasi pembayaran');
    }
  };

  // Helpers
  const formatDateFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-500 border-gray-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-400 border-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 'Menunggu';
    if (s === 'accepted') return 'Diterima';
    if (s === 'preparing') return 'Dimasak';
    if (s === 'ready') return 'Siap';
    if (s === 'completed') return 'Selesai';
    return status.toUpperCase();
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
    const matchesDate = !selectedDate || o.createdAt.split('T')[0] === selectedDate;
    return matchesFilter && matchesSearch && matchesDate;
  });

  const stats = {
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    activeCooking: orders.filter(o => o.status === 'preparing' || o.status === 'accepted').length,
    pendingPayments: payments.filter(p => p.status === 'pending' && p.paymentMethod === 'manual').length,
    totalToday: orders.filter(o => o.createdAt.split('T')[0] === new Date().toISOString().split('T')[0]).length
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden transition-colors duration-300">
      {/* Sidebar - Clean & Minimalist (White) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:relative lg:translate-x-0 border-r border-gray-100`}>
        <div className="flex items-center gap-3 px-8 h-20 border-b border-gray-50">
          <div className="h-12 w-12 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-contain transform scale-125" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900 uppercase">
            {APP_CONFIG.NAME.split(' ')[0]}
            <span className="text-indigo-600"> {APP_CONFIG.NAME.split(' ').slice(1).join(' ')}</span>
          </span>
        </div>

        <nav className="p-6 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
            { id: 'orders', label: 'Pesanan Aktif', icon: <FiClock />, badge: stats.pendingOrders, badgeColor: 'orange' },
            { id: 'payments', label: 'Pembayaran', icon: <FiCreditCard />, badge: stats.pendingPayments, badgeColor: 'indigo' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { handleTabChange(item.id as any); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all relative group ${activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
              )}
              <span className={`text-lg ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-auto bg-${item.badgeColor}-500 text-white text-[10px] px-2 py-0.5 rounded-full`}>
                  {item.badge}
                </span>
              )}
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
      <div className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-300">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-30 shrink-0 shadow-sm shadow-gray-100/50">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-gray-50 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">
              <FiMenu size={22} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'orders' ? 'Pesanan' : 'Pembayaran'}
            </h2>
          </div>

          <button onClick={loadAllData} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <FiRefreshCcw size={16} /> <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#F4F7FE]">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* TABS CONTENT */}
            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-fade-in">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Menunggu', val: stats.pendingOrders, icon: <FiClock />, color: 'orange' },
                    { label: 'Proses', val: stats.activeCooking, icon: <FiRefreshCcw />, color: 'indigo' },
                    { label: 'Kasir', val: stats.pendingPayments, icon: <FiDollarSign />, color: 'emerald' },
                    { label: 'Total Hari Ini', val: stats.totalToday, icon: <FiShoppingBag />, color: 'gray' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 flex items-center gap-6 group hover:shadow-md transition-all duration-300">
                      <div className={`h-14 w-14 rounded-2xl bg-${s.color}-50 text-${s.color}-500 flex items-center justify-center text-2xl`}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{s.label}</div>
                        <div className="text-2xl font-black text-gray-900 leading-none">{s.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><FiAlertCircle /></div>
                      Pesanan Terbaru
                    </h3>
                    <div className="space-y-3">
                      {orders.filter(o => o.status === 'pending').slice(0, 3).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition group">
                          <div>
                            <div className="font-bold text-gray-900">Meja {o.tableNumber} <span className="text-xs text-gray-400 font-normal ml-2">#{o.id}</span></div>
                            <div className="text-xs font-medium text-gray-500">{o.customerName}</div>
                          </div>
                          <button
                            onClick={() => handleAcceptOrder(o)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-indigo-700 transition shadow-sm"
                          >
                            Terima
                          </button>
                        </div>
                      ))}
                      {orders.filter(o => o.status === 'pending').length === 0 && (
                        <div className="text-center py-12 text-gray-400 font-medium text-sm italic">Belum ada pesanan masuk</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><FiDollarSign /></div>
                      Antrean Kasir (Tunai)
                    </h3>
                    <div className="space-y-3">
                      {payments.filter(p => p.status === 'pending' && p.paymentMethod === 'manual').slice(0, 3).map(p => (
                        <div key={p.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50/50 transition">
                          <div>
                            <div className="font-bold text-gray-900 tracking-tight">Order #{p.orderId}</div>
                            <div className="text-xs font-semibold text-emerald-600">Rp {p.amount.toLocaleString()} <span className="text-gray-400 ml-1 font-normal">• Tunai</span></div>
                          </div>
                          <button
                            onClick={() => handleConfirmPayment(p.id)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-emerald-600 transition shadow-sm"
                          >
                            Lunas
                          </button>
                        </div>
                      ))}
                      {payments.filter(p => p.status === 'pending' && p.paymentMethod === 'manual').length === 0 && (
                        <div className="text-center py-12 text-gray-400 font-medium text-sm italic">Antrean kasir kosong</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8 animate-fade-in">
                {/* Search & Filter Bar - Minimalist */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 transition-colors">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari pelanggan atau nomor pesanan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-6 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    <FiCalendar className="text-indigo-500" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent font-bold text-xs outline-none text-gray-600 uppercase"
                    />
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-xl px-2 border border-gray-100">
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value as any)}
                      className="px-4 py-3 bg-transparent font-bold text-[11px] uppercase tracking-wider outline-none border-none text-gray-600 cursor-pointer"
                    >
                      <option value="all">SEMUA STATUS</option>
                      <option value="pending">MENUNGGU</option>
                      <option value="preparing">DIMASAK</option>
                      <option value="ready">SIAP SAJI</option>
                      <option value="completed">SELESAI</option>
                    </select>
                  </div>
                </div>

                {/* Orders Grid */}
                {filteredOrders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map(o => (
                      <div key={o.id} className="bg-white rounded-2xl border border-gray-100/50 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                        {/* Status Stripe */}
                        <div className={`h-1 w-full ${getStatusColor(o.status)} opacity-60`}></div>

                        <div className="p-6 space-y-5 flex-1">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meja</span>
                              <h4 className="text-xl font-black text-gray-900 leading-none">{o.tableNumber}</h4>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(o.status)} transition-colors`}>
                              {getStatusText(o.status)}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 py-3 border-y border-gray-50/50">
                            <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs transition-colors">
                              <FiUser />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-gray-800 truncate">{o.customerName || 'Guest'}</span>
                              <span className="text-[9px] uppercase font-medium text-gray-400">Order #{o.id}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-[11px] font-semibold text-gray-600 transition-colors">
                                <span className="truncate pr-2"><span className="text-gray-400 mr-1">x{item.quantity}</span> {item.name}</span>
                                <span className="text-gray-400 italic shrink-0">Rp {(Number(item.price) * Number(item.quantity)).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-2 bg-gray-50/30 transition-colors">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Grand Total</span>
                              <span className="text-lg font-black text-indigo-600">Rp {o.totalAmount.toLocaleString()}</span>
                            </div>
                            <button
                              onClick={() => { setSelectedOrderForReceipt(o); setIsReceiptModalOpen(true); }}
                              className="p-2.5 bg-white text-gray-400 hover:text-indigo-600 rounded-lg transition shadow-sm border border-gray-100"
                            >
                              <FiPrinter size={16} />
                            </button>
                          </div>

                          <div className="text-[9px] text-gray-400 font-bold mb-4 flex items-center gap-2 transition-colors">
                            <FiCalendar size={12} /> {formatDateFull(o.createdAt)}
                          </div>

                          {o.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptOrder(o)}
                              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
                            >
                              Terima Pesanan
                            </button>
                          )}
                          {o.status === 'accepted' && (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleUpdateStatus(o.id, 'preparing')}
                                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-orange-600 transition shadow-sm shadow-orange-200"
                              >
                                Mulai Masak
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(o.id, 'completed')}
                                className="w-full border-2 border-indigo-100 text-indigo-600 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition"
                              >
                                Selesaikan Sekarang
                              </button>
                            </div>
                          )}
                          {o.status === 'preparing' && (
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleUpdateStatus(o.id, 'ready')}
                                className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition shadow-sm shadow-emerald-200"
                              >
                                Pesanan Siap
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(o.id, 'completed')}
                                className="w-full border-2 border-indigo-100 text-indigo-600 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition"
                              >
                                Selesaikan Sekarang
                              </button>
                            </div>
                          )}
                          {o.status === 'ready' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'completed')}
                              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-black transition shadow-sm shadow-gray-200"
                            >
                              Selesaikan Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6 text-3xl">
                      <FiSearch />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">Pesanan Tidak Ditemukan</h3>
                    <button onClick={() => { setSearchTerm(''); setOrderFilter('all'); }} className="mt-4 text-indigo-600 font-bold hover:underline">Reset Filte</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in transition-colors duration-300">
                <div className="p-8 border-b border-gray-50 bg-white">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">Riwayat & Tunggu Pembayaran</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase text-gray-400 tracking-widest bg-gray-50/50">
                        <th className="px-8 py-5 text-left font-bold">ID</th>
                        <th className="px-8 py-5 text-left font-bold">Waktu</th>
                        <th className="px-8 py-5 text-left font-bold">Pesanan</th>
                        <th className="px-8 py-5 text-left font-bold">Metode</th>
                        <th className="px-8 py-5 text-left font-bold text-indigo-600">Total</th>
                        <th className="px-8 py-5 text-left font-bold">Status</th>
                        <th className="px-8 py-5 text-center font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                      {payments.slice().reverse().map(p => (
                        <tr key={p.id} className="hover:bg-indigo-50/20 transition">
                          <td className="px-8 py-5 text-gray-400 text-xs font-medium">#{p.id}</td>
                          <td className="px-8 py-5 text-gray-500 font-medium">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="px-8 py-5 font-bold text-gray-900">#ORD-{p.orderId}</td>
                          <td className="px-8 py-5 uppercase text-[10px] tracking-wider font-bold text-gray-500">{p.paymentMethod}</td>
                          <td className="px-8 py-5 text-base font-black text-indigo-600 tracking-tight">Rp {p.amount.toLocaleString()}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase border ${getStatusColor(p.status)}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            {p.status === 'pending' && p.paymentMethod === 'manual' ? (
                              <button
                                onClick={() => handleConfirmPayment(p.id)}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-black transition shadow-sm"
                              >
                                Konfirmasi
                              </button>
                            ) : <span className="text-gray-300">—</span>}
                          </td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr><td colSpan={7} className="text-center py-24 text-gray-400 font-medium text-sm italic">Belum ada riwayat transaksi</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Decision Modal - Minimalist */}
      {showAcceptanceOption && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-10 text-center animate-scale-in border border-gray-100">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 text-3xl">
              <FiPrinter />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Terima Pesanan?</h3>
            <p className="text-gray-500 font-medium mb-8 text-sm leading-relaxed px-2">
              Pesanan untuk <span className="text-gray-900 font-bold">Meja {showAcceptanceOption.order.tableNumber}</span> siap diproses. Cetak struk sekarang?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleAcceptWithReceipt(showAcceptanceOption.order)}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
              >
                <FiPrinter size={14} /> Cetak & Terima
              </button>
              <button
                onClick={() => handleAcceptOnly(showAcceptanceOption.order)}
                className="w-full border-2 border-gray-50 text-gray-500 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 hover:text-gray-800 transition"
              >
                Terima Saja
              </button>
              <button
                onClick={() => setShowAcceptanceOption(null)}
                className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 transition mt-4"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {isReceiptModalOpen && selectedOrderForReceipt && (
        <ReceiptModal
          order={selectedOrderForReceipt}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
    </div>
  );
};

// --- Sub Component Struk ---
interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <FiFileText className="text-indigo-600" /> POS RECEIPT
            </h3>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition text-gray-400">
              <FiX size={24} />
            </button>
          </div>

          <div id="receipt-content" className="border-4 border-dashed border-gray-100 p-8 rounded-[32px] bg-gray-50/30 font-mono text-[11px] leading-relaxed text-gray-800">
            <h4 className="text-base font-black uppercase text-gray-900 tracking-tighter">{APP_CONFIG.NAME}</h4>
            <p className="text-[10px] text-gray-400 mt-2 font-bold italic tracking-wide">Jl. Antigravity No. 123, Jakarta</p>
          </div>

          <div className="space-y-2 mb-6 font-bold uppercase text-[10px]">
            <div className="flex justify-between"><span>ORDER ID:</span><span className="font-black text-indigo-600">#{order.id}</span></div>
            <div className="flex justify-between"><span>TANGGAL:</span><span>{new Date(order.createdAt).toLocaleDateString('id-ID')}</span></div>
            <div className="flex justify-between"><span>MEJA:</span><span className="font-black">BOX {order.tableNumber}</span></div>
            <div className="flex justify-between"><span>NAME:</span><span className="font-black truncate max-w-[100px]">{order.customerName || 'GUEST'}</span></div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-3 mb-6">
            <div className="flex justify-between font-black text-gray-400 text-[9px] mb-2">
              <span>RESTORAN MENU</span>
              <span className="w-10 text-center">QTY</span>
              <span className="w-20 text-right">PRICE</span>
            </div>
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between text-gray-800 font-bold">
                <span className="max-w-[140px] truncate">{it.name}</span>
                <span className="w-10 text-center">{it.quantity}</span>
                <span className="w-20 text-right font-black">Rp {((it.unitPrice || it.price || 0) * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t-4 border-gray-900 pt-6 mt-4">
            <div className="flex justify-between text-base font-black text-gray-900 tracking-tighter">
              <span>GRAND TOTAL</span>
              <span className="text-xl">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="mt-2 text-[9px] font-black text-indigo-500 uppercase tracking-widest text-right italic">
              -- LUNAS via {order.paymentMethod} --
            </div>
          </div>

          <div className="text-center mt-10 text-[10px] text-gray-300 font-black italic tracking-tighter">
            TERIMA KASIH & SELAMAT MENIKMATI
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-10">
          <button onClick={handlePrint} className="flex items-center justify-center gap-3 border-2 border-indigo-600 text-indigo-600 py-5 rounded-2xl font-black text-xs uppercase hover:bg-indigo-50 transition">
            <FiPrinter /> PRINT
          </button>
          <button onClick={onClose} className="bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase hover:bg-black transition shadow-xl shadow-indigo-600/20">
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffPortal;
