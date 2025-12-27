import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Building2 } from 'lucide-react';

import AuthProvider from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CampusPage from './pages/CampusPage';
import BuildingPage from './pages/BuildingPage';
import RoomPage from './pages/RoomPage';
import DashboardLayout from './components/DashboardLayout';
import AdminPage from './pages/AdminPage';

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

        <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path='/register' element={<RegistrationPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/campuses" element={<CampusPage />} />
                <Route path="/campuses/:campusId/buildings" element={<BuildingPage />} />
                <Route path="/buildings/:buildingId/rooms" element={<RoomPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
    </BrowserRouter>
  );
}
