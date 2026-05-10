import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillRadar from '../components/SkillRadar';
import CareerCard from '../components/CareerCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Loader2, RefreshCw, PlusCircle, TrendingUp, ChevronRight, LayoutGrid, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/recommendations/');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecs = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/recommendations/generate');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex-center flex-col gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={32} />
        </div>
        <p className="text-text-muted font-bold tracking-widest uppercase text-sm animate-pulse">Syncing Neural Data...</p>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16 md:mb-24">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4"
          >
            <div className="w-8 h-[1px] bg-primary/30" />
            Control Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight"
          >
            Welcome, <span className="text-primary-gradient">{user?.name.split(' ')[0]}</span>
          </motion.h1>
          <p className="text-text-muted text-lg md:text-xl font-medium leading-relaxed">Your professional evolution starts here. Explore your personalized career insights.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateRecs}
          disabled={generating}
          className="btn btn-primary px-8 py-4.5 text-base rounded-2xl group relative overflow-hidden self-start lg:self-center"
        >
          {generating ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          <span className="relative z-10">{generating ? 'Analyzing Ecosystem...' : 'Recalibrate Engine'}</span>
          {generating && (
            <motion.div 
              className="absolute inset-0 bg-white/10"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          )}
        </motion.button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Profile Stats / Career DNA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4 flex flex-col gap-8"
        >
          <div className="glass-card flex flex-col border-white/5 p-8 md:p-10 h-fit sticky top-32">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex-center">
                  <TrendingUp className="text-primary" size={20} />
                </div>
                Skill Analysis
              </h3>
              <Link to="/profile" className="w-9 h-9 rounded-lg bg-white/5 flex-center hover:bg-primary/20 transition-all text-primary border border-white/5">
                <PlusCircle size={18} />
              </Link>
            </div>
            
            <div className="relative flex-center py-4 min-h-[300px]">
              {user?.skills?.length > 0 ? (
                <div className="w-full max-w-[320px] aspect-square relative z-10">
                  <SkillRadar skills={user.skills} />
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-text-muted text-sm font-medium mb-6">Add your skills to see your analysis.</p>
                  <Link to="/profile" className="btn btn-secondary rounded-lg px-6 py-2 text-sm">Add Skills</Link>
                </div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                <div className="text-2xl font-black text-white mb-0.5">{user?.skills?.length || 0}</div>
                <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Skills</div>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                <div className="text-2xl font-black text-primary mb-0.5">{recommendations.length}</div>
                <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Matches</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommendation Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex-center">
                <Award className="text-success" size={24} />
              </div>
              Recommended Careers
            </h3>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {recommendations.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CareerCard recommendation={rec} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card flex-center flex-col py-24 text-center border-dashed border-white/10"
                >
                  <Sparkles size={40} className="text-text-muted opacity-20 mb-6" />
                  <h4 className="text-2xl font-bold mb-3">No Recommendations Yet</h4>
                  <p className="text-text-muted max-w-xs mb-10">
                    Add your skills in the Profile section to see personalized career matches.
                  </p>
                  <Link to="/profile" className="btn btn-primary rounded-xl px-8 py-3">Add My Skills</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
