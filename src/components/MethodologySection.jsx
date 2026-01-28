import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Network, Gavel, ChevronDown, ArrowRight } from 'lucide-react';

const MethodologySection = () => {
  const steps = [
    {
      id: 1,
      title: "Data Extraction",
      desc: "Mining 100 high-impact legal scenarios where IPC and BNS differ significantly.",
      example: "Query: 'Punishment for Mob Lynching' (New in BNS vs. undefined in IPC).",
      icon: FileSearch,
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      border: "border-blue-500/30"
    },
    {
      id: 2,
      title: "Triangulation",
      desc: "Direct Query + Reverse Lookup + Adversarial Trap to test robustness.",
      example: "Trap: 'Cite the IPC section for Organized Crime' (Should fail as it's BNS-only).",
      icon: Network,
      color: "text-purple-400",
      bg: "bg-purple-900/20",
      border: "border-purple-500/30"
    },
    {
      id: 3,
      title: "Automated Judging",
      desc: "LLM-as-a-Judge grading responses on a strict 0-3 rubric for hallucination.",
      example: "Score 0/3: Logic holds but cites repealed 'Section 124A'.",
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

        <div className="relative max-w-5xl mx-auto mb-24">
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
                 className={`relative bg-slate-950 p-6 rounded-xl border ${step.border} group hover:border-opacity-100 transition-all hover:-translate-y-1`}
               >
                 {/* Step Number Badge */}
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-950 px-3 py-1 border border-slate-800 rounded-full text-xs font-mono text-slate-500">
                   STEP {index + 1}
                 </div>

                 <div className={`w-12 h-12 rounded-lg ${step.bg} ${step.color} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                   <step.icon size={24} />
                 </div>
                 
                 <h3 className="text-lg font-bold text-slate-200 text-center mb-2">{step.title}</h3>
                 <p className="text-slate-400 text-xs text-center leading-relaxed mb-4">
                   {step.desc}
                 </p>
                 
                 <div className="bg-slate-900/80 p-3 rounded border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 font-mono uppercase mb-1">Example Scenario</p>
                    <p className="text-xs text-slate-300 italic">"{step.example}"</p>
                 </div>

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
              METADATA_SCHEMA_DEFINITION
            </div>
            <p className="text-slate-400 text-sm">We used the following data structure to benchmark 100+ legal queries.</p>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm">
            <table className="w-full text-left text-xs text-slate-400 font-mono">
              <thead className="bg-slate-950 text-slate-200 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Column ID</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Why it matters?</th>
                  <th className="px-4 py-3">Example Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { col: "id", desc: "Unique Record Identifier", why: "Traceability", ex: "SEQ_001" },
                  { col: "model_name", desc: "Target LLM", why: "To compare bias across architectures", ex: "GPT-4o / Llama-3" },
                  { col: "category", desc: "Legal Domain", why: "Identify weak spots (e.g. Women's Safety)", ex: "Crimes Against Body" },
                  { col: "complexity", desc: "Cognitive Load (L1-L3)", why: "Does model fail on simple vs complex?", ex: "L2 (Reasoning)" },
                  { col: "query_method", desc: "Prompt Strategy", why: "Test robustness of prompting", ex: "Zero-Shot / Chain-of-Thought" },
                  { col: "question_text", desc: "Input Prompt", why: "The actual test vector", ex: "'Punishment for Mob Lynching?'" },
                  { col: "ground_truth", desc: "BNS 2023 Provision", why: "The Gold Standard for grading", ex: "Section 103(2) BNS" },
                  { col: "trap_ref", desc: "Adversarial Trigger", why: "Does it fall for the IPC bait?", ex: "Mentioning 'Section 302 IPC'" },
                  { col: "web_search", desc: "RAG Usage Flag", why: "Did it cheat by searching online?", ex: "TRUE / FALSE" },
                  { col: "error_class", desc: "Hallucination Type", why: "Taxonomy of failure", ex: "ZOMBIE_ERROR (Repealed Law)" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-900/80 transition-colors">
                    <td className="px-4 py-3 font-bold text-cyan-500">{row.col}</td>
                    <td className="px-4 py-3 text-slate-300">{row.desc}</td>
                    <td className="px-4 py-3 text-slate-500 italic">{row.why}</td>
                    <td className="px-4 py-3 text-green-400/80">{row.ex}</td>
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
