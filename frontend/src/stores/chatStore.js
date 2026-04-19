import { create } from 'zustand';
import { chatApi } from '../api/chat.api';

export const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  setMessages: (messages) => set({ messages }),

  sendMessage: async (projectId, question) => {
    // Add user message immediately for responsiveness
    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null 
    }));

    try {
      const data = await chatApi.sendMessage(projectId, question);
      
      const assistantMessage = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date().toISOString()
      };

      set((state) => ({ 
        messages: [...state.messages, assistantMessage],
        isLoading: false 
      }));
      
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to get answer from AI',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchHistory: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const history = await chatApi.getHistory(projectId);
      // History from backend is usually an array of sessions, 
      // but if we only support one session per project for now:
      const messages = history || [];
      set({ messages, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearChat: () => set({ messages: [], error: null })
}));
