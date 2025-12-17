import axios from 'axios';
import { Campus, Building, Room } from '../App';

const API_BASE = 'http://localhost:8000'; // adjust to your FastAPI URL

// --- Campuses ---
export const fetchCampuses = async (): Promise<Campus[]> => {
  const { data } = await axios.get(`${API_BASE}/campuses/`);
  return data;
};

export const fetchCampusesWithBuildings = async (): Promise<Campus[]> => {
  const { data } = await axios.get(`${API_BASE}/campuses/nested`);
  return data;
};

export const addCampus = async (campus: Omit<Campus, 'id'>): Promise<Campus> => {
  const { data } = await axios.post(`${API_BASE}/campuses/`, campus);
  return data;
};

export const updateCampus = async (id: number, campus: Omit<Campus, 'id'>): Promise<Campus> => {
  const { data } = await axios.put(`${API_BASE}/campuses/${id}`, campus);
  return data;
};

export const deleteCampus = async (id: number) => {
  await axios.delete(`${API_BASE}/campuses/${id}`);
};

// --- Buildings ---
export const fetchBuildings = async (): Promise<Building[]> => {
  const { data } = await axios.get(`${API_BASE}/buildings/`);
  return data;
};

export const fetchBuildingsWithRooms = async (campusId?: number): Promise<Building[]> => {
  const url = campusId ? `${API_BASE}/buildings/nested?campus_id=${campusId}` : `${API_BASE}/buildings/nested`;
  const { data } = await axios.get(url);
  return data;
};

export const addBuilding = async (building: Omit<Building, 'id'>): Promise<Building> => {
  const { data } = await axios.post(`${API_BASE}/buildings/`, building);
  return data;
};

export const updateBuilding = async (id: number, building: Omit<Building, 'id'>): Promise<Building> => {
  const { data } = await axios.put(`${API_BASE}/buildings/${id}`, building);
  return data;
};

export const deleteBuilding = async (id: number) => {
  await axios.delete(`${API_BASE}/buildings/${id}`);
};

// --- Rooms ---
export const fetchRooms = async (): Promise<Room[]> => {
  const { data } = await axios.get(`${API_BASE}/rooms/`);
  return data;
};

export const fetchRoomsByBuilding = async (buildingId: number): Promise<Room[]> => {
  const { data } = await axios.get(`${API_BASE}/rooms/`, {
    params: { building_id: buildingId }
  });
  return data;
};

export const addRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  const { data } = await axios.post(`${API_BASE}/rooms/`, room);
  return data;
};

export const updateRoom = async (id: string, room: Omit<Room, 'id'>): Promise<Room> => {
  const { data } = await axios.put(`${API_BASE}/rooms/${id}`, room);
  return data;
};

export const deleteRoom = async (id: number) => {
  await axios.delete(`${API_BASE}/rooms/${id}`);
};
