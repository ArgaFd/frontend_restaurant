import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuItem } from '../../services/api';

interface CartItem {
  id: number;
  quantity: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, menuItems, tableNumber } = location.state || {
    cart: [],
    menuItems: [],
    tableNumber: '1'
  };

  const [customerName, setCustomerName] = useState('');
  const [selectedTableNumber, setSelectedTableNumber] = useState(parseInt(tableNumber || '1'));
  // Set default to manual for simplicity
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'manual' | 'mock'>('manual');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cart.reduce((total: number, cartItem: CartItem) => {
    const item = menuItems.find((i: MenuItem) => i.id === cartItem.id);
    return total + (item ? item.price * cartItem.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert('Silakan masukkan nama pelanggan');
      return;
    }

    if (!selectedTableNumber || Number.isNaN(selectedTableNumber) || selectedTableNumber < 1) {
      alert('Silakan masukkan nomor meja yang valid');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        tableNumber: selectedTableNumber,
        customerName: customerName.trim(),
        items: cart.map((item: CartItem) => ({
          menuId: item.id,
          quantity: item.quantity,
          price: menuItems.find((menuItem: MenuItem) => menuItem.id === item.id)?.price,
        })),
      };

      // Navigate to payment page with order data
      navigate('/payment', {
        state: {
          orderData,
          paymentMethod,
          totalAmount
        }
      });
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Gagal memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-8 text-white">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-white/80 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Menu
            </button>
            <h1 className="text-3xl font-black">Checkout</h1>
            <p className="text-white/90 mt-2">Selesaikan pesanan Anda</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-6">Informasi Pelanggan</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Meja
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={selectedTableNumber}
                      onChange={(e) => setSelectedTableNumber(parseInt(e.target.value || '1'))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Masukkan nomor meja"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Customer
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-6">Ringkasan Pesanan</h2>
                
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((cartItem: CartItem) => {
                      const menuItem = menuItems.find((item: MenuItem) => item.id === cartItem.id);
                      if (!menuItem) return null;
                      
                      return (
                        <div key={cartItem.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{menuItem.name}</div>
                            <div className="text-sm text-gray-600">Rp {menuItem.price.toLocaleString('id-ID')} x {cartItem.quantity}</div>
                          </div>
                          <div className="font-black text-orange-600">
                            Rp {(menuItem.price * cartItem.quantity).toLocaleString('id-ID')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-gray-900">Total:</span>
                      <span className="text-2xl font-black text-orange-600">
                        Rp {totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-8">
              <h2 className="text-xl font-black text-gray-900 mb-6">Metode Pembayaran</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('manual')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'manual'
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">💰</div>
                    <div>
                      <div className="font-black text-gray-900">Manual Payment</div>
                      <div className="text-sm text-gray-600 mt-1">Bayar ke Kasir (Recommended)</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              
              <button
                onClick={handleCheckout}
                disabled={!customerName.trim() || isProcessing}
                className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Memproses...' : paymentMethod === 'qris' ? 'Bayar dengan QRIS' : 'Buat Pesanan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
