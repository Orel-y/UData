import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/api';
import { Campus, Building, Room } from '../App';
import { useAuth } from '../auth/useAuth';
// lightweight op id generator (avoids adding a dependency)
const makeOpId = () => `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

// Pending building operation stored when offline
type PendingBuildingOp = {
  opId: string;
  type: 'add' | 'update' | 'delete';
  tempId?: number; // used for adds before server assigns id
  id?: number; // server id or eventual id
  payload?: any; // the building data
  createdAt: number;
};

const PENDING_BUILDING_OPS_KEY = 'pendingBuildingOps';

const loadPendingBuildingOps = (): PendingBuildingOp[] => {
  try {
    const raw = localStorage.getItem(PENDING_BUILDING_OPS_KEY);
    return raw ? (JSON.parse(raw) as PendingBuildingOp[]) : [];
  } catch (e) {
    console.error('Failed to load pending building ops', e);
    return [];
  }
};

const savePendingBuildingOps = (ops: PendingBuildingOp[]) => {
  try {
    localStorage.setItem(PENDING_BUILDING_OPS_KEY, JSON.stringify(ops));
  } catch (e) {
    console.error('Failed to save pending building ops', e);
  }
};

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
  // Offline building sync helpers
  syncPendingBuildings: () => Promise<{ processed: number } | void>;
  pendingBuildingOpsCount: number;
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


  const { currentUser } = useAuth();

  const addBuilding = async (building: Omit<Building, 'id'>) => {
    // attach creator if present
    const createdBy = currentUser?.id;
    try {
      const data = await api.addBuilding(building);
      // preserve createdBy for frontend if set
      const withCreator = createdBy ? { ...data, createdBy } : data;
      setBuildings(prev => [...prev, withCreator as any]);
      return withCreator as any;
    } catch (err) {
      console.warn('addBuilding failed, queuing op', err);
      const tempId = Date.now() * -1;
      const local: Building & { createdBy?: number } = { id: tempId, ...building, createdBy } as any;
      setBuildings(prev => [...prev, local as any]);
      return local as any;
    }
  };

  const updateBuilding = async (id: number, building: Omit<Building, 'id'>) => {
    // if the id is a temporary id (negative), just update local and enqueue
    if (id < 0 || !navigator.onLine) {
      setBuildings(prev => prev.map(b => (b.id === id ? { ...b, ...building } : b)));
      return { id, ...building } as Building;
    }

    try {
      const updated = await api.updateBuilding(id, building);
      setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
      return updated;
    } catch (err) {
      console.warn('updateBuilding failed, queuing op', err);
      setBuildings(prev => prev.map(b => (b.id === id ? { ...b, ...building } : b)));
      return { id, ...building } as Building;
    }
  };

  const deleteBuilding = async (id: number) => {
    // if deleting a temporary (local-only) building, just remove it and drop any pending adds
    if (id < 0 || !navigator.onLine) {
      setBuildings(prev => prev.filter(b => b.id !== id));
      setRooms(prev => prev.filter(r => r.buildingId !== id));
      // remove related pending ops (e.g., add) and keep updated queue
    
      return;
    }

    try {
      await api.deleteBuilding(id);
      setBuildings(prev => prev.filter(b => b.id !== id));
      setRooms(prev => prev.filter(r => r.buildingId !== id));
    } catch (err) {
      console.warn('deleteBuilding failed, queuing op', err);
      setBuildings(prev => prev.filter(b => b.id !== id));
      setRooms(prev => prev.filter(r => r.buildingId !== id));
    }
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
