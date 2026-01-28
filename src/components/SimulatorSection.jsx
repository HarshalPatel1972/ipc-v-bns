
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Terminal, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  BookOpen
} from 'lucide-react';

/* --- 1. MOCK DATASETS (The 3 Teaching Moments) --- */
const SCENARIO_DB = {
  murder: {
    id: 'murder',
    title: 'Murder vs. Culpable Homicide',
    model: 'GPT-4o',
    model_icon: '🤖',
    query: "What is the punishment for Murder under the new BNS laws?",
    ground_truth: {
      source: "Official Gazette (Act 45 of 2023)",
      section: "Section 103(1)",
      text: "Punishment for Murder: Death or imprisonment for life, and liable to fine.",
      status: "verified"
    },
    ai_response: "Under the new Bharatiya Nyaya Sanhita, murder is punishable under Section 302. The punishment remains death or imprisonment for life.",
    judge_log: [
      { type: 'info', text: 'Initializing Independent Verification Protocol...' },
      { type: 'action', text: 'load_ground_truth(BNS_2023)' },
      { type: 'success', text: 'Ground Truth Loaded: Section 103(1)' },
      { type: 'action', text: 'scan_response_entities(response_text)' },
      { type: 'info', text: 'Found Citation: "Section 302"' },
      { type: 'warn', text: 'Reference Check: Section 302 != Section 103(1)' },
      { type: 'action', text: 'query_legacy_db(IPC_1860)' },
      { type: 'error', text: 'MATCH FOUND in Legacy Database: IPC Section 302' },
      { type: 'fatal', text: 'VERDICT: LEGACY ERROR DETECTED' }
    ],
    result: {
      status: 'fail',
      type: 'LEGACY ERROR',
      desc: 'Model cited repealed IPC law (Sec 302) instead of BNS.'
    }
  },
  suicide: {
    id: 'suicide',
    title: 'Attempted Suicide',
    model: 'Llama-3',
    model_icon: '🧠',
    query: "Is attempted suicide punishable under BNS?",
    ground_truth: {
      source: "Official Gazette (Act 45 of 2023)",
      section: "Section 226",
      text: "Attempt to commit suicide... with intent to restrain public servant... is punishable.",
      status: "verified"
    },
    ai_response: "The BNS Draft Bill 2023 proposes Section 224 for attempted suicide, focusing on community service rather than imprisonment.",
    judge_log: [
      { type: 'info', text: 'Initializing Independent Verification Protocol...' },
      { type: 'action', text: 'load_ground_truth(BNS_2023)' },
      { type: 'success', text: 'Ground Truth Loaded: Section 226' },
      { type: 'action', text: 'scan_response_entities(response_text)' },
      { type: 'info', text: 'Found Citation: "Section 224"' },
      { type: 'warn', text: 'Reference Check: Section 224 != Section 226' },
      { type: 'action', text: 'query_legislative_history()' },
      { type: 'error', text: 'MATCH FOUND: BNS Draft Bill (Pre-Enactment)' },
      { type: 'fatal', text: 'VERDICT: DRAFT ERROR DETECTED' }
    ],
    result: {
      status: 'fail',
      type: 'DRAFT ERROR',
      desc: 'Model cited a Draft Bill provision that changed in the final Act.'
    }
  },
  lynching: {
    id: 'lynching',
    title: 'Mob Lynching',
    model: 'Krutrim',
    model_icon: '🌐',
    query: "Does BNS have a specific section for Mob Lynching?",
    ground_truth: {
      source: "Official Gazette (Act 45 of 2023)",
      section: "Section 103(2)",
      text: "When a group of five or more persons acting in concert commits murder... ground of race, caste...",
      status: "verified"
    },
    ai_response: "Yes, the BNS introduces a specific provision for Mob Lynching under Section 103(2), punishable by death or life imprisonment.",
    judge_log: [
      { type: 'info', text: 'Initializing Independent Verification Protocol...' },
      { type: 'action', text: 'load_ground_truth(BNS_2023)' },
      { type: 'success', text: 'Ground Truth Loaded: Section 103(2)' },
      { type: 'action', text: 'scan_response_entities(response_text)' },
      { type: 'info', text: 'Found Citation: "Section 103(2)"' },
      { type: 'success', text: 'Reference Check: EXACT MATCH' },
      { type: 'success', text: 'Reasoning Check: Valid definitions found' },
      { type: 'success', text: 'VERDICT: ROBUST PASS' }
    ],
    result: {
      status: 'pass',
      type: 'VERIFIED',
      desc: 'Model correctly identified the new BNS provision.'
    }
  }
};

const STEPS = [
  { id: 1, label: "Ground Truth", icon: BookOpen },
  { id: 2, label: "AI Generation", icon: Terminal },
  { id: 3, label: "Judge Script", icon: Scale },
  { id: 4, label: "Verdict", icon: CheckCircle },
];


// Error Boundary for debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
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
          <pre className="bg-red-900/50 p-4 rounded overflow-auto text-xs">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const SimulatorSection = () => {
  const [activeScenarioId, setActiveScenarioId] = useState('murder');
  const [activeStep, setActiveStep] = useState(0); // 0=Idle, 1=GT, 2=Gen, 3=Judge, 4=Result
  const [aiOutput, setAiOutput] = useState("");
  const [visibleLogs, setVisibleLogs] = useState([]);
  
  const scenario = SCENARIO_DB[activeScenarioId];
  const judgeLogRef = useRef(null);

  // Safety Check: If scenario is missing, show error state instead of crashing
  if (!scenario) {
    return (
      <div className="py-24 bg-slate-950 text-center">
        <div className="text-red-500 font-mono mb-4">Error: Scenario Data Not Found</div>
        <button 
           onClick={() => setActiveScenarioId('murder')}
           className="bg-slate-800 text-slate-300 px-4 py-2 rounded"
        >
           Reset Simulator
        </button>
      </div>
    );
  }

  /* --- ANIMATION SEQUENCER --- */
  const intervalsRef = useRef([]);

  const cleanupIntervals = () => {
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  };

  useEffect(() => {
    return () => cleanupIntervals();
  }, []);

  const runSimulation = () => {
    cleanupIntervals(); // Stop any pending animations
    setActiveStep(1);
    setAiOutput("");
    setVisibleLogs([]);

    // Step 1: Ground Truth (1.5s)
    const step1Timeout = setTimeout(() => {
      setActiveStep(2);
      
      // Step 2: AI Generation (Typewriter)
      let i = 0;
      const typeInterval = setInterval(() => {
        if (!scenario || !scenario.ai_response) return; // Safety check
        setAiOutput(scenario.ai_response.substring(0, i + 1));
        i++;
        if (i >= scenario.ai_response.length) clearInterval(typeInterval);
      }, 30);
      intervalsRef.current.push(typeInterval);

    }, 1500);
    intervalsRef.current.push(step1Timeout);

    // Step 3: Judge Script (Start after AI finishes approx 2.5s)
    const step3Timeout = setTimeout(() => {
      setActiveStep(3);
      
      // Stream Logs
      let logIndex = 0;
      const logInterval = setInterval(() => {
        if (scenario && scenario.judge_log && logIndex < scenario.judge_log.length) {
          const newItem = scenario.judge_log[logIndex];
          if (newItem) {
             setVisibleLogs(prev => [...prev, newItem]);
          }
          
          if (judgeLogRef.current) {
            judgeLogRef.current.scrollTop = judgeLogRef.current.scrollHeight;
          }
          
          logIndex++;
        } else {
          clearInterval(logInterval);
          // Step 4: Final Verdict
          const step4Timeout = setTimeout(() => setActiveStep(4), 500);
          intervalsRef.current.push(step4Timeout);
        }
      }, 300); // Fast scroll
      intervalsRef.current.push(logInterval);

    }, 4500);
    intervalsRef.current.push(step3Timeout);
  };

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900" id="simulator">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            LIVE RESEARCH PROTOCOL
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-6 font-mono tracking-tight">
             The <span className="text-cyan-500">Scientific</span> Method
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             We don't just "chat" with AI. We subject every response to a rigorous, 4-stage adversarial verification process against the Official Gazette.
          </p>
        </div>

        {/* --- RESEARCH CONSOLE --- */}
        <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* Top Bar: Stepper & Controls */}
          <div className="bg-slate-950 border-b border-slate-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Scenario Selector */}
            <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
               {Object.values(SCENARIO_DB).map((s) => (
                 <button
                   key={s.id}
                   onClick={() => { setActiveScenarioId(s.id); setActiveStep(0); }}
                   disabled={activeStep > 0 && activeStep < 4}
                   className={`px-4 py-2 rounded text-xs font-bold font-mono transition-all ${activeScenarioId === s.id ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'} disabled:opacity-50`}
                 >
                   {s.title}
                 </button>
               ))}
            </div>

            {/* Step Progress Indicators */}
            <div className="flex items-center gap-2 md:gap-4">
               {STEPS.map((step, idx) => {
                 const isActive = activeStep === step.id;
                 const isCompleted = activeStep > step.id;
                 const StepIcon = step.icon; // Standardize component usage
                 return (
                   <div key={step.id} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isActive ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : isCompleted ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                        {isCompleted ? <CheckCircle size={14} /> : <StepIcon size={14} />}
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider hidden md:block ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>{step.label}</span>
                      {idx < STEPS.length - 1 && <div className="w-4 h-[1px] bg-slate-800 hidden md:block" />}
                   </div>
                 );
               })}
            </div>

            {/* Run Button */}
            <button
               onClick={runSimulation}
               disabled={activeStep > 0 && activeStep < 4}
               className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold rounded shadow-lg shadow-cyan-900/20 transition-all ${activeStep > 0 && activeStep < 4 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
               <Play size={16} fill="currentColor" />
               {activeStep === 4 ? "RE-RUN TEST" : "RUN BENCHMARK"}
            </button>
          </div>

          {/* Main Console Area (3-Panel Grid) */}
          <div className="grid md:grid-cols-12 h-[500px] divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-950">
            
            {/* PANEL 1: EVIDENCE (Left) */}
            <div className="md:col-span-3 p-6 flex flex-col relative overflow-hidden">
               <div className="text-xs font-mono text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <BookOpen size={14} /> Official Evidence
               </div>
               
               <AnimatePresence mode="wait">
                  {activeStep >= 1 ? (
                    <motion.div 
                      key="evidence-card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 bg-slate-900/50 border border-emerald-500/20 rounded-lg p-5 relative group"
                    >
                      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded-bl border-b border-l border-emerald-500/20 font-bold font-mono">
                        VERIFIED SOURCE
                      </div>
                      
                      {/* Document Icon */}
                      <div className="mb-4 text-slate-600 group-hover:text-emerald-500/50 transition-colors">
                        <Database size={32} />
                      </div>

                      <h4 className="text-slate-300 font-serif text-lg mb-1">{scenario.ground_truth.source}</h4>
                      <p className="text-emerald-400 font-mono text-sm mb-4">{scenario.ground_truth.section}</p>
                      
                      <div className="h-[1px] w-full bg-slate-800 mb-4" />
                      
                      <p className="text-slate-400 text-sm italic font-serif leading-relaxed">
                        "{scenario.ground_truth.text}"
                      </p>

                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
                        <CheckCircle size={14} /> HUMAN VERIFIED
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-700 text-sm font-mono border border-dashed border-slate-800 rounded-lg">
                       [ Waiting for Input ]
                    </div>
                  )}
               </AnimatePresence>
            </div>

            {/* PANEL 2: TERMINAL (Center) */}
            <div className="md:col-span-5 p-6 flex flex-col relative bg-slate-900/30">
               <div className="text-xs font-mono text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Terminal size={14} /> {scenario.model} Response
               </div>

               <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-5 font-mono text-sm text-slate-300 relative overflow-hidden shadow-inner">
                 
                 {/* Scanline Effect */}
                 {activeStep === 3 && (
                   <motion.div 
                     initial={{ top: 0 }}
                     animate={{ top: "100%" }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 right-0 h-[2px] bg-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)] z-10 block pointer-events-none"
                   />
                 )}

                 {activeStep >= 2 ? (
                   <div>
                     <span className="text-cyan-500 mr-2">❯</span>
                     {aiOutput}
                     <span className="animate-pulse inline-block w-2 H-4 bg-cyan-500 ml-1">▋</span>
                   </div>
                 ) : (
                   <span className="text-slate-700">./awaiting_model_generation...</span>
                 )}
               </div>
            </div>

            {/* PANEL 3: JUDGE BRAIN (Right) */}
            <div className="md:col-span-4 p-6 flex flex-col bg-black/40">
               <div className="text-xs font-mono text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Scale size={14} /> Evaluation Logic
               </div>

               <div 
                 ref={judgeLogRef}
                 className="flex-1 font-mono text-xs overflow-y-auto space-y-2 pr-2 scrollbar-hide"
               >
                 {visibleLogs.map((log, i) => {
                   if (!log) return null; // Defensive guard
                   return (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex gap-2 ${log.type === 'error' ? 'text-red-400 bg-red-950/20 p-1 rounded' : log.type === 'success' ? 'text-green-400' : log.type === 'warn' ? 'text-amber-400' : log.type === 'action' ? 'text-cyan-600' : log.type === 'fatal' ? 'text-red-500 font-bold border-l-2 border-red-500 pl-2' : 'text-slate-500'}`}
                   >
                     <span className="opacity-50 select-none">{(i+1).toString().padStart(2, '0')}</span>
                     <span>{log.text}</span>
                   </motion.div>
                 )})}
                 
                 {activeStep === 3 && (
                   <div className="flex gap-2 text-slate-700 animate-pulse">
                     <span>..</span>
                     <span>Thinking</span>
                   </div>
                 )}
               </div>
            </div>

          </div>

          {/* VERDICT OVERLAY (Step 4) */}
          <AnimatePresence>
            {activeStep === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <div className={`p-8 rounded-2xl border-2 shadow-2xl max-w-md w-full text-center ${scenario.result.status === 'pass' ? 'bg-green-950/90 border-green-500 text-green-100' : 'bg-red-950/90 border-red-500 text-red-100'}`}>
                  <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 ${scenario.result.status === 'pass' ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'}`}>
                    {scenario.result.status === 'pass' ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
                  </div>
                  
                  <h3 className="text-3xl font-bold font-mono mb-2 track-tight uppercase">{scenario.result.type}</h3>
                  <p className={`text-sm opacity-90 ${scenario.result.status === 'pass' ? 'text-green-200' : 'text-red-200'}`}>
                    {scenario.result.desc}
                  </p>
                  
                  <button 
                    onClick={() => setActiveStep(0)}
                    className="mt-8 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                  >
                    Dismiss Results
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
};

export default function SimulatorSectionWithBoundary() {
  return (
    <ErrorBoundary>
      <SimulatorSection />
    </ErrorBoundary>
  );
}
