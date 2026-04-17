import dotenv from 'dotenv';

// Load .env file FIRST before anything else reads process.env
dotenv.config();

const config = {
  // Server Configuration
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB Connection String
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/codebase-doc',

  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',

  // Frontend URL for CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // AI Server URL
  aiServerUrl: process.env.AI_SERVER_URL || 'http://localhost:8000',
};

export default config;
