import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, ChevronRight, Award, Zap, Target } from 'lucide-react';

const CareerCard = ({ recommendation }) => {
  // Now handling nested career object correctly
  const { career, confidence_score } = recommendation;
  const scorePercentage = (confidence_score * 100).toFixed(0);

  if (!career) return null;

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -8 }}
      className="glass-card flex flex-col h-full border border-white/5 hover:border-primary/40 group overflow-hidden p-8"
    >
      {/* Top Section: Icon and Score */}
      <div className="flex justify-between items-start mb-10">
        <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-all border border-primary/10 group-hover:scale-110">
          <Briefcase className="text-primary" size={32} />
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
            <Zap size={12} className="fill-primary/20" />
            Neural Match
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter">{scorePercentage}</span>
            <span className="text-sm font-bold text-text-muted">%</span>
          </div>
        </div>
      </div>

      {/* Title and Industry */}
      <div className="mb-6">
        <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
          {career.industry}
        </div>
        <h3 className="text-2xl font-black text-white leading-[1.1] group-hover:text-primary transition-colors tracking-tight">
          {career.career_title}
        </h3>
      </div>
      
      <p className="text-text-muted text-sm mb-10 flex-grow line-clamp-3 font-medium leading-relaxed opacity-80">
        {career.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-2 text-text-muted text-[10px] uppercase font-black tracking-widest mb-2">
            <DollarSign size={14} className="text-warning" />
            Yield
          </div>
          <div className="text-base font-black text-white">
            ${career.average_salary ? career.average_salary.toLocaleString() : 'N/A'}
          </div>
        </div>
        <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-2 text-text-muted text-[10px] uppercase font-black tracking-widest mb-2">
            <TrendingUp size={14} className="text-success" />
            Velocity
          </div>
          <div className="text-base font-black text-white">High Growth</div>
        </div>
      </div>

      {/* Progress Bar for Score */}
      <div className="space-y-3 mb-10">
        <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
          <span className="text-text-muted">Compatibility Index</span>
          <span className="text-primary">{scorePercentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${scorePercentage}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
          />
        </div>
      </div>

      <button className="w-full btn btn-secondary py-4 rounded-xl group/btn flex-center gap-3 font-bold text-sm border-white/5 hover:border-primary/20 transition-all">
        View Career Matrix
        <ChevronRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
      </button>
    </motion.div>
  );
};

export default CareerCard;
