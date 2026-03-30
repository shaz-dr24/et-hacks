import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCcw,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Clock
} from 'lucide-react';

import StatCard from '../components/StatCard';
import { WorkflowChart, TasksChart, InvoiceDistribution } from '../components/Charts';
import LogsFeed from '../components/LogsFeed';
import { pageVariants, staggerContainer } from '../animations/pageTransitions';

const Dashboard = () => {
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthData, setHealthData] = useState({ failed: 0, total: 100 });
  const [analyticsData, setAnalyticsData] = useState({
    total_tasks: 0,
    active_workflows: 0,
    failed_jobs: 0,
    invoice_distribution: [],
    chart_data: []
  });

  const loadAnalytics = async () => {
    try {
      const data = await api.getAnalytics();
      setAnalyticsData(data);
      setHealthData({ failed: data.failed_jobs, total: data.total_tasks || 100 });
    } catch {
      // Fallback
      setHealthData({ failed: Math.floor(Math.random() * 40), total: 100 });
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await api.triggerHealthScan();
      await loadAnalytics();
    } catch {
      // If backend unreachable, use random value as before
      setHealthData({ failed: Math.floor(Math.random() * 40), total: 100 });
    } finally {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }
  };

  const displayTotalTasks = Math.max(analyticsData.total_tasks ?? 0, 1);
  const displayFailedJobs = Math.min(healthData.failed, displayTotalTasks);
  const failureRate = (displayFailedJobs / displayTotalTasks) * 100;
  const successRate = Math.max(0, 100 - failureRate);

  // Custom styling for workflow health monitor (from-orange-500 to-red-500 requested)
  const healthStatus = 
    failureRate < 10 ? { label: 'Optimal', color: 'bg-emerald-500', text: 'text-emerald-500', icon: CheckCircle2, shadow: 'shadow-emerald-500/30' } :
    failureRate < 30 ? { label: 'Degraded', color: 'bg-orange-500', text: 'text-orange-500', icon: AlertCircle, shadow: 'shadow-orange-500/30' } :
    { label: 'Critical', color: 'bg-red-500', text: 'text-red-500', icon: Zap, shadow: 'shadow-red-500/30' };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-8 max-w-7xl mx-auto space-y-10 selection:bg-blue-500/30"
    >
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative">
        <div className="z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight"
          >
            Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
          </motion.h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4" />
            Last synced: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 z-10"
        >
          {/* Workflow Health Monitor -> Orange/Red custom gradient glow */}
          <div className={`group flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl`}>
            {/* The underlying subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/10 mix-blend-multiply dark:mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative">
                <healthStatus.icon className={`w-5 h-5 ${healthStatus.text}`} />
                <span className={`absolute inset-0 rounded-full ${healthStatus.color} opacity-30 animate-ping`} />
              </div>
              <span className={`text-sm font-extrabold ${healthStatus.text} tracking-wider uppercase`}>
                Workflow: {healthStatus.label}
              </span>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            className="p-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 border border-transparent dark:border-white/10 rounded-2xl shadow-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
            disabled={isRefreshing}
          >
            <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin opacity-70' : ''}`} />
          </motion.button>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        <StatCard title="Total Tasks Processed" value={analyticsData.total_tasks} isNumeric={true} trend={12.5} icon={CheckCircle2} color="blue" />
        <StatCard title="Active Workflows" value={analyticsData.active_workflows} isNumeric={true} trend={3.2} icon={Zap} color="purple" />
        <StatCard title="Failed Jobs" value={displayFailedJobs} isNumeric={true} trend={-0.4} icon={AlertCircle} color="red" />
        <StatCard title="Success Rate" value={Math.round(successRate)} isNumeric={true} suffix="%" trend={1.2} icon={TrendingUp} color="emerald" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            className="p-8 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl relative overflow-hidden transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-500">
                  <Activity className="w-5 h-5" />
                </div>
                Workflow Performance
              </h3>
              <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"/> Success</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-red-500 border-dashed rounded-full"/> Failure</div>
              </div>
            </div>
            <div className="relative z-10">
              <WorkflowChart data={analyticsData.chart_data} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-8 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight relative z-10">
                <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-500">
                  <BarChart3 className="w-4 h-4" />
                </div>
                Tasks per Module
              </h3>
              <div className="relative z-10">
                <TasksChart data={analyticsData.chart_data} />
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-8 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-white/5 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight relative z-10">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg text-yellow-600 dark:text-yellow-500">
                  <PieChartIcon className="w-4 h-4" />
                </div>
                Invoice Status
              </h3>
              <div className="relative z-10">
                <InvoiceDistribution data={analyticsData.invoice_distribution} />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="lg:col-span-1 h-full shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl transition-transform duration-300"
        >
          <LogsFeed logs={analyticsData.recent_logs || []} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
