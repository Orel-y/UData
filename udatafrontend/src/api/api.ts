import axios from 'axios';
import { Campus, Building, Room } from '../App';
import { getToken } from '../auth/authStore';


const token = getToken();

const API_BASE = 'http://localhost:8000';
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` 
  }
});

export interface CreateBuildingDTO {
  name: string;
  floor_count: number;
  campus_id: number;
}

// api.ts
export interface ApiBuilding {
  id: number;
  campus_id: number;
  name: string;
  floor_count: number;
}


// Campuses
export const fetchCampuses = async (): Promise<Campus[]> => {
  const { data } = await api.get(`/campuses/`);
  return data;
};

export const fetchCampusesWithBuildings = async (): Promise<Campus[]> => {
  const { data } = await api.get(`/campuses/nested`);
  return data;
};

export const addCampus = async (campus: Omit<Campus, 'id'>): Promise<Campus> => {
  const { data } = await api.post(`/campuses/`, campus);
  return data;
};

export const updateCampus = async (id: number, campus: Omit<Campus, 'id'>): Promise<Campus> => {
  const { data } = await api.put(`/campuses/${id}`, campus);
  return data;
};

export const deleteCampus = async (id: number) => {
  await api.delete(`/campuses/${id}`);
};



// Buildings
export const fetchBuildings = async (): Promise<Building[]> => {
  const { data } = await api.get(`/buildings/`);
  return data;
};

export const fetchBuildingsWithRooms = async (campusId?: number): Promise<ApiBuilding[]> => {
  const url = campusId ? `/buildings/nested?campus_id=${campusId}` : `/buildings/nested`;
  const { data } = await api.get(url);
  return data;
};

export const addBuilding = async ( building: Omit<Building, 'id'>): Promise<Building> => {
  const payload = {
    name: building.name,
    campus_id: building.campusId,
    floor_count: building.floorCount
  };

  const { data } = await api.post(`/buildings/`, payload);
  return {
    id: data.id,
    campusId: data.campus_id,
    name: data.name,
    floorCount: data.floor_count,
  };
};


export const updateBuilding = async (id: number, building: Omit<Building, 'id'>): Promise<Building> => {
  const payload = {
    name: building.name,
    campus_id: building.campusId,
    floor_count: building.floorCount
  };
  
  const { data } = await api.put(`/buildings/${id}`, building);
  return {
    id: data.id,
    campusId: data.campus_id,
    name: data.name,
    floorCount: data.floor_count,
  };
};

export const deleteBuilding = async (id: number) => {
  await api.delete(`/buildings/${id}`);
};

// Rooms
export const fetchRooms = async (): Promise<Room[]> => {
  const { data } = await api.get(`/rooms/`);
  return data;
};

export const fetchRoomsByBuilding = async (buildingId: number): Promise<Room[]> => {
  const { data } = await api.get(`/rooms/`, {
    params: { building_id: buildingId }
  });
  return data;
};

export const addRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  const { data } = await api.post(`/rooms/`, room);
  return data;
};

export const updateRoom = async (id: string, room: Omit<Room, 'id'>): Promise<Room> => {
  const { data } = await api.put(`/rooms/${id}`, room);
  return data;
};

export const deleteRoom = async (id: number) => {
  await api.delete(`/rooms/${id}`);
};
