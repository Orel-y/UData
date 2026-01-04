import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import { DataProvider } from '../context/DataContext.js';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/api.js';

export default function ProtectedRoute() {
    const { isAuthenticated, isInitializing,setIsAuthenticated,setIsInitializing,setCurrentUser } = useAuth(); //use the context
    const [loading,setLoading] = useState(true);

     // initialize auth state once on mount
    useEffect(()=>{
          getCurrentUser()
          .then((data)=>{
              setCurrentUser(data);
                setIsAuthenticated(true);
                setIsInitializing(false);
          }).catch(async ()=>{
            await new Promise(r=>setTimeout(r,1000));
            try{
              setCurrentUser(await getCurrentUser());
              setIsAuthenticated(true);
              setIsInitializing(false);
            }catch{
              setIsInitializing(false)
              setIsAuthenticated(false);
            }
            })

    }, [])


    if (isInitializing) {
        return <div className="text-center py-8">Checking authentication...</div>;
    }

    return isAuthenticated ? 
            <DataProvider>
                <Outlet />
            </DataProvider> : <Navigate to="/" />;
}
