import express from 'express';
import dotenv from 'dotenv';
import User from './Models/userModels.js';

import userRouter from './Routes/userRoutes.js';
import { sendMail } from './Controllers/sendMail.js';
import cors from 'cors';


dotenv.config({ path: './config/config.env' });
const app = express();
app.use(express.json()) //to accept the json format data

app.use(
  cors({
    origin: ["http://localhost:5173", "https://moviefy-frontend.vercel.app"], // ✅ Correct format
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // ✅ Allow cookies if needed
  })
);

app.use('/api/user', userRouter);




app.get("/", (req,res) => {
 res.send(`Hello from serevr`);   
});



export default app;