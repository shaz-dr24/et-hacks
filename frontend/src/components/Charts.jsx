import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export const WorkflowChart = ({ data = [] }) => (
  <div className="h-[300px] w-full mt-4" style={{ minWidth: 0, minHeight: 0 }}>
    <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={10}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
        <XAxis 
          dataKey="name" 
          stroke="#525252" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#525252" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#171717', 
            border: '1px solid #333333',
            borderRadius: '12px',
            fontSize: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }}
          itemStyle={{ color: '#fff' }}
        />
        <Area 
          type="monotone" 
          dataKey="success" 
          stroke="#3b82f6" 
          fillOpacity={1} 
          fill="url(#colorSuccess)" 
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="failure" 
          stroke="#ef4444" 
          fill="none" 
          strokeWidth={2}
          strokeDasharray="5 5"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const TasksChart = ({ data = [] }) => (
  <div className="h-[300px] w-full mt-4" style={{ minWidth: 0, minHeight: 0 }}>
    <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={10}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
        <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #333333', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'}} />
        <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const InvoiceDistribution = ({ data = [] }) => (
  <div className="h-[300px] w-full mt-4" style={{ minWidth: 0, minHeight: 0 }}>
    <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={10}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #333333', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'}} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
