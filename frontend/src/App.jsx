import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './stores/authStore';
import { authApi } from './api/auth.api';

// Placeholder empty components so routing works immediately
const Dashboard = () => <div className="text-white p-8">Dashboard coming soon...</div>;
const ProjectDetail = () => <div className="text-white p-8">Project Detail coming soon...</div>;
const ChatPage = () => <div className="text-white p-8">Chat coming soon...</div>;
const DocsPage = () => <div className="text-white p-8">Docs Viewer coming soon...</div>;

function App() {
  const { isAuthenticated, setAuth, logout, token } = useAuthStore();

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      if (token) {
        try {
          const data = await authApi.getMe();
          setAuth(data.user, token);
        } catch (error) {
          logout();
        }
      }
    };
    validateSession();
  }, [token, setAuth, logout]);

  return (
    <BrowserRouter>
      {/* Toast notifications configuration */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      />
      
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/projects/:id/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/projects/:id/docs" element={<ProtectedRoute><DocsPage /></ProtectedRoute>} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
