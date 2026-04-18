import Project from './project.model.js';
import { repoQueue } from '../../jobs/queue.js';


// @desc    Create new project (Add Repo)
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, repoUrl } = req.body;

    const project = await Project.create({
      userId: req.user._id,
      name,
      repoUrl,
      // defaults to status: 'pending'
    });

    // ✨ NEW: Add a job to our background worker queue!
    // Give the job a name ('process'), and the data it needs to work
    await repoQueue.add('process', {
      projectId: project._id,
      repoUrl: project.repoUrl
    });

    // Immediately reply to browser right after enqueueing.
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
