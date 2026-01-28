import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Network, Gavel, ChevronDown, ArrowRight } from 'lucide-react';

const MethodologySection = () => {
  const steps = [
    {
      id: 1,
      title: "Data Extraction",
      desc: "Mining 100 high-impact legal scenarios where IPC and BNS differ significantly.",
      icon: FileSearch,
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      border: "border-blue-500/30"
    },
    {
      id: 2,
      title: "Triangulation",
      desc: "Direct Query + Reverse Lookup + Adversarial Trap to test robustness.",
      icon: Network,
      color: "text-purple-400",
      bg: "bg-purple-900/20",
      border: "border-purple-500/30"
    },
    {
      id: 3,
      title: "Automated Judging",
      desc: "LLM-as-a-Judge grading responses on a strict 0-3 rubric for hallucination.",
      icon: Gavel,
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      border: "border-amber-500/30"
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900" id="methodology">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 font-mono">
            <span className="text-cyan-500">/// </span>
            RESEARCH_METHODOLOGY
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
             A rigorous three-stage pipeline designed to expose "Parametric Inertia" in large language models.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 hidden md:block" />
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
             {steps.map((step, index) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.2 }}
                 className={`relative bg-slate-950 p-8 rounded-xl border ${step.border} group hover:border-opacity-100 transition-colors`}
               >
                 {/* Step Number Badge */}
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 px-3 py-1 border border-slate-800 rounded-full text-xs font-mono text-slate-500">
                   STEP {index + 1}
                 </div>

                 <div className={`w-16 h-16 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                   <step.icon size={32} />
                 </div>
                 
                 <h3 className="text-xl font-bold text-slate-200 text-center mb-3">{step.title}</h3>
                 <p className="text-slate-400 text-sm text-center leading-relaxed">
                   {step.desc}
                 </p>

                 {/* Arrow for next step (except last) */}
                 {index !== steps.length - 1 && (
                   <div className="absolute top-1/2 -right-6 -translate-y-1/2 hidden md:block text-slate-700">
                     <ArrowRight size={20} />
                   </div>
                 )}
               </motion.div>
             ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              EVALUATION_RUBRIC_V1.0
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950 text-slate-200 font-mono uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { feature: "Parametric Inertia", desc: "Tendency to default to high-frequency training data (IPC) over new data (BNS)", weight: "0.4", example: "Citing IPC 302 instead of BNS 103" },
                  { feature: "Hallucination Type", desc: "Classification of error: Zombie (Dead Law), Confabulation (Made up), or Refusal", weight: "0.3", example: "Zombie: Citing Repealed Act" },
                  { feature: "Search Reliance", desc: "Did the model trigger RAG/Web Search to answer?", weight: "0.2", example: "Bing/Google Search Triggered" },
                  { feature: "Citation Accuracy", desc: "Precision of Section Number citation (Exact Match)", weight: "0.1", example: "Section 103(1) vs Section 103" },
                  { feature: "Reasoning Chain", desc: "Did the model explain the transition from IPC to BNS?", weight: "0.0", example: "Explained Repeal of 124A" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-900/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-cyan-500">{row.feature}</td>
                    <td className="px-6 py-4">{row.desc}</td>
                    <td className="px-6 py-4 font-mono text-xs">{row.weight}</td>
                    <td className="px-6 py-4 italic text-slate-500">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default MethodologySection;
