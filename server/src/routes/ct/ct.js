import express, {} from "express";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import gemCt from "../../utils/gemCt/gemCt.js";
import supabase from "../../utils/supabase/supabase.js";
import dotenv from "dotenv";
dotenv.config();
const ctRouter = express.Router();
const prismaclient = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
ctRouter.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }
    try {
        const fileExtension = req.file.originalname.split('.').pop();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `${Date.now()}-${randomString}.${fileExtension}`;
        const diseaseId = req.body.diseaseId;
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("scans")
            .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false
        });
        if (error) {
            console.error('Supabase upload error:', error);
            res.status(500).json({ error: 'Failed to upload image to storage' });
            return;
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from("scans")
            .getPublicUrl(fileName);
        const tempFilePath = path.join('uploads', fileName);
        fs.writeFileSync(tempFilePath, req.file.buffer);
        const result = await gemCt(tempFilePath);
        fs.unlinkSync(tempFilePath);
        console.log(result);
        console.log('File uploaded to Supabase:', fileName);
        const obj = {
            supabaseUrl: publicUrlData.publicUrl,
            analysis_generated: result,
        };
        try {
            const response = await prismaclient.disease.update({
                where: {
                    id: diseaseId
                },
                data: {
                    analysis: JSON.stringify(obj),
                }
            });
            if (response) {
                res.status(200).json({ type: "success", message: "disease created successfully", id: response.id });
            }
        }
        catch (e) {
            if (e instanceof Error)
                res.status(500).json({ type: "error", message: "failed to create disease", error: e.message });
        }
        res.status(200).json({
            message: 'Analysis Generated successfully!',
            filename: fileName,
            supabaseUrl: publicUrlData.publicUrl,
            analysis_generated: result,
        });
    }
    catch (e) {
        console.log(e);
    }
});
export default ctRouter;
//# sourceMappingURL=ct.js.map