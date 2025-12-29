import { useEffect } from 'react';
import { CampusSection } from '../components/CampusSection';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { getCurrentUser } from '../api/api';

export default function CampusPage() {
  const navigate = useNavigate();
  const { campuses, fetchCampuses, addCampus, updateCampus, deleteCampus } = useData();
  const { currentUser, setIsAuthenticated, setIsInitializing, setCurrentUser } = useAuth();

  const isAdmin = currentUser?.role=="ADMIN";
     useEffect(()=>{
      // making sure user is authenticated
          const initialize = async()=>{
            if(currentUser){
              setIsAuthenticated(true);
              setIsInitializing(false);
              return;
            }
            try{
              setCurrentUser(await getCurrentUser());
              setIsAuthenticated(true);
              setIsInitializing(false);
            }catch{
              setIsAuthenticated(false);
              setIsInitializing(true);
              navigate('/');
            }
          }
  
          initialize();
      }, [])
  useEffect(() => {
    // Ensure campuses are loaded
    fetchCampuses()
    .catch(err => console.error('Error fetching campuses:', err));
  }, []);

  const handleNavigate = (id: string) => navigate(`/campuses/${id}/buildings`);

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
