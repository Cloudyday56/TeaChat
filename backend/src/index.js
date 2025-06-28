import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";


dotenv.config(); //load environment variables from .env file

const app = express(); //create an express application
const PORT = process.env.PORT;

// app.use(express.json()); //so that we can parse JSON data from the request body
app.use(cookieParser()); //so that we can parse cookies from the request
app.use(cors({
    origin: "http://localhost:5173", //allow requests from the frontend
    credentials: true, //allow cookies to be sent with requests
}));
app.use(express.json({ limit: '2mb' })); //limit the JSON data to 2mb

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB();
});



