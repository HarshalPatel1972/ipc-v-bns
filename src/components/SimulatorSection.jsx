import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, ShieldCheck, Skull, Search, AlertTriangle, ChevronDown, Cpu, Gavel, User, Bot, Sparkles, Brain, Zap, Globe, Check, X } from 'lucide-react';

const SCENARIO_DB = {
  murder: {
    id: "murder",
    title: "Punishment for Murder",
    query: "What is the punishment for Murder in BNS?",
    ground_truth: "Section 103(1) of Bharatiya Nyaya Sanhita (BNS)",
    responses: {
      gpt4: { 
        text: "Under the new Bharatiya Nyaya Sanhita (BNS) 2023, Murder is defined and punishable under Section 103(1). The punishment remains death or imprisonment for life, and shall also be liable to fine. Section 302 of the IPC has been replaced.", 
        verdict: "PASS", 
        score: 3,
        search_triggered: true,
        rubric: [
          { criteria: "Parametric Inertia Check", status: "pass", note: "Correctly switched to BNS context" },
          { criteria: "Citation Accuracy", status: "pass", note: "Identified Section 103(1)" },
          { criteria: "Zombie Law Detection", status: "pass", note: "No repealed IPC citations" },
          { criteria: "Reasoning Validity", status: "pass", note: "Accurately noted replacement of Sec 302" }
        ]
      },
      claude3: {
        text: "In the Bharatiya Nyaya Sanhita (BNS), murder is punishable under Section 103(1). The punishment is death or imprisonment for life, and a fine. It replaces Section 302 of the Indian Penal Code.",
        verdict: "PASS",
        score: 3,
        search_triggered: false,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Correctly switched to BNS context" },
           { criteria: "Citation Accuracy", status: "pass", note: "Identified Section 103(1)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No repealed IPC citations" },
           { criteria: "Reasoning Validity", status: "pass", note: "Accurately noted replacement of Sec 302" }
        ]
      },
      llama3: { 
        text: "According to the Indian Penal Code (IPC), Murder is defined under Section 300 and punishable under Section 302 with death or life imprisonment. This is the primary law governing homicide in India.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Failed to recognize BNS 2023 prompt" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited repealed Section 302" },
           { criteria: "Zombie Law Detection", status: "fail", note: " hallucinated active status of dead law" },
           { criteria: "Reasoning Validity", status: "fail", note: "Outdated legal framework" }
        ]
      },
      krutrim: { 
        text: "The punishment for murder is prescribed under Section 302 of the IPC. It is a non-bailable offense. The new laws are under discussion but currently IPC 302 is the active provision.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Failed to recognize enactment of BNS" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited repealed Section 302" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Explicitly claimed IPC is active" },
           { criteria: "Reasoning Validity", status: "fail", note: "False claim about 'under discussion'" }
        ]
      }
    }
  },
  sedition: {
    id: "sedition",
    title: "Sedition Law Status",
    query: "Is Sedition (Section 124A) still applicable?",
    ground_truth: "Repealed. Replaced by Section 152 (Treason) in BNS.",
    responses: {
      gpt4: { 
        text: "Sedition (Section 124A IPC) has been completely repealed in the BNS 2023. It has been replaced by Section 152, which deals with 'Acts endangering sovereignty, unity and integrity of India'. The term 'Sedition' is no longer used.", 
        verdict: "PASS", 
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Acknowledged repeal of 124A" },
           { criteria: "Citation Accuracy", status: "pass", note: "Correctly cited Section 152" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Did not hallucinate validity" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct terminology (Treason/Sovereignty)" }
        ]
      },
      claude3: {
        text: "Section 124A (Sedition) of the IPC has been omitted in the Bharatiya Nyaya Sanhita. It is replaced by Section 152, acts endangering sovereignty, unity and integrity of India.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Acknowledged repeal of 124A" },
           { criteria: "Citation Accuracy", status: "pass", note: "Correctly cited Section 152" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Did not hallucinate validity" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct terminology" }
        ]
      },
      llama3: { 
        text: "Yes, Section 124A of the IPC criminalizes Sedition. The Supreme Court has put it in abeyance, but it remains part of the statute book until officially removed by Parliament.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Ignored BNS repeal" },
           { criteria: "Citation Accuracy", status: "pass", note: "Correctly cited 124A (Contextually wrong)" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Hallucinated 'Active' status" },
           { criteria: "Reasoning Validity", status: "fail", note: "Unaware of 2023 Enactment" }
        ]
      },
      krutrim: { 
        text: "Section 124A regarding Sedition is active. Punishment involves imprisonment for life or up to three years.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
         search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Ignored BNS repeal" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited repealed law as active" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Major hallucination" },
           { criteria: "Reasoning Validity", status: "fail", note: "Failed legal check" }
        ]
      }
    }
  },
  lynching: {
    id: "lynching",
    title: "Mob Lynching Provision",
    query: "Specific section for Mob Lynching in BNS?",
    ground_truth: "Section 103(2) of BNS.",
    responses: {
      gpt4: { 
        text: "The BNS 2023 introduces a specific provision for Mob Lynching under Section 103(2). It prescribes death or imprisonment for life for murder committed by a group of five or more persons on grounds of race, caste, or community.", 
        verdict: "PASS", 
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Found new BNS provision" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 103(2)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No IPC fallback" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct details on '5 or more persons'" }
        ]
      },
      claude3: {
        text: "The Bharatiya Nyaya Sanhita (BNS) explicitly addresses Mob Lynching in Section 103(2), treating it as a distinct category of murder punishable by death or life imprisonment.",
        verdict: "PASS",
        score: 3,
        search_triggered: false,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Found new BNS provision" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 103(2)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No IPC fallback" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct definition" }
        ]
      },
      llama3: { 
        text: "Mob Lynching is not specifically defined as a separate offense in the IPC, but is prosecuted under Section 302 (Murder) and Section 149 (Unlawful Assembly).", 
        verdict: "FAIL (INCOMPLETE)", 
        score: 1,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Reverted to IPC analysis" },
           { criteria: "Citation Accuracy", status: "fail", note: "Missed Section 103(2)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Technically correct about IPC, but wrong context" },
           { criteria: "Reasoning Validity", status: "fail", note: "Missed specific BNS provision" }
        ]
      },
      krutrim: { 
        text: "Mob lynching is treated as murder under Section 302 IPC read with Section 34.", 
        verdict: "FAIL (ZOMBIE)", 
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Reverted to IPC" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited repealed 302" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Ignored new Mob Lynching law" },
           { criteria: "Reasoning Validity", status: "fail", note: "Outdated knowledge" }
        ]
      }
    }
  },
  theft: {
    id: "theft",
    title: "Theft vs Snatching",
    query: "Is 'Snatching' a separate offense in BNS?",
    ground_truth: "Yes, Section 304 of BNS.",
    responses: {
      gpt4: {
        text: "Yes, the BNS identifies 'Snatching' as a distinct offense under Section 304. Previously, in the IPC, it was often covered under theft (Section 379) or robbery (Section 390) without a specific provision.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Identified new classification" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 304" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Correctly contrasted with IPC" },
           { criteria: "Reasoning Validity", status: "pass", note: "Accurate historical context" }
        ]
      },
      claude3: {
        text: "Correct. Section 304 of the Bharatiya Nyaya Sanhita specifically criminalizes Snatching, distinguishing it from general theft to address chain-snatching incidents more effectively.",
        verdict: "PASS",
        score: 3,
        search_triggered: false,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Identified new classification" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 304" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No hallucination" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct logic" }
        ]
      },
      llama3: {
        text: "Snatching is a form of theft defined under Section 378 of the Indian Penal Code. It is punishable under Section 379.",
        verdict: "FAIL (ZOMBIE)",
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Stuck in IPC 1860" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited repealed 379" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Failed to see 'Snatching' update" },
           { criteria: "Reasoning Validity", status: "fail", note: "Missed new provision" }
        ]
      },
      krutrim: {
        text: "Snatching is covered under Section 356 (Assault or criminal force in attempt to commit theft) of the IPC.",
        verdict: "FAIL (ZOMBIE)",
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Stuck in IPC 1860" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited repealed 356" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Failed to see 'Snatching' update" },
           { criteria: "Reasoning Validity", status: "fail", note: "Missed new provision" }
        ]
      }
    }
  },
  defamation: {
    id: "defamation",
    title: "Defamation (Community Service)",
    query: "Can Community Service be awarded for Defamation?",
    ground_truth: "Yes, Section 356(2) of BNS.",
    responses: {
      gpt4: {
        text: "Yes, under Section 356(2) of the BNS, the magistrate has the discretion to award 'Community Service' as a punishment for Defamation. This is a new introduction not present in the IPC.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Identified new BNS feature" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 356(2)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Correctly noted IPC absence" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct punishment type" }
        ]
      },
      claude3: {
        text: "The BNS introduces community service as a punishment for petty offenses, including Defamation, under Section 356. This aims to reduce prison overcrowding.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Identified new BNS feature" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 356" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No hallucination" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct reasoning" }
        ]
      },
      llama3: {
        text: "Defamation is punishable under Section 500 of the IPC with simple imprisonment for a term which may extend to two years, or with fine, or with both.",
        verdict: "FAIL (INCOMPLETE)",
        score: 1,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Cited IPC 500" },
           { criteria: "Citation Accuracy", status: "fail", note: "Missed Section 356(2)" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Missed Community Service update" },
           { criteria: "Reasoning Validity", status: "fail", note: "Outdated punishment metrics" }
        ]
      },
      krutrim: {
        text: "Defamation falls under Section 499 IPC. Punishment is jail up to 2 years. Community service is not a prescribed punishment in the Indian Penal Code.",
        verdict: "FAIL (ZOMBIE)",
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Explicitly denied Community Service" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited IPC 499" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Asserted IPC limitation" },
           { criteria: "Reasoning Validity", status: "fail", note: "False claim in BNS context" }
        ]
      }
    }
  },
  hitandrun: {
    id: "hitandrun",
    title: "Hit & Run (New Law)",
    query: "What is the penalty for Hit and Run in BNS?",
    ground_truth: "Section 106(2) of BNS (10 years + fine).",
    responses: {
       gpt4: {
        text: "Section 106(2) of the Bharatiya Nyaya Sanhita (BNS) prescribes a punishment of imprisonment of up to 10 years and a fine for 'Hit and Run' cases where the driver escapes without reporting the incident.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Identified new 10-year rule" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 106(2)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No IPC 304A citation" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct reporting clause" }
        ]
       },
       claude3: {
        text: "Under BNS Section 106(2), causing death by rash and negligent driving and fleeing the scene attracts a 10-year prison term.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Identified new 10-year rule" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 106(2)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No IPC 304A citation" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct logic" }
        ]
       },
       gemini15: {
        text: "The new BNS law is strict on Hit and Run. Section 106(2) increases the punishment to 10 years if the driver fails to report the accident to a police officer or magistrate.",
        verdict: "PASS",
        score: 3,
        search_triggered: false,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Identified new 10-year rule" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 106(2)" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No IPC 304A citation" },
           { criteria: "Reasoning Validity", status: "pass", note: "Detailed explanation of reporting" }
        ]
       },
       llama3: {
        text: "Hit and Run is covered under Section 304A of the IPC (Causing death by negligence), which carries a maximum sentence of 2 years.",
        verdict: "FAIL (ZOMBIE)",
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Cited IPC terms" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited IPC 304A" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Missed 10-year penalty update" },
           { criteria: "Reasoning Validity", status: "fail", note: "Outdated sentencing info" }
        ]
       },
       krutrim: {
        text: "It falls under rash driving, Section 279 and 304A IPC.",
        verdict: "FAIL (ZOMBIE)",
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Cited IPC terms" },
           { criteria: "Citation Accuracy", status: "fail", note: "Cited IPC 304A" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Missed 10-year penalty update" },
           { criteria: "Reasoning Validity", status: "fail", note: "Outdated sentencing info" }
        ]
       }
    }
  },
  organized: {
    id: "organized",
    title: "Organized Crime",
    query: "Is Organized Crime defined in BNS?",
    ground_truth: "Yes, Section 111 of BNS.",
    responses: {
       gpt4: {
        text: "Yes, for the first time in general criminal law, 'Organized Crime' is defined under Section 111 of the Bharatiya Nyaya Sanhita. It includes kidnapping, robbery, and vehicle theft by a syndicate.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Recognized new definition" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 111" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Correctly noted it's a 'first time' addition" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct scope of crime" }
        ]
       },
       claude3: {
        text: "BNS Section 111 introduces a specific definition and punishment for Organized Crime, addressing a gap in the original IPC.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Recognized new definition" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 111" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Correctly noted addressing IPC gap" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct logic" }
        ]
       },
       gemini15: {
        text: "Section 111 of the BNS deals with Organized Crime. Penalties range from life imprisonment to death if the offense results in the death of any person.",
        verdict: "PASS",
        score: 3,
        search_triggered: true,
        rubric: [
           { criteria: "Parametric Inertia Check", status: "pass", note: "Recognized new definition" },
           { criteria: "Citation Accuracy", status: "pass", note: "Cited Section 111" },
           { criteria: "Zombie Law Detection", status: "pass", note: "No hallucination" },
           { criteria: "Reasoning Validity", status: "pass", note: "Correct penalty range" }
        ]
       },
       llama3: {
        text: "Organized Crime is not defined in the IPC. Usually, the MCOCA (Maharashtra Control of Organized Crime Act) is invoked in such cases.",
        verdict: "FAIL (INCOMPLETE)",
        score: 1,
        search_triggered: true,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Failed to checked BNS" },
           { criteria: "Citation Accuracy", status: "fail", note: "Missed Section 111" },
           { criteria: "Zombie Law Detection", status: "pass", note: "Correctly stated not in IPC" },
           { criteria: "Reasoning Validity", status: "fail", note: "Reverted to MCOCA (State Act)" }
        ]
       },
       krutrim: {
        text: "There is no specific section for Organized Crime in the IPC.",
        verdict: "FAIL (ZOMBIE)",
        score: 0,
        search_triggered: false,
         rubric: [
           { criteria: "Parametric Inertia Check", status: "fail", note: "Checked only IPC" },
           { criteria: "Citation Accuracy", status: "fail", note: "Missed Section 111" },
           { criteria: "Zombie Law Detection", status: "fail", note: "Ignored BNS update" },
           { criteria: "Reasoning Validity", status: "fail", note: "Incomplete analysis" }
        ]
       }
    }
  }
};

const MODELS = [
  { id: 'gpt4', name: 'GPT-4o (OpenAI)', icon: Bot },
  { id: 'claude3', name: 'Claude 3.5 Sonnet', icon: Sparkles },
  { id: 'gemini15', name: 'Gemini 1.5 Pro', icon: Zap },
  { id: 'llama3', name: 'Llama-3 (Meta)', icon: Brain },
  { id: 'krutrim', name: 'Krutrim (Indian AI)', icon: Globe }
];

const SCENARIOS = Object.values(SCENARIO_DB);

const SimulatorSection = () => {
  /* Interactive Logic */
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [showSearchBadge, setShowSearchBadge] = useState(false);
  
  /* New States for Step-by-Step Grading */
  const [simState, setSimState] = useState('idle'); // idle, scanning, thinking, typing, grading, complete
  const [gradingSteps, setGradingSteps] = useState([]);
  const [result, setResult] = useState(null);

  const terminalRef = useRef(null);

  const handleRunSimulation = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setSimState('scanning');
    setProgress(0);
    setTerminalOutput("");
    setShowSearchBadge(false);
    setResult(null);
    setGradingSteps([]);

    // 1. Simulation Sequence (Progress Bar)
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        startResponseGeneration();
      }
    }, 30);
  };

  const startResponseGeneration = () => {
    setSimState('thinking');
    const scenario = SCENARIO_DB[selectedScenario];
    const responseData = scenario.responses[selectedModel];
    
    // 2. Simulate Latency & Typing
    setTimeout(() => {
      if (responseData.search_triggered) {
        setShowSearchBadge(true);
      }
      
      setTimeout(() => {
        setSimState('typing');
        typewriterEffect(responseData);
      }, 1000);
    }, 1500);
  };

  const typewriterEffect = (data) => {
    let i = 0;
    const text = data.text;
    const speed = 15; 

    const typeInterval = setInterval(() => {
      setTerminalOutput(text.substring(0, i + 1));
      i++;

      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }

      if (i === text.length) {
        clearInterval(typeInterval);
        // 3. Start Grading Sequence instead of finishing immediately
        setTimeout(() => {
            startGradingSequence(data);
        }, 500);
      }
    }, speed);
  };

  const startGradingSequence = (data) => {
      setSimState('grading');
      const rubricItems = data.rubric || [];
      let currentStep = 0;

      const gradeInterval = setInterval(() => {
          if (currentStep < rubricItems.length) {
              setGradingSteps(prev => [...prev, rubricItems[currentStep]]);
              
               if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
              }
              
              currentStep++;
          } else {
              clearInterval(gradeInterval);
              setTimeout(() => {
                  setSimState('complete');
                  setResult(data);
                  setIsRunning(false);
              }, 800);
          }
      }, 800); // Add one check every 800ms
  };

  /* Helper to get Model Icon */
  const getModelIcon = (modelId) => {
      const model = MODELS.find(m => m.id === modelId);
      return model ? model.icon : Bot;
  };

  const CurrentModelIcon = getModelIcon(selectedModel);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden" id="simulator">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 font-mono">
            <span className="text-cyan-500">&gt; </span>
            INTERACTIVE_BENCHMARK_SIMULATOR
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Execute live legal scenarios against state-of-the-art LLMs to detect hallucinations and legacy bias.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* LEFT PANEL: CONTROL DECK */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-6 rounded-lg shadow-xl h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                   <Cpu className="text-cyan-400" size={20} />
                   <h3 className="font-bold text-slate-200 uppercase tracking-wider text-sm">Control Deck</h3>
                </div>

                {/* Dropdown 1: Model */}
                <div className="mb-6">
                  <label className="block text-slate-500 text-xs font-mono mb-2 uppercase">Target Model Layer</label>
                  <div className="relative">
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded px-4 py-3 appearance-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    >
                      {MODELS.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Dropdown 2: Scenario */}
                <div className="mb-8">
                  <label className="block text-slate-500 text-xs font-mono mb-2 uppercase">Test Vector (Scenario)</label>
                  <div className="relative">
                    <select 
                      value={selectedScenario}
                      onChange={(e) => setSelectedScenario(e.target.value)}
                      disabled={isRunning}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded px-4 py-3 appearance-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    >
                      {SCENARIOS.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              {/* Big Execute Button */}
              <motion.button
                whileHover={!isRunning ? { scale: 1.02, boxShadow: "0 0 30px rgba(6,182,212,0.4)" } : {}}
                whileTap={!isRunning ? { scale: 0.98 } : {}}
                onClick={handleRunSimulation}
                disabled={isRunning}
                className={`w-full relative group overflow-hidden rounded-md py-4 px-6 font-bold tracking-widest uppercase transition-all ${
                  isRunning 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50'
                }`}
              >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   {isRunning ? (
                     <>
                       <Cpu className="animate-spin" size={18} /> PROCESSING...
                     </>
                   ) : (
                     <>
                       <Play className="fill-current" size={18} /> EXECUTE BENCHMARK
                     </>
                   )}
                 </span>
                 {!isRunning && (
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                 )}
              </motion.button>
              
              <div className="mt-4 text-center">
                 <p className="text-slate-500 text-[10px] font-mono">
                   Secure Connection: TLS 1.3 // Latency: 45ms
                 </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: LIVE CHAT TERMINAL */}
          <div className="lg:col-span-8">
            <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl flex flex-col h-full min-h-[600px] relative">
              
              {/* Header */}
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-2">
                    <Terminal size={12} />
                    IndoLegal_Benchmark_v2.0
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-600 uppercase">
                    Session ID: {Math.random().toString(36).substr(2, 9)}
                </div>
              </div>

              {/* Chat Body */}
              <div ref={terminalRef} className="p-6 font-sans text-sm leading-relaxed text-slate-300 flex-1 overflow-y-auto relative bg-[#0B1120]">
                
                {/* 1. User Message (Always Visible) */}
                <div className="flex gap-4 mb-8">
                     <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-600">
                        <User size={16} className="text-slate-300" />
                     </div>
                     <div className="flex-1">
                        <div className="text-xs text-slate-500 mb-1 font-mono">USER (Hon. Judge)</div>
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg rounded-tl-none inline-block text-slate-200">
                            ./run_benchmark --model="{selectedModel}" --query="{SCENARIO_DB[selectedScenario].query}"
                        </div>
                     </div>
                </div>

                {/* 2. System Progress */}
                {simState === 'scanning' && (
                   <div className="ml-12 mb-8 animate-fadeIn">
                       <div className="text-cyan-500 text-xs font-mono mb-2 flex items-center gap-2">
                            <Cpu size={12} className="animate-spin" /> 
                            INITIALIZING_CONTEXT_WINDOW...
                       </div>
                       <div className="h-1 w-48 bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                                className="h-full bg-cyan-500" 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                           />
                       </div>
                   </div>
                )}

                {/* 3. Model Response */}
                {(simState === 'thinking' || simState === 'typing' || simState === 'grading' || simState === 'complete') && (
                    <div className="flex gap-4 mb-8 animate-slideUp">
                        <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center flex-shrink-0 border border-cyan-500/30">
                            <CurrentModelIcon size={16} className="text-cyan-400" />
                        </div>
                        <div className="flex-1">
                           <div className="text-xs text-cyan-500 mb-1 font-mono flex items-center gap-2 uppercase">
                                {MODELS.find(m => m.id === selectedModel)?.name}
                                {showSearchBadge && (
                                    <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[9px] border border-blue-500/20 flex items-center gap-1">
                                        <Globe size={8} /> ONLINE
                                    </span>
                                )}
                           </div>
                           
                           {simState === 'thinking' ? (
                                <div className="flex gap-1 mt-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                           ) : (
                                <div className="bg-slate-900 border border-cyan-900/30 p-4 rounded-lg rounded-tl-none text-slate-300 shadow-lg relative overflow-hidden">
                                     {terminalOutput}
                                     {simState === 'typing' && <span className="animate-pulse inline-block w-1.5 h-4 bg-cyan-500 align-middle ml-1" />}
                                </div>
                           )}
                        </div>
                    </div>
                )}

                {/* 4. Grading System (The New Feature) */}
                {(simState === 'grading' || simState === 'complete') && (
                    <div className="ml-12 mb-8 border-l-2 border-slate-800 pl-6 py-2">
                        <div className="text-xs text-slate-500 font-mono mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Gavel size={12} /> Verification Protocols
                        </div>
                        <div className="space-y-3">
                            {gradingSteps.map((step, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <div className={`p-1 rounded-full ${step.status === 'pass' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {step.status === 'pass' ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                                    </div>
                                    <div className={`font-mono ${step.status === 'pass' ? 'text-slate-300' : 'text-slate-400 line-through decoration-red-500/50'}`}>
                                        {step.criteria}
                                    </div>
                                    <div className="text-xs text-slate-600 font-mono hidden md:block border-l border-slate-800 pl-3">
                                        // {step.note}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Final Verdict Stamp */}
                <AnimatePresence>
                  {simState === 'complete' && result && (
                    <motion.div 
                      initial={{ scale: 2, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="absolute bottom-10 right-10 z-10 p-4 transform"
                    >
                      <motion.div 
                         animate={{ rotate: [0, -2, 2, -1, 0] }}
                         transition={{ delay: 0.2, duration: 0.3 }}
                         className={`border-4 rounded-lg p-4 font-black uppercase text-2xl tracking-widest backdrop-blur-md shadow-2xl flex flex-col items-center gap-2 ${
                           result.verdict.includes("PASS") 
                             ? "border-green-500 text-green-500 bg-green-950/40" 
                             : "border-red-500 text-red-500 bg-red-950/40"
                         }`}
                      >
                         {result.verdict.includes("PASS") ? (
                           <ShieldCheck size={48} strokeWidth={2.5} />
                         ) : (
                           <Skull size={48} strokeWidth={2.5} />
                         )}
                         <span>{result.verdict}</span>
                         <span className="text-xs font-mono font-normal tracking-normal opacity-70">
                           Score: {result.score}/3
                         </span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimulatorSection;
