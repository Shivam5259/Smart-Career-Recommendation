import React from 'react';
// We import special tools from 'react-router-dom' to handle different "pages" (routes)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// AuthProvider is a "wrapper" that gives all our components access to user login info
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute is a special "guard" component.
 * It checks if a user is logged in. 
 * - If yes, it shows the page (children).
 * - If no, it kicks them back to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // While we are checking if the user is logged in, show a loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex-center bg-background">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }
  
  // If the check is done and there is NO user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If we have a user, show the requested page!
  return children;
};

/**
 * AppRoutes defines which component to show based on the URL path.
 * Example: if path is "/", show <Landing />
 */
const AppRoutes = () => {
  const { loading } = useAuth();

  // Show a global loading spinner while the app initializes
  if (loading) {
    return (
      <div className="min-h-screen flex-center bg-background">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is visible on all pages */}
      <Navbar />
      
      {/* This div grows to fill the screen between the navbar and footer */}
      <div className="flex-grow">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          
          {/* Private Pages (require login) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback: if the user types a random URL, send them to the landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

/**
 * The main App component.
 * It wraps the entire application in the AuthProvider (for user data)
 * and the Router (for page navigation).
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

