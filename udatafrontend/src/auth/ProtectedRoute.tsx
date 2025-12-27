import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import { DataProvider } from '../context/DataContext.js';

export default function ProtectedRoute() {
    const { isAuthenticated, isInitializing } = useAuth(); //use the context

    if (isInitializing) {
        return <div className="text-center py-8">Checking authentication...</div>;
    }

    return isAuthenticated ? 
            <DataProvider>
                <Outlet />
            </DataProvider> : <Navigate to="/" />;
}
