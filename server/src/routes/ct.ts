import  express, { type Request, type Response }  from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path"
import { PrismaClient } from "@prisma/client";
import multer from "multer"
import gemCt from "../utils/gemCt.js";

import dotenv from "dotenv";
dotenv.config();

const ctRouter = express.Router();

const prismaclient = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });



ctRouter.post('/upload', upload.single('image'), async(req :Request, res : Response) : Promise<void> => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const filePath = req.file.path;
    const result = await gemCt(filePath);
    console.log(result);
    console.log('File uploaded:', req.file);
    res.status(200).json({
        message: 'Analysis Generated successfully!',
        filename: req.file.filename,
        analysis_generated: result,
    });
});

export default ctRouter;