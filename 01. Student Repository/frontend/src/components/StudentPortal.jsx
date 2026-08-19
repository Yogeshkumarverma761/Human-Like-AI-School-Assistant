import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Calendar, CheckCircle, TrendingUp, User } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { motion } from 'framer-motion';

const StudentPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState({ percentage: 0, status_today: 'Unknown' });
  const [timetable, setTimetable] = useState({ day: 'Monday', schedule: 'Loading...' });

  useEffect(() => {
    // Redirect if not logged in or not a student
    if (!user || user.role !== 'student') {
      navigate('/');
      return;
    }

    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const [gradesRes, attRes, timeRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/student/${user.name}/grades`),
          axios.get(`http://localhost:8000/api/student/${user.name}/attendance`),
          axios.get(`http://localhost:8000/api/timetable/student/Monday`)
        ]);
        
        setGrades(gradesRes.data);
        setAttendance(attRes.data);
        setTimetable(timeRes.data);
      } catch (err) {
        console.error("Failed to fetch student data", err);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 text-slate-200 max-w-[1600px] mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center glass-panel rounded-3xl p-6"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Student Portal
          </h1>
          <p className="text-slate-400 mt-1">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
            <User size={16} className="text-blue-400" />
            <span className="text-blue-400 font-semibold uppercase">{user.role}</span>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="text-sm text-red-400 hover:text-red-300 underline transition"
          >
            Sign Out
          </button>
        </div>
      </motion.div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-140px)]">
        
        {/* Left Column: Stats & Grades */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center"
            >
              <CheckCircle className="text-green-400 mb-2" size={28} />
              <h3 className="text-3xl font-bold text-white">{attendance.percentage}%</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Attendance</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center"
            >
              <TrendingUp className="text-purple-400 mb-2" size={28} />
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
              <Calendar className="text-blue-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Today's Schedule ({timetable.day})</h2>
            </div>
            <div className="glass-card rounded-xl p-4 border border-white/5">
              <p className="text-slate-300">{timetable.schedule}</p>
            </div>
          </motion.div>

          {/* Grades Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-3xl p-6 flex-1 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-cyan-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Current Grades</h2>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
              {grades.length === 0 ? (
                <p className="text-slate-400 text-sm">No grades found.</p>
              ) : (
                grades.map((g, idx) => (
                  <div key={idx} className="flex justify-between items-center glass-card rounded-xl p-4">
                    <span className="font-medium text-slate-200">{g.subject}</span>
                    <span className="font-bold text-cyan-400">{g.score}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

        </div>

        {/* Right Column: AI Chat */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.5 }}
           className="w-full lg:w-2/3 h-[600px] lg:h-full relative rounded-3xl overflow-hidden glass-panel"
        >
          {/* We pass a prop 'embedded' to ChatInterface so it doesn't try to take up the whole screen */}
          <ChatInterface embedded={true} />
        </motion.div>

      </div>
    </div>
  );
};

export default StudentPortal;
