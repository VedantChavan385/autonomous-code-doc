import Project from './project.model.js';

// @desc    Create new project (Add Repo)
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, repoUrl } = req.body;

    // Create the project in our database
    // req.user._id comes from our 'protect' bouncer/middleware
    const project = await Project.create({
      userId: req.user._id,
      name,
      repoUrl,
    });

    res.status(201).json(project);
    
    // NOTE: In the next step, we will trigger the AI processing here!
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
