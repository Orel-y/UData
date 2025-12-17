import { useParams, useNavigate } from 'react-router-dom';
import { Room, Building, Campus } from '../App';
import { RoomSection } from '../components/RoomSection';
import { ArrowLeft } from 'lucide-react';

interface Props {
  rooms: Room[];
  buildings: Building[];
  campuses: Campus[];
  onAdd: (room: Omit<Room, 'id'>) => void;
  onUpdate: (id: number, room: Omit<Room, 'id'>) => void;
  onDelete: (id: number) => void;
}

export default function RoomPage({
  rooms,
  buildings,
  campuses,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();

  // Convert buildingId from string to number
  const buildingIdNumber = buildingId ? Number(buildingId) : undefined;

  // Find the building
  const building = buildingIdNumber
    ? buildings.find(b => b.id === buildingIdNumber)
    : undefined;

  // Find campus of the building
  const campus = building ? campuses.find(c => c.id === building.campusId) : undefined;

  if (!building) {
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
          <h1 className="text-gray-900 text-2xl font-bold">{building.name}</h1>
          <p className="text-gray-600">Manage rooms under this building</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Back
        </button>
      </div>

      <RoomSection
        selectedBuildingId={buildingIdNumber!} // now a number
        rooms={rooms}
        buildings={buildings}
        campuses={campuses}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}
