import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CountUp from 'react-countup';

const StatCard = ({ title, value, trend, icon: Icon, color, isNumeric = false, suffix = '' }) => {
  const isPositive = trend > 0;
  
  // Safely parse number for CountUp if it's a string like "12,842"
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  
  // Handle Vite CJS/ESM interop where default export might be nested
  const SafeCountUp = CountUp.default || CountUp;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/5 rounded-3xl relative overflow-hidden group shadow-lg shadow-gray-200/50 dark:shadow-none transition-all duration-300 hover:shadow-2xl hover:shadow-${color}-500/20 dark:hover:shadow-${color}-500/10 hover:border-${color}-500/30`}
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 border border-${color}-100 dark:border-${color}-500/20 shadow-inner group-hover:rotate-6 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-500`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'} px-3 py-1.5 rounded-full border shadow-sm`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(trend)}%
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 tracking-wide uppercase">{title}</p>
        <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-baseline gap-1">
          {isNumeric && !isNaN(numericValue) ? (
            <SafeCountUp 
              end={numericValue} 
              duration={2.5} 
              separator="," 
              useEasing={true}
              suffix={suffix}
            />
          ) : (
            value
          )}
        </h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
