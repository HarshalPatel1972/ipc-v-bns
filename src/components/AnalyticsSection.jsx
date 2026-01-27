import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Activity, AlertTriangle, Database, CheckCircle, Smartphone } from 'lucide-react';

const AnalyticsSection = () => {
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
            className="md:col-span-2 md:row-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm"
          >
             <h3 className="flex items-center gap-2 text-slate-300 font-bold mb-6">
               <BarChart className="text-cyan-500" size={20} />
               Hallucination Rate by Model
             </h3>
             {/* Chart Placeholder */}
             <div className="flex items-end justify-around h-64 md:h-80 w-full pb-8 border-b border-slate-700/50">
                <div className="text-slate-500 text-sm">Loading Visualization...</div>
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
             {/* Chart Placeholder */}
             <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center text-slate-600 text-xs">
               Load
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
             <div className="flex-1 overflow-hidden relative">
               <div className="text-slate-500 italic">Initializing stream...</div>
             </div>
          </motion.div>

           {/* Placeholder for future box if needed, or Box 2 only took 1 row, leaving a slot. 
               The prompt asks for Box 2 to be Pie Chart. 
               Layout: Box 1 (2x2), Box 3 (1x2). That leaves 1 col left.
               If Box 2 is 1x1, there is an empty 1x1 slot below it. 
               I will make Box 2 1x2 to fill the gap or add a stat card.
               Let's make Box 2 span 1 col, 2 rows for now to simplify, or add a Stat card.
               Re-reading prompt: "Bento Grid". 
               Let's stick to prompt box definitions. 
               I'll add a "Total Queries" stat card to fill the grid.
           */}
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
            { title: "The 160-Year Bias", icon: Database, color: "text-amber-500", text: "Parametric Inertia prevents models from unlearning high-frequency tokens associated with the 1860 IPC." },
            { title: "The RAG Trap", icon: AlertTriangle, color: "text-red-500", text: "Google Custom Search fails to distinguish between 'legacy' and 'repealed' law without specific date-filtering metadata." },
            { title: "Sovereign Advantage", icon: Smartphone, color: "text-cyan-500", text: "Indigenous models (Krutrim/Sarvam) show 40% better recall on BNS-specific nomenclature due to local training curation." }
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
              <p className="text-slate-400 text-sm leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AnalyticsSection;
