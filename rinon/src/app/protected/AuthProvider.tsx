"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";


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

    const [user, setuser] = useState<User | null>(null);

    useEffect(() => {
        const token:string = localStorage.getItem('token') as string;
        login(token);
        }, []);

    const login = async(token :string)=>{

        try { 
            const response = await axios.post('https://rinon.onrender.com/auth/v1/verify-token',{
                token : token
            });

            if(response.data)
            {
                setuser(response.data.user);
                localStorage.setItem('token', token);
            }
        }
        catch(e: any)
        {
            localStorage.removeItem('token');
            if(e instanceof Error)
                setuser(null);
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