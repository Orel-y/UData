import { useContext } from "react";
import { AppContext, Building } from "../App";
import { BuildingSection } from "../components/BuildingSection";

export default function BuildingPage() {

    const { campuses,buildings, setBuildings, rooms, setRooms } = useContext(AppContext);
    
      const addBuilding = (building: Omit<Building, 'id'>) => {
        const newBuilding = { ...building, id: Date.now().toString() };
        setBuildings([...buildings, newBuilding]);
      };
    
      const updateBuilding = (id: string, building: Omit<Building, 'id'>) => {
        setBuildings(buildings.map(b => b.id === id ? { ...building, id } : b));
      };
    
      const deleteBuilding = (id: string) => {
        setBuildings(buildings.filter(b => b.id !== id));
        setRooms(rooms.filter(r => r.buildingId !== id));
      };
  return (
    <div>
                  <BuildingSection
                    buildings={buildings}
                    campuses={campuses}
                    onAdd={addBuilding}
                    onUpdate={updateBuilding}
                    onDelete={deleteBuilding}
                  />
    </div>
  )
}
