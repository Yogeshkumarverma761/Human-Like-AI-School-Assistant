import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, User, Users, GraduationCap, 
  BookOpen, Calendar, CheckSquare, Clock, Shield,
  Activity, Star
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Ensure theme is set just in case of direct reload (though we protect against it above)
  useEffect(() => {
    document.body.className = `theme-${user.role === 'principal' ? 'management' : user.role} bg-mesh`;
  }, [user.role]);

  // Role Configurations
  const ROLE_CONFIG = {
    student: {
      title: "Student Portal",
      icon: GraduationCap,
      colorClass: "text-blue-400",
      bgClass: "bg-blue-500/10 border-blue-500/20",
      btnClass: "from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
    },
    parent: {
      title: "Parent Portal",
      icon: Users,
      colorClass: "text-amber-400",
      bgClass: "bg-amber-500/10 border-amber-500/20",
      btnClass: "from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
    },
    staff: {
      title: "Staff Portal",
      icon: BookOpen,
      colorClass: "text-indigo-400",
      bgClass: "bg-indigo-500/10 border-indigo-500/20",
      btnClass: "from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
    },
    principal: {
      title: "Management Portal",
      icon: Shield,
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10 border-emerald-500/20",
      btnClass: "from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
    }
  };

  const config = ROLE_CONFIG[user.role];
  const Icon = config.icon;

  // Render specific widgets based on role
  const renderWidgets = () => {
    switch (user.role) {
      case 'student':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Widget icon={CheckSquare} value="92%" label="Attendance" themeColor="var(--theme-glow)" />
              <Widget icon={BookOpen} value="6" label="Active Subjects" themeColor="var(--theme-color-1)" />
              <Widget icon={Calendar} value="12:30" label="Next Class" themeColor="var(--theme-color-2)" />
            </div>
            <ScheduleWidget title="Upcoming Schedule" subtitle="Physics - Room 204" time="12:30 PM" />
          </>
        );
      case 'parent':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Widget icon={User} value="Present" label="Child's Status" themeColor="var(--theme-glow)" />
              <Widget icon={CheckSquare} value="92%" label="Attendance" themeColor="var(--theme-color-1)" />
              <Widget icon={Star} value="A-" label="Latest Grade" themeColor="var(--theme-color-2)" />
            </div>
            <ActionWidget title="Quick Actions" actionLabel="Ask about Child's Performance" onClick={() => navigate('/chat', { state: { user } })} />
          </>
        );
      case 'staff':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Widget icon={BookOpen} value="5" label="Active Classes" themeColor="var(--theme-glow)" />
              <Widget icon={CheckSquare} value="32" label="To Grade" themeColor="var(--theme-color-1)" />
              <Widget icon={Clock} value="10:30" label="Next Class" themeColor="var(--theme-color-2)" />
            </div>
            <ActionWidget title="Quick Actions" actionLabel="Mark Attendance" onClick={() => navigate('/chat', { state: { user } })} />
          </>
        );
      case 'principal':
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Widget icon={Users} value="1,204" label="Total Students" themeColor="var(--theme-glow)" />
              <Widget icon={User} value="84" label="Active Staff" themeColor="var(--theme-color-1)" />
              <Widget icon={Activity} value="96%" label="Avg Attendance" themeColor="var(--theme-color-2)" />
            </div>
            <ActionWidget title="School Broadcast" actionLabel="Send Announcement via Aether" onClick={() => navigate('/chat', { state: { user } })} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 text-slate-200 max-w-[1200px] mx-auto flex flex-col gap-6">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel rounded-3xl p-6 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white text-glow mb-1">
            {config.title}
          </h1>
          <p className="text-slate-400">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 border rounded-full px-4 py-2 ${config.bgClass}`}>
            <Icon size={16} className={config.colorClass} />
            <span className={`${config.colorClass} font-semibold uppercase tracking-wider text-sm`}>{user.role}</span>
          </div>
          <button 
            onClick={() => navigate('/chat', { state: { user } })}
            className={`px-6 py-2 bg-gradient-to-r text-white rounded-xl font-medium transition flex items-center gap-2 ${config.btnClass}`}
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
          <h2 className="text-xl font-semibold text-slate-300 ml-2">Dashboard Overview</h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {renderWidgets()}
          </motion.div>
        </div>

        {/* Right Column: Profile & Info */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 pt-0 lg:pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-6 flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-2 border-white/10 ${config.bgClass}`}>
              <Icon size={40} className={config.colorClass} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-slate-400 uppercase tracking-widest text-sm mb-6">{user.role}</p>
            
            <button 
              onClick={() => {
                document.body.className = '';
                navigate('/');
              }}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-sm text-slate-300"
            >
              Sign Out
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

// Sub-components
const Widget = ({ icon: Icon, value, label, themeColor }) => (
  <div 
    className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center border-t-2"
    style={{ borderTopColor: themeColor }}
  >
    <Icon className="mb-2" size={32} style={{ color: themeColor }} />
    <h3 className="text-3xl font-bold text-white">{value}</h3>
    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{label}</p>
  </div>
);

const ScheduleWidget = ({ title, subtitle, time }) => (
  <div className="glass-panel rounded-3xl p-6">
    <div className="flex items-center gap-2 mb-4 text-white">
      <Calendar size={20} />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="glass-card rounded-xl p-6 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-white font-medium mb-1">{subtitle}</p>
        <p className="text-sm text-slate-400">Please arrive 5 minutes early.</p>
      </div>
      <div className="bg-white/10 px-4 py-2 rounded-full font-bold text-white border border-white/10">
        {time}
      </div>
    </div>
  </div>
);

const ActionWidget = ({ title, actionLabel, onClick }) => (
  <div className="glass-panel rounded-3xl p-6">
    <div className="flex items-center gap-2 mb-4 text-white">
      <Activity size={20} />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="p-4 glass-card rounded-2xl">
      <p className="text-sm text-slate-400 mb-4">Leverage Aether's AI capabilities for this action.</p>
      <button 
        onClick={onClick}
        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-sm flex justify-center items-center gap-2 font-medium text-white"
      >
        <MessageCircle size={16} /> {actionLabel}
      </button>
    </div>
  </div>
);

export default Dashboard;
