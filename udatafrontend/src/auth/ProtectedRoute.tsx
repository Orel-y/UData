import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth(); //use the context
    
    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/" />
    )
}
