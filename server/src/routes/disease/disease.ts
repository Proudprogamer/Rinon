import { PrismaClient } from "@prisma/client";
import express, { type Request, type Response } from "express"

const diseaseRouter = express.Router();
const prismaclient = new PrismaClient();


diseaseRouter.post('/create-disease', async(req :Request, res : Response) : Promise<void> => {

    const creds = req.body;
    console.log(creds);

    try {
        const response = await prismaclient.disease.create({
            data:{
                name : creds.name,
                type : creds.type,
                diagnoserid : creds.diagnoserId,
                patientid : creds.patientId
            }
        });

        if(response)
        {
            res.status(200).json({type : "success", message:"disease created successfully", id : response.id});
        }
        
    }
    catch(e : any)
    {
        if(e instanceof Error)
            res.status(500).json({type : "error", message:"failed to create disease", error : e.message});
    }   
});

diseaseRouter.post('/get-diseases', async(req :Request, res : Response) : Promise<void> => {

    const patientId = req.body.patientId;

    try {
        const response = await prismaclient.disease.findMany({
            where : {
                patientid : patientId
            }
        });

        if(response)
            res.status(200).json({type : "success", message : "fetched diseases", diseases : response})
    }
    catch(e:any)
    {
        if(e instanceof Error)
            res.status(500).json({type : "error", message : "failed to fetch diseases", error : e.message});
    }
});

diseaseRouter.post('/get-disease-by-id', async(req :Request, res : Response) : Promise<void> => {
    const diseaseId = req.body.diseaseId;

    try {
        const response = await prismaclient.disease.findFirst({
            where : {
                id : diseaseId
            }
        });

        if(response)
            res.status(200).json({type : "success", message : "fetched diseases", disease : response})
    }
    catch(e:any)
    {
        if(e instanceof Error)
            res.status(500).json({type : "error", message : "failed to fetch diseases", error : e.message});
    }
});

diseaseRouter.post('/get-patient-diseases', async(req :Request, res : Response) : Promise<void> => {
    const patientId = req.body.patientId;

    try {
        const response = await prismaclient.disease.findMany({
            where : {
                patientid : patientId
            }
        });

        if(response)
        {
            res.status(200).json({type:"success", message :"diseases fetched successfully", diseases : response});
        }
    }
    catch(e : any)
    {
        if(e instanceof Error)
        {
            res.status(500).json({type : "error", message : "failed to fetch diseases", error : e.message});
        }
    }
});


export default diseaseRouter;