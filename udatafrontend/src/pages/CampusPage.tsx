import { useEffect, useState } from 'react';
import { Campus } from '../App';
import { CampusSection } from '../components/CampusSection';
import { fetchCampuses, addCampus, updateCampus, deleteCampus } from '../api/api.ts';
import { useNavigate } from 'react-router-dom';

export default function CampusPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampuses().then(setCampuses);
  }, []);

  const handleAdd = async (campus: Omit<Campus, 'id'>) => {
    try {
      const newCampus = await addCampus(campus);
      setCampuses(prev => [...prev, newCampus]); // use functional updater
    } catch (error) {
      console.error('Failed to add campus:', error);
    }
  };

  const handleUpdate = async (id: string, campus: Omit<Campus, 'id'>) => {
    try {
      const updated = await updateCampus(id, campus);
      setCampuses(prev => prev.map(c => (c.id.toString() === id ? updated : c)));
    } catch (error) {
      console.error('Failed to update campus:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCampus(id);
      setCampuses(prev => prev.filter(c => c.id.toString() !== id));
    } catch (error) {
      console.error('Failed to delete campus:', error);
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/campuses/${id}/buildings`);
  };

  return (
    <CampusSection
      campuses={campuses}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onNavigate={handleNavigate}
    />
  );
}
