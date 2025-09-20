import  express, { type Request, type Response }  from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
dotenv.config();


const authRouter = express.Router();

const prismaclient = new PrismaClient();
const JWT_SECRET :string = process.env["JWT_SECRET"] as string;

//interface for signup creds
interface credsUp {
    name :string,
    email : string,
    password: string,
    organization? : string,
    type : "Doctor" | "Patient"| "Diagnoser"
}

//interface for sigin creds
interface credsIn {
    email : string, 
    password :string,
    type : "Doctor" | "Patient"| "Diagnoser"
}

async function hashPassword(password:string) : Promise<string> {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

authRouter.post('/sign-up', async(req :Request, res : Response) : Promise<void> => {

    const userCreds :credsUp = req.body.creds;

    const hashedpass = await hashPassword(userCreds.password);
    userCreds.password = hashedpass;


    try { 
        if(userCreds.type=="Diagnoser" && userCreds.organization)
        {
            
            await prismaclient.diagnoser.create({
                data:{
                    name :userCreds.name,
                    email : userCreds.email,
                    password: userCreds.password,
                    organization : userCreds.organization
                }
            })

            res.status(201).json({type : "success", message:"diagnoser created"});

        }
        else if(userCreds.type == "Doctor" && userCreds.organization)
        {
            await prismaclient.doctors.create({
                data:{
                    name :userCreds.name,
                    email : userCreds.email,
                    password: userCreds.password,
                    organization : userCreds.organization
                }
            });

            res.status(201).json({type : "success", message:"doctor created"});

        }
        else if(userCreds.type == "Patient")
        {
            await prismaclient.patients.create({
                data:{
                    name :userCreds.name,
                    email : userCreds.email,
                    password: userCreds.password,
                    
                }
            });

            res.status(201).json({type : "success", message:"patient created"});
        }
    }
    catch(e: any)
    {
        if(e instanceof Error)
            res.status(500).json({type : "error", message :"User could not be created", error : e.message});
    }
});

authRouter.post('/sign-in', async(req :Request, res : Response) : Promise<void> => {

    const userCreds : credsIn = req.body.creds;

    if(userCreds.type == "Doctor")
    {
        const user = await prismaclient.doctors.findFirst({
            where :{
                email : userCreds.email
            }
        })

        if(user)
        {
            const hash =await bcrypt.compare(userCreds.password, user.password);
            if(hash)
            {
                const token = jwt.sign({...user, type : 'Doctor'}, JWT_SECRET);
                res.status(200).json({type:"success", message:"logged in", token : token});
            }
            else
                res.status(500).json({type : "error", message : "Invalid email or Password"});
        }
        else
            res.status(500).json({type : "error", message : "Invalid email or Password"});
    }
    
    if(userCreds.type == "Diagnoser")
    {
        const user = await prismaclient.diagnoser.findFirst({
            where :{
                email : userCreds.email
            }
        })

        if(user)
        {
            const hash =await bcrypt.compare(userCreds.password, user.password);
            if(hash)
            {
                const token = jwt.sign({...user, type : 'Diagnoser'}, JWT_SECRET);
                res.status(200).json({type:"success", message:"logged in", token : token});
            }
            else
                res.status(500).json({type : "error", message : "Invalid email or Password"});

        }
        else
            res.status(500).json({type : "error", message : "Invalid email or Password"});

    }
    if(userCreds.type == "Patient")
    {
        const user = await prismaclient.patients.findFirst({
            where :{
                email : userCreds.email
            }
        })

        if(user)
        {
            const hash =await bcrypt.compare(userCreds.password, user.password);
            if(hash)
            {
                const token = jwt.sign({...user, type : 'Patient'}, JWT_SECRET);
                res.status(200).json({type:"success", message:"logged in", token : token});
            }
            else
                res.status(500).json({type : "error", message : "Invalid email or Password"});
        }
        else
            res.status(500).json({type : "error", message : "Invalid email or Password"});
    }
});

authRouter.post('/verify-token', async(req :Request, res : Response) : Promise<void> => {
    const token:string = req.body.token;

    try {
        const decoded:any = jwt.verify(token, JWT_SECRET);
    
        if(decoded.id)
        {
            res.status(200).json({isvalid : "true", user : decoded});
        }
        else
        {
            res.status(500).json({isvalie : "false"});
        }
    }
    catch(e: any)
    {
        if(e instanceof Error)
            res.status(500).json({type : "error", message :"error in validating token", error : e.message});
    }

})

export default authRouter;