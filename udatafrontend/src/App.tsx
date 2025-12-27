import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';

/* Pages */
import AuthProvider from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CampusPage from './pages/CampusPage';
import BuildingPage from './pages/BuildingPage';
import RoomPage from './pages/RoomPage';

/* Types */
export interface Campus {
  id: number;
  name: string;
  location: string;
}

export interface Building {
  id: number;
  campusId: number;
  name: string;
  floorCount: number;
}

export interface Room {
  id: number;
  buildingId: number;
  roomNumber: string;
  capacity: number;
  roomType: string;
  description: string;
}

export default function App() {
  const [campuses, setCampuses] = useState<Campus[]>([]);

  const [buildings, setBuildings] = useState<Building[]>([]);

  const [rooms, setRooms] = useState<Room[]>([]);

  /* Handlers (CRUD) */
  const addCampus = (c: Omit<Campus, 'id'>) => setCampuses([...campuses, { ...c, id: Date.now() }]);
  const updateCampus = (id: number, c: Omit<Campus, 'id'>) => setCampuses(campuses.map(ca => (ca.id === id ? { ...c, id } : ca)));
  const deleteCampus = (id: number) => {
    setCampuses(campuses.filter(c => c.id !== id));
    setBuildings(buildings.filter(b => b.campusId !== id));
  };

  const addBuilding = (b: Omit<Building, 'id'>) => setBuildings([...buildings, { ...b, id: Date.now() }]);
  const updateBuilding = (id: number, b: Omit<Building, 'id'>) => setBuildings(buildings.map(bu => (bu.id === id ? { ...b, id } : bu)));
  const deleteBuilding = (id: number) => {
    setBuildings(buildings.filter(b => b.id !== id));
    setRooms(rooms.filter(r => r.buildingId !== id));
  };

  const addRoom = (r: Omit<Room, 'id'>) => setRooms([...rooms, { ...r, id: Date.now() }]);
  const updateRoom = (id: number, r: Omit<Room, 'id'>) => setRooms(rooms.map(ro => (ro.id === id ? { ...r, id } : ro)));
  const deleteRoom = (id: number) => setRooms(rooms.filter(r => r.id !== id));

  return (
    <BrowserRouter>
    <AuthProvider >
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
            <Route path="/" element={<LoginPage />} />
            <Route path='/register' element={<RegistrationPage />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/campuses"
                element={
                  <CampusPage
                    campuses={campuses}
                    onAdd={addCampus}
                    onUpdate={updateCampus}
                    onDelete={deleteCampus}
                  />
                }
              />
              <Route
                path="/campuses/:campusId/buildings"
                element={
                  <BuildingPage
                    campuses={campuses}
                    buildings={buildings}
                    onAdd={addBuilding}
                    onUpdate={updateBuilding}
                    onDelete={deleteBuilding}
                  />
                }
              />
              <Route
                path="/buildings/:buildingId/rooms"
                element={
                  <RoomPage
                    campuses={campuses}
                    buildings={buildings}
                    rooms={rooms}
                    onAdd={addRoom}
                    onUpdate={updateRoom}
                    onDelete={deleteRoom}
                  />
                }
              />
              </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
    </BrowserRouter>
  );
}
