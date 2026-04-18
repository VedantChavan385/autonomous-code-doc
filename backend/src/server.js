import app from './app.js';
import connectDB from './config/db.js';
import config from './config/index.js';

// WAKE UP THE WORKER! 🤖
import './jobs/processRepo.job.js'; 

// 1. Connect to MongoDB
connectDB();

// 2. Start the Express server
app.listen(config.port, () => {
    console.log(`
    =========================================
    🚀 Backend Server is running!
    📡 URL: http://localhost:${config.port}
    🛠️  Mode: ${config.nodeEnv}
    =========================================
    `);
});
