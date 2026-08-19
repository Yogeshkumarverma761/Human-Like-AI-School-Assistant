import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Mic, MicOff, Settings, Paperclip, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import AIAvatar from './AIAvatar';

const ChatInterface = ({ embedded = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { role: 'student', name: 'Guest' }; // fallback
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Inject background mesh class to body
    document.body.classList.add('bg-mesh');
    return () => document.body.classList.remove('bg-mesh');
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [user.role, language]);

  useEffect(() => {
    if (recognitionRef.current) {
        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'mr': 'mr-IN'
        };
        recognitionRef.current.lang = langMap[language] || 'en-US';
    }
  }, [language]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN'
      };
      utterance.lang = langMap[language] || 'en-US';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { text, sender: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // We prepend the user's name to context so AI knows who is asking, but keep it hidden in UI
      const contextPrefix = `[System: The current authenticated user is ${user.name}. Keep this context in mind if they ask for 'my' grades or 'my' attendance.]\n`;
      const messageWithContext = contextPrefix + text;

      const response = await axios.post('http://localhost:8001/chat', {
        message: messageWithContext,
        role: user.role,
        language: language,
        session_id: sessionId
      });

      const aiResponseText = response.data.response;
      const aiMessage = { text: aiResponseText, sender: 'ai', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      
      setMessages(prev => [...prev, aiMessage]);
      speakText(aiResponseText);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: 'Connection Error', sender: 'ai', time: new Date().toLocaleTimeString() }]);
    }
  };

  return (
    <div className={`flex w-full gap-6 text-slate-200 ${embedded ? 'h-full p-0' : 'h-screen p-4 md:p-8 max-w-7xl mx-auto'}`}>
      
      {/* Sidebar: Avatar & Settings */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className={`hidden md:flex flex-col w-1/3 p-6 ${embedded ? '' : 'glass-panel rounded-3xl'}`}
      >
        {!embedded && (
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AETHER AI
            </h1>
            <button className="p-2 glass-card rounded-full hover:bg-white/10 transition">
              <Settings size={20} />
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center">
          <AIAvatar isSpeaking={isSpeaking} />
          <p className="mt-4 text-sm text-slate-400">
            {isSpeaking ? 'Aether is speaking...' : 'Aether | Active'}
          </p>
          <div className="mt-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold tracking-wider flex items-center gap-2">
            <User size={14} />
            {user.name} ({user.role})
          </div>
        </div>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
          {!embedded && (
            <div className="mb-4 text-center">
               <button 
                  onClick={() => navigate('/')} 
                  className="text-xs text-red-400 hover:text-red-300 transition underline">
                  Sign Out
               </button>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex-1 flex flex-col overflow-hidden ${embedded ? '' : 'glass-panel rounded-3xl'}`}
      >
        {/* Header (Mobile only) */}
        <div className="md:hidden p-4 border-b border-white/10 flex items-center justify-between glass-card">
          <h1 className="text-xl font-bold text-glow">AETHER AI</h1>
          <AIAvatar isSpeaking={isSpeaking} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <span className="text-6xl mb-4">✨</span>
              <p>Start a conversation with Aether</p>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-lg shadow-purple-500/20">
                    A
                  </div>
                )}
                
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div 
                    className={`p-4 ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl rounded-tr-sm shadow-md' 
                        : 'glass-card rounded-2xl rounded-tl-sm border-l-2 border-l-cyan-400 shadow-lg'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className={`text-[10px] text-slate-500 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <User size={14} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-6">
          <div className="relative flex items-center bg-black/40 border border-white/10 rounded-2xl p-2 shadow-lg backdrop-blur-md focus-within:border-cyan-500/50 transition-colors">
            
            <button className="p-3 text-slate-400 hover:text-white transition">
              <Paperclip size={20} />
            </button>
            
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask Aether anything..."
              className="flex-1 bg-transparent border-none outline-none px-2 text-slate-200 placeholder-slate-500"
            />
            
            <button 
              onClick={toggleListening}
              className={`p-3 transition-colors rounded-xl mr-2 ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button 
              onClick={() => sendMessage()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium transition shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center gap-2"
            >
              Send <Send size={16} />
            </button>

          </div>
        </div>
      </motion.div>
      
    </div>
  );
};

export default ChatInterface;
