import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, GraduationCap, Award, ChevronRight, Check, Loader2 } from 'lucide-react';

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
      
      // Update local user state
      const updatedUser = { ...user };
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
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Your Career Profile</h1>
          <div className="flex items-center gap-6 p-6 glass-card border-primary/20">
            <div className="bg-primary/20 p-4 rounded-2xl">
              <GraduationCap size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-text-muted">{user?.education}</p>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Current Skills Section */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Award className="text-secondary" size={20} />
              My Skills & Proficiency
            </h3>
            
            <div className="space-y-4">
              {user?.skills?.length > 0 ? (
                user.skills.map((userSkill) => (
                  <motion.div 
                    layout
                    key={userSkill.skill.id}
                    className="glass-card p-5 border-white/5"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">{userSkill.skill.skill_name}</span>
                      <span className="text-primary font-mono font-bold">{userSkill.proficiency_level}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={userSkill.proficiency_level}
                      onChange={(e) => handleProficiencyChange(userSkill.skill.id, e.target.value)}
                      className="w-full accent-primary h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-text-muted tracking-widest">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center glass-card border-dashed border-white/10">
                  <p className="text-text-muted">No skills added yet. Search and add skills to get started.</p>
                </div>
              )}
            </div>
          </section>

          {/* Add Skills Section */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-primary" size={20} />
              Add New Skills
            </h3>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text"
                placeholder="Search skills (e.g. Python, SQL, Design...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-primary outline-none"
              />
            </div>

            <div className="glass-card p-2 max-h-[500px] overflow-y-auto border-white/5">
              <div className="flex flex-wrap gap-2 p-2">
                <AnimatePresence>
                  {filteredSkills.map(skill => (
                    <motion.button
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => handleAddSkill(skill.id)}
                      disabled={addingSkill === skill.id}
                      className="px-4 py-2 bg-white/5 hover:bg-primary/20 border border-white/5 hover:border-primary/50 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                    >
                      {skill.skill_name}
                      {addingSkill === skill.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Plus size={14} className="text-primary" />
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {search && filteredSkills.length === 0 && (
                  <p className="p-4 text-text-muted text-center w-full">No matching skills found.</p>
                )}
                {!search && filteredSkills.length === 0 && availableSkills.length > 0 && (
                  <p className="p-4 text-text-muted text-center w-full">You've added all available skills!</p>
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
