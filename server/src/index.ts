import express from "express"
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
dotenv.config()


const port = process.env["PORT"];


const app = express();
app.use(express.json());


app.use('/auth/v1', authRouter);


app.listen(port, ()=>{
    console.log(`Backend is running on port ${port}!`);
})