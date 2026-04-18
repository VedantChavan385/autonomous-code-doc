import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Hello World / Health Check
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Autonomous Codebase Documentor API! 🚀" });
});

// ==========================================
// 🔌 API Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', chatRoutes);

export default app;
