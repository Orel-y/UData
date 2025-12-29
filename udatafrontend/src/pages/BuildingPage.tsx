import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuildingSection } from '../components/BuildingSection';
import { Building, Campus } from '../App';
import { useData } from '../context/DataContext';
import { addBuilding, ApiBuilding, deleteBuilding, updateBuilding } from '../api/api';
import { AxiosError } from 'axios';


export default function BuildingPage() {
  const params = useParams<{ campusId: string }>();
  const campusId = params.campusId;
  const navigate = useNavigate();

  const { campuses, fetchBuildingsWithRooms, fetchCampuses, } = useData();

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [campus, setCampus] = useState<Campus | null>(null);
  const [error,setError] = useState(false);
  const [msg,setMsg] = useState("");

  useEffect(() => {
    if (!campusId) return;

    // ensure campuses loaded
    fetchCampuses().then(data => {
      const found = data.find(c => c.id == campusId);
      setCampus(found ?? null);
      setLoading(false)
    }).catch(err => console.error(err));
  }, [campusId]);

  useEffect(() => {
    if (!campusId) return;

    setLoading(true);
    fetchBuildingsWithRooms(campusId)
      .then((data: ApiBuilding[]) => {
      const mappedBuildings: Building[] = data.map(b => ({
                code:b.code,
                id: b.id,
                campus_id: b.campus_id,
                name: b.name,
                floors: b.floors,
                status:b.status,
                type:b.type
              }));
        
        setBuildings(mappedBuildings);
      })
      .catch(err => {
        console.error('Error fetching buildings:', err);
        setBuildings([]);
      })
      .finally(() => setLoading(false));
  }, [campusId]);

  const delay = async(s:number)=>{
    await new Promise(res=>setTimeout(res,s*1000))
  }

  const handleAdd = async (building: Omit<Building, 'id'>) => {
    try {
      const newBuilding = await addBuilding(building);
      setBuildings(prev => [...prev, newBuilding]);
      setMsg("Building added");
      setError(false);
    } catch (error) {
        console.error('Error adding building:', error);
        const err = error as AxiosError;
        setError(true);
        setMsg(err.response?.data.detail || "Error adding new building")
    }
    finally{
      await delay(3)
      setMsg("")
    }
  };

  const handleUpdate = async (id: string, building: Omit<Building, 'id'>) => {
    try {
      const updated = await updateBuilding(id, building);
      setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
      setMsg("Building updated")
      setError(false)
    } catch (error) {
      console.error('Error updating building:', error);
        const err = error as AxiosError;
        setError(true);
        setMsg(err.response?.data.detail || "Error updating building check the building code")
    }finally{
      await delay(3)
      setMsg("")
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBuilding(id);
      setBuildings(prev => prev.filter(b => b.id !== id));
      setMsg("Building deleted")
      setError(false)
    } catch (error) {
      console.error('Error deleting building:', error);
        const err = error as AxiosError;
        setError(true);
        setMsg(err.response?.data.detail || "Error deleting building")
    }finally{
      await delay(3)
      setMsg("")
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="w-full sm:flex-1">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold">{campus.name}</h1>
          <p className="text-gray-600 mt-1">Manage buildings under this campus</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        </div> 
      </div>

        <div className={error==true?"text-center text-red":"text-center text-green"}>{msg}</div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading buildings...</div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <BuildingSection
            campusId={campusId}
            buildings={buildings}
            campuses={campuses}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      )} 
    </div>
  );
}
