import React from 'react';

const LogsTable = () => {
  const logs = [
    { id: 1, action: 'User login', user: 'admin@example.com', time: '10:45 AM' },
    { id: 2, action: 'File uploaded', user: 'john.doe@org.com', time: '11:12 AM' },
    { id: 3, action: 'Settings updated', user: 'admin@example.com', time: '12:30 PM' },
    { id: 4, action: 'Export completed', user: 'system', time: '01:15 PM' },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm transition-all hover:shadow-md h-full">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">System Activity Logs</h3>
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 px-2 rounded-lg transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-800">{log.action}</span>
              <span className="text-xs text-neutral-400">{log.user}</span>
            </div>
            <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
              {log.time}
            </span>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-all">
        View All Logs
      </button>
    </div>
  );
};

export default LogsTable;
