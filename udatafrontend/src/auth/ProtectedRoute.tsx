import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import { DataProvider } from '../context/DataContext.js';
import { useEffect } from 'react';
import { getCurrentUser } from '../api/api.js';

export default function ProtectedRoute() {
    const { isAuthenticated, isInitializing,setIsAuthenticated,setIsInitializing,setCurrentUser } = useAuth(); //use the context

     // initialize auth state once on mount
    useEffect(()=>{
        const initialize = async()=>{
          try{
            setCurrentUser(await getCurrentUser());
            setIsAuthenticated(true);
            setIsInitializing(false);
          }catch{
            setIsAuthenticated(false);
            setIsInitializing(false);
          }
        }

        initialize();
    }, [])

    if (isInitializing) {
        return <div className="text-center py-8">Checking authentication...</div>;
    }

    return isAuthenticated ? 
            <DataProvider>
                <Outlet />
            </DataProvider> : <Navigate to="/" />;
}
