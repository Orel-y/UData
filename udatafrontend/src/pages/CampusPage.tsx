import { useEffect, useState } from 'react';
import { CampusSection } from '../components/CampusSection';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { getCurrentUser } from '../api/api';

export default function CampusPage() {
  const navigate = useNavigate();
  const { campuses, fetchCampuses, addCampus, updateCampus, deleteCampus } = useData();
  const { currentUser, setIsAuthenticated, setIsInitializing, setCurrentUser } = useAuth();
  const [loading,setLoading] =useState(true);

  const isAdmin = currentUser?.role=="ADMIN";
     useEffect(()=>{
        setIsAuthenticated(true);
        setIsInitializing(false);
        const initialize = async()=>{
            if(currentUser){
              setCurrentUser(await getCurrentUser());
            }
          }
        initialize();
      }, [])
  useEffect(() => {
    // Ensure campuses are loaded
    setLoading(true);
    fetchCampuses()
    .catch(err => console.error('Error fetching campuses:', err))
    .finally(()=>setLoading(false));
  }, []);

  const handleNavigate = (id: string) => navigate(`/campuses/${id}/buildings`);
  if(loading){
        return  <div className="text-center text-gray-500 py-8 bg-white shadow">Loading...</div>
  }
  return (
      <CampusSection
        campuses={campuses}
        onAdd={addCampus}
        onUpdate={updateCampus}
        onDelete={deleteCampus}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
      />
  );
}
