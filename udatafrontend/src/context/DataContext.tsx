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

  const [pendingBuildingOps, setPendingBuildingOps] = useState<PendingBuildingOp[]>(() => loadPendingBuildingOps());

  const enqueuePendingBuildingOp = (op: PendingBuildingOp) => {
    setPendingBuildingOps(prev => {
      const next = [...prev, op];
      savePendingBuildingOps(next);
      return next;
    });
  };

  const { currentUser } = useAuth();

  const addBuilding = async (building: Omit<Building, 'id'>) => {
    // attach creator if present
    const createdBy = currentUser?.id;

    // if offline, create a temporary local record and enqueue for later sync
    if (!navigator.onLine) {
      const tempId = Date.now() * -1; // negative temporary id
      const local: Building & { createdBy?: number } = { id: tempId, ...building, createdBy } as any;
      setBuildings(prev => [...prev, local as any]);
      enqueuePendingBuildingOp({ opId: makeOpId(), type: 'add', tempId, payload: { ...building, createdBy }, createdAt: Date.now() });
      return local as any;
    }

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
      enqueuePendingBuildingOp({ opId: makeOpId(), type: 'add', tempId, payload: { ...building, createdBy }, createdAt: Date.now() });
      return local as any;
    }
  };

  const updateBuilding = async (id: number, building: Omit<Building, 'id'>) => {
    // if the id is a temporary id (negative), just update local and enqueue
    if (id < 0 || !navigator.onLine) {
      setBuildings(prev => prev.map(b => (b.id === id ? { ...b, ...building } : b)));
      enqueuePendingBuildingOp({ opId: makeOpId(), type: 'update', tempId: id < 0 ? id : undefined, id: id > 0 ? id : undefined, payload: building, createdAt: Date.now() });
      return { id, ...building } as Building;
    }

    try {
      const updated = await api.updateBuilding(id, building);
      setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
      return updated;
    } catch (err) {
      console.warn('updateBuilding failed, queuing op', err);
      setBuildings(prev => prev.map(b => (b.id === id ? { ...b, ...building } : b)));
      enqueuePendingBuildingOp({ opId: makeOpId(), type: 'update', id, payload: building, createdAt: Date.now() });
      return { id, ...building } as Building;
    }
  };

  const deleteBuilding = async (id: number) => {
    // if deleting a temporary (local-only) building, just remove it and drop any pending adds
    if (id < 0 || !navigator.onLine) {
      setBuildings(prev => prev.filter(b => b.id !== id));
      setRooms(prev => prev.filter(r => r.buildingId !== id));
      // remove related pending ops (e.g., add) and keep updated queue
      setPendingBuildingOps(prev => {
        const next = prev.filter(op => !(op.type === 'add' && op.tempId === id));
        savePendingBuildingOps(next);
        return next;
      });
      // queue a delete only if it had a real id but we're offline (handled above by !navigator.onLine)
      if (id > 0 && !navigator.onLine) {
        enqueuePendingBuildingOp({ opId: makeOpId(), type: 'delete', id, createdAt: Date.now() });
      }
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
      enqueuePendingBuildingOp({ opId: makeOpId(), type: 'delete', id, createdAt: Date.now() });
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

  const flushPendingBuildingOps = async () => {
    const ops = loadPendingBuildingOps();
    if (!ops || ops.length === 0) return { processed: 0 };

    let remaining: PendingBuildingOp[] = [...ops];
    const tempIdMap = new Map<number, number>(); // tempId -> realId

    // Process adds first
    for (const op of ops.filter(o => o.type === 'add')) {
      try {
        const { payload, tempId } = op;
        const created = await api.addBuilding(payload);
        // replace local temp in state
        setBuildings(prev => prev.map(b => (b.id === tempId ? created : b)));
        tempIdMap.set(tempId!, created.id);
        // remove this op from remaining
        remaining = remaining.filter(r => r.opId !== op.opId);
        // update other ops that referenced tempId
        remaining = remaining.map(r => {
          if (r.tempId && r.tempId === tempId) {
            return { ...r, id: created.id, tempId: undefined };
          }
          return r;
        });
      } catch (err) {
        console.error('Failed to flush add op', op, err);
        // likely still offline or server error - stop processing to avoid repeated failures
        savePendingBuildingOps(remaining);
        setPendingBuildingOps(remaining);
        return { processed: ops.length - remaining.length };
      }
    }

    // Process updates
    for (const op of remaining.filter(o => o.type === 'update')) {
      try {
        const idToUse = op.id ?? op.tempId;
        if (!idToUse || (op.tempId && !tempIdMap.has(op.tempId))) {
          // cannot process update if it references an add that failed to sync
          continue;
        }
        const id = op.id ?? tempIdMap.get(op.tempId!);
        const updated = await api.updateBuilding(id!, op.payload);
        setBuildings(prev => prev.map(b => (b.id === id ? updated : b)));
        remaining = remaining.filter(r => r.opId !== op.opId);
      } catch (err) {
        console.error('Failed to flush update op', op, err);
        savePendingBuildingOps(remaining);
        setPendingBuildingOps(remaining);
        return { processed: ops.length - remaining.length };
      }
    }

    // Process deletes
    for (const op of remaining.filter(o => o.type === 'delete')) {
      try {
        // if this delete references a tempId that was never created, just remove it
        if (op.id && op.id < 0) {
          // local-only; nothing to do
          remaining = remaining.filter(r => r.opId !== op.opId);
          continue;
        }
        const id = op.id ?? (op.tempId ? tempIdMap.get(op.tempId) : undefined);
        if (!id) {
          remaining = remaining.filter(r => r.opId !== op.opId);
          continue;
        }
        await api.deleteBuilding(id);
        setBuildings(prev => prev.filter(b => b.id !== id));
        setRooms(prev => prev.filter(r => r.buildingId !== id));
        remaining = remaining.filter(r => r.opId !== op.opId);
      } catch (err) {
        console.error('Failed to flush delete op', op, err);
        savePendingBuildingOps(remaining);
        setPendingBuildingOps(remaining);
        return { processed: ops.length - remaining.length };
      }
    }

    savePendingBuildingOps(remaining);
    setPendingBuildingOps(remaining);
    return { processed: ops.length - remaining.length };
  };

  useEffect(() => {
    // try flushing pending ops when we become online
    const onOnline = () => {
      flushPendingBuildingOps().catch(err => console.error('Error flushing building ops on online', err));
    };

    window.addEventListener('online', onOnline);

    // try on mount if online
    if (navigator.onLine) {
      flushPendingBuildingOps().catch(err => console.error('Error flushing building ops on init', err));
    }

    return () => {
      window.removeEventListener('online', onOnline);
    };
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
        // offline building sync helpers
        syncPendingBuildings: flushPendingBuildingOps,
        pendingBuildingOpsCount: pendingBuildingOps.length,
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
