import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Server,
  Cpu,
  HardDrive,
  Globe,
  Check,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';

/**
 * SystemInfoPage — Shows system requirements and current status
 * Helps users understand if their computer can run MAX locally
 */
const SystemInfoPage = () => {
  const [systemStatus, setSystemStatus] = useState({
    checking: true,
    os: null,
    ram: null,
    storage: null,
    browser: null,
    meetsRequirements: false,
  });

  useEffect(() => {
    // Simulate system check (in real app, this would check actual system specs)
    const checkSystem = () => {
      const userAgent = navigator.userAgent;
      const isWindows = userAgent.includes('Windows');
      const isMac = userAgent.includes('Mac');
      const isLinux = userAgent.includes('Linux');
      
      // Get approximate RAM (not available in JS, using navigator.deviceMemory if available)
      const ram = navigator.deviceMemory || 'unknown';
      
      // Check browser
      const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
      const isFirefox = userAgent.includes('Firefox');
      const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
      const isEdge = userAgent.includes('Edg');
      
      let browserName = 'Unknown';
      if (isChrome) browserName = 'Chrome';
      else if (isFirefox) browserName = 'Firefox';
      else if (isSafari) browserName = 'Safari';
      else if (isEdge) browserName = 'Edge';

      let osName = 'Unknown';
      if (isWindows) osName = 'Windows';
      else if (isMac) osName = 'macOS';
      else if (isLinux) osName = 'Linux';

      setSystemStatus({
        checking: false,
        os: osName,
        ram: ram,
        storage: 'Check below', // Can't detect storage in browser
        browser: browserName,
        meetsRequirements: isWindows || isMac || isLinux,
      });
    };

    setTimeout(checkSystem, 1000);
  }, []);

  const REQUIREMENTS = [
    {
      icon: HardDrive,
      title: 'Storage Space',
      required: '~15 GB free',
      description: 'AI models are large files (4-8 GB each). You need space for 3 models plus the application.',
      critical: true,
    },
    {
      icon: Server,
      title: 'RAM (Memory)',
      required: '8 GB minimum',
      recommended: '16 GB or more',
      description: 'AI models need RAM to run. More RAM = better performance and ability to run larger models.',
      critical: true,
    },
    {
      icon: Globe,
      title: 'Operating System',
      required: 'Windows 10/11, macOS 12+, or Linux',
      description: '64-bit operating system required. Windows users should run the installer as Administrator.',
      critical: true,
    },
    {
      icon: Cpu,
      title: 'Processor',
      required: '64-bit CPU',
      recommended: 'Modern multi-core (Intel i5/i7, AMD Ryzen, Apple Silicon)',
      description: 'AI processing is CPU-intensive. Faster processors = faster responses.',
      critical: false,
    },
  ];

  const MODELS_INFO = [
    {
      name: 'Llama 3.1',
      size: '~4.7 GB',
      purpose: 'General-purpose AI',
      useCase: 'Conversations, analysis, writing, coding help',
    },
    {
      name: 'Gemma 3',
      size: '~2.5 GB',
      purpose: 'Fast responses',
      useCase: 'Quick answers, simple tasks, low latency',
    },
    {
      name: 'Qwen Coder',
      size: '~4.4 GB',
      purpose: 'Programming',
      useCase: 'Code generation, debugging, technical tasks',
    },
  ];

  return (
    <div className="min-h-screen font-body bg-[#0C0A09] text-white gold-edge-lighting">
      <div className="fixed inset-0 bg-gradient-to-br from-[#8B000022] via-transparent to-[#C9A34F22] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Voyageur Luxury Home"
        >
          <div className="p-2 glass-card border-[#C9A34F]/40">
            <Shield className="w-6 h-6 text-[#C9A34F]" />
          </div>
          <span className="font-heading text-xl font-bold">
            VOYAGEUR <span className="text-[#C9A34F]">LUXURY</span>
          </span>
        </Link>
        <div className="flex gap-6 text-sm">
          <Link to="/" className="text-white/60 hover:text-[#C9A34F] transition-colors">
            Accueil
          </Link>
          <Link to="/dashboard" className="text-white/60 hover:text-[#C9A34F] transition-colors">
            Tableau de Bord
          </Link>
          <Link to="/floguru" className="text-white/60 hover:text-[#C9A34F] transition-colors">
            FloGuru
          </Link>
          <Link to="/pricing" className="text-white/60 hover:text-[#C9A34F] transition-colors">
            Prix
          </Link>
          <Link to="/system-info" className="text-[#C9A34F] font-semibold">
            Info Système
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A34F]/10 border border-[#C9A34F]/20 text-[#C9A34F] text-sm mb-6">
            <Info className="w-4 h-4" />
            System Information
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#C9A34F] mb-4">
            Can My Computer Run MAX?
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Running AI locally requires some disk space and memory. Here's what you need.
          </p>
        </motion.div>

        {/* Current System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#C9A34F]" />
              Your System
            </h2>
            
            {systemStatus.checking ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-white/60">Checking your system...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/60">Operating System</span>
                    <span className="font-semibold">{systemStatus.os}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/60">Browser</span>
                    <span className="font-semibold">{systemStatus.browser}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/60">Approximate RAM</span>
                    <span className="font-semibold">
                      {systemStatus.ram === 'unknown' ? 'Unknown (check below)' : `${systemStatus.ram} GB`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className={`text-center p-6 rounded-2xl border ${systemStatus.meetsRequirements ? 'border-green-500/30 bg-green-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                    {systemStatus.meetsRequirements ? (
                      <>
                        <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="font-bold text-green-400">Likely Compatible</p>
                        <p className="text-sm text-white/60 mt-1">Check storage space below</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                        <p className="font-bold text-yellow-400">Check Requirements</p>
                        <p className="text-sm text-white/60 mt-1">Your OS may not be supported</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* System Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">System Requirements</h2>
          <div className="space-y-4">
            {REQUIREMENTS.map((req, index) => (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-[#C9A34F]/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#C9A34F]/10">
                    <req.icon className="w-6 h-6 text-[#C9A34F]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{req.title}</h3>
                      {req.critical && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-3">{req.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-white/40">Minimum: </span>
                        <span className="font-semibold text-[#C9A34F]">{req.required}</span>
                      </div>
                      {req.recommended && (
                        <div>
                          <span className="text-white/40">Recommended: </span>
                          <span className="font-semibold text-green-400">{req.recommended}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Models Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">AI Models Included</h2>
          <p className="text-white/60 text-center mb-8 max-w-2xl mx-auto">
            These models are downloaded during installation. Each provides different capabilities.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {MODELS_INFO.map((model) => (
              <div
                key={model.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center hover:border-[#C9A34F]/30 transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                <p className="text-[#C9A34F] font-semibold mb-2">{model.size}</p>
                <p className="text-white/60 text-sm mb-3">{model.purpose}</p>
                <p className="text-white/40 text-xs">{model.useCase}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Storage Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="rounded-2xl border border-[#C9A34F]/20 bg-[#C9A34F]/5 p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-[#C9A34F]" />
              Storage Breakdown (~15 GB Total)
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Llama 3.1 (General AI)</span>
                <span className="font-mono">~4.7 GB</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Qwen Coder (Programming)</span>
                <span className="font-mono">~4.4 GB</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Gemma 3 (Fast responses)</span>
                <span className="font-mono">~2.5 GB</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Ollama Application</span>
                <span className="font-mono">~500 MB</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">FloGuru Application</span>
                <span className="font-mono">~500 MB</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Temporary/Update buffer</span>
                <span className="font-mono">~2+ GB</span>
              </div>
              <div className="flex items-center justify-between py-3 pt-4">
                <span className="font-bold text-[#C9A34F]">Total Recommended</span>
                <span className="font-bold font-mono text-[#C9A34F]">~15 GB</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            <details className="rounded-xl border border-white/10 bg-white/5 group">
              <summary className="p-6 cursor-pointer flex items-center justify-between">
                <span className="font-semibold">Can I install on an external drive?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/60">
                Currently, the Windows installer places files in your user directory. 
                External drive support is planned for a future update.
              </div>
            </details>
            <details className="rounded-xl border border-white/10 bg-white/5 group">
              <summary className="p-6 cursor-pointer flex items-center justify-between">
                <span className="font-semibold">What if I don't have 15 GB free?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/60">
                You can still use FloGuru with our cloud option (no local installation needed), 
                or install fewer AI models. Contact us for a minimal installation option.
              </div>
            </details>
            <details className="rounded-xl border border-white/10 bg-white/5 group">
              <summary className="p-6 cursor-pointer flex items-center justify-between">
                <span className="font-semibold">Can I delete models I don't use?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/60">
                Yes! You can remove any models through the Ollama interface to free up space. 
                You can always re-download them later.
              </div>
            </details>
            <details className="rounded-xl border border-white/10 bg-white/5 group">
              <summary className="p-6 cursor-pointer flex items-center justify-between">
                <span className="font-semibold">Is my data really private?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-white/60">
                Yes! When running locally, everything happens on your computer. 
                No data is sent to our servers or any third-party AI services. 
                Your conversations and files stay on your machine.
              </div>
            </details>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C9A34F] text-black font-bold hover:bg-[#d4af5a] transition-colors"
          >
            Back to Pricing
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default SystemInfoPage;
