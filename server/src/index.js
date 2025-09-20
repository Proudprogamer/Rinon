import express from "express";
import authRouter from "./routes/auth.js";
import patientRouter from "./routes/patient/patient.js";
import diseaseRouter from "./routes/disease/disease.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const port = process.env["PORT"];
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth/v1', authRouter);
app.use('/patient', patientRouter);
app.use('/disease', diseaseRouter);
app.listen(port, () => {
    console.log(`Backend is running on port ${port}!`);
});
//# sourceMappingURL=index.js.map