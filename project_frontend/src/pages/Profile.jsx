import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, GraduationCap, Award, ChevronRight, Check, Loader2, Sparkles, Filter, Zap, Brain, User } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [availableSkills, setAvailableSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingSkill, setAddingSkill] = useState(null); // ID of skill being added

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills/');
        setAvailableSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, []);

  const handleAddSkill = async (skillId, proficiency = 50) => {
    setAddingSkill(skillId);
    try {
      const response = await api.post('/users/me/skills', {
        skill_id: skillId,
        proficiency_level: proficiency
      });
      
      // The response now includes the nested skill object from backend
      const updatedUser = { ...user };
      if (!updatedUser.skills) updatedUser.skills = [];
      
      const skillIdx = updatedUser.skills.findIndex(s => s.skill_id === skillId);
      
      if (skillIdx > -1) {
        updatedUser.skills[skillIdx] = response.data;
      } else {
        updatedUser.skills.push(response.data);
      }
      
      setUser(updatedUser);
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setAddingSkill(null);
    }
  };

  const handleProficiencyChange = async (skillId, level) => {
    try {
      const response = await api.post('/users/me/skills', {
        skill_id: skillId,
        proficiency_level: parseInt(level)
      });
      
      const updatedUser = { ...user };
      const skillIdx = updatedUser.skills.findIndex(s => s.skill_id === skillId);
      updatedUser.skills[skillIdx] = response.data;
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating proficiency:', error);
    }
  };

  const filteredSkills = availableSkills.filter(s => 
    s.skill_name.toLowerCase().includes(search.toLowerCase()) &&
    !user?.skills?.some(us => us.skill_id === s.id)
  );

  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4">
            <div className="w-8 h-[1px] bg-primary/30" />
            User Profile
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-tight">Your Career <span className="text-primary-gradient">Dashboard</span></h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 glass-card border-white/5 relative overflow-hidden"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex-center shrink-0 border border-primary/20 shadow-xl">
              <User size={48} className="text-primary" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">{user?.name}</h2>
              <p className="text-text-muted text-lg font-medium opacity-80">{user?.education}</p>
              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                <span className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Active Member</span>
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Current Skills Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex-center">
                  <Award className="text-secondary" size={18} />
                </div>
                My Skills
              </h3>
              <span className="text-xs font-bold text-text-muted">{user?.skills?.length || 0} Added</span>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {user?.skills?.length > 0 ? (
                  user.skills.map((userSkill) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      key={userSkill.skill.id}
                      className="glass-card p-6 border-white/20 group bg-white/[0.08] hover:bg-white/[0.12] shadow-xl"
                    >
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1.5">{userSkill.skill.category}</span>
                          <span className="font-bold text-2xl text-white tracking-tight">{userSkill.skill.skill_name}</span>
                        </div>
                        <div className="bg-primary text-white px-4 py-2 rounded-xl shadow-lg shadow-primary/20">
                          <span className="text-xl font-black">{userSkill.proficiency_level}%</span>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={userSkill.proficiency_level}
                          onChange={(e) => handleProficiencyChange(userSkill.skill.id, e.target.value)}
                          className="w-full accent-primary h-2.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center glass-card border-dashed border-white/10 flex flex-col items-center gap-4"
                  >
                    <p className="text-text-muted font-medium">No skills added yet. Select skills from the list on the right to get started.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Add Skills Section */}
          <section>
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex-center">
                  <Plus className="text-primary" size={18} />
                </div>
                Add Skills
              </h3>
            </div>

            <div className="relative mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
              <input 
                type="text"
                placeholder="Search skills to add..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg font-medium outline-none focus:bg-white/10 focus:border-primary/50 transition-all placeholder:text-white/20"
              />
            </div>

            <div className="glass-card p-6 max-h-[500px] overflow-y-auto border-white/5">
              <div className="flex flex-wrap gap-3">
                <AnimatePresence>
                  {filteredSkills.map(skill => (
                    <motion.button
                      key={skill.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => handleAddSkill(skill.id)}
                      disabled={addingSkill === skill.id}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-all flex items-center gap-3 shadow-lg shadow-primary/10 active:scale-95"
                    >
                      <span className="whitespace-nowrap">{skill.skill_name}</span>
                      {addingSkill === skill.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} className="opacity-70" />
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
                
                {search && filteredSkills.length === 0 && (
                  <p className="text-text-muted p-8 text-center w-full">No skills found for "{search}"</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
