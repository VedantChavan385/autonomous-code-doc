import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 Backend Server is running!
    📡 URL: http://localhost:${PORT}
    🛠️  Mode: Development
    =========================================
    `);
});
