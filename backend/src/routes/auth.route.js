import express from 'express';
import { signup, login, logout, updateProfile, checkAuth, deleteAccount} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router()

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

//update user profile
router.put('/update-profile', protectRoute, updateProfile)
//protectRoute is a middleware to check if the authentication token is valid

//check authentication
router.get('/check', protectRoute, checkAuth);

//delete account
router.delete('/delete-account', protectRoute, deleteAccount);

export default router;

