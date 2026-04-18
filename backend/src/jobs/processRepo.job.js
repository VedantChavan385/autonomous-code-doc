import { Worker } from 'bullmq';
import axios from 'axios';
import { connection } from './queue.js';
import Project from '../modules/project/project.model.js';
import config from '../config/index.js';

// The Worker listens to the 'repo-processing' queue we created
const worker = new Worker('repo-processing', async (job) => {
  // 1. Get the data from the job ticket
  const { projectId, repoUrl } = job.data;
  console.log(`🤖 Worker picked up job for project: ${projectId}`);

  try {
    // 2. Update status in MongoDB to "processing"
    await Project.findByIdAndUpdate(projectId, { status: 'processing' });

    // 3. ✨ THE BIG CALL ✨
    // Send the GitHub URL to our Python AI Server
    // This part might take 30-120 seconds to finish!
    console.log(`📡 Sending ${repoUrl} to AI Server...`);
    
    const aiResponse = await axios.post(`${config.aiServerUrl}/process-repo`, {
      repo_url: repoUrl,
      project_id: projectId.toString(),
    });

    const aiData = aiResponse.data;

    // 4. Time-consuming process is done! Update MongoDB with success
    await Project.findByIdAndUpdate(projectId, {
      status: 'ready',
      fileCount: aiData.file_count,
      chunkCount: aiData.chunk_count,
      chromaCollection: aiData.collection_id,
    });

    console.log(`✅ Success processing project ${projectId}!`);

  } catch (error) {
    console.error(`❌ Worker failed for ${projectId}:`, error.message);
    
    // 5. If python server crashed or repo was invalid, mark as failed
    await Project.findByIdAndUpdate(projectId, {
      status: 'failed',
      errorMessage: error.response?.data?.detail || error.message,
    });
  }
}, { connection }); // attach the same redis connection

// Error handling for the worker itself
worker.on('error', err => {
  console.error('Worker connection error:', err);
});

export default worker;
