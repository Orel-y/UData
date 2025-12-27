import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuildingSection } from '../components/BuildingSection';
import { Building, Campus } from '../App';
import { useData } from '../context/DataContext';

interface ApiBuilding {
  id: number;
  campus_id: number;
  name: string;
  floor_count: number;
}

export default function BuildingPage() {
  const params = useParams<{ campusId: string }>();
  const campusId = Number(params.campusId);
  const navigate = useNavigate();

  const { campuses, fetchBuildingsWithRooms, addBuilding, updateBuilding, deleteBuilding, fetchCampuses, syncPendingBuildings, pendingBuildingOpsCount } = useData();

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [campus, setCampus] = useState<Campus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const onOnlineForUI = async () => {
      if (pendingBuildingOpsCount > 0) {
        setIsSyncing(true);
        try {
          await syncPendingBuildings();
        } catch (err) {
          console.error('Auto sync failed (UI handler):', err);
        } finally {
          setIsSyncing(false);
        }
      }
    };
    window.addEventListener('online', onOnlineForUI);

    // If already online on mount and we have pending ops, show syncing briefly
    if (navigator.onLine && pendingBuildingOpsCount > 0) {
      (async () => {
        setIsSyncing(true);
        try {
          await syncPendingBuildings();
        } catch (err) {
          console.error('Initial auto sync (UI handler) failed', err);
        } finally {
          setIsSyncing(false);
        }
      })();
    }

    return () => window.removeEventListener('online', onOnlineForUI);
  }, [pendingBuildingOpsCount, syncPendingBuildings]);

  useEffect(() => {
    if (!campusId) return;

    // ensure campuses loaded
    fetchCampuses().then(data => {
      const found = data.find(c => c.id === campusId);
      setCampus(found ?? null);
    }).catch(err => console.error(err));
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
      const newBuilding = await addBuilding({ ...building, campusId });
      setBuildings(prev => [...prev, newBuilding]);
    } catch (err) {
      console.error('Error adding building:', err);
    }
  };

  const handleUpdate = async (id: number, building: Omit<Building, 'id'>) => {
    try {
      const updated = await updateBuilding(id, building);
      setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
    } catch (err) {
      console.error('Error updating building:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBuilding(id);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="w-full sm:flex-1">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-bold">{campus.name}</h1>
          <p className="text-gray-600 mt-1">Manage buildings under this campus</p>

          {(!navigator.onLine && pendingBuildingOpsCount > 0) && (
            <div className="mt-3 inline-flex items-center gap-3 text-sm text-yellow-800 bg-yellow-50 px-3 py-2 rounded-md">
              <span className="font-medium">{pendingBuildingOpsCount} pending changes</span>
              <span className="text-sm text-gray-600"> Will sync when you reconnect</span>
            </div>
          )}

          {isSyncing && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-600">
              <div className="h-4 w-4 border-2 border-gray-300 rounded-full animate-spin" />
              <span>Syncing changes…</span>
            </div>
          )}
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
