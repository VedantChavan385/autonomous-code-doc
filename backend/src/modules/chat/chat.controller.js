import ChatSession from './chat.model.js';
import Project from '../project/project.model.js';
import axios from 'axios';
import config from '../../config/index.js';

// @desc    Send a message to the AI for a specific project
// @route   POST /api/projects/:projectId/chat
export const sendMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;

    // 1. Double check the project exists and belongs to the user
    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Ask the Python AI Server the question!
    // We pass top_k: 5 so the AI gets the 5 most relevant code chunks
    const aiResponse = await axios.post(`${config.aiServerUrl}/query`, {
      question: question,
      project_id: projectId.toString(),
      top_k: 5,
    });

    const { answer, sources } = aiResponse.data;

    // 3. Find (or create) the chat session history for this project/user
    let chatSession = await ChatSession.findOne({ projectId, userId: req.user._id });
    if (!chatSession) {
      chatSession = new ChatSession({ projectId, userId: req.user._id, messages: [] });
    }

    // 4. Save both the user's question and the AI's answer to the database
    chatSession.messages.push({ role: 'user', content: question });
    chatSession.messages.push({ role: 'assistant', content: answer, sources });
    await chatSession.save();

    // 5. Send the AI's answer back to the frontend
    res.json({ answer, sources });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ message: 'Failed to communicate with AI Server' });
  }
};

// @desc    Get the chat history for a specific project
// @route   GET /api/projects/:projectId/chat
export const getChatHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const chatSession = await ChatSession.findOne({ projectId, userId: req.user._id });
    
    // Return messages if they exist, or empty array if brand new chat
    res.json(chatSession ? chatSession.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
