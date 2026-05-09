import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Briefcase, ChevronRight, Award } from 'lucide-react';

const CareerCard = ({ recommendation }) => {
  const { career, confidence_score } = recommendation;
  const scorePercentage = (confidence_score * 100).toFixed(0);

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass-card flex flex-col h-full border border-white/5 hover:border-primary/30"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Briefcase className="text-primary" size={24} />
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Match Score</div>
          <div className="text-2xl font-black text-white">{scorePercentage}%</div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {career.career_title}
      </h3>
      
      <p className="text-text-muted text-sm mb-6 flex-grow line-clamp-3">
        {career.description}
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-sm">
          <TrendingUp size={16} className="text-success" />
          <span className="text-text-muted">Industry:</span>
          <span className="font-semibold">{career.industry}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <DollarSign size={16} className="text-warning" />
          <span className="text-text-muted">Avg. Salary:</span>
          <span className="font-semibold">${career.average_salary.toLocaleString()}</span>
        </div>
      </div>

      {/* Growth Path Visualization (Mini) */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-text-muted font-medium">Growth Potential</span>
          <span className="text-primary font-bold">High</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(95, scorePercentage)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      <button className="mt-6 w-full btn btn-secondary py-2 text-sm group">
        View Career Path
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export default CareerCard;
