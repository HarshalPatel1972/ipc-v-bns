import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, Skull, Search, Play, ChevronRight } from 'lucide-react';

/* Components */
import Navbar from './components/Navbar';
import SimulatorSection from './components/SimulatorSection';
import AnalyticsSection from './components/AnalyticsSection';
import MethodologySection from './components/MethodologySection';
import FooterSection from './components/FooterSection';

/* Problem Card Component */
const ProblemCard = ({ icon: Icon, color, title, desc, example }) => {
  const [showExample, setShowExample] = useState(false);
  
  return (
    <div 
      className={`group p-6 bg-slate-950 border border-slate-800 hover:border-${color}-500/50 transition-all duration-300 rounded-lg relative overflow-hidden h-full cursor-pointer`}
      onClick={() => setShowExample(!showExample)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      
      <div className={`w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-${color}-500 mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon size={24} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-200 mb-3">{title}</h3>
      
      <div className="relative">
        <AnimatePresence mode="wait">
          {!showExample ? (
            <motion.p 
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-slate-400 text-sm leading-relaxed min-h-[60px]"
            >
              {desc}
            </motion.p>
          ) : (
            <motion.div 
               key="example"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className={`bg-${color}-900/10 border border-${color}-500/30 p-3 rounded text-xs font-mono text-${color}-400 mb-2 min-h-[60px]`}
               onClick={(e) => e.stopPropagation()} 
            >
              <strong className="block uppercase text-[10px] mb-1 opacity-70">Example Scenario:</strong>
              {example}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`mt-4 text-${color}-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity`}>
        {showExample ? (
            <>Hide Example <ChevronRight size={14} className="rotate-180 transition-transform" /></> 
        ) : (
            <>View Example <ChevronRight size={14} /></>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* 1. Sticky Navigation */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden" id="home">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          
          {/* Typing Headline */}
          <div className="mb-6 inline-block max-w-full overflow-hidden">
            <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 whitespace-nowrap border-r-4 border-cyan-500 animate-typing overflow-hidden">
              Can AI Unlearn 160 Years of Law?
            </h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto"
          >
            Benchmarking LLM Hallucinations in the <span className="text-cyan-400">IPC</span> to <span className="text-emerald-400">BNS</span> Transition.
          </motion.p>

          {/* Visual Hook: Split Screen Animation */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 items-center">
            {/* Left: IPC (Fading) */}
            <motion.div 
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.3, 1], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              className="p-8 border border-slate-700 rounded-lg bg-slate-900/50"
            >
              <h3 className="text-3xl font-serif text-slate-500 mb-2">IPC 1860</h3>
              <p className="text-slate-600 font-mono text-sm">Legacy Code • Deprecated</p>
              <div className="mt-4 h-1 w-full bg-slate-800 rounded overflow-hidden">
                 <div className="h-full w-full bg-slate-600 origin-left scale-x-50" />
              </div>
            </motion.div>

            {/* Right: BNS (Glowing) */}
            <motion.div 
              animate={{ boxShadow: ["0 0 0px rgba(52, 211, 153, 0)", "0 0 20px rgba(52, 211, 153, 0.3)", "0 0 0px rgba(52, 211, 153, 0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-8 border border-emerald-500/50 rounded-lg bg-emerald-950/20 relative"
            >
              <div className="absolute top-0 right-0 p-2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <h3 className="text-3xl font-sans font-bold text-emerald-400 mb-2">BNS 2023</h3>
              <p className="text-emerald-300/70 font-mono text-sm">Active Provision • Enforced</p>
               <div className="mt-4 h-1 w-full bg-emerald-900/50 rounded overflow-hidden">
                 <div className="h-full w-full bg-emerald-500 animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg rounded-sm overflow-hidden transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]"
          >
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              RUN THE SIMULATION
            </span>
          </motion.button>
        </div>
      </section>

      {/* 3. Problem Section (Context) */}
      <section className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-end mb-12 border-b border-slate-700 pb-4">
             <h2 className="text-3xl font-bold text-slate-100">
               <span className="text-amber-500 mr-2">///</span> 
               SYSTEM_FAILURES
             </h2>
             <span className="text-slate-500 font-mono mb-1">Detected in LLM Legal Reasoning</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProblemCard 
              icon={Anchor}
              color="cyan"
              title="Parametric Inertia"
              desc="Models cling to old IPC data embedded deep in their weights, refusing to update to the new BNS framework."
              example="GPT-4 insists 'Murder is Section 302' despite being explicitly prompted about 2023 laws, because '302' is statistically dominant in its training set."
            />
            <ProblemCard 
              icon={Skull}
              color="red"
              title="The Zombie Error"
              desc="Citing dead laws as active provisions. The model hallucinates that repealed acts are still enforceable."
              example="Claude 3 cites 'Sedition (124A)' as a valid charge, unaware that BNS has completely repealed and replaced it with 'Treason'."
            />
            <ProblemCard 
              icon={Search}
              color="purple"
              title="RAG Confusion"
              desc="Retrieval Augmented Generation fails to filter legacy noise from the open web, polluting the context window."
              example="When searching 'Theft punishment India', the model retrieves top 10 results from 2019 (IPC) and ignores the single recent BNS result."
            />
          </div>
        </div>
      </section>

      {/* 4. Simulator Section (Live Demo) */}
      <SimulatorSection />

      {/* 5. Methodology Section (The Bridge) */}
      <MethodologySection />
      
      {/* 6. Analytics Section (Scientific Data) */}
      <AnalyticsSection />

      {/* 7. Footer & Team */}
      <FooterSection />

    </div>
  );
}

export default App;
