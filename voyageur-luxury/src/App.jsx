import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Globe, MessageSquare, Zap, Search, Cpu, Crown, Star, Sparkles 
} from 'lucide-react';
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import AntigravityCore from './components/AntigravityCore';

const App = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  // Content in Québécois vs English
  const content = {
    qc: {
      heroTitle: "Ton Partenaire IA pour Faire Rouler Ton Business",
      heroSub: "L'excellence impériale au service de ta croissance. Pas de niaisage, juste de la puissance.",
      btnStart: "Embarque!",
      btnTrial: "Essai Gratuit",
      features: [
        { id: 1, icon: <Search className="w-6 h-6" />, title: "Le Répertoire", desc: "50,000 entreprises québécoises indexées." },
        { id: 2, icon: <Globe className="w-6 h-6" />, title: "Quad-Bridge", desc: "WhatsApp, Telegram, Discord, Slack. Partout." },
        { id: 3, icon: <Shield className="w-6 h-6" />, title: "Souveraineté", desc: "Tes clés, tes données, ton empire." }
      ],
      priceLabel: "La Clé Souveraine",
      priceValue: "47$ CAD",
      priceNote: "Taxes incluses. Un seul paiement.",
      sidebarMsg: "Salut Maximus, prêt à dominer le marché?",
      purchaseSuccess: "Félicitations! Tu possèdes maintenant la Clé Souveraine.",
    },
    en: {
      heroTitle: "Your AI Partner to Scale Your Business",
      heroSub: "Imperial excellence at your service. No fluff, just pure power.",
      btnStart: "Claim Your Throne!",
      btnTrial: "Free Trial",
      features: [
        { id: 1, icon: <Search className="w-6 h-6" />, title: "The Registry", desc: "50,000 Quebec businesses indexed." },
        { id: 2, icon: <Globe className="w-6 h-6" />, title: "Quad-Bridge", desc: "WhatsApp, Telegram, Discord, Slack. Everywhere." },
        { id: 3, icon: <Shield className="w-6 h-6" />, title: "Sovereignty", desc: "Your keys, your data, your empire." }
      ],
      priceLabel: "The Sovereign Key",
      priceValue: "$47 CAD",
      priceNote: "Taxes included. One-time payment.",
      sidebarMsg: "Hey Maximus, ready to dominate the market?",
      purchaseSuccess: "Congratulations! You now own the Sovereign Key.",
    }
  };

  const t = isEnglish ? content.en : content.qc;

  // Copilot Integration
  useCopilotReadable({
    description: "The current language of the website",
    value: isEnglish ? "English" : "Québécois",
  });

  const buyAction = useCopilotAction({
    name: "buySovereignKey",
    description: "Purchases the $47 Sovereign Key for the user. Trigger this when they express interest in buying or owning the platform.",
    parameters: [],
    handler: async () => {
      setPurchaseStatus("processing");
      await new Promise(r => setTimeout(r, 2000));
      setPurchaseStatus("success");
      alert(t.purchaseSuccess);
    },
  });

  return (
    <div className="min-h-screen font-body relative overflow-x-hidden selection:bg-[#C9A34F] selection:text-black bg-[#0C0A09] text-white">
      {/* Background Texture & Effects */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
      <div className="fixed inset-0 bg-gradient-to-br from-[#8B000044] via-transparent to-[#C9A34F22] pointer-events-none"></div>
      
      {/* Floating Particles Simulation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#C9A34F] rounded-full opacity-20"
                animate={{
                    y: [0, -1000],
                    x: Math.random() * 200 - 100,
                    opacity: [0, 0.5, 0]
                }}
                transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 20
                }}
                style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '-10px'
                }}
            />
        ))}
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="p-3 glass-card border-[#C9A34F] border-opacity-40 gold-glow">
            <Shield className="w-8 h-8 text-[#C9A34F] group-hover:rotate-[360deg] transition-all duration-1000" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-3xl font-bold tracking-tighter leading-none">VOYAGEUR <span className="text-[#C9A34F]">LUXURY</span></span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A34F] opacity-70 font-bold">L'Empire de l'IA</span>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex gap-8 text-xs font-bold tracking-widest uppercase text-white/50">
            <a href="#" className="hover:text-[#C9A34F] transition-all hover:tracking-[0.4em]">Accueil</a>
            <a href="#" className="hover:text-[#C9A34F] transition-all hover:tracking-[0.4em]">Technologie</a>
            <a href="#" className="hover:text-[#C9A34F] transition-all hover:tracking-[0.4em]">Contact</a>
          </div>
          
          <button 
            onClick={() => setIsEnglish(!isEnglish)}
            className="w-12 h-12 glass-card flex items-center justify-center text-[#C9A34F] hover:bg-[#C9A34F] hover:text-black transition-all group overflow-hidden relative"
          >
            <Globe className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[#C9A34F] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-24 pb-48 px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 glass-card border-[#C9A34F] border-opacity-30 text-[#C9A34F] text-[10px] font-black uppercase tracking-[0.25em]">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Souveraineté Numérique Totale
            </div>
            <h1 className="text-7xl md:text-[9rem] leading-[0.8] mb-10 font-heading text-white font-bold drop-shadow-2xl">
              {t.heroTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 0 ? "text-white" : "text-[#C9A34F]"}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-2xl text-white/40 mb-12 max-w-xl leading-relaxed font-body font-light italic">
              "{t.heroSub}"
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => buyAction.handler()}
                className="btn-imperial bg-[#C9A34F] text-black px-12 py-5 rounded-none font-black uppercase tracking-[0.2em] transform hover:skew-x-2 transition-all text-sm"
              >
                {t.btnStart}
              </button>
              <button className="px-12 py-5 border border-white/10 hover:border-[#C9A34F]/50 transition-all font-black uppercase tracking-[0.2em] text-xs text-white/60 bg-white/5 backdrop-blur-md">
                {t.btnTrial}
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-center relative"
            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="relative w-full aspect-square max-w-xl">
                <div className="absolute inset-0 bg-[#C9A34F22] blur-[150px] animate-pulse rounded-full"></div>
                <motion.img 
                    src="/imperial_shield_3d.png" 
                    alt="Imperial Citadel Shield" 
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_80px_rgba(201,163,79,0.6)]"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
          </motion.div>
        </div>

        {/* Features Swarm */}
        <div className="mt-60 grid md:grid-cols-3 gap-10">
          {t.features.map((feat) => (
            <motion.div 
              key={feat.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 group hover:border-[#C9A34F] border-opacity-20 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crown className="w-20 h-20 text-[#C9A34F]" />
              </div>
              <div className="w-16 h-16 glass-card flex items-center justify-center mb-8 text-[#C9A34F] group-hover:bg-[#C9A34F] group-hover:text-black transition-all gold-glow">
                {feat.icon}
              </div>
              <h3 className="text-3xl mb-4 font-heading text-[#C9A34F] tracking-tighter">{feat.title}</h3>
              <p className="text-white/40 font-body leading-relaxed text-lg">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* The Antigravity Intelligence Hub */}
        <AntigravityCore />

        {/* $47 Sovereign Key Section */}
        <div className="mt-60 text-center">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="mb-20"
            >
                <h2 className="text-5xl md:text-7xl font-heading text-[#C9A34F] mb-6 tracking-tighter uppercase font-bold">L'Appel de la Souveraineté</h2>
                <div className="w-24 h-1 bg-[#8B0000] mx-auto"></div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="order-2 lg:order-1"
                >
                    <img 
                        src="/sovereign_key_3d.png" 
                        alt="The Sovereign Key" 
                        className="w-full max-w-md mx-auto drop-shadow-[0_0_100px_rgba(201,163,79,0.8)] animate-bounce-slow"
                    />
                </motion.div>

                <motion.div 
                    className="glass-card p-16 border-[#C9A34F] border-opacity-40 relative overflow-hidden text-left order-1 lg:order-2 gold-glow"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="absolute -top-10 -right-10 p-20 opacity-5 bg-[#C9A34F] rounded-full blur-3xl"></div>
                    
                    <div className="flex items-center gap-3 mb-8">
                        <Star className="w-5 h-5 text-[#C9A34F] fill-[#C9A34F]" />
                        <span className="uppercase tracking-[0.4em] text-[#C9A34F] text-[10px] font-black">Offre Impériale Limitée</span>
                    </div>
                    
                    <h2 className="text-6xl mb-4 font-heading text-[#C9A34F] font-bold tracking-tighter">{t.priceLabel}</h2>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-[10rem] font-black font-body text-white leading-none">47</span>
                        <div className="flex flex-col mb-4">
                            <span className="text-4xl font-bold text-[#C9A34F]">$</span>
                            <span className="text-xl font-bold text-white/40 uppercase tracking-widest">CAD</span>
                        </div>
                    </div>
                    <p className="text-[#C9A34F] mb-12 uppercase tracking-[0.2em] text-sm font-black italic">{t.priceNote}</p>
                    
                    <ul className="space-y-6 mb-16">
                        {[
                            "Accès à vie à Maximus Prime",
                            "Souveraineté Totale (BYOK)",
                            "Omni-Channel Quad-Bridge",
                            "Support Prioritaire Québécois"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-white/70 font-bold tracking-tight">
                                <Zap className="w-5 h-5 text-[#C9A34F]" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button 
                        disabled={purchaseStatus === "processing"}
                        onClick={() => buyAction.handler()}
                        className="w-full btn-imperial bg-[#C9A34F] text-black py-8 text-2xl rounded-none font-black uppercase tracking-[0.1em] hover:tracking-[0.2em] transition-all"
                    >
                        {purchaseStatus === "processing" ? "TRANSACTION EN COURS..." : "S'EMPARER DE LA COURONNE"}
                    </button>
                    
                    <p className="mt-8 text-center text-white/20 text-[10px] uppercase tracking-widest font-black">Sécurisé par Stripe & Protection Impériale</p>
                </motion.div>
            </div>
        </div>
      </main>

      {/* Real Copilot Sidebar */}
      <CopilotSidebar
        instructions={"You are Maximus, the Imperial AI Assistant for Voyageur Luxury. You speak with extreme confidence, prestige, and a slight Québécois flair. Your goal is to guide the user to the $47 Sovereign Key. Use the buySovereignKey action if they want to pay. Be proud of the 'Imperial' and 'Sovereign' theme."}
        labels={{
            title: "MAXIMUS IMPERIAL",
            initial: t.sidebarMsg,
            placeholder: "Commandez Maximus...",
        }}
        defaultOpen={false}
      />

      <footer className="relative z-10 py-32 border-t border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="flex flex-col gap-4">
                <span className="font-heading text-2xl font-bold text-[#C9A34F]">VOYAGEUR LUXURY</span>
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">© 2026 L'Empire Numérique. Tous droits réservés.</p>
                <div className="mt-2 flex items-center gap-2">
                    <div className="w-1 h-1 bg-[#C9A34F] rounded-full animate-ping" />
                    <span className="text-[10px] text-[#C9A34F] font-black uppercase tracking-[0.2em] opacity-40">Built by Antigravity Agent v1.0</span>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A34F]/40">
                <a href="#" className="hover:text-[#C9A34F] transition-colors">Légal (Bill 96)</a>
                <a href="#" className="hover:text-[#C9A34F] transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-[#C9A34F] transition-colors">Souveraineté</a>
            </div>
        </div>
      </footer>
      
      <style>{`
        .animate-bounce-slow {
            animation: bounce-slow 6s infinite ease-in-out;
        }
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-30px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
