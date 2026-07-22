import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, Server, Bell, Eye, EyeOff, Save, Moon, Sun, User 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function SettingsPanel({ 
  apiKey, 
  setApiKey, 
  backendUrl, 
  setBackendUrl,
  theme,
  setTheme
}: SettingsPanelProps) {
  const [localKey, setLocalKey] = useState(apiKey);
  const [localUrl, setLocalUrl] = useState(backendUrl);
  const [showKey, setShowKey] = useState(false);
  
  // Profile settings state (mock)
  const [profileName, setProfileName] = useState('Operator #102');
  const [profileRole, setProfileRole] = useState('Lead Safety Inspector');

  const [notifAlerts, setNotifAlerts] = useState(true);
  const [notifLogs, setNotifLogs] = useState(false);
  const [notifReports, setNotifReports] = useState(true);

  const handleSave = () => {
    setApiKey(localKey);
    setBackendUrl(localUrl);
    toast.success("Configurations saved successfully!", {
      style: {
        background: '#ffffff',
        color: '#0f172a',
        border: '1px solid #d6ecff',
        borderRadius: '16px',
        fontWeight: 'bold',
        fontSize: '12px'
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8 max-w-3xl mx-auto text-left"
    >
      {/* Header */}
      <div className="border-b border-[#d6ecff] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure AskMyPDF AI theme styling, Gemini keys, notifications, and profile parameters.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="p-6 bg-white border border-[#d6ecff] rounded-[24px] shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
            <User className="w-4.5 h-4.5 text-blue-600" />
            Profile Settings
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md shadow-blue-500/10">
              {profileName[0]}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-extrabold">Operator Name</label>
                <input 
                  type="text" 
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full h-10 bg-white rounded-xl border border-[#d6ecff] px-3 text-xs text-slate-700 focus:border-blue-500 mt-1.5"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-wider block font-extrabold">Designation Role</label>
                <input 
                  type="text" 
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full h-10 bg-white rounded-xl border border-[#d6ecff] px-3 text-xs text-slate-700 focus:border-blue-500 mt-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-6 bg-white border border-[#d6ecff] rounded-[24px] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
            <Sun className="w-4.5 h-4.5 text-blue-600" />
            Theme Customization
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            Select your preferred system interface visual style.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200/50 text-slate-400 hover:text-slate-600'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light Blue (Clean)
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-blue-600/10 text-blue-600 border-blue-500/30 shadow-sm'
                  : 'bg-slate-50 border-slate-200/50 text-slate-400 hover:text-slate-600'
              }`}
            >
              <Moon className="w-4 h-4" />
              Midnight Dark (Glass)
            </button>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 bg-white border border-[#d6ecff] rounded-[24px] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
            <Key className="w-4.5 h-4.5 text-blue-600" />
            Gemini API Credentials
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-normal font-sans">
            By default, AskMyPDF AI uses its server-side `GEMINI_API_KEY`. You can override it here. Your custom credentials are saved inside your browser storage and passed in custom headers.
          </p>
          <div className="relative">
            <input 
              type={showKey ? "text" : "password"}
              placeholder="Enter custom GEMINI_API_KEY..."
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="w-full h-11 bg-white rounded-xl border border-[#d6ecff] pl-4 pr-12 text-xs text-slate-755 focus:border-blue-500 font-mono shadow-sm"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Server Connections */}
        <div className="p-6 bg-white border border-[#d6ecff] rounded-[24px] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
            <Server className="w-4.5 h-4.5 text-blue-600" />
            Backend Connection
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-normal font-sans">
            Configure the local Flask API gateway address for text ingestion and semantic vector lookups.
          </p>
          <div>
            <input 
              type="text"
              placeholder="Backend Endpoint URL..."
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              className="w-full h-11 bg-white rounded-xl border border-[#d6ecff] px-4 text-xs text-slate-700 focus:border-blue-500 font-mono shadow-sm"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-white border border-[#d6ecff] rounded-[24px] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
            <Bell className="w-4.5 h-4.5 text-blue-600" />
            System Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3.5 cursor-pointer group">
              <input 
                type="checkbox"
                checked={notifAlerts}
                onChange={() => setNotifAlerts(!notifAlerts)}
                className="w-4.5 h-4.5 accent-blue-600 rounded border-[#d6ecff] cursor-pointer mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-sans">Alert Notifications</span>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">Notify immediately during document parsing failures or API connection latency issues.</p>
              </div>
            </label>

            <label className="flex items-start gap-3.5 cursor-pointer group">
              <input 
                type="checkbox"
                checked={notifLogs}
                onChange={() => setNotifLogs(!notifLogs)}
                className="w-4.5 h-4.5 accent-blue-600 rounded border-[#d6ecff] cursor-pointer mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-sans">Extraction Processing Logs</span>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">Enable granular logging prints for sliding-window chunking algorithms.</p>
              </div>
            </label>

            <label className="flex items-start gap-3.5 cursor-pointer group">
              <input 
                type="checkbox"
                checked={notifReports}
                onChange={() => setNotifReports(!notifReports)}
                className="w-4.5 h-4.5 accent-blue-600 rounded border-[#d6ecff] cursor-pointer mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-sans">Daily Ingestion Summary</span>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium leading-relaxed">Enable daily updates summarizing total indexed PDF documents.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer transition-all border border-blue-500/10"
          >
            <Save className="w-4.5 h-4.5" />
            Save Configurations
          </button>
        </div>

      </div>
    </motion.div>
  );
}
