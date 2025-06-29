import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import {app, server} from "./lib/socket.js"; //import the socket.io instance

dotenv.config(); //load environment variables from .env file


const PORT = process.env.PORT;

const __dirname = path.resolve(); //get the current directory name

// app.use(express.json()); //so that we can parse JSON data from the request body
app.use(cookieParser()); //so that we can parse cookies from the request
app.use(cors({
    origin: "http://localhost:5173", //allow requests from the frontend
    credentials: true, //allow cookies to be sent with requests
}));
app.use(express.json({ limit: '2mb' })); //limit the JSON data to 2mb

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// production (putting both frontend and backend in the same server)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); //serve static files from the frontend build directory
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); //send the index.html file for any other route
    });
}

server.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
    connectDB();
});



