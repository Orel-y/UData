import React, { useContext } from "react";
import { AppContext, Building } from "../App";
import { BuildingSection } from "../components/BuildingSection";
import {useParams,useNavigate } from 'react-router-dom'

export default function BuildingPage() {
  const navigate = useNavigate();

    const { campuses,buildings, setBuildings, rooms, setRooms } = useContext(AppContext);
    const {campusId} = useParams();
    const campus = campuses.filter(c => c.id === campusId)[0];
    const filteredBuildings = buildings.filter(b => b.campusId === campusId);

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
          (campus ? <BuildingSection
                        campus={campus}
                        currentCampusBuildings= {filteredBuildings}
                        onAdd={addBuilding}
                        onUpdate={updateBuilding}
                        onDelete={deleteBuilding}
                      />
                    : "No Campus exists with this credential")
            
      )
}
