import { 
  Brain, FileText, Database, BarChart3, Settings, LogOut, LayoutDashboard 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  documentCount: number;
}

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  onLogout,
  documentCount 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'upload', name: 'Upload Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'chat', name: 'AI Chat', icon: <Brain className="w-5 h-5" /> },
    { id: 'knowledge', name: 'Knowledge Base', icon: <Database className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <aside className="w-64 my-4 ml-4 rounded-[24px] border border-[#d6ecff] bg-[#dff3ff] backdrop-blur-md shadow-xl flex flex-col justify-between shrink-0 transition-colors duration-400">
      
      {/* Upper Brand Section */}
      <div className="flex flex-col flex-1 pt-6 overflow-y-auto">
        {/* Brand logo */}
        <div className="px-6 flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 font-sans">AskMyPDF</span>
            <span className="text-blue-600 font-black text-[9px] ml-1 bg-blue-500/10 px-1.5 py-0.2 rounded-full border border-blue-500/20 font-mono">AI</span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.01]'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
                
                {/* Count Badge for Ingested Vault */}
                {item.id === 'knowledge' && documentCount > 0 && (
                  <span className={`ml-auto font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                    isActive 
                      ? 'bg-white/20 text-white border-white/20' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {documentCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Lower Logout Block */}
      <div className="p-4 border-t border-[#d6ecff] bg-[#eaf6ff]/40 rounded-b-[24px]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group cursor-pointer"
        >
          <div className="transition-transform group-hover:translate-x-0.5">
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
          </div>
          <span>Exit Platform</span>
        </button>
      </div>

    </aside>
  );
}
