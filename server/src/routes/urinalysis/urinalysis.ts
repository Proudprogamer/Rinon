import  express, { type Request, type Response }  from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path"
import { PrismaClient } from "@prisma/client";

const urinalysisRouter = express.Router();

urinalysisRouter.post('/upload', async(req :Request, res : Response) : Promise<void> => {
    const data = req.body;
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
    
    res.status(200).json({
        message: 'Analysis Generated successfully!',
        analysis: result.response,
    });
});

export default urinalysisRouter;