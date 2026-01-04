import axios from 'axios';
import { Campus, Building, Room, BuildingStatus, BuildingType } from '../App';
import { getToken } from '../auth/authStore';


var token = getToken();

// const API_BASE = 'https://udata1.onrender.com';
const API_BASE = "http://localhost:8000";


export interface CreateBuildingDTO {
  name: string;
  floor_count: number;
  campus_id: number;
}

// api.ts
export interface ApiBuilding {
  code:string,
  id: string;
  campus_id: string;
  name: string;
  floors: number;
  status:BuildingStatus
  type:BuildingType
}

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  status?: UserStatus;
  role: string;
}
export enum UserStatus{
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    SUSPENDED = "SUSPENDED"
}
export enum Role{
    ADMIN = "ADMIN",
    DATA_MANAGER = "DATA_MANAGER",
    VIEWER = "VIEWER"
}


// user
export const getCurrentUser = async():Promise<AuthUser>=>{
  token = getToken();
  const { data } = await axios.get(`${API_BASE}/auth/me`,{
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    }
  });
  return data;
}

export const registerUser = async(form:Omit<Omit<AuthUser,'status'>,'id'>)=>{
  const { data } = await axios.post(`${API_BASE}/auth/register`,form);
  return data;
}
export const authenticate = async(form:any)=>{
  const data = await axios.post(`${API_BASE}/auth/login`,form);
  return data;
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` 
  }
});

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

// updated to get building data with campus id
export const fetchBuildingsWithRooms = async (campusId?: string): Promise<ApiBuilding[]> => {
  const url = `/buildings/campus/${campusId}`;
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
    code:building.code,
    name: building.name,
    floors: building.floors,
    type:building.type,
    status: building.status
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

export const deleteBuilding = async (id: string) => {
  await api.delete(`/buildings/${id}`);
};

export const getBuilding = async(id:string):Promise<Building>=>{
  const {data} = await api.get(`/buildings/${id}`);
   return {
    code: data.code,
    id: data.id,
    campus_id: data.campus_id,
    name: data.name,
    floors: data.floors,
    type: data.type,
    status: data.status
  };;
}

// Rooms
export const fetchRooms = async (): Promise<Room[]> => {
  const { data } = await api.get(`/rooms/`);
  return data;
};

export const fetchRoomsByBuilding = async (buildingId: string): Promise<Room[]> => {
  const { data } = await api.get(`/rooms/building/${buildingId}`);
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

export const deleteRoom = async (id: string) => {
  await api.delete(`/rooms/${id}`);
};
