import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';


import { getUserProfile, login, register } from '../controllers/auth.Controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register',register );
// Protected route example  
router.get('/profile', authenticate,getUserProfile )



export default router;  