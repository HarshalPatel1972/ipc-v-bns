
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Terminal, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  BookOpen,
  Cpu,
  Server,
  ArrowRight,
  Loader2,
  FileCode
} from 'lucide-react';

// Error Boundary for debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Simulator Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 bg-red-950 text-red-100 font-mono text-sm">
          <h2 className="text-xl font-bold mb-4">Simulator Crashed</h2>
          <p className="mb-2">{this.state.error && this.state.error.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

/* --- 1. CONFIGURATION: THE 8-MODEL GAUNTLET --- */
const MODEL_QUEUE = [
  // 1. GPT-4o: Fails specifically on "Murder" (Legacy Error) -> INTERRUPT
  { id: 'gpt4', name: 'GPT-4o', type: 'teaching', scenarioId: 'murder', color: 'text-green-400' },
  
  // 2. Claude 3: Fast Batch Pass
  { id: 'claude3', name: 'Claude 3 Opus', type: 'batch_only', color: 'text-amber-400' },
  
  // 3. Llama-3: Fails on "Suicide" (Draft Error) -> INTERRUPT
  { id: 'llama3', name: 'Llama-3', type: 'teaching', scenarioId: 'suicide', color: 'text-blue-400' },
  
  // 4. Mistral Large: Fast Batch Pass
  { id: 'mistral', name: 'Mistral Large', type: 'batch_only', color: 'text-purple-400' },
  
  // 5. Gemini 1.5: Fast Batch Pass
  { id: 'gemini', name: 'Gemini 1.5 Pro', type: 'batch_only', color: 'text-cyan-400' },
  
  // 6. Krutrim: Passes "Mob Lynching" (Robustness) -> INTERRUPT
  { id: 'krutrim', name: 'Olac Krutrim', type: 'teaching', scenarioId: 'lynching', color: 'text-indigo-400' },
  
  // 7. Sarvam AI: Fast Batch Pass
  { id: 'sarvam', name: 'Sarvam 2B', type: 'batch_only', color: 'text-orange-400' },
  
  // 8. Qwen 2.5: Fast Batch Pass
  { id: 'qwen', name: 'Qwen 2.5', type: 'batch_only', color: 'text-emerald-400' }
];

const SCENARIO_DB = {
  murder: {
    id: 'murder',
    title: 'Legacy Error Detected',
    query: "What is the punishment for Murder under the new BNS laws?",
    ground_truth: {
      source: "Official Gazette (Act 45 of 2023)",
      section: "Section 103(1)",
      text: "Punishment for Murder: Death or imprisonment for life, and liable to fine.",
      status: "verified"
    },
    ai_response: "Under the new Bharatiya Nyaya Sanhita, murder is punishable under Section 302. The punishment remains death or imprisonment for life.",
    judge_log: [
      { type: 'info', text: 'Initializing Verification Protocol...' },
      { type: 'action', text: 'load_ground_truth(BNS_2023)' },
      { type: 'success', text: 'Ground Truth Loaded: Section 103(1)' },
      { type: 'warn', text: 'Reference Check: Section 302 != Section 103(1)' },
      { type: 'error', text: 'MATCH FOUND in Legacy Database: IPC Section 302' },
      { type: 'fatal', text: 'VERDICT: LEGACY ERROR DETECTED' }
    ],
    result: { status: 'fail', type: 'LEGACY ERROR', desc: 'Model cited repealed IPC law (Sec 302).' }
  },
  suicide: {
    id: 'suicide',
    title: 'Draft Bill Error',
    query: "Is attempted suicide punishable under BNS?",
    ground_truth: {
      source: "Official Gazette (Act 45 of 2023)",
      section: "Section 226",
      text: "Attempt to commit suicide... with intent to restrain public servant... is punishable.",
      status: "verified"
    },
    ai_response: "The BNS Draft Bill 2023 proposes Section 224 for attempted suicide, focusing on community service rather than imprisonment.",
    judge_log: [
      { type: 'info', text: 'Initializing Verification Protocol...' },
      { type: 'action', text: 'load_ground_truth(BNS_2023)' },
      { type: 'success', text: 'Ground Truth Loaded: Section 226' },
      { type: 'warn', text: 'Reference Check: Section 224 != Section 226' },
      { type: 'error', text: 'MATCH FOUND: BNS Draft Bill (Pre-Enactment)' },
      { type: 'fatal', text: 'VERDICT: DRAFT ERROR DETECTED' }
    ],
    result: { status: 'fail', type: 'DRAFT ERROR', desc: 'Model cited a Draft Bill provision, not the final Act.' }
  },
  lynching: {
    id: 'lynching',
    title: 'Robust Pass Verification',
    query: "Does BNS have a specific section for Mob Lynching?",
    ground_truth: {
      source: "Official Gazette (Act 45 of 2023)",
      section: "Section 103(2)",
      text: "When a group of five or more persons acting in concert commits murder... ground of race, caste...",
      status: "verified"
    },
    ai_response: "Yes, the BNS introduces a specific provision for Mob Lynching under Section 103(2), punishable by death or life imprisonment.",
    judge_log: [
      { type: 'info', text: 'Initializing Verification Protocol...' },
      { type: 'action', text: 'load_ground_truth(BNS_2023)' },
      { type: 'success', text: 'Ground Truth Loaded: Section 103(2)' },
      { type: 'success', text: 'Reference Check: EXACT MATCH' },
      { type: 'success', text: 'VERDICT: ROBUST PASS' }
    ],
    result: { status: 'pass', type: 'VERIFIED', desc: 'Model correctly identified the new BNS provision.' }
  }
};

/* --- 2. SUB-COMPONENT: BATCH CONSOLE --- */
const BatchConsole = ({ currentModel, progress, logs }) => {
  const terminalRef = useRef(null);
  
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="h-[500px] flex flex-col p-6 bg-slate-950 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
         <div className="flex items-center gap-3">
            <Server className={`animate-pulse ${currentModel.color}`} size={24} />
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest">Processing Node</div>
              <div className={`text-xl font-bold ${currentModel.color}`}>{currentModel.name}</div>
            </div>
         </div>
         <div className="text-right">
            <div className="text-xs text-slate-500 uppercase tracking-widest">Batch Status</div>
            <div className="text-white font-bold">{progress.toFixed(0)}% Complete</div>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-900 rounded-full mb-8 overflow-hidden">
        <motion.div 
           className={`h-full ${currentModel.color.replace('text', 'bg')}`}
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ ease: "linear" }}
        />
      </div>

      {/* Logs */}
      <div className="flex-1 bg-black/50 rounded-lg border border-slate-800 p-4 overflow-hidden relative">
        <div className="absolute top-2 right-2 text-[10px] text-slate-600 uppercase">/var/log/syslog</div>
        <div ref={terminalRef} className="h-full overflow-y-auto space-y-1 text-xs font-mono opacity-80">
           {logs.map((log, i) => (
             <div key={i} className="flex gap-2">
                <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.includes('FAIL') ? 'text-red-400' : 'text-slate-300'}>{log}</span>
             </div>
           ))}
           <div className="animate-pulse text-cyan-500">_</div>
        </div>
      </div>
    </div>
  );
};

/* --- 3. SUB-COMPONENT: TEACHING VIEW (3-Panel) --- */
const TeachingView = ({ model, scenario, onResume }) => {
   const [step, setStep] = useState(0); 
   const [visibleLogs, setVisibleLogs] = useState([]);
   const [aiText, setAiText] = useState("");
   const judgeRef = useRef(null);
   const timersRef = useRef([]);

   // Helper to track timers for cleanup
   const addTimer = (id, type = 'timeout') => {
     timersRef.current.push({ id, type });
   };

   useEffect(() => {
     // Safe cleanup function
     return () => {
       timersRef.current.forEach(t => {
         if (t.type === 'timeout') clearTimeout(t.id);
         else clearInterval(t.id);
       });
       timersRef.current = [];
     };
   }, []);

   useEffect(() => {
     // Sequence: GT -> AI -> Judge -> Result
     
     // 1. Show GT
     const t1 = setTimeout(() => setStep(1), 500);
     addTimer(t1);
     
     // 2. Start AI Typing
     const t2 = setTimeout(() => {
       setStep(2); 
       let i = 0;
       const interval = setInterval(() => {
         // Defensive check
         if (!scenario || !scenario.ai_response) return;
         setAiText(scenario.ai_response.substring(0, i + 1));
         i++;
         if (i >= scenario.ai_response.length) clearInterval(interval);
       }, 20);
       addTimer(interval, 'interval');
     }, 1500);
     addTimer(t2);

     // 3. Start Judge Log
     const t3 = setTimeout(() => {
       setStep(3); 
       let j = 0;
       const interval = setInterval(() => {
         if (scenario && scenario.judge_log && j < scenario.judge_log.length) {
            setVisibleLogs(prev => [...prev, scenario.judge_log[j]]);
            if (judgeRef.current) judgeRef.current.scrollTop = judgeRef.current.scrollHeight;
            j++;
         } else {
            clearInterval(interval);
            const t4 = setTimeout(() => setStep(4), 500); // Show Result
            addTimer(t4);
         }
       }, 400);
       addTimer(interval, 'interval');
     }, 3500);
     addTimer(t3);

   }, [scenario]); // Added scenario dependency

   // Guard for render
   if (!scenario) return null;

   return (
     <div className="h-[500px] grid md:grid-cols-12 divide-x divide-slate-800 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden relative">
        {/* Overlay for Resume (Step 4) */}
        {step === 4 && (
           <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center animate-in fade-in">
              <div className={`p-6 rounded-xl border-2 ${scenario.result.status === 'pass' ? 'border-green-500 bg-green-950/50' : 'border-red-500 bg-red-950/50'} text-center max-w-md`}>
                 <div className="text-6xl mb-4">{scenario.result.status === 'pass' ? <CheckCircle className="text-green-500 mx-auto" /> : <AlertTriangle className="text-red-500 mx-auto" />}</div>
                 <h2 className="text-2xl font-bold text-white mb-2">{scenario.result.type}</h2>
                 <p className="text-slate-300 mb-6">{scenario.result.desc}</p>
                 <button onClick={onResume} className="bg-white text-black px-6 py-2 rounded font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                    RESUME BATCH <ArrowRight size={16} />
                 </button>
              </div>
           </div>
        )}

        {/* Panel 1: Evidence */}
        <div className="hidden md:flex md:col-span-3 p-6 flex-col bg-slate-950/50">
           <div className="flex items-center gap-2 text-xs text-slate-500 uppercase mb-4 font-bold tracking-wider"><BookOpen size={14}/> Ground Truth</div>
           {step >= 1 && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex-1">
                <div className="text-xs bg-emerald-900/30 text-emerald-400 inline-block px-2 py-1 rounded mb-3 border border-emerald-500/20">OFFICIAL GAZETTE</div>
                <h4 className="font-serif text-slate-200 text-lg mb-2">{scenario.ground_truth.source}</h4>
                <p className="font-mono text-emerald-400 text-sm mb-4">{scenario.ground_truth.section}</p>
                <div className="h-px bg-slate-800 mb-4" />
                <p className="italic text-slate-400 text-sm">"{scenario.ground_truth.text}"</p>
             </motion.div>
           )}
        </div>

        {/* Panel 2: Terminal */}
        <div className="col-span-12 md:col-span-5 p-6 flex flex-col">
           <div className="flex items-center gap-2 text-xs text-slate-500 uppercase mb-4 font-bold tracking-wider"><Terminal size={14}/> {model.name} Output</div>
           {step >= 2 && (
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-slate-300 flex-1 border border-slate-800 shadow-inner">
                 <span className={`${model.color} mr-2`}>❯</span>{aiText}<span className="animate-pulse bg-cyan-500 w-2 h-4 inline-block ml-1"/>
              </div>
           )}
        </div>

        {/* Panel 3: Judge */}
        <div className="hidden md:flex md:col-span-4 p-6 flex-col bg-slate-950/30">
           <div className="flex items-center gap-2 text-xs text-slate-500 uppercase mb-4 font-bold tracking-wider"><Scale size={14}/> Auto-Judge Logic</div>
           <div ref={judgeRef} className="flex-1 overflow-y-auto space-y-2 text-xs font-mono">
              {visibleLogs.map((l, i) => {
                 if (!l || !l.type) return null; // Defensive guard
                 return (
                 <div key={i} className={`p-2 rounded ${l.type === 'error' ? 'bg-red-950/30 text-red-400 border border-red-900' : l.type === 'success' ? 'text-green-400' : 'text-slate-400'}`}>
                    <span className="opacity-50 mr-2">{(i+1).toString().padStart(2,'0')}</span>{l.text}
                 </div>
              )})}
           </div>
        </div>
     </div>
   );
};


const BATCH_QS = [
  { q: "Punishment for Snatching?", src: "BNS Sec 304" },
  { q: "Def. of Organized Crime?", src: "BNS Sec 111" },
  { q: "Community Service rules?", src: "BNS Sec 4(f)" },
  { q: "Electronic Records?", src: "BSA Sec 61" },
  { q: "Mob Lynching penalty?", src: "BNS Sec 103(2)" },
  { q: "Sedition repealed?", src: "BNS (Absent)" },
  { q: "Hit & Run fine?", src: "BNS Sec 106(2)" },
  { q: "Fake News detection?", src: "IT Act + BNS" },
  { q: "Marriage by deceit?", src: "BNS Sec 69" }
];

/* --- 4. MAIN CONTROLLER --- */
const SimulatorSection = () => {
  const [status, setStatus] = useState('IDLE'); // IDLE, RUNNING, INTERRUPT, COMPLETED
  const [modelIndex, setModelIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  
  const currentModel = MODEL_QUEUE[modelIndex];
  const timerRef = useRef(null);

  // Auto-scroll helper
  const scrollToAnalytics = () => {
    const el = document.getElementById('analytics');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Main Loop
  useEffect(() => {
    if (status !== 'RUNNING') return;
    
    // Safety check for model
    if (!currentModel) return;

    // Reset for new model
    if (progress === 0 && logs.length === 0) {
      setLogs([`INITIALIZING ${currentModel.name.toUpperCase()}...`, 'LOADING BNS_V2_DATASET...']);
    }

    const interval = setInterval(() => {
      setProgress(p => {
        // If we hit 50% and it's a teaching model, trigger INTERRUPT
        if (p >= 50 && currentModel.type === 'teaching' && status === 'RUNNING') {
          clearInterval(interval);
          setStatus('INTERRUPT');
          return 50;
        }
        
        // If we Complete (100%)
        if (p >= 100) {
           clearInterval(interval);
           
           // Move to next model
           if (modelIndex < MODEL_QUEUE.length - 1) {
              setLogs([]); 
              setProgress(0);
              setModelIndex(prev => prev + 1);
           } else {
              setStatus('COMPLETED');
              setTimeout(scrollToAnalytics, 2000);
           }
           return 100;
        }

        // Add detailed log (No Blackbox)
        if (Math.random() > 0.6) {
           const randQ = BATCH_QS[Math.floor(Math.random() * BATCH_QS.length)];
           const batchId = Math.floor(Math.random() * 800) + 100;
           
           // Format: Q: [Question] | Source: [Section] | Verdict: [PASS]
           const logMsg = `Q: "${randQ.q}" | Src: ${randQ.src} | VERIFIED`;
           
           setLogs(prev => [...prev, logMsg].slice(-8));
        }

        return p + (currentModel.type === 'batch_only' ? 2 : 1); // Fast vs Normal speed
      });
    }, 50);

    return () => clearInterval(interval);
  }, [status, modelIndex, progress, currentModel]); // Dependency on currentModel

  // Handler for Start
  const startBenchmark = () => {
    setStatus('RUNNING');
    setModelIndex(0);
    setProgress(0);
    setLogs([]);
  };

  // Handler for Resume after Interrupt
  const handleResume = () => {
    setStatus('RUNNING');
    setProgress(51); // Push past the interrupt point
  };
  
  // Guard Clauses for Render
  if (!currentModel && status !== 'COMPLETED' && status !== 'IDLE') return null;

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900 min-h-[800px] flex flex-col justify-center" id="simulator">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 ${status === 'RUNNING' ? '' : 'hidden'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'RUNNING' ? 'bg-cyan-500' : 'bg-slate-500'}`}></span>
            </span>
            HIGH-THROUGHPUT BENCHMARK CONSOLE
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 font-mono tracking-tight">
             Evaluating <span className="text-cyan-500">8 Foundation Models</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
             Processing 1,024 legal queries across 8 architectures. Interrupting only for critical anomaly detection.
          </p>

          {status === 'IDLE' && (
             <button onClick={startBenchmark} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-cyan-600 px-8 font-medium text-white transition-all duration-300 hover:bg-cyan-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                <span className="mr-2"><Play size={18} fill="currentColor"/></span> START BATCH PROCESS
             </button>
          )}

          {status === 'COMPLETED' && (
             <div className="text-emerald-400 font-bold text-xl animate-pulse flex items-center justify-center gap-2">
                <CheckCircle /> ALL MODELS EVALUATED. GENERATING REPORT...
             </div>
          )}
        </div>

        {/* Main Console View */}
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 relative min-h-[500px]">
           
           {/* Queue indicator */}
           <div className="bg-slate-950 border-b border-slate-800 p-4 flex gap-2 overflow-x-auto no-scrollbar">
              {MODEL_QUEUE.map((m, i) => (
                 <div key={m.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all whitespace-nowrap ${i === modelIndex ? `${m.color} border-current bg-white/5` : i < modelIndex ? 'text-slate-600 border-slate-800 bg-slate-900' : 'text-slate-700 border-transparent'}`}>
                    {i < modelIndex ? <CheckCircle size={12} /> : i === modelIndex ? <Loader2 size={12} className="animate-spin" /> : <div className="w-3 h-3 rounded-full bg-slate-800" />}
                    {m.name}
                 </div>
              ))}
           </div>

           {/* Viewport Switcher */}
           <AnimatePresence mode="wait">
              
              {status === 'IDLE' && (
                 <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[500px] flex flex-col items-center justify-center text-slate-600">
                    <Database size={64} className="mb-4 opacity-20" />
                    <p className="font-mono text-sm">READY TO INGEST DATASET</p>
                 </motion.div>
              )}

              {(status === 'RUNNING' || status === 'COMPLETED') && currentModel && (
                 <motion.div key="batch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <BatchConsole currentModel={currentModel} progress={progress} logs={logs} />
                 </motion.div>
              )}

              {status === 'INTERRUPT' && (
                 <motion.div key="teaching" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative">
                    <div className="absolute top-0 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-xs font-bold px-4 py-2 flex items-center justify-between z-10">
                       <span className="flex items-center gap-2"><AlertTriangle size={14} /> ANOMALY DETECTED: PAUSING BATCH FOR INSPECTION</span>
                       <span className="font-mono opacity-70">Case ID: {currentModel.scenarioId.toUpperCase()}</span>
                    </div>
                    <div className="pt-8">
                       <TeachingView 
                          model={currentModel} 
                          scenario={SCENARIO_DB[currentModel.scenarioId]} 
                          onResume={handleResume} 
                       />
                    </div>
                 </motion.div>
              )}

           </AnimatePresence>

        </div>

      </div>
    </section>
  );
};

export default function SimulatorSectionBoundary() {
  return (
    <ErrorBoundary>
      <SimulatorSection />
    </ErrorBoundary>
  );
}
