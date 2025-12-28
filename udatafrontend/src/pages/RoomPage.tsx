import { useParams, useNavigate, data } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Room, Building, Campus } from '../App';
import { RoomSection } from '../components/RoomSection';
import { useData } from '../context/DataContext';
import { getBuilding } from '../api/api';

export default function RoomPage() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const {fetchRoomsByBuilding, campuses, addRoom, updateRoom, deleteRoom } = useData();

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
<<<<<<< HEAD
    setLoading(true);
    fetchRoomsByBuilding(buildingIdNumber)
    .then(data=>{
      setRooms(data)
      setLoading(false)
    })
    // fetchBuildingsWithRooms()
    //   .then(data => {
    //     const mappedBuildings: Building[] = data.map(b => ({
    //       id: b.id,
    //       campusId: b.campus_id,
    //       name: b.name,
    //       floorCount: b.floor_count,
    //     }));

    //     const foundBuilding = mappedBuildings.find(b => b.id === buildingIdNumber);
    //     if (!foundBuilding) {
    //       setBuilding(undefined);
    //       setRooms([]);
    //     } else {
    //       setBuilding(foundBuilding);
         
    //       return fetchRoomsByBuilding(buildingIdNumber);
    //     }
    //   })
    //   .then(fetchedRooms => {
    //     if (fetchedRooms) setRooms(fetchedRooms);
    //   })
    //   .catch(err => console.error('Error fetching building or rooms:', err))
    //   .finally(() => setLoading(false));
=======
    const initialize = async()=>{
        try {
          setLoading(true);
          setBuilding(await getBuilding(buildingIdNumber)) 
          setRooms(await fetchRoomsByBuilding(buildingIdNumber));
        } catch (error) {
          
        }
        finally{
          setLoading(false);
        }
      }
      initialize();
>>>>>>> master
  }, [buildingIdNumber]);


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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">{building?.name}</h1>
          <p className="text-gray-600">Manage rooms under this building</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Back
        </button>
      </div>

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
