import { create } from 'zustand';
import { projectApi } from '../api/project.api';

export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectApi.getProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectApi.getProject(id);
      set({ selectedProject: project, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await projectApi.createProject(projectData);
      set((state) => ({ 
        projects: [newProject, ...state.projects],
        isLoading: false 
      }));
      return newProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectApi.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        isLoading: false,
        selectedProject: state.selectedProject?._id === id ? null : state.selectedProject
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
