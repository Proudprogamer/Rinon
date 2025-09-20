import express from "express";
import authRouter from "./routes/auth.js";
import ctRouter from "./routes/ct/ct.js";
import urinalysisRouter from "./routes/urinalysis/urinalysis.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const port = process.env["PORT"];
const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth/v1', authRouter);
app.use('/ct/v1', ctRouter);
app.use('/urinalysis/v1', urinalysisRouter);
app.listen(port, () => {
    console.log(`Backend is running on port ${port}!`);
});
//# sourceMappingURL=index.js.map