import { useParams, useNavigate, data } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Room, Building } from '../App';
import { RoomSection } from '../components/RoomSection';
import { useData } from '../context/DataContext';
import { addRoom, deleteRoom, fetchRoomsByBuilding, getBuilding, updateRoom } from '../api/api';

export default function RoomPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const {campuses } = useData();

  // Ensure buildingId is a number or return early
  if (!buildingId) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-red-600 text-center">Invalid building ID.</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const buildingIdNumber = buildingId;

  const [building, setBuilding] = useState<Building | undefined>();
  const campus = building ? campuses.find(c => c.id === building.campus_id) : undefined;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initialize = async()=>{
        try {
          setLoading(true);
          setBuilding(await getBuilding(buildingIdNumber)) 
          setRooms(await fetchRoomsByBuilding(buildingIdNumber));
        } catch (error) {
          console.log(error)
        }
        finally{
          setLoading(false);
        }
      }
      initialize();
  }, [buildingIdNumber]);

  useEffect(()=>{
    if(!buildingIdNumber) return;
    setLoading(true)
    fetchRoomsByBuilding(buildingIdNumber)
    .then(data=>{
        new Promise(res=>setTimeout(res,4000))
        setLoading(false)
        setRooms(data)
    }).catch(err=>console.log(err));
  },[buildingIdNumber])
  

  if (!buildingIdNumber && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-red-600 text-center">Building not found.</p>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6 shadow-sm bg-white rounded-lg border border-gray-200 p-6">

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading rooms...</div>
      ) : (
        <RoomSection
          selectedBuildingId={buildingIdNumber}
          rooms={rooms}
          building={building}
          campus={campus}
          onAdd={addRoom}
          onUpdate={updateRoom}
          onDelete={deleteRoom}
        />
      )}
    </div>
  );
}
