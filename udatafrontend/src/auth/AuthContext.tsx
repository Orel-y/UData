import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { clearToken } from "./authStore";
import { useNavigate } from "react-router-dom";
import { AuthUser, getCurrentUser } from "../api/api";

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  currentUser?: AuthUser | null;
  logout: () => void;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setIsInitializing: Dispatch<SetStateAction<boolean>>;
  setCurrentUser: Dispatch<SetStateAction<AuthUser | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}:{children:React.ReactNode}) {
    const [isAuthenticated,setIsAuthenticated] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const [currentUser,setCurrentUser] = useState<AuthUser | null>(null);

    const navigate = useNavigate();

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
        <AuthContext.Provider value={{isAuthenticated,isInitializing,currentUser,logout,setIsAuthenticated,setIsInitializing,setCurrentUser}}>
            {children}
        </AuthContext.Provider>
    )
}
