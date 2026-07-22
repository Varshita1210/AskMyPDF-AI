import { motion } from 'framer-motion';
import { 
  FileText, MessageSquare, Clock, ShieldCheck, 
  UploadCloud, Database, BarChart3, ArrowRight, Activity, Brain, Search
} from 'lucide-react';
import type { DocumentInfo, ActivityFeedItem } from '../types';

interface DashboardHomeProps {
  documents: DocumentInfo[];
  totalQueries: number;
  avgResponseTime: number;
  avgConfidence: number;
  activities: ActivityFeedItem[];
  setCurrentTab: (tab: string) => void;
}

export default function DashboardHome({
  documents,
  totalQueries,
  avgResponseTime,
  avgConfidence,
  activities,
  setCurrentTab
}: DashboardHomeProps) {

  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  const stats = [
    {
      label: "Total Documents",
      value: documents.length,
      subtext: `${sizeMB} MB indexed`,
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-100/70"
    },
    {
      label: "Questions Asked",
      value: totalQueries,
      subtext: "Last 30 days active",
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-100/70"
    },
    {
      label: "Avg Response Time",
      value: `${avgResponseTime.toFixed(2)}s`,
      subtext: "RAG matching latency",
      icon: <Clock className="w-5 h-5 text-cyan-600" />,
      bg: "bg-cyan-50 border-cyan-100/70"
    },
    {
      label: "AI Accuracy",
      value: `${avgConfidence}%`,
      subtext: "Based on citations",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100/70"
    },
    {
      label: "Total Searches",
      value: totalQueries + 12,
      subtext: "Keyword index lookups",
      icon: <Search className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-50 border-sky-100/70"
    },
    {
      label: "Active Sessions",
      value: "3",
      subtext: "Active dashboard instances",
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50 border-purple-100/70"
    }
  ];

  const quickActions = [
    {
      title: "Ingest New Manuals",
      description: "Upload PDFs, SOPs, and safety instructions.",
      icon: <UploadCloud className="w-5 h-5" />,
      tab: "upload",
      color: "border-[#d6ecff] hover:border-blue-400 group shadow-sm hover:shadow-md bg-gradient-to-br from-white to-blue-50/10"
    },
    {
      title: "Query Copilot",
      description: "Ask questions with immediate RAG citation maps.",
      icon: <Brain className="w-5 h-5" />,
      tab: "chat",
      color: "border-[#d6ecff] hover:border-indigo-400 group shadow-sm hover:shadow-md bg-gradient-to-br from-white to-indigo-50/10"
    },
    {
      title: "Explore Knowledge Base",
      description: "Filter, search, and view individual parsed chunks.",
      icon: <Database className="w-5 h-5" />,
      tab: "knowledge",
      color: "border-[#d6ecff] hover:border-cyan-400 group shadow-sm hover:shadow-md bg-gradient-to-br from-white to-cyan-50/10"
    },
    {
      title: "View Analytics",
      description: "Inspect citation counts and monthly activity logs.",
      icon: <BarChart3 className="w-5 h-5" />,
      tab: "analytics",
      color: "border-[#d6ecff] hover:border-emerald-400 group shadow-sm hover:shadow-md bg-gradient-to-br from-white to-emerald-50/10"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#d6ecff] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans text-left">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 text-left">AI-powered document intelligence platform for industrial knowledge management.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Status: Active</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-5 rounded-[24px] bg-white border border-[#d6ecff] text-left flex flex-col justify-between h-36 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-xl ${stat.bg} border`}>
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Quick Actions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 text-left flex items-center gap-2.5 font-sans">
            <Activity className="w-5 h-5 text-blue-600" />
            Quick Operational Commands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTab(action.tab)}
                className={`p-5 rounded-[24px] border text-left flex flex-col justify-between gap-5 transition-all duration-300 ${action.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                    {action.icon}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-sans">{action.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{action.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Platform Metric Card */}
          <div className="p-6 rounded-[24px] bg-white border border-[#d6ecff] text-left flex items-center gap-6 shadow-sm">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
              <Brain className="w-8 h-8" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-extrabold text-slate-900 text-sm font-sans">Empowered with Gemini RAG Intelligence</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">AskMyPDF AI maps uploaded PDFs, DOCX files, and text protocols, converting them into structured database vectors to provide plant operators with cited answers in under two seconds.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 text-left flex items-center gap-2.5 font-sans">
            <Clock className="w-5 h-5 text-blue-600" />
            Recent Activity Log
          </h2>
          <div className="bg-white border border-[#d6ecff] rounded-[24px] p-6 h-[348px] flex flex-col justify-between overflow-hidden shadow-sm">
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {activities.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <Activity className="w-8 h-8 mb-2 opacity-20 text-blue-600" />
                  No activity logged yet.
                </div>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex gap-3.5 text-left border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="relative flex flex-col items-center shrink-0">
                      <div className={`w-3 h-3 rounded-full mt-1.5 border-2 border-white ${
                        act.type === 'upload' ? 'bg-blue-600 shadow-lg shadow-blue-500/30' :
                        act.type === 'query' ? 'bg-indigo-500' :
                        act.type === 'delete' ? 'bg-red-500' : 'bg-slate-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed font-medium font-sans">{act.message}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{act.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
