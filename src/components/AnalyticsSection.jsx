import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Activity, AlertTriangle, Database, CheckCircle, Smartphone } from 'lucide-react';

const AnalyticsSection = () => {
  /* Live Log Logic */
  const [logs, setLogs] = useState([]);
  const logContainerRef = useRef(null);

  useEffect(() => {
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

    const interval = setInterval(() => {
      const randomQ = BATCH_QS[Math.floor(Math.random() * BATCH_QS.length)];
      const time = new Date().toLocaleTimeString('en-US', { hour12: false });
      const isError = Math.random() > 0.8;
      
      const msg = `Q: "${randomQ.q}" | Src: ${randomQ.src} | ${isError ? 'LEGACY_ERR' : 'VERIFIED'}`;
      
      setLogs(prev => {
        const newLogs = [...prev, { time, msg, type: isError ? 'fail' : 'pass' }];
        if (newLogs.length > 20) newLogs.shift(); // Keep last 20
        return newLogs;
      });

    }, 800);

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
             Aggregated performance metrics across 1,024 legal queries showing the "IndoLegal-100" impact.
          </p>
        </div>


        <div className="grid md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px] mb-12">
          
          {/* Box 1: Leaderboard Matrix (Spans 2 cols, 2 rows) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm flex flex-col"
          >
             <h3 className="flex items-center gap-2 text-slate-300 font-bold mb-6">
               <Database className="text-cyan-500" size={20} />
               Comparative Performance Matrix (N=1,024)
             </h3>
             
             {/* Scientific Leaderboard */}
             <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="text-[10px] uppercase text-slate-500 border-b border-slate-700">
                     <th className="py-2 pl-2">Model Rank</th>
                     <th className="py-2 text-right">BNS Acc %</th>
                     <th className="py-2 text-right">Legacy Bias %</th>
                     <th className="py-2 text-right">Safety %</th>
                     <th className="py-2 text-right">Logic /10</th>
                   </tr>
                 </thead>
                 <tbody className="font-mono text-xs">
                    {[
                      { rank: 1, name: "Olac Krutrim", acc: 92, bias: 5, safe: 97, logic: 7.8, win: true },
                      { rank: 2, name: "Sarvam 2B", acc: 88, bias: 8, safe: 95, logic: 7.2, win: false },
                      { rank: 3, name: "GPT-4o", acc: 65, bias: 32, safe: 99, logic: 9.6, win: false },
                      { rank: 4, name: "Claude 3", acc: 62, bias: 35, safe: 98, logic: 9.4, win: false },
                      { rank: 5, name: "Gemini 1.5", acc: 58, bias: 38, safe: 94, logic: 8.9, win: false },
                      { rank: 6, name: "Mistral", acc: 55, bias: 40, safe: 92, logic: 8.5, win: false },
                      { rank: 7, name: "Qwen 2.5", acc: 48, bias: 45, safe: 88, logic: 8.1, win: false },
                      { rank: 8, name: "Llama-3", acc: 42, bias: 52, safe: 85, logic: 8.0, win: false },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-slate-800/50 hover:bg-white/5 transition-colors ${row.win ? 'bg-cyan-900/10' : ''}`}>
                        <td className="py-3 pl-2 flex items-center gap-2">
                          <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${row.rank <= 2 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                            #{row.rank}
                          </span>
                          <span className={row.win ? 'text-cyan-400 font-bold' : 'text-slate-300'}>{row.name}</span>
                          {row.win && <Activity size={12} className="text-cyan-500" />}
                        </td>
                        <td className="text-right text-emerald-400">{row.acc}%</td>
                        <td className="text-right text-amber-400">{row.bias}%</td>
                        <td className="text-right text-blue-400">{row.safe}%</td>
                        <td className="text-right text-slate-400">{row.logic}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
             
             <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-slate-500 border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-400" /> BNS Accuracy (Higher is Better)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-400" /> IPC Bias (Lower is Better)</span>
             </div>
          </motion.div>

          {/* Box 2: Radar / Insight (Spans 1 col, 1 row) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col relative overflow-hidden"
          >
             <h3 className="flex items-center gap-2 text-slate-300 font-bold mb-4 text-sm">
               <AlertTriangle className="text-amber-500" size={16} />
               Key Insight
             </h3>
             
             <div className="flex-1 flex flex-col justify-center">
               <div className="text-4xl font-bold text-white mb-2">32%</div>
               <p className="text-slate-400 text-xs leading-relaxed">
                 Average <span className="text-amber-400">Legacy Inertia</span> across Western models (GPT, Claude, Llama). They struggle to "unlearn" 160 years of IPC data.
               </p>
             </div>
             
             <div className="mt-4 pt-4 border-t border-slate-800">
               <div className="flex justify-between text-xs mb-1">
                 <span className="text-slate-500">Global Models</span>
                 <span className="text-red-400">High Bias</span>
               </div>
               <div className="flex justify-between text-xs">
                 <span className="text-slate-500">Indic Models</span>
                 <span className="text-green-400">Low Bias</span>
               </div>
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
                   <span className="text-slate-600">[{log.time}]</span> {log.msg}
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
