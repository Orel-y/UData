import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/api';
import { Campus, Building, Room } from '../App';

// Pending building operation stored when offline
// type PendingBuildingOp = {
//   opId: string;
//   type: 'add' | 'update' | 'delete';
//   tempId?: number; // used for adds before server assigns id
//   id?: number; // server id or eventual id
//   payload?: any; // the building data
//   createdAt: number;
// };

export interface DataContextValue {
  campuses: Campus[];
  fetchCampuses: () => Promise<Campus[]>;
  fetchBuildingsWithRooms: (campusId?: string) => Promise<api.ApiBuilding[]>;
  fetchRoomsByBuilding: (buildingId: string) => Promise<Room[]>;
  addCampus: (campus: Omit<Campus, 'id'>) => Promise<Campus>;
  updateCampus: (id: string, campus: Omit<Campus, 'id'>) => Promise<Campus>;
  deleteCampus: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campuses, setCampuses] = useState<Campus[]>([]);

  const fetchCampuses = async () => {
    const data = await api.fetchCampuses();
    setCampuses(data);
    return data;
  };

  const fetchBuildingsWithRooms = async (campusId?: string) => {
    const data = await api.fetchBuildingsWithRooms(campusId);
    return data;
  };

  const fetchRoomsByBuilding = async (buildingId: string) => {
    const data = await api.fetchRoomsByBuilding(buildingId);
    // replace rooms for this building
    setRooms(prev => {
      const other = prev.filter(r => r.buildingId !== buildingId);
      return [...other, ...data];
    });
    return data;
  };

  const addCampus = async (campus: Omit<Campus, 'id'>) => {
    const data = await api.addCampus(campus);
    setCampuses(prev => [...prev, data]);
    return data;
  };


  const updateCampus = async (id: string, campus: Omit<Campus, 'id'>) => {
    const updated = await api.updateCampus(id, campus);
    setCampuses(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCampus = async (id: string) => {
    await api.deleteCampus(id);
    setCampuses(prev => prev.filter(c => c.id !== id));
    // remove buildings and rooms related to that campus
    const removedBuildingIds = buildings.filter(b => b.campus_id === id).map(b => b.id);
    setBuildings(prev => prev.filter(b => b.campus_id !== id));
    setRooms(prev => prev.filter(r => !removedBuildingIds.includes(r.building_id)));
  };


  return (
    <DataContext.Provider
      value={{
        campuses,
        fetchCampuses,
        fetchBuildingsWithRooms,
        fetchRoomsByBuilding,
        addCampus,
        updateCampus,
        deleteCampus
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export default DataContext;
