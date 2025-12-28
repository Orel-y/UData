import React, { createContext, useState, useEffect } from "react";
import { clearToken, isTokenValid, saveToken } from "./authStore";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export interface AuthUser {
  id: number;
  full_name?: string;
  username: string;
  email?: string;
  hashedPassword?: string,
  role: Role;
  status?: UserStatus;
  permittedCampusIds: number[];
}

export enum Role{
    ADMIN = "ADMIN",
    DATA_MANAGER = "DATA_MANAGER",
    VIEWER = "VIEWER"
}
export enum UserStatus{
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
    SUSPENDED = "SUSPENDED"
}


export interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  currentUser?: AuthUser | null;
  login: (form: any) => void;
  logout: () => void;
  register: (form: any)=>void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}:{children:React.ReactNode}) {
    const [isAuthenticated,setIsAuthenticated] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const [currentUser,setCurrentUser] = useState<AuthUser | null>(null);

    const navigate = useNavigate();

    const register = async (form: any)=>{
            try {
              const data = await axios.post('http://localhost:8000/auth/register', form, {
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      withCredentials: false,  // or true if your backend expects credentials
                                    });
              console.log(data);

            } catch (error) {
              console.log("Registration error",error)
            }
            return;
        }
    const login = async (form: any)=>{
            try {
              const response = await axios.post('http://localhost:8000/auth/login',form)
              const token = response.data.access_token;
                saveToken(token);
                setIsAuthenticated(true);
                navigate('/campuses');
            } catch (error) {
              console.log("Login error",error)
            }
    }
    const logout = ()=>{
        clearToken();
        setIsAuthenticated(false);
        navigate('/');
    }

    // initialize auth state once on mount
    useEffect(()=>{
        const valid = isTokenValid();
        setIsAuthenticated(valid);
        if (valid) {
        //  auto route
        }
        setIsInitializing(false);
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated,isInitializing,currentUser,login,logout,register}}>
            {children}
        </AuthContext.Provider>
    )
}
