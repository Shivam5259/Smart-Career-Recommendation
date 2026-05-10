import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, LogOut, User, LayoutDashboard, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  // We only want to show the "user" parts if we are NOT on a login/register page
  const showUserMenu = user && !isAuthPage;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 py-4 border-b border-white/5">
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight group">
          <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20 flex-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            SmartCareer
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {showUserMenu ? (
            <>
              <Link 
                to="/dashboard" 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                  location.pathname === '/dashboard' 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                    : 'text-text-muted hover:text-white border-white/10 hover:border-white/30'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                  location.pathname === '/profile' 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                    : 'text-text-muted hover:text-white border-white/10 hover:border-white/30'
                }`}
              >
                Profile
              </Link>
            </>
          ) : (
            !isAuthPage && (
              <Link 
                to="/" 
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                  location.pathname === '/' 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                    : 'text-text-muted hover:text-white border-white/10 hover:border-white/30'
                }`}
              >
                Home
              </Link>
            )
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          {showUserMenu ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{user.education}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 flex-center bg-white/5 text-text-muted hover:text-error transition-all rounded-lg border border-white/5"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-widest">Sign In</Link>
                <Link to="/register" className="btn btn-primary rounded-lg px-5 py-2.5 text-sm">
                  Get Started
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
