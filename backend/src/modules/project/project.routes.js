import express from 'express';
import { createProject, getMyProjects, getProject, deleteProject } from './project.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getMyProjects);
router.get('/:id', protect, getProject);
router.delete('/:id', protect, deleteProject);

export default router;
