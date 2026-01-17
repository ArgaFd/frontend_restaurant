import { useState, useEffect } from 'react';
import { FiPieChart, FiTrendingUp, FiShoppingBag, FiCalendar } from 'react-icons/fi';
import { reportAPI } from '../../services/api';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const reportTypes = [
    { id: 'daily', label: 'Laporan Harian', description: 'Lihat pendapatan harian', icon: <FiCalendar /> },
    { id: 'weekly', label: 'Laporan Mingguan', description: 'Lihat pendapatan mingguan', icon: <FiTrendingUp /> },
    { id: 'monthly', label: 'Laporan Bulanan', description: 'Lihat pendapatan bulanan', icon: <FiPieChart /> },
    { id: 'popular', label: 'Menu Terpopuler', description: 'Menu yang paling laku', icon: <FiShoppingBag /> },
  ];

  useEffect(() => {
    fetchReport();
  }, [selectedReport, date]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      // Backend getSalesReport handles daily, weekly, monthly via 'period' param
      const response = await reportAPI.getDailyReport(date, selectedReport === 'popular' ? 'monthly' : selectedReport);
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laporan Bisnis</h2>
          <p className="text-gray-600">Pantau performa penjualan restoran Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Pilih Tanggal:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedReport(type.id)}
            className={`p-4 rounded-xl border text-left transition-all ${selectedReport === type.id
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
              : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-300'
              }`}
          >
            <div className={`p-2 rounded-lg w-fit mb-3 ${selectedReport === type.id ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
              {type.icon}
            </div>
            <p className="font-bold">{type.label}</p>
            <p className={`text-xs ${selectedReport === type.id ? 'text-indigo-100' : 'text-gray-500'}`}>{type.description}</p>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="spinner-modern mx-auto mb-4"></div>
            Memproses data laporan...
          </div>
        ) : reportData ? (
          <div className="p-6 space-y-8">
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Pendapatan</p>
                <p className="text-2xl font-black text-gray-900">Rp {reportData.summary.totalRevenue.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Pesanan</p>
                <p className="text-2xl font-black text-gray-900">{reportData.summary.totalOrders}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rata-rata Transaksi</p>
                <p className="text-2xl font-black text-gray-900">Rp {reportData.summary.averageOrderValue.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Periode</p>
                <p className="text-lg font-bold text-indigo-600 capitalize">{reportData.summary.period}</p>
              </div>
            </div>

            {/* Popular Items */}
            {selectedReport === 'popular' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Menu Terpopuler</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 text-sm font-bold text-gray-400">Nama Menu</th>
                        <th className="pb-3 text-sm font-bold text-gray-400">Jumlah Terjual</th>
                        <th className="pb-3 text-sm font-bold text-gray-400 text-right">Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.topSellingItems.map((item: any) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="py-4 font-bold text-gray-900">{item.name}</td>
                          <td className="py-4 text-gray-600">{item.quantity} porsi</td>
                          <td className="py-4 text-right font-mono font-bold text-indigo-600">Rp {item.totalRevenue.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Default View: Detail Periods */}
            {selectedReport !== 'popular' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rincian Penjualan</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 text-sm font-bold text-gray-400">Tanggal/Periode</th>
                        <th className="pb-3 text-sm font-bold text-gray-400">Jumlah Order</th>
                        <th className="pb-3 text-sm font-bold text-gray-400 text-right">Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reportData.periods.map((p: any) => (
                        <tr key={p.period} className="hover:bg-gray-50">
                          <td className="py-4 font-bold text-gray-900">{p.period}</td>
                          <td className="py-4 text-gray-600">{p.orderCount} pesanan</td>
                          <td className="py-4 text-right font-mono font-bold text-green-600">Rp {p.revenue.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 font-medium">
            Tidak ada data untuk periode ini.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
