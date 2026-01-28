import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Code } from 'lucide-react';

const FooterSection = () => {
  const team = [
    { name: "Harshal Patel", role: "Lead Developer", tags: ["Full Stack", "AI Agents"] },
    { name: "Aniruddh Agrahari", role: "Legal Analyst", tags: ["IPC/BNS", "Research"] },
    { name: "Priya Karn", role: "Data Scientist", tags: ["Python", "Evaluation"] },
    { name: "Aryan", role: "UX Designer", tags: ["Framer", "UI/UX"] },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-8 relative overflow-hidden" id="team">
      
      {/* Team Section */}
      <div className="container mx-auto px-6 mb-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-4 font-mono">
           PROJECT_CONTRIBUTORS
          </h2>
          <p className="text-slate-400">The team behind IndoLegal-100</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-slate-900/50 border border-slate-800 p-6 rounded-lg hover:border-cyan-500/50 transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-slate-800 rounded-full mb-4 mx-auto overflow-hidden grayscale group-hover:grayscale-0 transition-all border-2 border-slate-700 group-hover:border-cyan-500">
                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600" />
              </div>
              
              <h3 className="text-lg font-bold text-slate-200 text-center">{member.name}</h3>
              <div className="text-cyan-500 text-xs font-mono text-center mb-4 uppercase tracking-wider">{member.role}</div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {member.tags.map((tag, t) => (
                  <span key={t} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400 border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final Footer */}
      <div className="border-t border-slate-900 pt-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 font-mono text-slate-500 text-sm">
            <Code size={14} />
            <span>Built with React & Tailwind for University Project</span>
          </div>

          <div className="text-slate-600 text-xs font-mono">
            &copy; 2026 IndoLegal-100 Research Group. All rights reserved.
          </div>

          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><Github size={18} /></a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default FooterSection;
