import Project from './project.model.js';
import ProjectDoc from './doc.model.js';
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

// @desc    Get project docs
// @route   GET /api/projects/:id/docs
export const getDocs = async (req, res) => {
  try {
    const doc = await ProjectDoc.findOne({ projectId: req.params.id });
    if (!doc) {
      return res.status(404).json({ message: 'Docs not found' });
    }
    res.json({ tree: doc.tree, docs: doc.files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate new project docs
// @route   POST /api/projects/:id/docs/generate
export const generateDocs = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const response = await axios.post(`${config.aiServerUrl}/generate-docs`, {
        repo_url: project.repoUrl,
        project_id: project._id.toString()
    }, { timeout: 300000 }); // generous 5-min timeout

    const { tree, docs } = response.data;

    let projectDoc = await ProjectDoc.findOne({ projectId: project._id });
    if (!projectDoc) {
      projectDoc = new ProjectDoc({ projectId: project._id });
    }
    
    projectDoc.tree = tree;
    projectDoc.files = docs;
    await projectDoc.save();

    res.status(200).json({ tree, docs });

  } catch (error) {
    console.error('Docs generation error:', error.message);
    res.status(500).json({ message: 'Failed to communicate with AI Server or generate docs ' + (error.response?.data?.detail || '') });
  }
};

// @desc    Get AI Server status and Groq credits info
// @route   GET /api/projects/system/status
export const getSystemStatus = async (req, res) => {
  try {
    const response = await axios.get(`${config.aiServerUrl}/status`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      status: 'offline', 
      message: 'AI Server is unreachable',
      error: error.message 
    });
  }
};
