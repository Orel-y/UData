import React, { createContext, useState, useEffect } from "react";
import { getToken, saveToken } from "./authStore";

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (form: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}:{children:React.ReactNode}) {
    const [isAuthenticated,setIsAuthenticated] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);

    const login = (form: any)=>{
            // sending the credentials to the backend and then get a token
            // process the token and route
            console.log('Auth.login called with', JSON.stringify(form));
            saveToken(JSON.stringify(form));
            setIsAuthenticated(true);
    }
    const logout = ()=>{
        console.log("Auth.logout called");
        try { window.localStorage.removeItem('uDataToken'); } catch {}
        setIsAuthenticated(false);
    }

    // initialize auth state once on mount
    useEffect(()=>{
        const token = getToken();
        setIsAuthenticated(!!token);
        setIsInitializing(false);
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated,isInitializing,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
