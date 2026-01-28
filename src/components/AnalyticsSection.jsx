import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Activity, AlertTriangle, Database, CheckCircle, Smartphone } from 'lucide-react';

const AnalyticsSection = () => {
  /* Live Log Logic */
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  useEffect(() => {
    const logTypes = [
      { msg: "Analysing Q{id}... ERROR DETECTED (Type: IPC_Legacy)", type: "fail" },
      { msg: "Analysing Q{id}... VERIFIED (Type: BNS_Compliant)", type: "pass" },
      { msg: "Analysing Q{id}... ERROR DETECTED (Type: Hallucination)", type: "fail" },
      { msg: "Analysing Q{id}... VERIFIED (Type: BNS_Compliant)", type: "pass" },
      { msg: "System Heartbeat... OK", type: "neutral" }
    ];

    let count = 42;
    const interval = setInterval(() => {
      count++;
      const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const msg = randomLog.msg.replace("{id}", count);
      
      setLogs(prev => {
        const newLogs = [...prev, { time, msg, type: randomLog.type }];
        if (newLogs.length > 20) newLogs.shift(); // Keep last 20
        return newLogs;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900" id="analytics">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 font-mono">
            <span className="text-cyan-500">/// </span>
            SYSTEM_ANALYTICS & VISUALIZATION
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
             Aggregated performance metrics across 1,000+ legal queries showing the "IndoLegal-100" impact.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px] mb-12">
          
          {/* Box 1: Bar Chart (Spans 2 cols, 2 rows) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm flex flex-col"
          >
             <h3 className="flex items-center gap-2 text-slate-300 font-bold mb-6">
               <BarChart className="text-cyan-500" size={20} />
               Hallucination Rate by Model
             </h3>
             
             {/* Custom Bar Chart */}
             <div className="flex-1 flex items-end justify-around pb-8 border-b border-slate-700/50 relative gap-2">
                {[
                  { label: 'GPT-4', height: '15%', color: 'bg-green-500', error: '15%' },
                  { label: 'Claude 3', height: '12%', color: 'bg-green-400', error: '12%' },
                  { label: 'Gemini 1.5', height: '18%', color: 'bg-yellow-400', error: '18%' },
                  { label: 'Krutrim', height: '25%', color: 'bg-yellow-500', error: '25%' },
                  { label: 'Llama-3', height: '45%', color: 'bg-red-500', error: '45%' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                    <div className="text-[10px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {bar.error} Error
                    </div>
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: bar.height }}
                      transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "circOut" }}
                      className={`w-full max-w-[40px] ${bar.color} rounded-t-md opacity-80 hover:opacity-100 transition-opacity relative`}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    </motion.div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold truncate w-full text-center">{bar.label}</span>
                  </div>
                ))}
             </div>
          </motion.div>

          {/* Box 2: Donut Chart (Spans 1 col, 1 row) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
          >
             <h3 className="flex items-center gap-2 text-slate-300 font-bold mb-4 text-sm">
               <PieChart className="text-red-500" size={16} />
               Error Taxonomy
             </h3>
             
             {/* CSS Conic Gradient Donut Chart */}
             <div className="relative w-32 h-32 rounded-full flex items-center justify-center"
               style={{
                 background: "conic-gradient(#ef4444 0% 60%, #f97316 60% 90%, #64748b 90% 100%)"
               }}
             >
               <div className="absolute inset-2 bg-slate-900 rounded-full flex flex-col items-center justify-center z-10">
                 <span className="text-2xl font-bold text-slate-200">60%</span>
                 <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Legacy</span>
               </div>
             </div>
             
             {/* Legend */}
             <div className="mt-4 flex gap-2 text-[10px] text-slate-500">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Legacy</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500" /> Draft</span>
             </div>
          </motion.div>

          {/* Box 3: Live Feed (Spans 1 col, 2 rows) */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="md:col-span-1 md:row-span-2 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col"
          >
             <div className="flex items-center gap-2 text-green-500 mb-4 pb-2 border-b border-slate-800">
               <Activity size={14} className="animate-pulse" />
               LIVE_ADJUDICATION_LOG
             </div>
             <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-2 relative no-scrollbar">
               {logs.map((log, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`border-l-2 pl-2 ${
                     log.type === 'fail' ? 'border-red-500 text-red-400' : 
                     log.type === 'pass' ? 'border-green-500 text-green-400' : 'border-slate-500 text-slate-500'
                   }`}
                 >
                   <span className="text-slate-600">[{log.time}]</span> JUDGE_BOT: {log.msg}
                   {log.type === 'fail' && <span className="ml-1 text-red-500">Score: 0/3</span>}
                 </motion.div>
               ))}
               <div className="animate-pulse text-cyan-500">_</div>
             </div>
          </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.15 }}
             className="md:col-span-1 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center"
           >
              <div className="text-4xl font-mono font-bold text-slate-100 mb-1">1,024</div>
              <div className="text-slate-500 text-xs uppercase tracking-wider">Total Benchmarks</div>
           </motion.div>

        </div>

        {/* Insights Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              title: "The 160-Year Bias", 
              icon: Database, 
              color: "text-amber-500", 
              text: "Parametric Inertia prevents models from unlearning high-frequency tokens associated with the 1860 IPC.",
              example: "Ex: Predicted 'Section 302' (IPC Murder) with 94% confidence, ignoring BNS prompts."
            },
            { 
              title: "The RAG Trap", 
              icon: AlertTriangle, 
              color: "text-red-500", 
              text: "Google Custom Search fails to distinguish between 'legacy' and 'repealed' law without specific date-filtering metadata.",
              example: "Ex: Retrieved 'Indian Kanoon 2018' articles instead of 'Official Gazette 2023'."
            },
            { 
              title: "Sovereign Advantage", 
              icon: Smartphone, 
              color: "text-cyan-500", 
              text: "Indigenous models (Krutrim/Sarvam) show 40% better recall on BNS-specific nomenclature due to local training curation.",
              example: "Ex: Correctly identified 'Snatching' as a distinct BNS offense (Section 304)."
            }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-slate-950 border border-slate-800 p-6 rounded-lg hover:border-slate-600 transition-colors group"
            >
              <div className={`mb-4 ${card.color} w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <card.icon size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-2">{card.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">{card.text}</p>
              <div className="bg-slate-900/50 p-2 rounded border border-slate-800 text-[11px] text-slate-500 font-mono">
                <span className="text-slate-400 font-bold uppercase mr-1">Evidence:</span>
                {card.example}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AnalyticsSection;
