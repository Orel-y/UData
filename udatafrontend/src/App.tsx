import { useState } from 'react';
import { CampusSection } from './components/CampusSection';
import { BuildingSection } from './components/BuildingSection';
import { RoomSection } from './components/RoomSection';
import { Building2 } from 'lucide-react';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 }
  ];

  const addCampus = (campus: Omit<Campus, 'id'>) => {
    const newCampus = { ...campus, id: Date.now().toString() };
    setCampuses([...campuses, newCampus]);
  };

  const updateCampus = (id: string, campus: Omit<Campus, 'id'>) => {
    setCampuses(campuses.map(c => c.id === id ? { ...campus, id } : c));
  };

  const deleteCampus = (id: string) => {
    setCampuses(campuses.filter(c => c.id !== id));
    setBuildings(buildings.filter(b => b.campusId !== id));
  };

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

  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: Date.now().toString() };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, room: Omit<Room, 'id'>) => {
    setRooms(rooms.map(r => r.id === id ? { ...room, id } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl text-gray-900">U-Data</span>
            </div>
            <div className="flex gap-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content 
      should create a router and make this in different screen*/}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            <div>
              <h1 className="text-gray-900 mb-2">Campus Data Collector</h1>
              <p className="text-gray-600">Manage campuses, buildings, and rooms across your university system</p>
            </div>

            <CampusSection
              campuses={campuses}
              onAdd={addCampus}
              onUpdate={updateCampus}
              onDelete={deleteCampus}
            />

            <BuildingSection
              buildings={buildings}
              campuses={campuses}
              onAdd={addBuilding}
              onUpdate={updateBuilding}
              onDelete={deleteBuilding}
            />

            <RoomSection
              rooms={rooms}
              buildings={buildings}
              campuses={campuses}
              onAdd={addRoom}
              onUpdate={updateRoom}
              onDelete={deleteRoom}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {tabs.find(t => t.id === activeTab)?.icon && 
                  (() => {
                    const Icon = tabs.find(t => t.id === activeTab)!.icon;
                    return <Icon className="w-8 h-8 text-gray-400" />;
                  })()
                }
              </div>
              <h2 className="text-gray-900 mb-2">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-gray-600">This section is under development</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
