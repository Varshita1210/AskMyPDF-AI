import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, Search, Trash2, Loader2, AlertCircle, Eye, X, BookOpen, Clock, Layers
} from 'lucide-react';
import type { DocumentInfo } from '../types';

interface DocUploadProps {
  documents: DocumentInfo[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
}

export default function DocUpload({ 
  documents, 
  onUpload, 
  onDelete, 
  isUploading, 
  uploadProgress 
}: DocUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<DocumentInfo | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMsg(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (validTypes.includes(file.type) || ['pdf', 'docx', 'txt'].includes(fileExt || '')) {
      onUpload(file).catch(err => {
        setErrorMsg(err.message || "Failed to process document.");
      });
    } else {
      setErrorMsg("Unsupported file format. Please upload PDF, DOCX, or TXT.");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <div className="border-b border-[#d6ecff] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 text-left font-sans">Document Ingestion</h1>
        <p className="text-sm text-slate-500 mt-1 text-left">Upload manuals, safety guides, and SOPs to index into the AskMyPDF AI's memory.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 text-left font-sans">Ingest File</h2>
          
          <motion.form 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onSubmit={(e) => e.preventDefault()}
            animate={{ scale: dragActive ? 1.02 : 1 }}
            className={`h-64 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all relative cursor-pointer ${
              dragActive 
                ? 'border-blue-500 bg-blue-50/50 glow-blue-soft' 
                : 'border-[#d6ecff] hover:border-blue-400 bg-white/70'
            }`}
            onClick={onButtonClick}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              multiple={false}
              onChange={handleChange}
              accept=".pdf,.docx,.txt"
            />
            
            <div className="flex flex-col items-center justify-center space-y-3 text-center pointer-events-none">
              <motion.div 
                animate={{ y: dragActive ? -5 : 0 }}
                className="p-3.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 transition-colors"
              >
                <UploadCloud className="w-8 h-8" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-slate-800">Drag & drop your file here, or <span className="text-blue-600 hover:text-blue-700 underline cursor-pointer">browse</span></p>
                <p className="text-xs text-slate-400 mt-1.5">Supports PDF, DOCX, TXT (Max 25MB)</p>
              </div>
            </div>
          </motion.form>

          {/* Progress / Status Block */}
          <AnimatePresence mode="wait">
            {isUploading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-white border border-[#d6ecff] text-left space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    Extracting & Chunking Document...
                  </span>
                  <span className="font-mono text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/20">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-sky-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-left"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-700">Processing Error</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-normal">{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Uploaded Documents List Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 text-left font-sans">Ingested Vault ({filteredDocs.length})</h2>
            
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-white rounded-xl border border-[#d6ecff] pl-9 pr-4 text-xs text-slate-700 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Cards Grid layout instead of table */}
          {filteredDocs.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[#d6ecff] rounded-[24px] shadow-sm max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-full text-blue-600">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm font-sans">No documents found in vault</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Upload manuals or technical guidelines on the left to initialize the vector database.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDocs.map((doc) => {
                const ext = doc.file_type.toUpperCase();
                return (
                  <motion.div 
                    key={doc.id}
                    layout
                    className="p-5 bg-white border border-[#d6ecff] rounded-[24px] hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-48 group shadow-sm"
                  >
                    <div>
                      {/* Title block */}
                      <div className="flex items-start gap-3 justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl border ${
                            ext === 'PDF' ? 'bg-red-50 text-red-600 border-red-100' :
                            ext === 'DOCX' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-sky-50 text-sky-600 border-sky-100'
                          } font-bold text-[10px] uppercase font-mono`}>
                            {ext}
                          </div>
                          <span className="font-bold text-xs text-slate-500 font-mono">ID: #{doc.id}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setSelectedPreviewDoc(doc)}
                            className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-100 transition-colors cursor-pointer"
                            title="View Document Summary"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(doc.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* File Name */}
                      <h4 className="font-bold text-slate-900 text-sm mt-3 line-clamp-2 text-left font-sans" title={doc.name}>
                        {doc.name}
                      </h4>
                    </div>

                    {/* Metadata indicators */}
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
        </div>

      </div>

      {/* File Preview Summary Overlay Modal */}
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
                  <h3 className="font-extrabold text-slate-900 text-sm font-sans">Document Summary</h3>
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
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block">Metadata Stats</label>
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
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold block">AI Document Summary</label>
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
