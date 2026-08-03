import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { WorkspaceProvider } from '@/context/WorkspaceContext';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import ChatPage from '@/pages/ChatPage';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <ChatProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="workspace" element={<Dashboard />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="/workspace" element={<Navigate to="/app/workspace" replace />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </ChatProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
