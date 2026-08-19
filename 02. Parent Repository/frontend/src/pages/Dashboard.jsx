import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Calendar, CheckCircle, TrendingUp, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  // Assume a parent profile
  const user = { role: 'parent', name: 'Sarah Doe' };
  const childName = "John Doe"; // Hardcoded child for the mock backend

  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState({ percentage: 0, status_today: 'Unknown' });
  const [timetable, setTimetable] = useState({ day: 'Monday', schedule: 'Loading...' });

  useEffect(() => {
    // Fetch dashboard data for the child
    const fetchData = async () => {
      try {
        const [gradesRes, attRes, timeRes] = await Promise.all([
          axios.get(`http://localhost:8001/api/student/${childName}/grades`),
          axios.get(`http://localhost:8001/api/student/${childName}/attendance`),
          axios.get(`http://localhost:8001/api/timetable/student/Monday`)
        ]);
        
        setGrades(gradesRes.data);
        setAttendance(attRes.data);
        setTimetable(timeRes.data);
      } catch (err) {
        console.error("Failed to fetch student data", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 text-slate-200 max-w-[1200px] mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel rounded-3xl p-6 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-rose-500 text-transparent bg-clip-text">
            Parent Portal
          </h1>
          <p className="text-slate-400 mt-1">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2">
            <User size={16} className="text-amber-400" />
            <span className="text-amber-400 font-semibold uppercase">{user.role}</span>
          </div>
          <button 
            onClick={() => navigate('/chat')}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-xl font-medium transition shadow-lg flex items-center gap-2"
          >
            <MessageCircle size={18} />
            Ask Aether
          </button>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Stats & Grades */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          
          <h2 className="text-xl font-semibold text-slate-300 ml-2">{childName}'s Overview</h2>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center border-t-2 border-t-amber-500/50"
            >
              <CheckCircle className="text-green-400 mb-2" size={28} />
              <h3 className="text-3xl font-bold text-white">{attendance.percentage}%</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Attendance</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center border-t-2 border-t-rose-500/50"
            >
              <TrendingUp className="text-amber-400 mb-2" size={28} />
              <h3 className="text-lg font-bold text-white uppercase">{attendance.status_today}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Today's Status</p>
            </motion.div>
          </div>

          {/* Timetable Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-amber-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Today's Schedule ({timetable.day})</h2>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/5">
              <p className="text-slate-300">{timetable.schedule}</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Grades */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 pt-0 lg:pt-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-3xl p-6 flex-1 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-rose-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Recent Grades</h2>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {grades.length === 0 ? (
                <p className="text-slate-400 text-sm">No grades found.</p>
              ) : (
                grades.map((g, idx) => (
                  <div key={idx} className="flex justify-between items-center glass-card rounded-xl p-5 hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="font-medium text-slate-200 text-lg">{g.subject}</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 text-2xl">{g.score}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
