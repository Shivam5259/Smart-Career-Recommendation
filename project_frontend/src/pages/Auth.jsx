import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, ArrowRight, Loader2, AlertCircle, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const isLogin = location.pathname === '/login';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    education: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await register(formData);
        setSuccess(true);
        // Automatically login after successful registration
        setTimeout(async () => {
          await login(formData.email, formData.password);
          navigate('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error('Auth error detail:', err.response?.data);
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || 'Validation error');
      } else {
        setError(detail || 'Connection failed. Is the backend server running?');
      }
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 bg-gradient relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-primary rounded-[2rem] flex-center mx-auto mb-8 shadow-2xl shadow-primary/30 border border-white/10"
          >
            <Brain className="text-white" size={36} />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            {isLogin ? 'Welcome Back' : 'Join the Future'}
          </h2>
          <p className="text-text-muted text-lg font-medium opacity-80 leading-relaxed">
            {isLogin 
              ? 'Access your personal AI career dashboard' 
              : 'Start your journey towards a data-driven career path'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <div className="w-24 h-24 bg-success/10 rounded-full flex-center mx-auto mb-8">
                <CheckCircle2 size={56} className="text-success" />
              </div>
              <h3 className="text-3xl font-black mb-4">Account Initialized!</h3>
              <p className="text-text-muted text-lg">Personalizing your experience, please wait...</p>
              <div className="mt-12 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={36} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="form">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-10 p-5 rounded-2xl bg-error/10 border border-error/20 text-error text-sm flex items-center gap-4 font-bold"
                >
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-10 overflow-hidden"
                    >
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-white/40 ml-2 uppercase tracking-[0.3em]">Full Name</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 rounded-2xl flex-center text-text-muted group-focus-within:text-primary group-focus-within:bg-primary/10 transition-all border border-white/5 shadow-inner">
                            <User size={22} />
                          </div>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-3xl py-7 pl-24 pr-8 text-xl font-medium bg-white/[0.03] border border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all outline-none shadow-2xl"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-white/40 ml-2 uppercase tracking-[0.3em]">Education Background</label>
                        <div className="relative group">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 rounded-2xl flex-center text-text-muted group-focus-within:text-primary group-focus-within:bg-primary/10 transition-all border border-white/5 shadow-inner">
                            <GraduationCap size={22} />
                          </div>
                          <input
                            type="text"
                            name="education"
                            required
                            value={formData.education}
                            onChange={handleChange}
                            className="w-full rounded-3xl py-7 pl-24 pr-8 text-xl font-medium bg-white/[0.03] border border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all outline-none shadow-2xl"
                            placeholder="e.g. B.Tech in CS, MBA, etc."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-white/40 ml-2 uppercase tracking-[0.3em]">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 rounded-2xl flex-center text-text-muted group-focus-within:text-primary group-focus-within:bg-primary/10 transition-all border border-white/5 shadow-inner">
                      <Mail size={22} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-3xl py-7 pl-24 pr-8 text-xl font-medium bg-white/[0.03] border border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all outline-none shadow-2xl"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-white/40 ml-2 uppercase tracking-[0.3em]">Security Password</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 rounded-2xl flex-center text-text-muted group-focus-within:text-primary group-focus-within:bg-primary/10 transition-all border border-white/5 shadow-inner">
                      <Lock size={22} />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-3xl py-7 pl-24 pr-8 text-xl font-medium bg-white/[0.03] border border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all outline-none shadow-2xl"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn btn-primary py-6 text-xl rounded-3xl flex-center gap-4 mt-12 shadow-2xl shadow-primary/40"
                >
                  {loading ? <Loader2 className="animate-spin" size={28} /> : (
                    <>
                      <span className="font-bold">{isLogin ? 'Sign In to Dashboard' : 'Initialize Account'}</span>
                      <ArrowRight size={26} className="opacity-70 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 text-center">
                <p className="text-text-muted font-medium opacity-80">
                  {isLogin ? "New to SmartCareer?" : "Already have an account?"}
                  <Link 
                    to={isLogin ? "/register" : "/login"} 
                    className="text-primary font-bold ml-2 hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    {isLogin ? 'Create Profile' : 'Sign In'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
