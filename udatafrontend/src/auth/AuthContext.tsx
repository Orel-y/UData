import React, { createContext, useState, useEffect } from "react";
import { clearToken, isTokenValid, saveToken } from "./authStore";
import { useNavigate } from "react-router-dom";

export interface AuthUser {
  id: number;
  username: string;
  avatarUrl?: string;
  permittedCampusIds: number[];
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  currentUser?: AuthUser | null;
  login: (form: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}:{children:React.ReactNode}) {
    const [isAuthenticated,setIsAuthenticated] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const [currentUser,setCurrentUser] = useState<AuthUser | null>(null);

    const navigate = useNavigate();

    const login = (form: any)=>{
            // sending the credentials to the backend and then get a token
            // process the token and route
            console.log('Auth.login called with', JSON.stringify(form));
            saveToken(JSON.stringify(form), 60 * 60 * 24); // 1 day

            const email = (form?.email as string) || 'demo@local';
            const username = email.split('@')[0];
            // decide permitted campuses - demo: admin gets all, others get first 3
            const permittedCampusIds = (email.includes('admin')) ? [4,5,6,7,8,9,10] : [4,5,6];

            const mockUser: AuthUser = {
              id: 1,
              username,
              avatarUrl: `https://i.pravatar.cc/40?u=${encodeURIComponent(email)}`,
              permittedCampusIds,
            };

            try { localStorage.setItem('uDataUser', JSON.stringify(mockUser)); } catch {}
            setCurrentUser(mockUser);
            setIsAuthenticated(true);
            navigate('/campuses');
    }
    const logout = ()=>{
        console.log("Auth.logout called");
        clearToken();
        try { localStorage.removeItem('uDataUser'); } catch {}
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate('/');
    }

    // initialize auth state once on mount
    useEffect(()=>{
        const valid = isTokenValid();
        setIsAuthenticated(valid);
        if (valid) {
          try {
            const u = localStorage.getItem('uDataUser');
            if (u) setCurrentUser(JSON.parse(u));
          } catch (e) { console.error('Failed to parse stored user', e); }
        }
        setIsInitializing(false);
    }, [])

    return (
        <AuthContext.Provider value={{isAuthenticated,isInitializing,currentUser,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
