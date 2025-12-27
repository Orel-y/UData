import { createContext, useState } from "react"

export const AuthContext = createContext(undefined);

export default function AuthProvider({children}:{children:React.ReactNode}) {
    const [isAuthenticated,setAuthenticated] = useState(false);
    
    
    const login = (form:Object)=>{
            // sending the credentials to the backend and then get a token
            // process the token and route
            console.log(JSON.stringify(form));
    }
    const logout = ()=>{
        console.log("LOGED OUT");
    }

    return (
        <AuthContext.Provider value={{isAuthenticated,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
