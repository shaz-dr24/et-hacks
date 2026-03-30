import React, { useState } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  FileText, 
  MessageSquare, 
  ListTodo, 
  CheckCircle2, 
  ChevronRight,
  Loader2,
  Share2,
  Download
} from 'lucide-react';

import UploadCard from '../components/UploadCard';
import { pageVariants } from '../animations/pageTransitions';

const Meeting = () => {
  const [processing, setProcessing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const handleUploadSuccess = async (file) => {
    setProcessing(true);
    setTasks([]);
    setError(null);
    try {
      const result = await api.uploadTranscript(file);
      // Backend returns { tasks: [{task, assigned_to, status}], workflow_id, ... }
      const rawTasks = result.tasks || result.action_items || [];
      const mapped = rawTasks.map((t, index) => ({
        id: index + 1,
        text: t.task || t.action || t.text || t,
        user: typeof t.assigned_to === 'string'
          ? t.assigned_to.substring(0, 2).toUpperCase()
          : `T${index + 1}`,
        status: t.status || 'pending'
      }));
      // Stream tasks in one by one for the same animated feel
      setProcessing(false);
      mapped.forEach((task, index) => {
        setTimeout(() => {
          setTasks(prev => [...prev, task]);
        }, index * 800);
      });
    } catch (err) {
      setProcessing(false);
      setError(err.message || 'Failed to process transcript. Please try again.');
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 max-w-6xl mx-auto space-y-12"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[2rem] text-white shadow-xl shadow-purple-500/30 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Video className="w-10 h-10 relative z-10" />
          </motion.div>
          <div>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 tracking-tight leading-tight">Meeting Intelligence</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mt-1">Upload transcripts to extract action items automatically.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-sm text-red-700 dark:text-red-400 font-medium"
            >
              ⚠️ {error}
            </motion.div>
          )}
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-8 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-xl hover:shadow-2xl dark:shadow-none hover:shadow-purple-500/10 backdrop-blur-xl transition-all duration-300 relative overflow-hidden"
          >
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight relative z-10">
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
                <FileText className="w-5 h-5" />
              </div>
              Source Transcript
            </h3>
            <div className="relative z-10">
              <UploadCard 
                onSuccess={handleUploadSuccess}
                title="Drop Transcript"
                description="TXT, PDF, or DOCX (Max 20MB)"
                accept=".txt,.pdf,.doc,.docx"
              />
            </div>
          </motion.div>

          {/* AI Log Area */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="p-8 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-white/5 shadow-inner dark:shadow-none rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20" />
            
            <h4 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ListTodo className="w-4 h-4" /> AI Processing Log
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center border border-green-200 dark:border-green-500/20 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                </div>
                Audio segment mapping complete
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center border border-green-200 dark:border-green-500/20 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                </div>
                Speaker diarization synchronized
              </div>
              <AnimatePresence>
                {processing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-4 text-sm font-bold text-purple-600 dark:text-purple-400 mt-2 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl border border-purple-200 dark:border-purple-500/20 shadow-inner"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating action items payload...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              Extracted Action Items
            </h3>
            <span className="text-xs font-extrabold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/5 shadow-inner uppercase tracking-wider">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {tasks.length === 0 && !processing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-24 text-center space-y-6 bg-gray-50/50 dark:bg-gray-800/20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] shadow-inner"
                >
                  <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                     className="w-20 h-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-xl flex items-center justify-center mx-auto shadow-purple-500/10"
                  >
                    <ListTodo className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-lg tracking-tight">System standing by.<br/><span className="text-sm font-medium">Upload a meeting transcript to extract insights.</span></p>
                </motion.div>
              )}
              
              {/* Skeleton Loaders */}
              {processing && tasks.length === 0 && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <motion.div 
                      key={`skeleton-${i}`} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-white/5 rounded-3xl flex items-center gap-5 shadow-sm overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent skew-x-12 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex-shrink-0 relative z-10" />
                      <div className="flex-1 space-y-3 relative z-10 w-full">
                        <div className="flex justify-between w-full">
                           <div className="h-4 w-16 bg-gray-100 dark:bg-gray-700/50 rounded-full" />
                           <div className="h-4 w-4 bg-gray-100 dark:bg-gray-700/50 rounded-full" />
                        </div>
                        <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-700/50 rounded-full" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Action Items List */}
              {tasks.map((task, index) => (
                <motion.div
                   key={task.id}
                   initial={{ opacity: 0, x: 50, scale: 0.95 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   whileHover={{ x: 10, scale: 1.01 }}
                   transition={{ type: "spring", damping: 15 }}
                   className="p-6 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 hover:border-purple-300 dark:hover:border-purple-500/30 rounded-3xl transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-none dark:hover:shadow-purple-500/10 group flex items-start gap-5 backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-white dark:border-white/10 flex items-center justify-center text-sm font-black text-gray-700 dark:text-white flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform relative z-10">
                   {task.user}
                  </div>
                  
                  <div className="flex-1 space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border shadow-sm ${
                        task.status === 'completed' 
                           ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' 
                           : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                      }`}>
                        {task.status}
                      </span>
                      <motion.div whileHover={{ scale: 1.2, x: 2 }} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </motion.div>
                    </div>
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-200 leading-relaxed pr-8">{task.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {tasks.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="grid grid-cols-2 gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02, filter: "brightness(1.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="py-5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-[2rem] border border-gray-200 dark:border-white/5 transition-all shadow-md hover:shadow-xl dark:shadow-none flex items-center justify-center gap-3 w-full"
                >
                  <Share2 className="w-5 h-5" /> Share Report
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-[2rem] transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 flex items-center justify-center gap-3 w-full"
                >
                  <Download className="w-5 h-5" /> Export to Asana
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Meeting;
