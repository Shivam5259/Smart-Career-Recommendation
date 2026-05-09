import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Target, TrendingUp, ChevronRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-gradient min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="container pt-24 pb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary flex items-center gap-2 text-sm font-semibold"
          >
            <Sparkles size={16} />
            AI-Powered Career Guidance
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-8 max-w-4xl tracking-tight leading-[1.1]"
          >
            Find Your <span className="text-primary">Perfect Career</span> Path with AI
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-muted mb-10 max-w-2xl leading-relaxed"
          >
            SmartCareer analyzes your skills, interests, and background to recommend the most suitable careers using state-of-the-art machine learning.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/register" className="btn btn-primary px-10 py-4 text-lg group">
              Get Started for Free
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="btn btn-secondary px-10 py-4 text-lg">
              Learn More
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative w-full max-w-5xl"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="glass-card p-4 relative overflow-hidden aspect-video flex-center border border-white/10">
              <div className="grid grid-cols-3 gap-4 w-full h-full opacity-40">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-lg border border-white/5" />
                ))}
              </div>
              <div className="absolute flex-center flex-col gap-4">
                <div className="bg-primary/20 p-6 rounded-full animate-pulse">
                  <Brain size={64} className="text-primary" />
                </div>
                <p className="text-sm font-mono text-primary font-bold uppercase tracking-widest">Processing Talent DNA...</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-surface/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why SmartCareer?</h2>
              <p className="text-text-muted max-w-2xl mx-auto">Our platform combines data science with career psychology to give you actionable insights.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="text-primary" />,
                  title: "AI Analysis",
                  desc: "Advanced skill-matching algorithms that look beyond job titles."
                },
                {
                  icon: <Target className="text-secondary" />,
                  title: "Precision Matching",
                  desc: "We calculate similarity scores based on your unique strengths."
                },
                {
                  icon: <TrendingUp className="text-accent" />,
                  title: "Growth Visualization",
                  desc: "See exactly how your skills map to your future career path."
                }
              ].map((feat, i) => (
                <div key={i} className="glass-card group hover:border-primary/50 transition-all">
                  <div className="bg-white/5 w-12 h-12 rounded-lg flex-center mb-6 group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                  <p className="text-text-muted">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 border-t border-white/5">
        <div className="container text-center text-text-muted text-sm">
          <p>© 2026 SmartCareer AI Career Recommendation System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
