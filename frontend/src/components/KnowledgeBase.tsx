import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Database, Eye, X, BookOpen, Layers, Clock
} from 'lucide-react';
import type { DocumentInfo } from '../types';

interface KnowledgeBaseProps {
  documents: DocumentInfo[];
}

export default function KnowledgeBase({ documents }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentInfo | null>(null);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.file_type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filterTabs = [
    { id: 'all', name: 'All Formats' },
    { id: 'pdf', name: 'PDF Documents' },
    { id: 'docx', name: 'Word Documents' },
    { id: 'txt', name: 'Text Manuals' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <div className="border-b border-[#d6ecff] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 text-left font-sans">Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-1 text-left">Explore parsed document structures, metadata indexing, and chunks counts.</p>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/70 border border-[#d6ecff] p-5 rounded-[24px] shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search indexed documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white rounded-xl border border-[#d6ecff] pl-9 pr-4 text-xs text-slate-700 focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {filterTabs.map((tab) => {
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all shadow-sm cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                    : 'bg-white border-[#d6ecff] text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

      </div>

      {/* Document Grid Cards */}
      {filteredDocs.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#d6ecff] rounded-[24px] shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-full text-blue-600">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-sans">No indexed records found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try selecting another filter format or check your document list.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const ext = doc.file_type.toUpperCase();
            return (
              <motion.div 
                key={doc.id}
                layout
                className="p-5 bg-white border border-[#d6ecff] rounded-[24px] hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-48 group shadow-sm text-left"
              >
                <div>
                  {/* Top Row Format & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border ${
                        ext === 'PDF' ? 'bg-red-50 text-red-600 border-red-100' :
                        ext === 'DOCX' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-sky-50 text-sky-600 border-sky-100'
                      } font-bold text-[10px] uppercase font-mono`}>
                        {ext}
                      </div>
                      <span className="font-bold text-xs text-slate-400 font-mono">ID: #{doc.id}</span>
                    </div>

                    <button
                      onClick={() => setSelectedPreviewDoc(doc)}
                      className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-100 transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      title="Open file preview details"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>

                  {/* Doc Name */}
                  <h4 className="font-bold text-slate-900 text-sm mt-3 line-clamp-2 font-sans" title={doc.name}>
                    {doc.name}
                  </h4>
                </div>

                {/* Bottom Row metadata metrics */}
                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-semibold text-slate-400 font-mono">
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>{doc.chunk_count} Chunks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{doc.upload_date}</span>
                  </div>
                  <div className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 font-bold">
                    {formatSize(doc.size)}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* Document Detail Preview Overlay Modal */}
      <AnimatePresence>
        {selectedPreviewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/10 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white border border-[#d6ecff] shadow-2xl overflow-hidden text-left"
            >
              <div className="px-6 py-4 bg-slate-50 border-b border-[#d6ecff] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm font-sans">Document Metadata Summary</h3>
                </div>
                <button 
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block">File Name</label>
                  <h4 className="text-slate-900 text-sm font-extrabold mt-1 font-sans">{selectedPreviewDoc.name}</h4>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block">Database Indices</label>
                  <div className="grid grid-cols-3 gap-3 mt-1.5 text-xs font-mono text-slate-600 font-bold">
                    <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/50 text-center">
                      <span className="text-[9px] text-slate-400 block uppercase font-extrabold">Format</span>
                      <span className="font-extrabold text-blue-600 uppercase mt-0.5 block">{selectedPreviewDoc.file_type}</span>
                    </div>
                    <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-center">
                      <span className="text-[9px] text-slate-400 block uppercase font-extrabold">Pages</span>
                      <span className="font-extrabold text-indigo-600 mt-0.5 block">{selectedPreviewDoc.page_count} pg</span>
                    </div>
                    <div className="p-2.5 bg-sky-50/50 rounded-xl border border-sky-100/50 text-center">
                      <span className="text-[9px] text-slate-400 block uppercase font-extrabold">Size</span>
                      <span className="font-extrabold text-sky-600 mt-0.5 block">{formatSize(selectedPreviewDoc.size)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block">AI Extracted Summary</label>
                  <div className="mt-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/30 text-xs text-slate-600 leading-relaxed font-normal font-sans">
                    {selectedPreviewDoc.summary || "Summary text is currently parsing... Context segments are indexed inside vector DB loops."}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-[#d6ecff] flex justify-end">
                <button
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-md shadow-blue-500/20 border border-blue-500/10 transition-all cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
