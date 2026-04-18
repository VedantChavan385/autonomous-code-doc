import mongoose from 'mongoose';

// A sub-schema for individual messages
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sources: {
    type: Array, // Stores the exact code snippets the AI used to answer
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// The main schema for a whole conversation
const chatSessionSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;
