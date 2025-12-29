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
  rooms: Room[];
  fetchCampuses: () => Promise<Campus[]>;
  fetchBuildingsWithRooms: (campusId?: string) => Promise<api.ApiBuilding[]>;
  fetchRoomsByBuilding: (buildingId: string) => Promise<Room[]>;
  addCampus: (campus: Omit<Campus, 'id'>) => Promise<Campus>;
  updateCampus: (id: string, campus: Omit<Campus, 'id'>) => Promise<Campus>;
  deleteCampus: (id: string) => Promise<void>;
  addRoom: (room: Omit<Room, 'id'>) => Promise<Room>;
  updateRoom: (id: string, room: Omit<Room, 'id'>) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
  // Sync local campuses that are present in state but not on the backend
  // Offline building sync helpers
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

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


  const addRoom = async (room: Omit<Room, 'id'>) => {
    const data = await api.addRoom(room);
    setRooms(prev => [...prev, data]);
    return data;
  };

  const updateRoom = async (id: string, room: Omit<Room, 'id'>) => {
    const updated = await api.updateRoom(id.toString(), room);
    setRooms(prev => prev.map(r => (r.id === id ? updated : r)));
    return updated;
  };

  const deleteRoom = async (id: string) => {
    await api.deleteRoom(id);
    setRooms(prev => prev.filter(r => r.id !== id));
    return 
  };


  return (
    <DataContext.Provider
      value={{
        campuses,
        rooms,
        fetchCampuses,
        fetchBuildingsWithRooms,
        fetchRoomsByBuilding,
        addCampus,
        updateCampus,
        deleteCampus,
        addRoom,
        updateRoom,
        deleteRoom,
        // offline building sync helpers
        // syncPendingBuildings: flushPendingBuildingOps,
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
