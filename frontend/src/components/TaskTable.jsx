import React from 'react';

const TaskTable = () => {
  const tasks = [
    { id: 1, name: 'Resume Parsing', status: 'Completed', date: '2024-03-20' },
    { id: 2, name: 'Invoice PDF Generation', status: 'In Progress', date: '2024-03-21' },
    { id: 3, name: 'Data Migration', status: 'Pending', date: '2024-03-22' },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm transition-all hover:shadow-md h-full">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Recent Tasks</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="py-3 px-2 text-sm font-semibold text-neutral-600">Task Name</th>
              <th className="py-3 px-2 text-sm font-semibold text-neutral-600">Status</th>
              <th className="py-3 px-2 text-sm font-semibold text-neutral-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                <td className="py-3 px-2 text-sm text-neutral-700">{task.name}</td>
                <td className="py-3 px-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-neutral-100 text-neutral-700'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-neutral-500">{task.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
