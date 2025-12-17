import { useParams, useNavigate } from 'react-router-dom';
import { BuildingSection } from '../components/BuildingSection';
import { Campus, Building } from '../App';
import { ArrowLeft } from 'lucide-react';

interface BuildingPageProps {
  buildings: Building[];
  campuses: Campus[];
  onAdd: (building: Omit<Building, 'id'>) => void;
  onUpdate: (id: string, building: Omit<Building, 'id'>) => void;
  onDelete: (id: string) => void;
}

export default function BuildingPage({
  buildings,
  campuses,
  onAdd,
  onUpdate,
  onDelete,
}: BuildingPageProps) {
  const { campusId } = useParams<{ campusId: string }>();
  const navigate = useNavigate();

  const campus = campuses.find(c => c.id === campusId);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Campuses
      </button>

      <div>
        <h1 className="text-blue-900 font-bold">{campus.name}</h1>
        <p className="text-gray-500">Manage buildings under this campus</p>
        <br />
      </div>

      <BuildingSection
        campusId={campusId}
        buildings={buildings}
        campuses={campuses}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}
