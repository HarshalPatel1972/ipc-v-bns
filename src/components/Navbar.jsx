import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Basic scroll spy logic
      const sections = ['home', 'simulator', 'methodology', 'analytics', 'team'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'simulator', label: 'Benchmark' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'team', label: 'Team' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-cyan-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 py-4 shadow-lg' 
          : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold tracking-wider cursor-pointer" onClick={() => scrollTo('home')}>
            <span className="text-xl">INDOLEGAL-100</span>
            <div className={`h-2 w-2 bg-cyan-400 rounded-full ${isScrolled ? '' : 'animate-pulse'}`} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-sm font-mono transition-colors relative hover:text-cyan-400 ${
                  activeSection === link.id ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div 
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400" 
                  />
                )}
              </button>
            ))}
            <a 
              href="https://github.com/HarshalPatel1972/ipc-v-bns" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded hover:bg-cyan-500/10 transition-colors"
            >
              [GITHUB]
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
