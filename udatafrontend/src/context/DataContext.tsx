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
  // Sync local campuses that are present in state but not on the backend
  syncLocalCampusesToBackend: () => Promise<{ added: Campus[]; skipped: Campus[] } | null>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campuses, setCampuses] = useState<Campus[]>([
  {
    id: 4,
    name: "Main Campus",
    location: "Hawassa City, along the highway north of Hawassa"
  },
  {
    id: 5,
    name: "Institute of Technology (IoT) Campus",
    location: "Adjacent to the Main Campus in Hawassa City"
  },
  {
    id: 6,
    name: "College of Agriculture Campus",
    location: "Hawassa City"
  },
  {
    id: 7,
    name: "Medicine and Health Campus",
    location: "Hawassa City (home to the Comprehensive Specialized Hospital)"
  },
  {
    id: 8,
    name: "Wondo Genet Campus",
    location: "Wondo Genet town, ~25 km west of Hawassa"
  },
  {
    id: 9,
    name: "Awada Campus",
    location: "Awada near Yirgalem, ~40 km south of Hawassa"
  },
  {
    id: 10,
    name: "Daye Campus",
    location: "Bensa Daye area, ~125 km south of Hawassa"
  }
]
);
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

  const syncLocalCampusesToBackend = async () => {
    try {
      const remote = await api.fetchCampuses();
      const remoteSet = new Set(remote.map(r => `${r.name}:::${r.location ?? ''}`));
      const toSync = campuses.filter(c => !remoteSet.has(`${c.name}:::${c.location ?? ''}`));

      const added: Campus[] = [];
      for (const local of toSync) {
        try {
          // post to backend and get canonical campus back
          const created = await api.addCampus({ name: local.name, location: local.location });
          // replace the temporary/local entry (matching by name+location OR id) with the created one
          setCampuses(prev => prev.map(p => (p.id === local.id || (p.name === local.name && p.location === local.location) ? created : p)));
          added.push(created);
        } catch (err) {
          console.error('Failed to add campus during sync:', local, err);
        }
      }

      const skipped = campuses.filter(c => remoteSet.has(`${c.name}:::${c.location ?? ''}`));
      return { added, skipped };
    } catch (err) {
      console.error('Error syncing campuses:', err);
      return null;
    }
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
    // fetchCampuses().catch(err => console.error('Failed to fetch campuses', err));
    // instead of fetching campuses filter by the user's id from existing campuses data
    // setCampuses(campuses)
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
        syncLocalCampusesToBackend,
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
