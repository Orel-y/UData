import { useEffect, useState } from 'react';
import { CampusSection } from '../components/CampusSection';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function CampusPage() {
  const navigate = useNavigate();
  const { campuses, fetchCampuses, addCampus, updateCampus, deleteCampus, syncLocalCampusesToBackend } = useData();
  const { currentUser, logout } = useAuth();

  const visibleCampuses = currentUser?.permittedCampusIds && currentUser.permittedCampusIds.length > 0
    ? campuses.filter(c => currentUser.permittedCampusIds.includes(c.id))
    : campuses;

  const isAdmin = !!currentUser?.isAdmin;

  useEffect(() => {
    // Ensure campuses are loaded
    fetchCampuses().catch(err => console.error('Error fetching campuses:', err));
  }, []);

  const handleNavigate = (id: number) => navigate(`/campuses/${id}/buildings`);

  return (
      <CampusSection
        campuses={visibleCampuses}
        onAdd={addCampus}
        onUpdate={updateCampus}
        onDelete={deleteCampus}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
      />
  );
}
