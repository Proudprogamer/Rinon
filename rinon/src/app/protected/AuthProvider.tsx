import { createContext, ReactNode, useContext, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";


//this is how the user is being stored in our database
export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    type:string,
    organization?: string,
}

//this is what our auth context will provide to its children
interface AuthContextProps {
    user : User | null,
    login : (token:string)=>void,
    logout : () => void
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const  AuthProvider = ({children} : {children : ReactNode}) =>{

    const JWT_SECRET:string = process.env.NEXT_PUBLIC_JWT_SECRET as string;
    const [user, setuser] = useState<User | null>(null);

    const login = async(token :string)=>{

        const decoded:any = jwt.verify(token, JWT_SECRET);

        if(decoded.id)
        {
            setuser(decoded);
            localStorage.setItem('token', token);
        }

    }

    const logout = ()=>{
        setuser(null);
        localStorage.removeItem('token');
    }


    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () =>{
    const ctx = useContext(AuthContext);

    if(!ctx) throw new Error('useAuth must be used within AuthProvider');

    return ctx;
}