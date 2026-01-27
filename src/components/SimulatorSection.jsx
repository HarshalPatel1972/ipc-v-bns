import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, ShieldCheck, Skull, Search, AlertTriangle, ChevronDown, Cpu, Gavel } from 'lucide-react';

const SCENARIO_DB = {
  murder: {
    id: "murder",
    title: "Punishment for Murder",
    query: "What is the punishment for Murder in BNS?",
    ground_truth: "Section 103(1) of Bharatiya Nyaya Sanhita (BNS)",
    responses: {
      gpt4: { 
        text: "Under the new Bharatiya Nyaya Sanhita (BNS) 2023, Murder is defined and punishable under Section 103(1). The punishment remains death or imprisonment for life, and shall also be liable to fine. Section 302 of the IPC has been replaced.", 
        verdict: "PASS", 
        score: 3,
        search_triggered: true
      },
      llama3: { 
        text: "According to the Indian Penal Code (IPC), Murder is defined under Section 300 and punishable under Section 302 with death or life imprisonment. This is the primary law governing homicide in India.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false
      },
      krutrim: { 
        text: "The punishment for murder is prescribed under Section 302 of the IPC. It is a non-bailable offense. The new laws are under discussion but currently IPC 302 is the active provision.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false
      }
    }
  },
  sedition: {
    id: "sedition",
    title: "Sedition Law Status",
    query: "Is Sedition (Section 124A) still applicable?",
    ground_truth: "Repealed. Replaced by Section 152 (Treason) in BNS.",
    responses: {
      gpt4: { 
        text: "Sedition (Section 124A IPC) has been completely repealed in the BNS 2023. It has been replaced by Section 152, which deals with 'Acts endangering sovereignty, unity and integrity of India'. The term 'Sedition' is no longer used.", 
        verdict: "PASS", 
        score: 3,
        search_triggered: true
      },
      llama3: { 
        text: "Yes, Section 124A of the IPC criminalizes Sedition. The Supreme Court has put it in abeyance, but it remains part of the statute book until officially removed by Parliament.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false
      },
       krutrim: { 
        text: "Section 124A regarding Sedition is active. Punishment involves imprisonment for life or up to three years.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
         search_triggered: false
      }
    }
  },
  lynching: {
    id: "lynching",
    title: "Mob Lynching Provision",
    query: "Specific section for Mob Lynching in BNS?",
    ground_truth: "Section 103(2) of BNS.",
    responses: {
      gpt4: { 
        text: "The BNS 2023 introduces a specific provision for Mob Lynching under Section 103(2). It prescribes death or imprisonment for life for murder committed by a group of five or more persons on grounds of race, caste, or community.", 
        verdict: "PASS", 
        score: 3,
        search_triggered: true
      },
      llama3: { 
        text: "Mob Lynching is not specifically defined as a separate offense in the IPC, but is prosecuted under Section 302 (Murder) and Section 149 (Unlawful Assembly).", 
        verdict: "FAIL (INCOMPLETE)", 
        score: 1,
        search_triggered: false
      },
       krutrim: { 
        text: "Mob lynching is treated as murder under Section 302 IPC read with Section 34.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false
      }
    }
  }
};

const MODELS = [
  { id: 'gpt4', name: 'GPT-4o (OpenAI)', icon: 'openai' },
  { id: 'llama3', name: 'Llama-3 (Meta)', icon: 'meta' },
  { id: 'krutrim', name: 'Krutrim (Indian AI)', icon: 'ola' }
];

const SCENARIOS = Object.values(SCENARIO_DB);

const SimulatorSection = () => {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [showSearchBadge, setShowSearchBadge] = useState(false);
  const [simState, setSimState] = useState('idle'); // idle, scanning, thinking, typing, complete
  const [result, setResult] = useState(null);

  const terminalRef = useRef(null);

  const handleRunSimulation = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setSimState('scanning');
    setProgress(0);
    setTerminalOutput("");
    setShowSearchBadge(false);
    setResult(null);

    // Simulation Sequence
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        startResponseGeneration();
      }
    }, 30);
  };

  const startResponseGeneration = () => {
    setSimState('thinking');
    const scenario = SCENARIO_DB[selectedScenario];
    const responseData = scenario.responses[selectedModel];
    
    // Simulate latency/search
    setTimeout(() => {
      if (responseData.search_triggered) {
        setShowSearchBadge(true);
      }
      
      setTimeout(() => {
        setSimState('typing');
        typewriterEffect(responseData);
      }, 1000);
    }, 1500);
  };

  const typewriterEffect = (data) => {
    let i = 0;
    const text = data.text;
    const speed = 20; // ms per char

    const typeInterval = setInterval(() => {
      setTerminalOutput(text.substring(0, i + 1));
      i++;

      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }

      if (i === text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setSimState('complete');
          setResult(data);
          setIsRunning(false);
        }, 500);
      }
    }, speed);
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden" id="simulator">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 font-mono">
            <span className="text-cyan-500">&gt; </span>
            INTERACTIVE_BENCHMARK_SIMULATOR
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Execute live legal scenarios against state-of-the-art LLMs to detect hallucinations and legacy bias.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT PANEL: CONTROL DECK */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-lg shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                   <Cpu className="text-cyan-400" size={20} />
                   <h3 className="font-bold text-slate-200 uppercase tracking-wider text-sm">Control Deck</h3>
                </div>

                {/* Dropdown 1: Model */}
                <div className="mb-6">
                  <label className="block text-slate-500 text-xs font-mono mb-2 uppercase">Target Model Layer</label>
                  <div className="relative">
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded px-4 py-3 appearance-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    >
                      {MODELS.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Dropdown 2: Scenario */}
                <div className="mb-8">
                  <label className="block text-slate-500 text-xs font-mono mb-2 uppercase">Test Vector (Scenario)</label>
                  <div className="relative">
                    <select 
                      value={selectedScenario}
                      onChange={(e) => setSelectedScenario(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded px-4 py-3 appearance-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    >
                      {SCENARIOS.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* Big Execute Button */}
              <motion.button
                whileHover={!isRunning ? { scale: 1.02, boxShadow: "0 0 30px rgba(6,182,212,0.4)" } : {}}
                whileTap={!isRunning ? { scale: 0.98 } : {}}
                onClick={handleRunSimulation}
                disabled={isRunning}
                className={`w-full relative group overflow-hidden rounded-md py-4 px-6 font-bold tracking-widest uppercase transition-all ${
                  isRunning 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50'
                }`}
              >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   {isRunning ? (
                     <>
                       <Cpu className="animate-spin" size={18} /> PROCESSING...
                     </>
                   ) : (
                     <>
                       <Play className="fill-current" size={18} /> EXECUTE BENCHMARK
                     </>
                   )}
                 </span>
                 {!isRunning && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                 )}
              </motion.button>
              
              <div className="mt-4 text-center">
                 <p className="text-slate-500 text-[10px] font-mono">
                   Secure Connection: TLS 1.3 // Latency: 45ms
                 </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: LIVE TERMINAL */}
          <div className="lg:col-span-8">
            <div className="rounded-lg overflow-hidden border border-slate-700 bg-black shadow-2xl flex flex-col h-full min-h-[500px] relative">
              
              {/* Terminal Header */}
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <Terminal size={12} />
                    indolegal_cli_v1.0.exe
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-600">
                   {MODELS.find(m => m.id === selectedModel)?.name} @ {SCENARIO_DB[selectedScenario].id}_env
                </div>
              </div>

              {/* Terminal Body */}
              <div ref={terminalRef} className="p-6 font-mono text-sm leading-relaxed text-slate-300 flex-1 overflow-y-auto font-ligatures-none relative">
                
                {/* Initial Instruction */}
                <div className="mb-4">
                  <span className="text-green-500">user@indolegal:~$</span> ./run_benchmark --model="{selectedModel}" --query="{SCENARIO_DB[selectedScenario].query}"
                </div>

                {/* Progress Bar */}
                {simState === 'scanning' && (
                   <div className="mb-4">
                     <div className="text-cyan-400 mb-1 flex items-center gap-2">
                        <span>Scanning Knowledge Base...</span>
                        <span className="animate-pulse">_</span>
                     </div>
                     <div className="h-2 w-64 bg-slate-800 rounded overflow-hidden">
                       <motion.div 
                         className="h-full bg-cyan-500"
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         transition={{ ease: "linear", duration: 0.1 }}
                       />
                     </div>
                     <div className="text-slate-500 text-xs mt-1">{progress}% Complete</div>
                   </div>
                )}

                {/* Thinking / Searching State */}
                {(simState === 'thinking' || simState === 'typing' || simState === 'complete') && (
                  <div className="mb-6 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                       <span className="text-slate-500 uppercase text-xs tracking-wider">Status:</span>
                       {showSearchBadge ? (
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <Search size={10} /> WEB SEARCH TRIGGERED
                          </span>
                       ) : (
                          <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <Cpu size={10} /> ZERO-SHOT GENERATION
                          </span>
                       )}
                    </div>
                  </div>
                )}

                {/* Output Text */}
                {(Math.max(terminalOutput.length, 0) > 0) && (
                  <div className="border-l-2 border-slate-700 pl-4 py-2 mb-8">
                    <span className="text-slate-100">{terminalOutput}</span>
                    {simState === 'typing' && <span className="animate-pulse bg-slate-100 text-black ml-1"> </span>}
                  </div>
                )}

                {/* Result Stamp (The Climax) */}
                <AnimatePresence>
                  {simState === 'complete' && result && (
                    <motion.div 
                      initial={{ scale: 2, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="absolute bottom-10 right-10 z-10 p-4 transform"
                    >
                      <motion.div 
                         animate={{ rotate: [0, -2, 2, -1, 0] }}
                         transition={{ delay: 0.2, duration: 0.3 }}
                         className={`border-4 rounded-lg p-4 font-black uppercase text-2xl tracking-widest backdrop-blur-sm shadow-2xl flex flex-col items-center gap-2 ${
                           result.verdict.includes("PASS") 
                             ? "border-green-500 text-green-500 bg-green-950/20" 
                             : "border-red-500 text-red-500 bg-red-950/20"
                         }`}
                      >
                         {result.verdict.includes("PASS") ? (
                           <ShieldCheck size={48} strokeWidth={2.5} />
                         ) : (
                           <Skull size={48} strokeWidth={2.5} />
                         )}
                         <span>{result.verdict}</span>
                         <span className="text-xs font-mono font-normal tracking-normal opacity-70">
                           Confidence Score: {result.score}/3
                         </span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
              
              {/* Scanline Effect Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20 opacity-20" />
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulatorSection;
