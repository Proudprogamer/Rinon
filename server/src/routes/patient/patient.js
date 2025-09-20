import { PrismaClient } from "@prisma/client";
import express, {} from "express";
const patientRouter = express.Router();
const prismaclient = new PrismaClient();
patientRouter.get('/get-patients', async (req, res) => {
    try {
        const response = await prismaclient.patients.findMany();
        if (response) {
            res.status(201).json({ type: "success", message: "patients fetched", patients: response });
        }
    }
    catch (e) {
        if (e instanceof Error)
            res.status(201).json({ type: "error", message: "failed to fetch patients" });
    }
});
export default patientRouter;
//# sourceMappingURL=patient.js.map