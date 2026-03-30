import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Star, 
  CheckCircle2, 
  Circle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

import UploadCard from '../components/UploadCard';
import { pageVariants, staggerContainer, itemVariants } from '../animations/pageTransitions';

// Fallback static tasks shown if backend doesn't return tasks
const FALLBACK_TASKS = [
  { id: 1, title: 'Identity Verification', description: 'Confirm your legal identity documents.', status: 'completed' },
  { id: 2, title: 'Contract Signature', description: 'Review and sign the employment agreement.', status: 'pending' },
  { id: 3, title: 'Internal Tool Access', description: 'Request access to Slack, Jira, and GitHub.', status: 'pending' },
  { id: 4, title: 'Security Training', description: 'Complete the mandatory cyber security module.', status: 'pending' },
];

const Onboarding = () => {
  const [step, setStep] = useState('upload'); // upload, thinking, results
  const [thinkingState, setThinkingState] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [onboardingTasks, setOnboardingTasks] = useState([]);
  const [isProceeding, setIsProceeding] = useState(false);
  const [error, setError] = useState(null);
  const pendingFileRef = useRef(null);

  const thinkingMessages = [
    "Analyzing resume structure...",
    "Extracting contact entities...",
    "Mapping professional skills...",
    "Generating personalized onboarding path...",
    "Verifying data integrity..."
  ];

  const handleUploadSuccess = (file) => {
    pendingFileRef.current = file;
    setStep('thinking');
    setError(null);
  };

  useEffect(() => {
    if (step === 'thinking') {
      const interval = setInterval(() => {
        setThinkingState(prev => {
          if (prev >= thinkingMessages.length - 1) {
            clearInterval(interval);
            // All thinking messages shown — now call the real API
            const file = pendingFileRef.current;
            if (file) {
              api.uploadResume(file)
                .then(result => {
                  const candidate = result.candidate || {};
                  const rawTasks = result.tasks || [];
                  setExtractedData({
                    name: candidate.name || 'Candidate',
                    email: candidate.email || 'N/A',
                    role: candidate.role || candidate.current_role || candidate.designation || 'Professional',
                    skills: Array.isArray(candidate.skills)
                      ? candidate.skills
                      : typeof candidate.skills === 'string'
                        ? candidate.skills.split(',').map(s => s.trim())
                        : []
                  });
                  setOnboardingTasks(
                    rawTasks.length > 0
                      ? rawTasks.map((t, i) => ({
                          id: i + 1,
                          title: typeof t === 'string' ? t : t.task || t.title || `Task ${i + 1}`,
                          description: typeof t === 'string' ? '' : t.description || '',
                          status: typeof t === 'string' ? 'pending' : t.status || 'pending'
                        }))
                      : FALLBACK_TASKS
                  );
                  setStep('results');
                })
                .catch(err => {
                  setError(err.message || 'Failed to process resume.');
                  setStep('upload');
                });
            } else {
              setStep('upload');
            }
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 max-w-6xl mx-auto space-y-12"
    >
      <header className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/30 mb-2 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <User className="w-10 h-10 relative z-10" />
        </motion.div>
        
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">Onboarding Engine</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
          Upload your resume and let our autonomous agents handle your profile setup, 
          skill mapping, and onboarding roadmap.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-sm text-red-700 dark:text-red-400 font-medium"
                >
                  ⚠️ {error}
                </motion.div>
              )}
              <UploadCard 
                onSuccess={handleUploadSuccess}
                title="Drop your resume here"
                description="We support PDF and DOCX formats (Up to 10MB)"
                accept=".pdf,.doc,.docx"
              />
            </motion.div>
          )}

          {step === 'thinking' && (
            <motion.div 
              key="thinking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              className="py-24 flex flex-col items-center justify-center space-y-12 bg-white dark:bg-gray-800/40 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl backdrop-blur-xl"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-[3px] border-dashed border-blue-500/20 border-t-blue-500 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-[2px] border-indigo-500/20 border-b-indigo-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center drop-shadow-2xl"
                >
                  <Sparkles className="w-10 h-10 text-blue-500" />
                </motion.div>
              </div>
              
              <div className="text-center h-12 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={thinkingState}
                    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                  >
                    {thinkingMessages[thinkingState]}
                  </motion.p>
                </AnimatePresence>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                  className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-4 opacity-50"
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </motion.div>
          )}

          {step === 'results' && extractedData && (
            <motion.div 
              key="results"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Overview */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="p-10 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-2xl dark:shadow-none hover:shadow-blue-500/10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden transition-all duration-300 group"
                >
                  <h3 className="text-xs font-extrabold text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Extracted Profile
                  </h3>
                  
                  <div className="space-y-8 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                        <User className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-black text-2xl tracking-tight leading-tight">{extractedData.name}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">{extractedData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-gray-200 dark:border-indigo-500/20 group-hover:rotate-6 transition-transform duration-300">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-gray-300 font-bold text-lg">{extractedData.role}</p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Designation</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 relative z-10">
                    <h4 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Star className="w-4 h-4 text-yellow-500" /> Core Competencies
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {extractedData.skills.map((skill, i) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, type: "spring", damping: 12 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm transition-all"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Onboarding Tasks */}
                <motion.div 
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <h3 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> System Roadmap
                  </h3>
                  
                  {(onboardingTasks.length > 0 ? onboardingTasks : FALLBACK_TASKS).map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-6 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl dark:shadow-none rounded-3xl flex items-center gap-5 group cursor-pointer transition-all hover:border-blue-500/30 backdrop-blur-md"
                    >
                      {task.status === 'completed' ? (
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0 border border-green-200 dark:border-green-500/20 shadow-inner group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500 transition-colors shadow-inner">
                          <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 scale-50 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100" fill="currentColor" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-bold tracking-tight ${task.status === 'completed' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-200'}`}>
                            {task.title}
                          </p>
                          <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border shadow-sm ${
                             task.status === 'completed' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20' : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "spring" }}
                className="flex justify-center pt-8"
              >
                <motion.button 
                  onClick={() => setIsProceeding(true)}
                  whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-[2rem] shadow-2xl shadow-blue-500/30 transition-all flex items-center gap-4 hover:shadow-blue-500/50"
                >
                  {isProceeding ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  )}
                  {isProceeding ? "Provisioning Resources..." : "Proceed to Workspace"}
                  {!isProceeding && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Onboarding;
