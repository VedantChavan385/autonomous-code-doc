import { Queue } from 'bullmq';
import config from '../config/index.js';

// Parse the Redis URL to get connection details
const redisUrl = new URL(config.redisUrl);

// The Redis connection config that BullMQ needs
const connection = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port, 10) || 6379,
};

// Create a named queue called "repo-processing"
// Think of this as the "rail" in the kitchen where tickets are placed
const repoQueue = new Queue('repo-processing', { connection });

console.log('✅ BullMQ Queue "repo-processing" initialized');

export { repoQueue, connection };
