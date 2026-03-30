import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

const LOG_TYPES = [
  { icon: Cpu, color: 'text-blue-400', label: 'Agent' },
  { icon: Info, color: 'text-neutral-400', label: 'System' },
  { icon: AlertTriangle, color: 'text-yellow-400', label: 'Warning' },
  { icon: CheckCircle2, color: 'text-green-400', label: 'Success' },
];

const LogsFeed = ({ logs = [] }) => {
  const [displayLogs, setDisplayLogs] = useState([]);

  useEffect(() => {
    let index = 0;
    const actions = [
      'Extracting entities from transcript...',
      'Validating invoice #8821...',
      'Updating knowledge graph...',
      'Generating follow-up tasks...',
      'Syncing with database...',
    ];

    const interval = setInterval(() => {
      let newLog;
      if (logs && logs.length > 0) {
        // Trickle in a real log from the fetched DB data looping sequentially
        const realLog = logs[index % logs.length];
        newLog = {
          id: Date.now() + Math.random(),
          type: realLog.type,
          action: realLog.action,
          timestamp: new Date().toLocaleTimeString([], { hour12: false }), // animate time to feel live
          user: realLog.user
        };
        index++;
      } else {
        // Fallback fake logs if the DB logs table is completely empty
        newLog = {
          id: Date.now() + Math.random(),
          type: Math.floor(Math.random() * 4),
          action: actions[Math.floor(Math.random() * actions.length)],
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          user: `Agent-${Math.floor(Math.random() * 100)}`,
        };
      }
      
      setDisplayLogs(prev => [newLog, ...prev].slice(0, 15));
    }, 2000);

    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md flex flex-col h-full">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-300">Live Activity Feed</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {displayLogs.map((log) => {
            const TypeIcon = LOG_TYPES[log.type] ? LOG_TYPES[log.type].icon : Cpu;
            const logColor = LOG_TYPES[log.type] ? LOG_TYPES[log.type].color : 'text-blue-400';
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-3 group"
              >
                <span className="text-neutral-600 min-w-[65px]">{log.timestamp}</span>
                <div className={`${logColor} flex-shrink-0 mt-0.5`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <span className="text-neutral-500 mr-2">[{log.user}]</span>
                  <span className="text-neutral-300 group-hover:text-white transition-colors">
                    {log.action}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="p-3 bg-neutral-950/50 border-t border-white/5 text-[10px] text-neutral-600 flex justify-between items-center">
        <span>Connected to Cluster-US-East</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>
    </div>
  );
};

export default LogsFeed;
