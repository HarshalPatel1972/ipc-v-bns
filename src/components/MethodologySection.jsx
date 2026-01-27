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
                   STEP {img_number: index + 1}
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
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            PIPELINE_STATUS: ACTIVE
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default MethodologySection;
