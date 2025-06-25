import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config(); //load environment variables from .env file

const app = express(); //create an express application
const PORT = process.env.PORT;

app.use(express.json()); //so that we can parse JSON data from the request body
app.use(cookieParser()); //so that we can parse cookies from the request

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB();
});



