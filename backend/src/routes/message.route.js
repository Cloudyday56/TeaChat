import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

//get all users for the sidebar
router.get("/users", protectRoute, getUsersForSidebar);

//get messages between two users
router.get("/:id", protectRoute, getMessages);

//send a message to a user
router.post("/send/:id", protectRoute, sendMessage);

export default router;





