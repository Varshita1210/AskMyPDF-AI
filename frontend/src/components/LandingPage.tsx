import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, FileText, Database, ArrowRight, Search, Activity, 
  Layers, CheckCircle, Server, Code, Sparkles, ChevronDown, ChevronUp, Play,
  Cpu, ShieldCheck, BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      title: "AI Document Chat",
      description: "Ask natural questions and have interactive conversations directly with individual files or entire folders."
    },
    {
      icon: <Search className="w-6 h-6 text-sky-600" />,
      title: "Smart PDF Search",
      description: "Query documents semantically. Ask about complex metrics, engineering guidelines, or operating limits."
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
      title: "OCR Extraction",
      description: "Automatically read scanned PDFs, layout guidelines, and text tables with advanced layout recovery."
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: "Source Citations",
      description: "Clickable references linking directly to the specific page and text block of the source manual."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
      title: "Confidence Score",
      description: "Know exactly how well the source document answers your question with a calculated confidence rating."
    },
    {
      icon: <Layers className="w-6 h-6 text-cyan-600" />,
      title: "Multi-file Support",
      description: "Upload PDFs, DOCX, and TXT files. Query multiple documents simultaneously to synthesize answers."
    },
    {
      icon: <Activity className="w-6 h-6 text-pink-600" />,
      title: "Fast Semantic Search",
      description: "Pure-Python similarity matching returns context segments in milliseconds without installation errors."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-600" />,
      title: "Analytics Dashboard",
      description: "Visualise documents uploaded, queries processed, response times, and citation trends with dark charts."
    }
  ];

  const workflowSteps = [
    { number: "01", title: "Upload Documents", desc: "Drag & drop PDF, DOCX, or TXT manuals into the secure RAG dashboard." },
    { number: "02", title: "AI Extracts Text", desc: "Our engine parses document layers, extracting clean text and running OCR on scans." },
    { number: "03", title: "Indexes Knowledge", desc: "Generate high-dimensional embeddings via Gemini and index them inside SQLite." },
    { number: "04", title: "Ask Questions", desc: "Input queries like 'Show turbine shutdown procedure' or 'What safety precautions exist?'" },
    { number: "05", title: "Receive Answers", desc: "AI replies with precise context, citations, page matching, and confidence ratings." }
  ];

  const architectureNodes = [
    { title: "Frontend Client", tech: "React + TS + Tailwind v4", icon: <Code className="w-5 h-5" />, desc: "Responsive workspace, drag zones, Recharts panels, and light glass design." },
    { title: "Flask Backend", tech: "Python Gateway", icon: <Server className="w-5 h-5" />, desc: "Handles API endpoints, runs document parsers, and logs query metrics." },
    { title: "Knowledge Retrieval", tech: "SQLite + Pure Cosine", icon: <Database className="w-5 h-5" />, desc: "Caches text fragments and runs dot-product vector scoring in milliseconds." },
    { title: "Gemini AI Engine", tech: "Google LLM API", icon: <Brain className="w-5 h-5" />, desc: "Generates semantic vectors and synthesises answers cited to source blocks." }
  ];

  const faqs = [
    { q: "How does the OCR function work on scanned PDFs?", a: "When you upload a scanned PDF, AskMyPDF AI parses the document layer. If no standard unicode character layout is detected, the pipeline automatically processes the pages through an OCR extraction engine, using Gemini's native multimodal layout scanner to read values, checklists, and tables." },
    { q: "Can AskMyPDF AI query multiple documents at the same time?", a: "Yes. The vector search engine queries all indexed chunks across your entire vault. It gathers the top matching segments regardless of which PDF they come from, allowing Gemini to synthesize cohesive answers from multiple references simultaneously." },
    { q: "How secure is my document data?", a: "Your files are parsed on your server and matched using local vectors. Embeddings and prompt queries are handled over secure API connections directly to Google's Gemini models. Your industrial datasets are not fed into public LLM training datasets." },
    { q: "Is a Gemini API Key required to run the platform?", a: "No. The system loads a server-side default API Key from environment variables. However, you can paste your own personal API Key in the Settings page to bypass default server rate limits. Your key stays stored locally in your browser's storage." }
  ];

  return (
    <div className="min-h-screen bg-[#eaf6ff] text-slate-900 grid-bg relative overflow-hidden transition-colors duration-400">
      {/* Animated Background Blobs */}
      <div className="absolute top-[8%] left-[-5%] w-[550px] h-[550px] bg-blue-300/30 rounded-full blur-[140px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-sky-300/30 rounded-full blur-[160px] pointer-events-none animate-float-reverse"></div>
      <div className="absolute top-[45%] left-[20%] w-[350px] h-[350px] bg-indigo-200/25 rounded-full blur-[110px] pointer-events-none"></div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-[#d6eaf8] bg-white/70 backdrop-blur-md rounded-none shadow-md shadow-blue-500/2">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Brain className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">AskMyPDF</span>
              <span className="text-blue-600 font-black text-[10px] ml-1 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">AI</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-blue-600 transition-colors">Workflow</a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          <button 
            onClick={onEnterApp}
            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-full transition-all shadow-lg shadow-blue-500/25 border border-blue-500/10"
          >
            Launch Platform
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-7xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#d6eaf8] text-xs font-bold text-blue-600 mb-8 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          <span>AskMyPDF AI Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
        >
          <span className="text-slate-900">Upload PDFs. Ask Questions.</span><br />
          <span className="text-gradient-blue">Get Instant Answers.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto mb-10 font-normal leading-relaxed"
        >
          Upload PDFs, DOCX, TXT files, and instantly chat with your documents using Google Gemini AI. An intelligent document brain designed for engineering SOPs, safety standards, and operational manuals.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button 
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/25 border border-blue-500/10 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="#workflow"
            className="w-full sm:w-auto px-8 py-4 font-bold text-slate-700 bg-white/80 border border-[#d6eaf8] hover:bg-white rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 fill-slate-600 stroke-none" />
            Watch Demo
          </a>
        </motion.div>

        {/* Floating Mini Cards Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Floating Card Left */}
          <motion.div 
            initial={{ opacity: 0, x: -30, y: 50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute left-[-40px] top-[40px] z-20 hidden lg:flex items-center gap-3 p-4 bg-white border border-[#d6eaf8] rounded-2xl shadow-xl shadow-blue-500/5 text-left"
          >
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">RAG Document Ingestion</span>
              <h4 className="text-xs font-bold text-slate-800">Manuals Indexed: 100%</h4>
            </div>
          </motion.div>

          {/* Floating Card Right */}
          <motion.div 
            initial={{ opacity: 0, x: 30, y: -40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute right-[-40px] bottom-[60px] z-20 hidden lg:flex items-center gap-3 p-4 bg-white border border-[#d6eaf8] rounded-2xl shadow-xl shadow-blue-500/5 text-left"
          >
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl">
              <Sparkles className="w-5.5 h-5.5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Gemini 1.5 Synthesis</span>
              <h4 className="text-xs font-bold text-slate-800">AI Confidence: 99.4%</h4>
            </div>
          </motion.div>

          {/* Main App Demo Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden bg-white/70 border border-[#d6eaf8] shadow-2xl shadow-blue-500/10 backdrop-blur-md p-2"
          >
            <div className="h-9 bg-slate-50 border-b border-[#d6eaf8] px-4 flex items-center gap-1.5 rounded-t-2xl">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="text-[10px] text-slate-400 font-mono ml-4">askmypdf-workspace-v1.0</div>
            </div>
            <div className="p-5 bg-white/40">
              <div className="grid grid-cols-12 gap-5 h-[340px]">
                {/* Fake Sidebar */}
                <div className="col-span-3 border-r border-[#d6eaf8] pr-4 flex flex-col gap-2 text-left text-xs text-slate-500">
                  <div className="w-full h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center px-3 text-blue-600 font-bold gap-2">
                    <Brain className="w-4 h-4" /> AI Chat
                  </div>
                  <div className="w-full h-9 hover:bg-slate-50 rounded-xl flex items-center px-3 gap-2"><FileText className="w-4 h-4" /> Upload Documents</div>
                  <div className="w-full h-9 hover:bg-slate-50 rounded-xl flex items-center px-3 gap-2"><Database className="w-4 h-4" /> Knowledge Base</div>
                  <div className="w-full h-9 hover:bg-slate-50 rounded-xl flex items-center px-3 gap-2"><BarChart3 className="w-4 h-4" /> Analytics</div>
                </div>
                {/* Fake Chat area */}
                <div className="col-span-9 flex flex-col justify-between text-left relative">
                  <div className="overflow-y-auto space-y-3 p-1 text-xs">
                    <div className="bg-slate-100 border border-slate-200/50 rounded-2xl p-3 max-w-[85%] text-slate-700">
                      Explain the emergency shutdown parameters from the gas turbine generator handbook.
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 max-w-[90%] ml-auto text-slate-800 space-y-1.5 shadow-sm">
                      <div className="font-extrabold text-blue-600 flex items-center gap-1.5"><Brain className="w-4 h-4" /> AskMyPDF Copilot <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[9px] font-bold">99% Confidence</span></div>
                      <p className="text-slate-700 text-xs leading-relaxed">Emergency shutdown trigger guidelines (Turbine GTG-102): Depressing the manual console trip switch immediately actuates the primary fuel shut-off valve (ESDV-301), isolating high pressure fuel. Confirm auxiliary lubrication pumps kick in to protect turbine shaft bearings from seizure.</p>
                      <div className="pt-1.5 border-t border-blue-100/50 flex gap-2 text-[9px] text-slate-400">
                        <span>Source: GTG-102_Generator_Shutdown_Guides.pdf (Page 47)</span>
                      </div>
                    </div>
                  </div>
                  {/* Fake Input */}
                  <div className="border-t border-[#d6eaf8] pt-3 flex items-center gap-2">
                    <div className="flex-1 h-10 bg-slate-50 rounded-xl border border-[#d6eaf8] px-3 flex items-center text-xs text-slate-400">
                      Ask questions, summarize document text, query safety guidelines...
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20"><ArrowRight className="w-4 h-4" /></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#d6eaf8] relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 font-sans">SaaS Platform Capabilities</h2>
          <p className="text-slate-600 max-w-xl mx-auto font-normal">High-performance features designed for enterprise knowledge intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 bg-white border border-[#d6eaf8] rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col group shadow-sm"
            >
              <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4 group-hover:scale-110 group-hover:bg-blue-600/10 transition-all">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors font-sans">{feature.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 px-6 bg-[#f5fbff] border-t border-[#d6eaf8] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 font-sans">The Ingestion & Chat Workflow</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-normal">From raw document uploads to instant contextual references.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
            {workflowSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex flex-col text-left bg-white border border-[#d6eaf8] rounded-3xl p-6 hover:shadow-lg transition-all duration-300 group hover:border-blue-400"
              >
                <div className="absolute top-4 right-4 text-3xl font-black text-blue-600/5 font-mono group-hover:text-blue-600/10 transition-colors">
                  {step.number}
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-2 pr-6 font-sans">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                
                {idx < 4 && (
                  <div className="hidden lg:block absolute top-[50%] right-[-15px] translate-y-[-50%] z-20 text-slate-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#d6eaf8] relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 font-sans">Platform System Architecture</h2>
          <p className="text-slate-600 max-w-xl mx-auto font-normal">How our frontend coordinates file layout ingestion and vector scoring pipelines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {architectureNodes.map((node, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 bg-white border border-[#d6eaf8] rounded-3xl relative flex flex-col text-left hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600/20 transition-colors">
                  {node.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-sans">{node.title}</h3>
                  <span className="text-[9px] text-blue-600 font-mono font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full block w-fit mt-0.5">{node.tech}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{node.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-[#f5fbff] border-t border-[#d6eaf8] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 font-sans">Frequently Asked Questions</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-normal">Answers regarding data parsing, keys, and security parameters.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-[#d6eaf8] rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-800 hover:bg-slate-50 transition-colors font-sans text-sm md:text-base"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-[#d6eaf8] text-slate-600 text-xs md:text-sm bg-slate-50/50"
                    >
                      <p className="p-5 leading-relaxed font-normal">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-[#d6eaf8] bg-white/70 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-left text-sm text-slate-500 mb-12">
          {/* Logo Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="font-extrabold text-slate-900 text-lg font-sans">AskMyPDF AI</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Transform unstructured manuals and technical guides into cited, confidence-rated intelligence maps.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-4 font-sans">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-blue-600 transition-colors">About App</a></li>
              <li><a href="#features" className="hover:text-slate-700 transition-colors">Features Index</a></li>
              <li><a href="#workflow" className="hover:text-slate-700 transition-colors">Workflow Stages</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-4 font-sans">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Documentation</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">GitHub Repository</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Contact Support</span></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-4 font-sans">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-blue-600 transition-colors cursor-pointer">Compliance Audit</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-[#d6eaf8] pt-8 text-xs text-slate-500">
          <div className="font-normal">
            &copy; {new Date().getFullYear()} AskMyPDF AI. Developed for the ET AI Hackathon 2026.
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0 font-normal">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
