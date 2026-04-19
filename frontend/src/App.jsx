import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import ChatPage from './pages/ChatPage';
import DocsPage from './pages/DocsPage';
import Settings from './pages/Settings';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './stores/authStore';
import { authApi } from './api/auth.api';

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
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1a1a1a',
            border: '3px solid #1a1a1a',
            borderRadius: '1rem',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.15)',
            fontWeight: 'bold',
            fontSize: '13px',
            padding: '12px 20px',
          },
          iconTheme: {
            primary: '#1a1a1a',
            secondary: '#ffffff',
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
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
