import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Bell, Search, Sun, Moon, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl px-6 py-3 flex items-center justify-between transition-colors duration-500">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 tracking-tight">
            AutoPilotX
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-white/5 shadow-inner">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]"
          />
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 tracking-wide uppercase">System Running</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" 
            placeholder="Search workflows..." 
            className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-56 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        
        {/* Theme Toggle */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
        
        {/* Notifications */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
        </motion.button>
        
        <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />
        
        {/* User Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 pl-2 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors group-hover:text-blue-500">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user?.role}</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm"
            >
              <span className="text-sm font-bold text-blue-700 dark:text-gray-300">{user?.initials}</span>
            </motion.div>
          </div>

          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 mb-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                
                <div className="px-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                    <Settings className="w-4 h-4" /> Profile Settings
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
