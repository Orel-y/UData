import { useEffect, useState } from 'react';
import { Campus } from '../App';
import { CampusSection } from '../components/CampusSection';
import { fetchCampuses, addCampus as apiAddCampus, updateCampus as apiUpdateCampus, deleteCampus as apiDeleteCampus } from '../api/api';
import { useNavigate } from 'react-router-dom';

interface CampusPageProps {
  campuses: Campus[];
  onAdd: (c: Omit<Campus, 'id'>) => void;
  onUpdate: (id: number, c: Omit<Campus, 'id'>) => void;
  onDelete: (id: number) => void;
}

export default function CampusPage({ campuses: initialCampuses, onAdd, onUpdate, onDelete }: CampusPageProps) {
  const [campuses, setCampuses] = useState<Campus[]>(initialCampuses);
  const navigate = useNavigate();

  // Fetch campuses from backend (optional if you want live sync)
  useEffect(() => {
    fetchCampuses()
      .then(data => setCampuses(data))
      .catch(err => console.error('Error fetching campuses:', err));
  }, []);

  const handleAdd = async (campus: Omit<Campus, 'id'>) => {
    try {
      const newCampus = await apiAddCampus(campus);
      setCampuses(prev => [...prev, newCampus]);
    } catch (err) {
      console.error('Failed to add campus:', err);
    }
  };

  const handleUpdate = async (id: number, campus: Omit<Campus, 'id'>) => {
    try {
      const updated = await apiUpdateCampus(id, campus);
      setCampuses(prev => prev.map(c => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Failed to update campus:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDeleteCampus(id);
      setCampuses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete campus:', err);
    }
  };

  const handleNavigate = (id: number) => {
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
