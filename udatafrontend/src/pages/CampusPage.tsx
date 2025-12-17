import { useNavigate } from 'react-router-dom';
import { Campus } from '../App';
import { CampusSection } from '../components/CampusSection';

interface Props {
  campuses: Campus[];
  onAdd: (campus: Omit<Campus, 'id'>) => void;
  onUpdate: (id: string, campus: Omit<Campus, 'id'>) => void;
  onDelete: (id: string) => void;
}

export default function CampusPage({
  campuses,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* Use CampusSection for everything */}
      <CampusSection
        campuses={campuses}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onNavigate={(campusId: string) => navigate(`/campuses/${campusId}/buildings`)}
      />
    </div>
  );
}
