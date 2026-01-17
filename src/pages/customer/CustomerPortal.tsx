import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';

const CustomerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      const ordersData = response.data.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cooking':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'processing':
        return 'Sedang Diproses';
      case 'cooking':
        return 'Sedang Dimasak';
      case 'ready':
        return 'Siap Disajikan';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '📋';
      case 'cooking':
        return '👨‍🍳';
      case 'ready':
        return '✅';
      case 'completed':
        return '🎉';
      default:
        return '❓';
    }
  };

  const activeOrders = orders.filter(order => 
    ['pending', 'processing', 'cooking', 'ready'].includes(order.status)
  );

  const completedOrders = orders.filter(order => 
    order.status === 'completed'
  );

  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pesanan Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
              <p className="text-gray-600 mt-1">Kelola pesanan Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/menu')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Pesan Lagi
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pesanan Aktif
                {activeOrders.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    {activeOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Riwayat Pesanan
                {completedOrders.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {completedOrders.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {displayOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">Pesanan #{order.id}</h3>
                    <p className="text-green-100">Meja {order.table_number}</p>
                    <p className="text-green-100 text-sm">
                      {new Date(order.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-2">{getStatusIcon(order.status)}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Detail Pesanan:</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">Rp {order.total_amount.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {order.estimated_time && order.status !== 'completed' && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Estimasi waktu: {order.estimated_time} menit
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {order.status === 'ready' && (
                    <button
                      onClick={() => alert('Pelayan akan segera mengantarkan pesanan Anda!')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Panggil Pelayan
                    </button>
                  )}
                  
                  {order.status === 'completed' && (
                    <>
                      <button
                        onClick={() => alert('Terima kasih atas pesanan Anda!')}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Beri Rating
                      </button>
                      <button
                        onClick={() => navigate('/menu')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Pesan Lagi
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigate(`/order-status`, {
                      state: { orderId: order.id }
                    })}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'active' ? '📋' : '📜'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'active' ? 'Tidak ada pesanan aktif' : 'Tidak ada riwayat pesanan'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'active' 
                ? 'Anda belum memiliki pesanan yang aktif saat ini' 
                : 'Anda belum pernah melakukan pemesanan'
              }
            </p>
            {activeTab === 'active' && (
              <button
                onClick={() => navigate('/menu')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Buat Pesanan Baru
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerPortal;
