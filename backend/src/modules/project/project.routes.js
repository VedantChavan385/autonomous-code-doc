import express from 'express';
import { createProject, getMyProjects, getProject, deleteProject, getDocs, generateDocs } from './project.controller.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getMyProjects);
router.get('/:id', protect, getProject);
router.delete('/:id', protect, deleteProject);
router.get('/:id/docs', protect, getDocs);
router.post('/:id/docs/generate', protect, generateDocs);

export default router;
