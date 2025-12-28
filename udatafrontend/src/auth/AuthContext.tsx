import React, { createContext, useState, useEffect } from "react";
import { clearToken, isTokenValid, saveToken } from "./authStore";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthUser, getCurrentUser } from "../api/api";

const API_Base = "http://localhost:8000";



export interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  currentUser?: AuthUser | null;
  login: (form: any) => Promise<boolean>;
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
              const data = await axios.post(`${API_Base}/auth/register`, form, {
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      withCredentials: false,  // or true if your backend expects credentials
                                    });
                        return data;

            } catch (error) {
              console.log("Registration error",error)
            }
            return;
        }
    const login = async (form: any)=>{
            try {
              const response = await axios.post(`${API_Base}/auth/login`,form)
              const token = response.data.access_token;
                saveToken(token);
                // setCurrentUser(await getCurrentUser());
                setIsAuthenticated(true);
                setIsInitializing(false);
                navigate('/campuses');
                return true;
            } catch (error) {
              // console.log("Login error",error);
              return false;
            }
    }
    const logout = ()=>{
        clearToken();
        setIsAuthenticated(false);
        navigate('/');
    }

    // initialize auth state once on mount
    useEffect(()=>{
        const initialize = async()=>{
          try{
            setCurrentUser(await getCurrentUser());
            setIsAuthenticated(true);
            setIsInitializing(false);
          }catch{
            setIsAuthenticated(false);
            setIsInitializing(true);
            navigate('/');
          }
          
        }

        initialize();
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated,isInitializing,currentUser,login,logout,register}}>
            {children}
        </AuthContext.Provider>
    )
}
