import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Target, TrendingUp, ChevronRight, CheckCircle2, Award, Zap, Globe, Shield } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="bg-gradient min-h-screen overflow-x-hidden">
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container relative z-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center"
            >
              <motion.div
                variants={itemVariants}
                className="mb-8 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary flex items-center gap-2.5 text-sm font-bold tracking-wide uppercase"
              >
                <Sparkles size={16} className="animate-pulse" />
                Next-Gen Career Intelligence
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-extrabold mb-8 max-w-5xl mx-auto tracking-tight leading-[1.05] text-gradient"
              >
                Engineer Your <span className="text-primary-gradient">Future</span> with Precision AI
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Unlock your true potential. Our neural-matching engine analyzes your unique "Career DNA" to map out the most fulfilling and lucrative professional paths.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-16 md:mb-24"
              >
                <Link to="/register" className="btn btn-primary px-10 py-4 text-lg group">
                  Build Your Career DNA
                  <ChevronRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>
                <a href="#features" className="btn btn-secondary px-10 py-4 text-lg">
                  Explore Methodologies
                </a>
              </motion.div>

              {/* Dashboard Preview / Mockup */}
              <motion.div
                variants={itemVariants}
                className="relative w-full max-w-6xl mx-auto"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl rounded-[2.5rem] -z-10" />
                <div className="glass-card p-2 md:p-4 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden aspect-[16/9] flex items-stretch gap-4">
                  {/* Left Panel Sidebar Mockup */}
                  <div className="hidden md:flex w-64 bg-white/5 rounded-2xl flex-col p-6 gap-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary flex-center">
                        <Brain size={20} />
                      </div>
                      <div className="h-4 w-24 bg-white/10 rounded-full" />
                    </div>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4 gap-3">
                        <div className="w-5 h-5 rounded bg-white/10" />
                        <div className="h-2 flex-grow bg-white/10 rounded-full" />
                      </div>
                    ))}
                  </div>

                  {/* Main Content Mockup */}
                  <div className="flex-grow flex flex-col gap-4">
                    <div className="h-16 w-full bg-white/5 rounded-2xl flex items-center px-8 justify-between">
                      <div className="h-3 w-48 bg-white/10 rounded-full" />
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                    </div>
                    <div className="flex-grow grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-3xl p-8 flex-center flex-col gap-6">
                        <div className="w-48 h-48 rounded-full border-4 border-primary/20 border-t-primary animate-[spin_10s_linear_infinite]" />
                        <div className="h-3 w-32 bg-white/10 rounded-full" />
                      </div>
                      <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="bg-white/5 rounded-2xl p-6 flex flex-col gap-3">
                            <div className="h-3 w-3/4 bg-white/10 rounded-full" />
                            <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating Action Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex items-end justify-center pb-12">
                     <motion.div 
                       animate={{ y: [0, -10, 0] }}
                       transition={{ repeat: Infinity, duration: 4 }}
                       className="glass px-8 py-4 rounded-2xl flex items-center gap-4 border-primary/30"
                     >
                       <Zap size={24} className="text-warning fill-warning/20" />
                       <span className="font-bold">Neural Analysis Active</span>
                       <div className="flex -space-x-2">
                         {[...Array(3)].map((_, i) => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-primary/20" />
                         ))}
                       </div>
                     </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
              {[
                { label: 'Successful Placements', value: '15k+' },
                { label: 'Career Paths Indexed', value: '1.2k' },
                { label: 'AI Match Accuracy', value: '98%' },
                { label: 'Global Users', value: '50k+' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center md:items-start">
                  <div className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">{stat.value}</div>
                  <div className="text-xs md:text-sm text-text-muted font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section-spacing relative">
          <div className="container">
            <div className="max-w-3xl mb-16 md:mb-24">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gradient leading-tight">The Core Pillars of SmartCareer</h2>
              <p className="text-xl text-text-muted leading-relaxed font-medium">Our multi-dimensional approach ensures you don't just find a job, but a lifelong professional trajectory that aligns with your essence.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="text-primary" size={32} />,
                  title: "Neuro-Cognitive Mapping",
                  desc: "We analyze your problem-solving patterns and creative inclinations using advanced NLP models.",
                },
                {
                  icon: <Target className="text-secondary" size={32} />,
                  title: "Market Signal Analysis",
                  desc: "Live indexing of global job markets to identify high-growth opportunities before they go mainstream.",
                },
                {
                  icon: <Award className="text-accent" size={32} />,
                  title: "Skill Verification",
                  desc: "Visualize your competency gaps and get laser-focused learning paths to bridge them.",
                },
                {
                  icon: <Globe className="text-success" size={32} />,
                  title: "Global Reach",
                  desc: "Recommendations tailored for remote, hybrid, and local markets across 150+ countries.",
                },
                {
                  icon: <Shield className="text-warning" size={32} />,
                  title: "Privacy First",
                  desc: "Your data is encrypted and used solely for your personal career growth. No third-party selling.",
                },
                {
                  icon: <TrendingUp className="text-primary" size={32} />,
                  title: "Trajectory Tracking",
                  desc: "Not a one-time thing. We track your growth and suggest pivots as the industry evolves.",
                }
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="glass-card group p-10 border-white/5 hover:border-primary/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex-center mb-10 group-hover:scale-110 transition-all group-hover:bg-primary/10">
                    {feat.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-5 tracking-tight">{feat.title}</h3>
                  <p className="text-text-muted leading-relaxed font-medium">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 container">
          <div className="glass-card rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none -z-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 max-w-4xl mx-auto leading-tight">Ready to Decode Your Future?</h2>
              <p className="text-xl md:text-2xl text-text-muted mb-12 max-w-2xl mx-auto">Join thousands of professionals who have already found their perfect path.</p>
              <Link to="/register" className="btn btn-primary px-16 py-5 text-xl rounded-2xl">
                Get Started Now <Zap size={24} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-20 border-t border-white/5 bg-surface/10">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter mb-4">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Brain className="text-white w-6 h-6" />
                </div>
                <span>SmartCareer</span>
              </div>
              <p className="text-text-muted max-w-xs">Building the intelligence layer for global career development.</p>
            </div>
            
            <div className="flex gap-12">
              <div className="flex flex-col gap-4">
                <span className="font-bold text-white">Platform</span>
                <a href="#" className="text-text-muted hover:text-primary transition-colors">Features</a>
                <a href="#" className="text-text-muted hover:text-primary transition-colors">Pricing</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-bold text-white">Company</span>
                <a href="#" className="text-text-muted hover:text-primary transition-colors">About</a>
                <a href="#" className="text-text-muted hover:text-primary transition-colors">Privacy</a>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 text-center text-text-muted text-sm">
            <p>© 2026 SmartCareer AI Career Recommendation System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
