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
      <CampusSection
        campuses={campuses}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />


      <div>
        <br />
        <h1 className="text-gray-900 mb-4 ">Campuses</h1>
        <div className="grid gap-4">
          {campuses.map(campus => (
            <div
              key={campus.id}
              onClick={() =>
                navigate(`/campuses/${campus.id}/buildings`)
              }
              className="bg-white p-4 rounded-lg border cursor-pointer hover:bg-gray-50"
            >
              <h2 className="text-blue-600 text-lg">
                {campus.name}
              </h2>
              <p className="text-gray-500">{campus.location}</p>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
}
