import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuildingSection } from '../components/BuildingSection';
import { Campus, Building } from '../App';
import { fetchCampuses, fetchBuildingsWithRooms, addBuilding as apiAddBuilding, updateBuilding as apiUpdateBuilding, deleteBuilding as apiDeleteBuilding } from '../api/api';

interface BuildingPageProps {
  campuses: Campus[];
  buildings: Building[];
  onAdd: (b: Omit<Building, 'id'>) => void;
  onUpdate: (id: number, b: Omit<Building, 'id'>) => void;
  onDelete: (id: number) => void;
}

interface ApiBuilding {
  id: number;
  campus_id: number;
  name: string;
  floor_count: number;
}

export default function BuildingPage({ campuses, buildings: initialBuildings, onAdd, onUpdate, onDelete }: BuildingPageProps) {
  const params = useParams<{ campusId: string }>();
  const campusId = Number(params.campusId);
  const navigate = useNavigate();

  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [loading, setLoading] = useState(true);
  const [campus, setCampus] = useState<Campus | null>(null);


useEffect(() => {
  if (!campusId) return;

  fetchCampuses()
    .then(data => {
      const found = data.find(c => c.id === campusId);
      setCampus(found ?? null);
    });
}, [campusId]);



  useEffect(() => {
  if (!campusId) return;

  setLoading(true);
  fetchBuildingsWithRooms(campusId)
    .then((data: ApiBuilding[]) => {
      const mappedBuildings: Building[] = data.map(b => ({
        id: b.id,
        campusId: b.campus_id,
        name: b.name,
        floorCount: b.floor_count,
      }));
      setBuildings(mappedBuildings);
    })
    .catch(err => {
      console.error('Error fetching buildings:', err);
      setBuildings([]);
    })
    .finally(() => setLoading(false));
}, [campusId]);



  const handleAdd = async (building: Omit<Building, 'id'>) => {
  try {
    const newBuilding = await apiAddBuilding({ ...building, campusId });
    setBuildings(prev => [...prev, newBuilding]);
  } catch (err) {
    console.error('Error adding building:', err);
  }
};


  const handleUpdate = async (id: number, building: Omit<Building, 'id'>) => {
    try {
      const updated = await apiUpdateBuilding(id, building);
      setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
    } catch (err) {
      console.error('Error updating building:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDeleteBuilding(id);
      setBuildings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting building:', err);
    }
  };

  if (!campusId || !campus) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-red-600 text-center">Campus not found.</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">{campus.name}</h1>
          <p className="text-gray-600">Manage buildings under this campus</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Back
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading buildings...</div>
      ) : (
        <BuildingSection
          campusId={campusId}
          buildings={buildings}
          campuses={campuses}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
