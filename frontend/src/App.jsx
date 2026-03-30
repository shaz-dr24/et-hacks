import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Meeting from './pages/Meeting';
import Invoice from './pages/Invoice';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const DashboardLayout = () => {
  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 transition-colors duration-500 min-h-[calc(100vh-73px)]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden relative">
        <AnimatedRoutes />
      </main>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans selection:bg-blue-500/30 transition-colors duration-500">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <DashboardLayout />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
