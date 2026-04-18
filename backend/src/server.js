import app from './app.js';
import connectDB from './config/db.js';
import config from './config/index.js';
import { createServer } from 'http';
import { initSocket } from './socket/index.js'; // ✨ NEW

import './jobs/processRepo.job.js'; // Wake up the worker

connectDB();

// 1. We have to wrap our Express 'app' into a raw Node HTTP server...
const httpServer = createServer(app);

// 2. ...so that we can attach Socket.IO to the exact same port!
initSocket(httpServer);

// 3. Notice we use httpServer.listen now, NOT app.listen
httpServer.listen(config.port, () => {
    console.log(`
    =========================================
    🚀 Backend Server is running!
    📡 URL: http://localhost:${config.port}
    📻 Socket.IO: Attached
    🛠️  Mode: ${config.nodeEnv}
    =========================================
    `);
});
