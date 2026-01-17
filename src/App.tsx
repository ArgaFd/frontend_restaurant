import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APP_CONFIG } from './config';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute, StaffRoute, CustomerRoute } from './components/auth/ProtectedRoute';
import { QRScanner } from './components/qr/QRScanner';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ManagementDashboard from './pages/owner/ManagementDashboard';
import MenuPage from './pages/MenuPage';
import StaffPortal from './pages/staff/StaffPortal';

// Layout Components
const AdminLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
    </header>
    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome, Admin!</h2>
          <p className="text-gray-600">This is the admin dashboard where you can manage {APP_CONFIG.NAME}.</p>
        </div>
      </div>
    </main>
  </div>
);


const CustomerLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
      </div>
    </header>
    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Customer Dashboard</h2>
          <p className="text-gray-600">View your orders and manage your profile here.</p>
        </div>
      </div>
    </main>
  </div>
);

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/owner/dashboard" element={<ManagementDashboard />} />
            <Route path="/owner/users" element={<ManagementDashboard />} />
            <Route path="/owner/menu" element={<ManagementDashboard />} />
            <Route path="/owner/reports" element={<ManagementDashboard />} />
            <Route path="/owner/settings" element={<ManagementDashboard />} />
            <Route path="/owner/*" element={<AdminLayout />} />
          </Route>

          {/* Staff Routes */}
          <Route element={<StaffRoute />}>
            <Route path="/staff/orders" element={<StaffPortal />} />
            <Route path="/staff/payments" element={<StaffPortal />} />
            <Route path="/staff/dashboard" element={<StaffPortal />} />
            <Route path="/staff" element={<StaffPortal />} />
            <Route path="/staff/*" element={<StaffPortal />} />
          </Route>

          {/* Customer Routes */}
          <Route element={<CustomerRoute />}>
            <Route path="/customer/*" element={<CustomerLayout />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;