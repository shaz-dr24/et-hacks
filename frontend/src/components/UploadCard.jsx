import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, CheckCircle, X, Loader2 } from 'lucide-react';

const UploadCard = ({ onSuccess, title, description, accept }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) startUpload(droppedFile);
  }, []);

  const startUpload = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 15;
      if (p > 100) p = 100;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          onSuccess(selectedFile);
        }, 800);
      }
    }, 200);
  };

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            className={`
              relative flex flex-col items-center justify-center w-full h-72 
              border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-300
              overflow-hidden group
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-[1.02]' 
                : 'border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:border-gray-300 dark:hover:border-white/20 shadow-inner'}
            `}
          >
            {isDragging && (
              <motion.div 
                layoutId="pulse-glow"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-[2rem] bg-blue-400/20 blur-3xl pointer-events-none z-0"
              />
            )}
            
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 pb-6 px-10 text-center">
              <motion.div 
                animate={isDragging ? { y: [0, -10, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className={`p-5 rounded-3xl bg-white dark:bg-gray-800 shadow-xl dark:shadow-none border border-gray-100 dark:border-white/5 mb-6 transition-all duration-300 group-hover:shadow-2xl ${isDragging ? 'scale-110 shadow-blue-500/30' : ''}`}
              >
                <Upload className={`w-10 h-10 ${isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'} transition-colors`} />
              </motion.div>
              <p className="mb-2 text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <input type="file" className="hidden" accept={accept} onChange={(e) => startUpload(e.target.files?.[0])} />
          </motion.label>
        ) : (
          <motion.div
            key="upload-progress"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-8 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-xl backdrop-blur-xl relative overflow-hidden"
          >
            {progress === 100 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 10, opacity: 0.1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500 rounded-full blur-xl pointer-events-none"
              />
            )}

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl shadow-inner">
                  <File className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900 dark:text-white truncate max-w-[220px] sm:max-w-[300px] tracking-tight">{file.name}</p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              {!uploading && (
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFile(null)} 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-white" />
                </motion.button>
              )}
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm font-bold tracking-wide">
                <span className={progress === 100 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}>
                  {uploading ? 'Analyzing Payload...' : 'Extraction Complete'}
                </span>
                <motion.span 
                  key={progress}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={progress === 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-500'}
                >
                  {progress}%
                </motion.span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden shadow-inner relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full rounded-full ${progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`}
                >
                  {/* Shimmer effect inside progress bar */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {progress === 100 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
                  className="mt-6 flex items-center justify-center gap-3 text-sm font-extrabold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 p-4 rounded-2xl border border-green-200 dark:border-green-500/20 shadow-inner"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, delay: 0.4 }}
                  >
                    <CheckCircle className="w-6 h-6" />
                  </motion.div>
                  PAYLOAD SECURED & VERIFIED
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadCard;
