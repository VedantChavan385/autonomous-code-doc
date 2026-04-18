import express from 'express';
import { sendMessage, getChatHistory } from './chat.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// Notice we expect the URL to contain the specific project ID
// Both routes are protected by our JWT bouncer!
router.post('/:projectId/chat', protect, sendMessage);
router.get('/:projectId/chat', protect, getChatHistory);

export default router;
