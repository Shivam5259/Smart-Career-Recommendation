import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LogOut, User, LayoutDashboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Navbar component: The navigation bar at the top of the screen.
 * It changes based on whether the user is logged in or not.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 py-4 border-b border-white/5">
      <div className="container flex items-center justify-between">
        {/* Logo - clicking this takes you back home */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <div className="bg-primary p-1.5 rounded-lg">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text">
            SmartCareer
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-text-muted hover:text-white transition-colors">Home</Link>
          
          {/* Conditional Rendering: If user is logged in, show Dashboard/Career DNA */}
          {user && (
            <>
              <Link to="/dashboard" className="text-text-muted hover:text-white transition-colors">Dashboard</Link>
              <Link to="/profile" className="text-text-muted hover:text-white transition-colors">Career DNA</Link>
            </>
          )}
        </div>

        {/* User Actions (Login/Logout) */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-text-muted">{user.education}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-text-muted hover:text-error transition-colors rounded-full hover:bg-white/5"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="btn btn-primary">
                Join Now <Sparkles size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

