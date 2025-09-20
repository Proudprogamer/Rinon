import  express, { type Request, type Response }  from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path"
import { PrismaClient } from "@prisma/client";

const urinalysisRouter = express.Router();
const prismaclient = new PrismaClient();

urinalysisRouter.post('/upload', async(req :Request, res : Response) : Promise<void> => {
    const data = req.body.vals;
    const diseaseId = req.body.diseaseId;
    const tosend = {"data": data};
    console.log(data);
    const pythonresp = await fetch("https://maniakss.pythonanywhere.com/api/analyse", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tosend)
    });
    const result = await pythonresp.json();
    const obj = {
      analysis: result.response,
      data: data,
    }
    console.log(obj);
    try {
        const response = await prismaclient.disease.update({
            where: {
              id: diseaseId
            },
            data:{
                analysis: JSON.stringify(obj),
            }
        });
        
        res.status(200).json({
            message: 'Analysis Generated successfully!',
            analysis: result.response, 
            id: response.id 
        });

    }
    catch(e : any)
    {
        if(e instanceof Error) {
            res.status(500).json({type : "error", message:"failed to create disease", error : e.message});
        }
    }  
});

export default urinalysisRouter;