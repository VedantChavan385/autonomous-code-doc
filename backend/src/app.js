import express from 'express';
import cors from 'cors';

// Import our newly created routes
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// Middleware: Basic setup
app.use(express.json()); // Allow the server to understand JSON data in the request body
app.use(cors());         // Allow the frontend to communicate with this backend

// Hello World Route (Health Check)
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Autonomous Codebase Documentor API! 🚀" });
});

// ==========================================
// 🔌 API Routes
// ==========================================

// This means that the POST '/register' inside authRoutes will actually become POST '/api/auth/register'
app.use('/api/auth', authRoutes);


export default app;
