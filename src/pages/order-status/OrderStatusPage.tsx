import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderAPI } from '../../services/api';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface OrderStatusPageProps { }

interface OrderStatus {
  id: string;
  table_number: number;
  customer_name: string;
  status: string;
  items: Array<{
    menu_id: number;
    quantity: number;
    name: string;
    price: number;
  }>;
  total_amount: number;
  created_at: string;
  estimated_time?: number;
}

const OrderStatusPage: React.FC<OrderStatusPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {
    orderId: ''
  };

  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      navigate('/menu');
      return;
    }

    fetchOrderStatus();

    // Set up polling for real-time updates
    const interval = setInterval(fetchOrderStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  const fetchOrderStatus = async () => {
    try {
      const response = await orderAPI.getById(orderId);
      if (response.data.success) {
        const data = response.data.data;
        setOrderStatus({
          id: data.id.toString(),
          table_number: data.tableNumber,
          customer_name: data.customerName,
          status: data.status,
          items: data.items.map((item: any) => ({
            menu_id: item.menuId,
            quantity: item.quantity,
            name: item.name || '',
            price: item.unitPrice || 0
          })),
          total_amount: data.totalAmount,
          created_at: data.createdAt,
          estimated_time: (data as any).estimated_time
        });
        setError('');
      } else {
        setError('Gagal mengambil status pesanan');
      }
    } catch (err) {
      console.error('Failed to fetch order status:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
        return 'Unknown';
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

  const handleCallWaiter = () => {
    // Implement call waiter functionality
    alert('Pelayan akan segera datang ke meja Anda!');
  };

  const handleOrderAgain = () => {
    navigate('/menu');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Memuat status pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !orderStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">Terjadi Kesalahan</h1>
          <p className="text-gray-600 mb-8">{error || 'Pesanan tidak ditemukan'}</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-full font-black hover:shadow-lg transition-all duration-300"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-8 text-white">
            <h1 className="text-3xl font-black">Status Pesanan</h1>
            <p className="text-white/90 mt-2">Nomor Pesanan: #{orderStatus.id}</p>
          </div>

          <div className="p-8">
            {/* Current Status */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{getStatusIcon(orderStatus.status)}</div>
              <div className={`inline-block px-6 py-3 rounded-full font-black text-lg ${getStatusColor(orderStatus.status)}`}>
                {getStatusText(orderStatus.status)}
              </div>
              {orderStatus.estimated_time && (
                <p className="text-gray-600 mt-4">
                  Estimasi waktu: {orderStatus.estimated_time} menit
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-600">
                  {orderStatus.status === 'completed' ? '100%' :
                    orderStatus.status === 'ready' ? '80%' :
                      orderStatus.status === 'cooking' ? '60%' :
                        orderStatus.status === 'processing' ? '40%' : '20%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: orderStatus.status === 'completed' ? '100%' :
                      orderStatus.status === 'ready' ? '80%' :
                        orderStatus.status === 'cooking' ? '60%' :
                          orderStatus.status === 'processing' ? '40%' : '20%'
                  }}
                ></div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-black text-gray-900 mb-4">Detail Pesanan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Meja:</span>
                  <span className="font-black">{orderStatus.table_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-black">{orderStatus.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu Pemesanan:</span>
                  <span className="font-black">
                    {new Date(orderStatus.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="font-black text-gray-900 mb-4">Pesanan</h3>
              <div className="space-y-3">
                {orderStatus.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</div>
                    </div>
                    <div className="font-black text-orange-600">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-gray-900">Total:</span>
                  <span className="text-2xl font-black text-orange-600">
                    Rp {orderStatus.total_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCallWaiter}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-black hover:bg-gray-200 transition-colors"
              >
                🙋‍♂️ Panggil Pelayan
              </button>

              {orderStatus.status === 'completed' && (
                <button
                  onClick={handleOrderAgain}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-2xl font-black hover:shadow-xl transition-all duration-300"
                >
                  🍽️ Pesan Lagi
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <div className="mt-6 text-center">
              <button
                onClick={fetchOrderStatus}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center mx-auto"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
