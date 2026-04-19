import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useProjectStore } from '../stores/projectStore';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export function useSocket() {
  const socketRef = useRef(null);
  const { token, isAuthenticated } = useAuthStore();
  const { fetchProjects, fetchProject, selectedProject } = useProjectStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Listen for project status updates
    socketRef.current.on('project_status_updated', (data) => {
      console.log('Project status updated:', data);
      
      // Refresh the list if we're on the dashboard
      fetchProjects();
      
      // Refresh the specific project if we're viewing it
      if (selectedProject && selectedProject._id === data.projectId) {
        fetchProject(data.projectId);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, isAuthenticated, fetchProjects, fetchProject, selectedProject]);

  return socketRef.current;
}
