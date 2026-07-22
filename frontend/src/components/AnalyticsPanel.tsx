import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  TrendingUp, BarChart3, Database, FileText, Activity
} from 'lucide-react';
import type { AnalyticsSummary } from '../types';

interface AnalyticsPanelProps {
  analytics: AnalyticsSummary;
}

export default function AnalyticsPanel({ analytics }: AnalyticsPanelProps) {
  
  // Harmonies of light blue for Pie Chart sectors
  const PIE_COLORS = ['#2563eb', '#60a5fa', '#93c5fd', '#dbeafe', '#f1f5f9'];

  const stats = [
    {
      label: "Total Documents",
      value: analytics.total_documents,
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      subtext: "Parsed document indexes"
    },
    {
      label: "Queries Logged",
      value: analytics.total_questions,
      icon: <Activity className="w-5 h-5 text-indigo-600" />,
      subtext: "Operational search hits"
    },
    {
      label: "Avg Response Time",
      value: `${analytics.avg_response_time.toFixed(2)}s`,
      icon: <TrendingUp className="w-5 h-5 text-cyan-600" />,
      subtext: "Latency benchmarks"
    },
    {
      label: "Confidence Average",
      value: `${analytics.avg_confidence}%`,
      icon: <BarChart3 className="w-5 h-5 text-emerald-600" />,
      subtext: "Precision matching rating"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <div className="border-b border-[#d6ecff] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 text-left font-sans">Analytics Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1 text-left">Monitor ingestion volumes, RAG matching query frequencies, and citation averages.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-5 bg-white border border-[#d6ecff] rounded-[24px] shadow-sm text-left flex items-center justify-between hover:shadow-lg transition-all duration-300">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-[9px] text-slate-500 font-semibold">{stat.subtext}</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Graphs Layout Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Area Chart: Daily Activity */}
        <div className="lg:col-span-8 bg-white border border-[#d6ecff] rounded-[24px] p-6 shadow-sm flex flex-col justify-between h-[360px]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm font-sans text-left">Daily Chat Search Frequencies</h3>
          </div>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid #d6ecff', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                    color: '#0f172a' 
                  }} 
                />
                <Area type="monotone" dataKey="count" name="Queries" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActivity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Formats Distribution */}
        <div className="lg:col-span-4 bg-white border border-[#d6ecff] rounded-[24px] p-6 shadow-sm flex flex-col justify-between h-[360px]">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm font-sans text-left">Document Formats</h3>
          </div>
          <div className="flex-1 relative flex items-center justify-center text-xs">
            {analytics.file_type_distribution.length === 0 ? (
              <div className="text-slate-400 text-xs">No documents uploaded.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.file_type_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.file_type_distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '16px', 
                      border: '1px solid #d6ecff', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                      color: '#0f172a' 
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Bar Chart: Citation Logs */}
      <div className="bg-white border border-[#d6ecff] rounded-[24px] p-6 shadow-sm flex flex-col justify-between h-[360px]">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm font-sans text-left">Top Cited Reference Files</h3>
        </div>
        <div className="flex-1 w-full text-xs">
          {analytics.most_cited_docs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">No citations logged yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.most_cited_docs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid #d6ecff', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                    color: '#0f172a' 
                  }} 
                />
                <Bar dataKey="count" name="Citations" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </motion.div>
  );
}
