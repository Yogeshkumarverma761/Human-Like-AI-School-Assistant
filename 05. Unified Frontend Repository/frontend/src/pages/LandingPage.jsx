import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, Shield, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

const ROLES = [
  { id: 'student', title: 'Student Portal', icon: GraduationCap, color: 'from-blue-400 to-purple-500', bgHover: 'hover:bg-blue-500/10', borderHover: 'hover:border-blue-500/50' },
  { id: 'parent', title: 'Parent Portal', icon: Users, color: 'from-amber-400 to-rose-500', bgHover: 'hover:bg-amber-500/10', borderHover: 'hover:border-amber-500/50' },
  { id: 'staff', title: 'Staff Portal', icon: BookOpen, color: 'from-indigo-400 to-fuchsia-500', bgHover: 'hover:bg-indigo-500/10', borderHover: 'hover:border-indigo-500/50' },
  { id: 'principal', title: 'Management Portal', icon: Shield, color: 'from-emerald-400 to-teal-500', bgHover: 'hover:bg-emerald-500/10', borderHover: 'hover:border-emerald-500/50' }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState('');

  // Clear theme classes on unmount/mount to ensure clean state
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add('bg-mesh'); // Ensure background mesh structure exists
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Based on role, apply theme class to body for a smooth transition before navigating
    document.body.className = `theme-${selectedRole.id === 'principal' ? 'management' : selectedRole.id} bg-mesh`;
    
    setTimeout(() => {
      navigate('/dashboard', { state: { user: { role: selectedRole.id, name } } });
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background glow effects for landing page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
          <Sparkles size={16} className="text-yellow-400" />
          <span className="text-sm font-medium tracking-wide text-slate-300">Aether AI School System</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight text-glow">
          Welcome to <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Aether</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Select your portal to access AI-driven insights, management tools, and personalized assistance.
        </p>
      </motion.div>

      <div className="w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div 
              key="role-selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`group glass-panel rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 ${role.bgHover} ${role.borderHover} border-2 border-transparent`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${role.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                  <p className="text-sm text-slate-400">Access tailored tools and Aether AI.</p>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-panel rounded-3xl p-8 border-t-4" style={{ borderColor: 'var(--theme-glow)' }}>
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setSelectedRole(null)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 transition"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedRole.title}</h2>
                    <p className="text-sm text-slate-400">Please identify yourself</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-white/30 transition backdrop-blur-md shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition hover:scale-[1.02] bg-gradient-to-r ${selectedRole.color}`}
                  >
                    Enter Portal <ChevronRight size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;
