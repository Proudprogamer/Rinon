import { PrismaClient } from "@prisma/client";
import express, {} from "express";
const diseaseRouter = express.Router();
const prismaclient = new PrismaClient();
diseaseRouter.post('/create-disease', async (req, res) => {
    const creds = req.body.creds;
    try {
        const response = await prismaclient.disease.create({
            data: {
                name: creds.name,
                type: creds.type,
                diagnoserid: creds.diagnoserid,
                patientid: creds.patientid
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
});
diseaseRouter.post('/get-diseases', async (req, res) => {
    const patientId = req.body.patientId;
    try {
        const response = await prismaclient.disease.findMany({
            where: {
                patientid: patientId
            }
        });
        if (response)
            res.status(200).json({ type: "success", message: "fetched diseases", diseases: response });
    }
    catch (e) {
        if (e instanceof Error)
            res.status(500).json({ type: "error", message: "failed to fetch diseases", error: e.message });
    }
});
export default diseaseRouter;
//# sourceMappingURL=disease.js.map