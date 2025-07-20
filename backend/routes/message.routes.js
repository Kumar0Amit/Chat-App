import express from 'express';
import sendMessage from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();


router.post("/send/:id",protectRoute,sendMessage);// only those who are loged in can send the message



export default router;