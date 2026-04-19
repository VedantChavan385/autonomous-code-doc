import Project from './project.model.js';
import { repoQueue } from '../../jobs/queue.js';
import axios from 'axios';
import config from '../../config/index.js';

// @desc    Create new project (Add Repo)
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, repoUrl } = req.body;

    const project = await Project.create({
      userId: req.user._id,
      name,
      repoUrl,
    });

    await repoQueue.add('process', {
      projectId: project._id,
      repoUrl: project.repoUrl
    });

    res.status(201).json(project);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort('-createdAt');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // ✨ Cleanup: Tell AI Server to delete the vector collection
    try {
      await axios.delete(`${config.aiServerUrl}/collections/${project._id}`);
    } catch (err) {
      console.error(`Warning: Failed to delete collection on AI server for project ${project._id}`);
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
