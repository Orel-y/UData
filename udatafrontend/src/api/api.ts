import axios from 'axios';
import { Campus, Building, Room, BuildingStatus, BuildingType } from '../App';
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
  code:string,
  id: string;
  campus_id: number;
  name: string;
  floor_count: number;
  status:BuildingStatus
  type:BuildingType
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

export const updateCampus = async (id: string, campus: Omit<Campus, 'id'>): Promise<Campus> => {
  const { data } = await api.put(`/campuses/${id}`, campus);
  return data;
};

export const deleteCampus = async (id: string) => {
  await api.delete(`/campuses/${id}`);
};



// Buildings
export const fetchBuildings = async (): Promise<Building[]> => {
  const { data } = await api.get(`/buildings/`);
  return data;
};

export const fetchBuildingsWithRooms = async (campusId?: string): Promise<ApiBuilding[]> => {
  const url = campusId ? `/buildings/nested?campus_id=${campusId}` : `/buildings/nested`;
  const { data } = await api.get(url);
  return data;
};

export const addBuilding = async ( building: Omit<Building, 'id'>): Promise<Building> => {
  const payload = {
    name: building.name,
    campus_id: building.campus_id,
    floors: building.floors,
    code:building.code,
    status:building.status,
    type:building.type
  };

  const { data } = await api.post(`/buildings/`, payload);
  return {
    code: data.code,
    id: data.id,
    campus_id: data.campus_id,
    name: data.name,
    floors: data.floors,
    type: data.type,
    status: data.status
  };
};


export const updateBuilding = async (id: string, building: Omit<Building, 'id'>): Promise<Building> => {
  const payload = {
    name: building.name,
    campus_id: building.campus_id,
    floors: building.floors
  };
  
  const { data } = await api.put(`/buildings/${id}`, building);
  return {
    code:data.code,
    id: data.id,
    campus_id: data.campus_id,
    name: data.name,
    floors: data.floors,
    status:data.status,
    type:data.type
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
