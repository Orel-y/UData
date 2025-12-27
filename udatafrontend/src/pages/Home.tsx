import { useContext } from "react";
import { AppContext, Campus } from "../App";
import { CampusSection } from "../components/CampusSection"

export default function Home() {
    const { campuses, setCampuses, buildings, setBuildings } = useContext(AppContext);

  const addCampus = (campus: Omit<Campus, 'id'>) => {
    const newCampus = { ...campus, id: Date.now().toString() };
    setCampuses([...campuses, newCampus]);
  };

  const updateCampus = (id: string, campus: Omit<Campus, 'id'>) => {
    setCampuses(campuses.map(c => c.id === id ? { ...campus, id } : c));
  };

  const deleteCampus = (id: string) => {
    setCampuses(campuses.filter(c => c.id !== id));
    setBuildings(buildings.filter(b => b.campusId !== id));
  };
  return (
    <div>
        <CampusSection campuses={campuses} onAdd={addCampus} onUpdate={updateCampus} onDelete={deleteCampus} />
      
    </div>
  )
}
