import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, Shield, Search, Database } from 'lucide-react';

const AntigravityCore = () => {
    const [status, setStatus] = useState('active');
    const [leads, setLeads] = useState([
        { id: 1, name: "Pure Plomberie inc.", phone: "514-xxx-xxxx", rating: 4.7, status: "INDEXED" },
        { id: 2, name: "Precision Plumbing", phone: "(514) 209-3489", rating: 4.9, status: "INDEXED" },
        { id: 3, name: "Plomberie EAU MEGA", phone: "(514) 813-0032", rating: 4.9, status: "INDEXED" }
    ]);

    return (
        <div className="mt-40 max-w-7xl mx-auto px-8">
            <div className="flex items-center gap-6 mb-12">
                <div className="relative">
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-[#C9A34F] rounded-full blur-xl"
                    />
                    <div className="relative glass-card p-4 bg-black/40 border-[#C9A34F]">
                        <Cpu className="w-10 h-10 text-[#C9A34F]" />
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-heading font-bold text-white tracking-tighter uppercase">
                        ANTIGRAVITY <span className="text-[#C9A34F]">CORE</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                        <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Assistant Maximus : EN LIGNE</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Status Panel */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="glass-card p-8 border-white/5 bg-white/5 relative overflow-hidden flex-1">
                        <div className="absolute top-0 right-0 p-4">
                            <Shield className="w-12 h-12 text-[#C9A34F] opacity-10" />
                        </div>
                        <h3 className="text-[#C9A34F] font-black uppercase tracking-[0.2em] text-xs mb-6">Système de Bord</h3>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/40 text-[10px] uppercase font-bold">Modèle Principal</span>
                                <span className="text-xs font-black text-white tracking-widest">Gemini 2.5 Pro (FloGuru)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/40 text-[10px] uppercase font-bold">Mémoire Vectorielle</span>
                                <span className="text-xs font-black text-[#C9A34F] tracking-widest underline decoration-dotted">LanceDB (Sovereign)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/40 text-[10px] uppercase font-bold">Observabilité</span>
                                <span className="text-xs font-black text-white tracking-widest">Arize Tracing</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-black/40 border border-[#8B0000]/30 border-l-4 border-l-[#8B0000]">
                            <p className="text-[10px] text-white/60 font-medium italic underline decoration-red-500/30">
                                "Le Cheval de Troie est en place. 50,000 cibles québécoises en cours d'indexation."
                            </p>
                        </div>
                    </div>

                    {/* Scrolling Log Terminal */}
                    <div className="glass-card p-4 bg-black border-white/5 font-mono text-[9px] h-40 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10" />
                        <div className="text-[#C9A34F] opacity-50 space-y-1 animate-scroll-text">
                            <div>[SYS] FloGuru Sovereign Agent v1.0 Initialized...</div>
                            <div>[NET] Handshake with LanceDB Cloud: SUCCESS</div>
                            <div>[AI] Loading Imperial Decision Matrix...</div>
                            <div>[SWARM] Scout Bee dispatched to Google Maps Montreal</div>
                            <div>[SQL] SELECT * FROM leads WHERE niche='plumbing'</div>
                            <div>[MEM] Ingesting 5 record batches into my_table3</div>
                            <div>[SEC] Encryption layer secure (AES-256)</div>
                            <div>[UI] Rendering Imperial Red & Gold interfaces</div>
                            <div>[INFO] Quebec Business Registry sync: 41% complete</div>
                            <div>[WARN] High-frequency queries detected (Scout Bee)</div>
                            <div>[SUCCESS] Trojan Horse deployed successfully</div>
                        </div>
                    </div>
                </div>

                {/* Real-time Feed */}
                <div className="lg:col-span-2 glass-card p-8 border-white/5 bg-black/40 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-[#C9A34F]" />
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs underline decoration-[#C9A34F]">Dernières Extractions (Scout Bee)</h3>
                        </div>
                        <motion.div 
                            animate={{ opacity: [1, 0.4, 1] }} 
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-[10px] text-white/30 font-bold"
                        >
                            SYNC LIVE...
                        </motion.div>
                    </div>

                    <div className="grid gap-4">
                        {leads.map((lead, i) => (
                            <motion.div 
                                key={lead.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-[#C9A34F]/30 transition-all cursor-crosshair"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 flex items-center justify-center font-black text-[#C9A34F] glass-card text-xs">
                                        0{i+1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white group-hover:text-[#C9A34F] transition-colors">{lead.name}</div>
                                        <div className="text-[10px] text-white/30 font-medium tracking-widest uppercase">{lead.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs font-black text-[#C9A34F]">{lead.rating} ⭐</div>
                                        <div className="text-[8px] text-green-500 font-bold tracking-tighter">{lead.status}</div>
                                    </div>
                                    <Zap className="w-4 h-4 text-[#C9A34F] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                        <span>Capacité de Scan : 50,000 / jour</span>
                        <div className="flex gap-2">
                             <div className="w-1.5 h-1.5 bg-[#C9A34F] rounded-full animate-ping"></div>
                             <span>Signal Maximus Stable</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .animate-scroll-text {
                    animation: scroll-text 20s linear infinite;
                }
                @keyframes scroll-text {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-100%); }
                }
                .cursor-crosshair {
                    cursor: crosshair;
                }
                .gold-glow {
                    box-shadow: 0 0 20px rgba(201,163,79,0.1);
                }
            `}</style>
        </div>
    );
};

export default AntigravityCore;
