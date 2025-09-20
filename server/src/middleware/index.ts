import jwt, { type JwtPayload } from "jsonwebtoken";
import { type NextFunction,type Request } from "express";
import dotenv from "dotenv";

dotenv.config();

async function tokenChecker(req:Request, token : string, next:NextFunction) {

    const JWT_SECRET:string = process.env["JWT_SECRET"] as string;

    const type = req.body.creds.type;

    const decoded :JwtPayload= jwt.verify(token, JWT_SECRET) as JwtPayload;

    if(decoded.id)
    {
        if(type == decoded.type)
            next();
    }
}

export default tokenChecker;