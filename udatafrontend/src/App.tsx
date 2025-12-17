import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

/* Pages */
import CampusPage from './pages/CampusPage';
import BuildingPage from './pages/BuildingPage';
import RoomPage from './pages/RoomPage';

/* Types */
export interface Campus {
  id: string;
  name: string;
  location: string;
}

export interface Building {
  id: string;
  campusId: string;
  name: string;
  floorCount: number;
}

export interface Room {
  id: string;
  buildingId: string;
  roomNumber: string;
  capacity: number;
  roomType: string;
  description: string;
}

export const AppContext = createContext({ campuses: [] as Campus[], buildings: [] as Building[], rooms: [] as Room[], setCampuses: (campuses: Campus[]) => {}, setBuildings: (buildings: Building[]) => {}, setRooms: (rooms: Room[]) => {} });

export default function App() {
  const [campuses, setCampuses] = useState<Campus[]>([
    { id: '1', name: 'Main Campus', location: 'Hawassa, Megbiya' },
    { id: '2', name: 'Agri Campus', location: 'Hawassa, Piyasa' },
  ]);

  const [buildings, setBuildings] = useState<Building[]>([
    { id: '1', campusId: '1', name: 'Arch', floorCount: 2 },
    { id: '2', campusId: '1', name: 'Memariya', floorCount: 4 },
    { id: '3', campusId: '2', name: 'Agri Building', floorCount: 3 },
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', buildingId: '1', roomNumber: '101', capacity: 30, roomType: 'Lecture Hall', description: 'Standard classroom with projector' },
    { id: '2', buildingId: '1', roomNumber: '205', capacity: 50, roomType: 'Lecture Hall', description: 'Large auditorium-style room' },
    { id: '3', buildingId: '2', roomNumber: '301', capacity: 20, roomType: 'Laboratory', description: 'Computer lab with 20 workstations' },
  ]);

  /* Handlers (CRUD) */
  const addCampus = (c: Omit<Campus, 'id'>) => setCampuses([...campuses, { ...c, id: Date.now().toString() }]);
  const updateCampus = (id: string, c: Omit<Campus, 'id'>) => setCampuses(campuses.map(ca => (ca.id === id ? { ...c, id } : ca)));
  const deleteCampus = (id: string) => { setCampuses(campuses.filter(c => c.id !== id)); setBuildings(buildings.filter(b => b.campusId !== id)); };

  const addBuilding = (b: Omit<Building, 'id'>) => setBuildings([...buildings, { ...b, id: Date.now().toString() }]);
  const updateBuilding = (id: string, b: Omit<Building, 'id'>) => setBuildings(buildings.map(bu => (bu.id === id ? { ...b, id } : bu)));
  const deleteBuilding = (id: string) => { setBuildings(buildings.filter(b => b.id !== id)); setRooms(rooms.filter(r => r.buildingId !== id)); };

  const addRoom = (r: Omit<Room, 'id'>) => setRooms([...rooms, { ...r, id: Date.now().toString() }]);
  const updateRoom = (id: string, r: Omit<Room, 'id'>) => setRooms(rooms.map(ro => (ro.id === id ? { ...r, id } : ro)));
  const deleteRoom = (id: string) => setRooms(rooms.filter(r => r.id !== id));

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="text-xl text-gray-900">U-Data</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/campuses" replace />} />

            <Route path="/campuses" element={<CampusPage campuses={campuses} onAdd={addCampus} onUpdate={updateCampus} onDelete={deleteCampus} />} />
            <Route path="/campuses/:campusId/buildings" element={<BuildingPage buildings={buildings} campuses={campuses} onAdd={addBuilding} onUpdate={updateBuilding} onDelete={deleteBuilding} />} />
            <Route path="/buildings/:buildingId/rooms" element={<RoomPage rooms={rooms} buildings={buildings} campuses={campuses} onAdd={addRoom} onUpdate={updateRoom} onDelete={deleteRoom} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
