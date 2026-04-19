import apiClient from './client';

export const projectApi = {
  getProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data; // Array of projects
  },

  getProject: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data; // Single project
  },

  createProject: async (projectData) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data; // Created project
  },

  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  getDocs: async (id) => {
    const response = await apiClient.get(`/projects/${id}/docs`);
    return response.data;
  }
};
