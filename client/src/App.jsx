import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/Mainlayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import Tasks from './pages/Tasks.jsx';
import Chat from './pages/Chat.jsx';
import Team from './pages/Team.jsx';
import WhiteBoard from './pages/WhiteBoard.jsx';
import useAuthStore from './store/authStore.js';
import { useEffect } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import OAuthSuccess from './pages/OAuthSuccess.jsx';
import ProtectedRoute from './components/Protected.jsx';

export default function App() {
  
  const { fetchUser, loading, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="chat" element={<Chat />} />
          <Route path="team" element={<Team />} />
          <Route path="whiteboard" element={<WhiteBoard />} />
        </Route>
        
        {/* Public Routes */}
        <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}/>
        <Route path='/register' element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}/>
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}