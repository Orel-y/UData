import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/api';
import { Campus, Building, Room } from '../App';

export interface DataContextValue {
  campuses: Campus[];
  buildings: Building[];
  rooms: Room[];
  fetchCampuses: () => Promise<Campus[]>;
  fetchBuildingsWithRooms: (campusId?: number) => Promise<api.ApiBuilding[]>;
  fetchRoomsByBuilding: (buildingId: number) => Promise<Room[]>;
  addCampus: (campus: Omit<Campus, 'id'>) => Promise<Campus>;
  updateCampus: (id: number, campus: Omit<Campus, 'id'>) => Promise<Campus>;
  deleteCampus: (id: number) => Promise<void>;
  addBuilding: (building: Omit<Building, 'id'>) => Promise<Building>;
  updateBuilding: (id: number, building: Omit<Building, 'id'>) => Promise<Building>;
  deleteBuilding: (id: number) => Promise<void>;
  addRoom: (room: Omit<Room, 'id'>) => Promise<Room>;
  updateRoom: (id: number, room: Omit<Room, 'id'>) => Promise<Room>;
  deleteRoom: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchCampuses = async () => {
    const data = await api.fetchCampuses();
    setCampuses(data);
    return data;
  };

  const fetchBuildingsWithRooms = async (campusId?: number) => {
    const data = await api.fetchBuildingsWithRooms(campusId);
    const mapped = data.map(b => ({
      id: b.id,
      campusId: b.campus_id,
      name: b.name,
      floorCount: b.floor_count,
    }));
    // If campusId specified, API returns buildings for that campus only, otherwise all
    if (campusId) {
      // merge/replace only buildings for that campus
      setBuildings(prev => {
        const other = prev.filter(p => p.campusId !== campusId);
        return [...other, ...mapped];
      });
    } else {
      setBuildings(mapped);
    }
    return data;
  };

  const fetchRoomsByBuilding = async (buildingId: number) => {
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

  const updateCampus = async (id: number, campus: Omit<Campus, 'id'>) => {
    const updated = await api.updateCampus(id, campus);
    setCampuses(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCampus = async (id: number) => {
    await api.deleteCampus(id);
    setCampuses(prev => prev.filter(c => c.id !== id));
    // remove buildings and rooms related to that campus
    const removedBuildingIds = buildings.filter(b => b.campusId === id).map(b => b.id);
    setBuildings(prev => prev.filter(b => b.campusId !== id));
    setRooms(prev => prev.filter(r => !removedBuildingIds.includes(r.buildingId)));
  };

  const addBuilding = async (building: Omit<Building, 'id'>) => {
    const data = await api.addBuilding(building);
    setBuildings(prev => [...prev, data]);
    return data;
  };

  const updateBuilding = async (id: number, building: Omit<Building, 'id'>) => {
    const updated = await api.updateBuilding(id, building);
    setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
    return updated;
  };

  const deleteBuilding = async (id: number) => {
    await api.deleteBuilding(id);
    setBuildings(prev => prev.filter(b => b.id !== id));
    setRooms(prev => prev.filter(r => r.buildingId !== id));
  };

  const addRoom = async (room: Omit<Room, 'id'>) => {
    const data = await api.addRoom(room);
    setRooms(prev => [...prev, data]);
    return data;
  };

  const updateRoom = async (id: number, room: Omit<Room, 'id'>) => {
    const updated = await api.updateRoom(id.toString(), room);
    setRooms(prev => prev.map(r => (r.id === id ? updated : r)));
    return updated;
  };

  const deleteRoom = async (id: number) => {
    await api.deleteRoom(id);
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  useEffect(() => {
    // fetch initial campuses on mount
    fetchCampuses().catch(err => console.error('Failed to fetch campuses', err));
  }, []);

  return (
    <DataContext.Provider
      value={{
        campuses,
        buildings,
        rooms,
        fetchCampuses,
        fetchBuildingsWithRooms,
        fetchRoomsByBuilding,
        addCampus,
        updateCampus,
        deleteCampus,
        addBuilding,
        updateBuilding,
        deleteBuilding,
        addRoom,
        updateRoom,
        deleteRoom,
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
