import mongoose from 'mongoose';

const projectDocSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
      unique: true
    },
    tree: {
      type: Array, // Array of directory/file nodes
      default: []
    },
    files: {
      type: Object, // Key-value map of file_path to markdown json docs
      default: {}
    }
  },
  { timestamps: true }
);

const ProjectDoc = mongoose.model('ProjectDoc', projectDocSchema);
export default ProjectDoc;
