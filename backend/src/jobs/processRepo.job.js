import { Worker } from 'bullmq';
import axios from 'axios';
import { connection } from './queue.js';
import Project from '../modules/project/project.model.js';
import config from '../config/index.js';
import { getIO } from '../socket/index.js'; // ✨ NEW: Grab the radio microphone

const worker = new Worker('repo-processing', async (job) => {
  const { projectId, repoUrl } = job.data;
  console.log(`🤖 Worker picked up job for project: ${projectId}`);

  try {
    await Project.findByIdAndUpdate(projectId, { status: 'processing' });

    console.log(`📡 Sending ${repoUrl} to AI Server...`);
    const aiResponse = await axios.post(`${config.aiServerUrl}/process-repo`, {
      repo_url: repoUrl,
      project_id: projectId.toString(),
    });

    const aiData = aiResponse.data;

    await Project.findByIdAndUpdate(projectId, {
      status: 'ready',
      fileCount: aiData.file_count,
      chunkCount: aiData.chunk_count,
      chromaCollection: aiData.collection_id,
    });

    console.log(`✅ Success processing project ${projectId}!`);

    // ✨ NEW: Shout out to anyone listening in this project's radio room!
    // ✨ Standardized event name to match frontend
    const io = getIO();
    io.to(projectId.toString()).emit('project_status_updated', {
      projectId,
      status: 'ready',
      fileCount: aiData.file_count,
      chunkCount: aiData.chunk_count,
    });

  } catch (error) {
    console.error(`❌ Worker failed for ${projectId}:`, error.message);
    
    await Project.findByIdAndUpdate(projectId, {
      status: 'failed',
      errorMessage: error.response?.data?.detail || error.message,
    });

    const io = getIO();
    io.to(projectId.toString()).emit('project_status_updated', {
      projectId,
      status: 'failed',
      errorMessage: error.response?.data?.detail || error.message,
    });
  }
}, { connection });

worker.on('error', err => {
  console.error('Worker connection error:', err);
});

export default worker;
