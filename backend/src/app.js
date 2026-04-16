import express from 'express';
import cors from 'cors';

const app = express();

// Middleware: Basic setup
app.use(express.json()); // Allow the server to understand JSON data
app.use(cors());         // Allow the frontend to communicate with this backend

// Hello World Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Autonomous Codebase Documentor API! 🚀" });
});

export default app;
