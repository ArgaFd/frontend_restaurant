import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const QRScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initQRScanner = async () => {
      try {
        // In a real app, you would use a QR code scanning library like jsQR or ZXing
        // For demo purposes, we'll simulate a successful scan after 2 seconds
        const timer = setTimeout(() => {
          // Simulate a successful scan with a table number
          const tableNumber = Math.floor(Math.random() * 20) + 1; // Random table number 1-20
          const result = `table-${tableNumber}`;
          setScanResult(result);
          
          // Navigate to menu page with table number
          navigate(`/menu?table=${tableNumber}`);
        }, 2000);

        return () => clearTimeout(timer);
      } catch (err) {
        setError('Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
        console.error('Error accessing camera:', err);
      }
    };

    initQRScanner();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Scan QR Code Meja
        </h1>
        
        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-4 border-primary-500 rounded-lg pointer-events-none" />
          
          {!scanResult && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <p>Mengarahkan kamera...</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Arahkan kamera ke QR Code yang tersedia di meja Anda
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
