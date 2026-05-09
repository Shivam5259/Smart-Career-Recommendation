import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillRadar from '../components/SkillRadar';
import CareerCard from '../components/CareerCard';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Loader2, RefreshCw, PlusCircle, TrendingUp } from 'lucide-react';
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
      <div className="min-h-screen flex-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold mb-2"
          >
            Welcome back, <span className="text-primary">{user?.name.split(' ')[0]}</span>!
          </motion.h1>
          <p className="text-text-muted">Here are your personalized career insights and recommendations.</p>
        </div>
        <button 
          onClick={generateRecs}
          disabled={generating}
          className="btn btn-primary px-6 group"
        >
          {generating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
          {generating ? 'Analyzing Profile...' : 'Update Recommendations'}
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {/* Profile Stats / Career DNA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 glass-card flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Brain className="text-primary" size={20} />
              Career DNA
            </h3>
            <Link to="/profile" className="text-sm text-primary hover:underline flex items-center gap-1">
              Edit Skills <PlusCircle size={14} />
            </Link>
          </div>
          
          <div className="flex-grow flex-center">
            {user?.skills?.length > 0 ? (
              <SkillRadar skills={user.skills} />
            ) : (
              <div className="text-center py-12">
                <p className="text-text-muted mb-6">Add your skills to see your Career DNA visualization.</p>
                <Link to="/profile" className="btn btn-secondary">Add Skills</Link>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{user?.skills?.length || 0}</div>
              <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Skills</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-primary">{recommendations.length}</div>
              <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Paths Found</div>
            </div>
          </div>
        </motion.div>

        {/* Live Recommendation Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-success" size={20} />
              AI Career Recommendations
            </h3>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CareerCard recommendation={rec} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card flex-center flex-col py-24 text-center">
              <div className="bg-white/5 p-6 rounded-full mb-6">
                <Sparkles size={48} className="text-text-muted opacity-20" />
              </div>
              <h4 className="text-xl font-bold mb-2">No recommendations yet</h4>
              <p className="text-text-muted max-w-sm mb-8">
                Add your skills in the profile section and click "Update Recommendations" to see where your talent fits best.
              </p>
              <button onClick={generateRecs} className="btn btn-primary">Generate Now</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
