import apiClient from './client';

export const chatApi = {
  sendMessage: async (projectId, question) => {
    const response = await apiClient.post(`/projects/${projectId}/chat`, { question });
    return response.data; // { answer, sources: [{ file, line, snippet }] }
  },

  getHistory: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}/chat`);
    return response.data; // Array of message sessions
  }
};
