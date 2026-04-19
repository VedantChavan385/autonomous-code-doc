import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use('/api', apiLimiter);

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

// Error Handler Middleware
app.use(errorHandler);

export default app;
