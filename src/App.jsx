import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Skull, Search, Play, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

const DEMO_DATA = [
  { query: "Punishment for Murder?", model: "GPT-4", output: "Section 302 (IPC)", status: "Hallucination" },
  { query: "Definition of Sedition", model: "Claude 3", output: "Section 124A (IPC)", status: "Hallucination" },
  { query: "Electronic Evidence Admissibility", model: "Llama 3", output: "Section 65B (IEA)", status: "Hallucination" }
];

import SimulatorSection from './components/SimulatorSection';
import AnalyticsSection from './components/AnalyticsSection';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Navbar (Minimal) */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold tracking-wider">
            <span className="text-xl">INDOLEGAL-100</span>
            <div className="h-2 w-2 bg-cyan-400 animate-pulse rounded-full" />
          </div>
          <button className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors">
            [ACCESS_DATASET]
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
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
            onClick={() => document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' })} // added scroll
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
      
      {/* Simulator Section */}
      <SimulatorSection />
      
      {/* Analytics Section */}
      <AnalyticsSection />

      {/* Problem Section */}
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
            {/* Card 1 */}
            <div className="group p-6 bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors rounded-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Anchor size={80} />
               </div>
               <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                 <Anchor size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-200 mb-3">Parametric Inertia</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Models cling to old IPC data embedded deep in their weights, refusing to update to the new BNS framework.
               </p>
            </div>

            {/* Card 2 */}
            <div className="group p-6 bg-slate-950 border border-slate-800 hover:border-red-500/50 transition-colors rounded-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Skull size={80} />
               </div>
               <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                 <Skull size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-200 mb-3">The Zombie Error</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Citing dead laws as active provisions. The model hallucinates that repealed acts are still enforceable.
               </p>
            </div>

            {/* Card 3 */}
            <div className="group p-6 bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-colors rounded-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Search size={80} />
               </div>
               <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                 <Search size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-200 mb-3">RAG Confusion</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Retrieval Augmented Generation fails to filter legacy noise from the open web, polluting the context window.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Data Section */}
      <section className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6">
           <div className="mb-8 font-mono text-sm text-cyan-500 animate-pulse">
             $ ACCESSING_LOGS...
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left font-mono text-sm">
               <thead>
                 <tr className="border-b border-slate-800 text-slate-500">
                   <th className="py-4 px-4">QUERY</th>
                   <th className="py-4 px-4">MODEL</th>
                   <th className="py-4 px-4">OUTPUT</th>
                   <th className="py-4 px-4">STATUS</th>
                 </tr>
               </thead>
               <tbody>
                 {DEMO_DATA.map((item, index) => (
                   <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                     <td className="py-4 px-4 text-slate-300">{item.query}</td>
                     <td className="py-4 px-4 text-slate-400">{item.model}</td>
                     <td className="py-4 px-4 text-red-300">{item.output}</td>
                     <td className="py-4 px-4">
                       <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs border border-red-500/20">
                         {item.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-600 text-sm font-mono border-t border-slate-800">
        IndoLegal-100_Research_Module // v1.0.0
      </footer>
    </div>
  );
}

export default App;
