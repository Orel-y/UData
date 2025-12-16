import { createContext, useState } from 'react';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Home from './pages/home';
import NavBar from './components/NavBar';
import { Building } from 'lucide-react';
import BuildingPage from './pages/building';
import RoomPage from './pages/Room';


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
  ]);
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', buildingId: '1', roomNumber: '101', capacity: 30, roomType: 'Lecture Hall', description: 'Standard classroom with projector' },
    { id: '2', buildingId: '1', roomNumber: '205', capacity: 50, roomType: 'Lecture Hall', description: 'Large auditorium-style room' },
    { id: '3', buildingId: '2', roomNumber: '301', capacity: 20, roomType: 'Laboratory', description: 'Computer lab with 20 workstations' },
  ]);

  return (
    <AppContext.Provider value={{ campuses, buildings, rooms,setCampuses, setBuildings, setRooms }}>
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="campus/:campusId" element={<BuildingPage />} />
            <Route path='campus/:campusId/building/:buildingId' element={<RoomPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
    </AppContext.Provider>
  );
}
