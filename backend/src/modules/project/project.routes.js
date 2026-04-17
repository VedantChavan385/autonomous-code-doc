import express from 'express';
import { createProject, getMyProjects } from './project.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// We put 'protect' here so that BOTH routes require a valid login token
router.post('/', protect, createProject);
router.get('/', protect, getMyProjects);

export default router;
