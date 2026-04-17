import express from 'express';
import { registerUser, loginUser, getMe } from './auth.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);  // protect runs FIRST (checks token), then getMe runs

export default router;
