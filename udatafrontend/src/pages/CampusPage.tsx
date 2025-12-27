import { useEffect } from 'react';
import { CampusSection } from '../components/CampusSection';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export default function CampusPage() {
  const navigate = useNavigate();
  const { campuses, fetchCampuses, addCampus, updateCampus, deleteCampus } = useData();

  useEffect(() => {
    // Ensure campuses are loaded
    fetchCampuses().catch(err => console.error('Error fetching campuses:', err));
  }, []);

  const handleNavigate = (id: number) => navigate(`/campuses/${id}/buildings`);

  return (
    <CampusSection
      campuses={campuses}
      onAdd={addCampus}
      onUpdate={updateCampus}
      onDelete={deleteCampus}
      onNavigate={handleNavigate}
    />
  );
}
