import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    repoUrl: {
      type: String,
      required: [true, 'Please provide a GitHub repository URL'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'ready', 'failed'],
      default: 'pending',
    },
    fileCount: { type: Number, default: 0 },
    chunkCount: { type: Number, default: 0 },
    errorMessage: { type: String, default: null },
    chromaCollection: { type: String, default: null },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
