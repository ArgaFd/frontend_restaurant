import React, { useState } from 'react';

interface MockPaymentProps {
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentCancel: () => void;
  amount: number;
}

const MockPayment: React.FC<MockPaymentProps> = ({
  onPaymentSuccess,
  onPaymentCancel,
  amount
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMockPayment = async () => {
    setIsProcessing(true);


    await new Promise(resolve => setTimeout(resolve, 2000));


    const paymentId = 'MOCK_' + Date.now();

    setIsProcessing(false);
    onPaymentSuccess(paymentId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mock Payment</h2>
          <p className="text-gray-600 mb-6">
            Ini adalah sistem pembayaran testing untuk development
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Total Pembayaran:</div>
            <div className="text-3xl font-bold text-orange-600">
              Rp {amount.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleMockPayment}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memproses...
                </div>
              ) : (
                '✅ Bayar Sekarang (Testing)'
              )}
            </button>

            <button
              onClick={onPaymentCancel}
              disabled={isProcessing}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ❌ Batal
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>⚠️ Ini adalah payment testing</p>
            <p>Tidak ada uang asli yang ditransfer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
