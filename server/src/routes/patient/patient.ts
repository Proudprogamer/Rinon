import { PrismaClient } from "@prisma/client";
import express, { type Request, type Response } from "express"

const patientRouter = express.Router();
const prismaclient = new PrismaClient();



patientRouter.get('/get-patients', async(req :Request, res : Response) : Promise<void> => {

    try {
        const response = await prismaclient.patients.findMany();

        if(response)
        {
            res.status(201).json({type : "success", message:"patients fetched", patients : response});
        }
    }
    catch(e : any)
    {
        if(e instanceof Error)
            res.status(201).json({type : "error", message:"failed to fetch patients"});
    }   
});

export default patientRouter;