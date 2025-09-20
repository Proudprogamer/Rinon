"use client"
import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";



//how to use this route : 
//so basically, you use thsis to wrap all the html being returned from a component, and you send the desired role in the props


export default function ProtectedRoute(
    {children,
    allowedRoles}
     : {
    children : ReactNode, 
    allowedRoles : 'Patient'| 'Doctor'| 'Diagnoser' | 'All';
}){
    const { user } = useAuth();
    const router = useRouter();


    useEffect(()=>{
        if (!user) 
            router.replace('/');
        
        if(user)
        {
            if(!allowedRoles.includes(user.type))
                router.replace('/no-access');//here we show a forbidden page to the user
        }
    }, [user]);

    if(!user) return null;

    return (
        <>
            {children}
        </>
    )


}