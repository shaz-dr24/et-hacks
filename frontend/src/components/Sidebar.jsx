import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  UserPlus, 
  Video, 
  FileText, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: UserPlus, label: 'Onboarding', path: '/onboarding' },
    { icon: Video, label: 'Meetings', path: '/meeting' },
    { icon: FileText, label: 'Invoices', path: '/invoice' },
  ];

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 96 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-[calc(100vh-73px)] hidden lg:flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-gray-900 sticky top-[73px] transition-colors relative shadow-sm"
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-500 shadow-md transition-all z-50 hover:scale-110"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 py-10 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <p className={`px-4 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Navigation
          </p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : ''}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group font-bold relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/5 text-blue-600 dark:text-blue-500 border border-blue-500/20 shadow-[0_4px_12px_rgba(59,130,246,0.05)]' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active" 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10 ${isActive ? 'text-blue-500' : ''}`} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm whitespace-nowrap relative z-10"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className={`px-4 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-opacity ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Support
          </p>
          <nav className="space-y-2">
            <button title={isCollapsed ? "Settings" : ""} className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl border border-transparent transition-all group font-bold">
              <Settings className="w-5 h-5 flex-shrink-0 transition-transform group-hover:rotate-45" />
              <AnimatePresence>
                {!isCollapsed && <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm whitespace-nowrap">Settings</motion.span>}
              </AnimatePresence>
            </button>
            <button title={isCollapsed ? "Help Center" : ""} className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl border border-transparent transition-all group font-bold">
              <HelpCircle className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              <AnimatePresence>
                {!isCollapsed && <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm whitespace-nowrap">Help Center</motion.span>}
              </AnimatePresence>
            </button>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/50">
        <button 
          onClick={logout}
          title={isCollapsed ? "Sign Out" : ""}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl border border-transparent hover:border-red-100 dark:hover:border-red-500/20 transition-all font-bold group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
          <AnimatePresence>
            {!isCollapsed && <motion.span initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm whitespace-nowrap">Sign Out</motion.span>}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
