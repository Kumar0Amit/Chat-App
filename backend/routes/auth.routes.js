import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';


const router = express.Router();

// Sign up route
router.post('/signup',signup)


//  Login in route 
router.post('/login',login)


// Logout route
router.post('/logout',logout)




export default router;