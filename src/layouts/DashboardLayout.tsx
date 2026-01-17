import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoleBasedDashboard from '../components/RoleBasedDashboard';

const DashboardLayout = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <RoleBasedDashboard userRole={user.role}>
            <Outlet />
        </RoleBasedDashboard>
    );
};

export default DashboardLayout;
