import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, CheckSquare, Clock, GraduationCap, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  // Assume a teacher profile
  const user = { role: 'teacher', name: 'Mr. Alex Thorne' };

  // Mock teacher metrics
  const [metrics] = useState({
    myClasses: 5,
    pendingAssignments: 32,
    nextClass: 'Mathematics 101',
    nextTime: '10:30 AM'
  });

  return (
    <div className="min-h-screen p-4 md:p-8 text-slate-200 max-w-[1200px] mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel rounded-3xl p-6 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-fuchsia-500 text-transparent bg-clip-text">
            Staff Portal
          </h1>
          <p className="text-slate-400 mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2">
            <GraduationCap size={16} className="text-indigo-400" />
            <span className="text-indigo-400 font-semibold uppercase">{user.role}</span>
          </div>
          <button 
            onClick={() => navigate('/chat')}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white rounded-xl font-medium transition shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-2"
          >
            <MessageCircle size={18} />
            Ask Aether
          </button>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Core Analytics */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-slate-300 ml-2">My Teaching Overview</h2>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center border-t-2 border-t-indigo-500/50"
            >
              <BookOpen className="text-indigo-400 mb-2" size={32} />
              <h3 className="text-3xl font-bold text-white">{metrics.myClasses}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Active Classes</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center border-t-2 border-t-fuchsia-500/50"
            >
              <CheckSquare className="text-fuchsia-400 mb-2" size={32} />
              <h3 className="text-3xl font-bold text-white">{metrics.pendingAssignments}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">To Grade</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center border-t-2 border-t-pink-500/50"
            >
              <Clock className="text-pink-400 mb-2" size={32} />
              <h3 className="text-3xl font-bold text-white">{metrics.nextTime}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Next Class</p>
            </motion.div>
          </div>

          {/* Schedule Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-indigo-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Up Next</h2>
            </div>
            <div className="glass-card rounded-xl p-6 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-white font-medium mb-1">{metrics.nextClass}</p>
                <p className="text-sm text-slate-400">Room 304 - 25 Students</p>
              </div>
              <div className="bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full font-bold">
                {metrics.nextTime}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 pt-0 lg:pt-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-3xl p-6 flex-1 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckSquare className="text-fuchsia-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Quick Tasks</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 glass-card rounded-2xl">
                <h3 className="text-white font-medium mb-2">Mark Attendance</h3>
                <p className="text-sm text-slate-400 mb-4">Use Aether to quickly mark student attendance in your classes.</p>
                <button 
                  onClick={() => navigate('/chat')}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-sm flex justify-center items-center gap-2"
                >
                  <MessageCircle size={16} /> Open Assistant
                </button>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
