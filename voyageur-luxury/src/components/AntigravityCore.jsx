import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Cpu, Zap, Activity, Shield, Database, Crosshair, ArrowUpRight } from 'lucide-react';

// --- IMPERIAL UTILS ---
const generateLead = (id) => {
    const names = ["Toiture Elite", "Plomberie Royal", "Electro-Volt QC", "Construction 360", "Design V"];
    const phones = ["514", "450", "438"];
    return {
        id: Date.now() + Math.random(),
        name: names[Math.floor(Math.random() * names.length)],
        phone: `(${phones[Math.floor(Math.random() * phones.length)]}) ${Math.floor(Math.random() * 899) + 100}-${Math.floor(Math.random() * 8999) + 1000}`,
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        status: Math.random() > 0.7 ? "GOLD TIER" : "INDEXED",
        value: Math.floor(Math.random() * 10000)
    };
};

// --- PHYSICS COMPONENT: THE GRAVITY WELL ---
const ZeroGItem = ({ lead, index }) => {
    // Randomized float parameters for "Organic Drift"
    const randomDuration = 3 + Math.random() * 2;
    const randomY = 5 + Math.random() * 10;
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                // The "Float" Effect - Subtle breathing motion
                y: [0, -randomY, 0],
            }}
            exit={{ opacity: 0, scale: 0.8, x: -50 }}
            transition={{ 
                layout: { type: "spring", stiffness: 300, damping: 30 },
                y: { duration: randomDuration, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: "0px 10px 30px -10px rgba(201,163,79,0.3)",
                zIndex: 10
            }}
            className={`
                group relative flex items-center justify-between p-4 mb-3 
                backdrop-blur-md border transition-colors cursor-crosshair
                ${lead.status === "GOLD TIER" 
                    ? "bg-[#C9A34F]/10 border-[#C9A34F]/50 shadow-[0_0_15px_rgba(201,163,79,0.1)]" 
                    : "bg-white/5 border-white/5 hover:border-[#C9A34F]/30"}
            `}
        >
            {/* Lead Data */}
            <div className="flex items-center gap-4">
                <div className={`
                    w-10 h-10 flex items-center justify-center font-black text-xs rounded-sm
                    ${lead.status === "GOLD TIER" ? "bg-[#C9A34F] text-black" : "bg-white/10 text-white/50"}
                `}>
                    {index + 1}
                </div>
                <div>
                    <div className="text-sm font-bold text-white group-hover:text-[#C9A34F] transition-colors">
                        {lead.name}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/30 font-medium tracking-widest uppercase">
                            {lead.phone}
                        </span>
                        {lead.status === "GOLD TIER" && (
                            <span className="text-[8px] bg-[#C9A34F] text-black px-1 font-black rounded-sm">VIP</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Side */}
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-xs font-black text-[#C9A34F]">{lead.rating} ⭐</div>
                    <div className="text-[8px] text-green-500 font-bold tracking-tighter animate-pulse">LIVE</div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-[#C9A34F] hover:text-black text-[#C9A34F] rounded-full transition-colors"
                >
                    <ArrowUpRight className="w-4 h-4" />
                </motion.button>
            </div>
            
            {/* Corner Accent for "Tech" feel */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#C9A34F]/30" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#C9A34F]/30" />
        </motion.div>
    );
};

const AntigravityCore = () => {
    // The "Live Feed" State
    const [leads, setLeads] = useState([
        { id: 1, name: "Souverain Construction", phone: "514-000-0001", rating: 5.0, status: "GOLD TIER" },
        { id: 2, name: "Voyageur Transport", phone: "450-555-0199", rating: 4.8, status: "INDEXED" },
        { id: 3, name: "Imperial Tech", phone: "438-999-8888", rating: 4.9, status: "GOLD TIER" }
    ]);

    const [isScanning, setIsScanning] = useState(true);
    const scrollRef = useRef(null);

    // LIVE INJECTOR: Simulates incoming data stream (The "Feed")
    useEffect(() => {
        if (!isScanning) return;

        const interval = setInterval(() => {
            setLeads(prev => {
                const newLead = generateLead();
                // Keep only last 5 items to maintain "Luxury" density (Anti-Clutter)
                const newFeed = [newLead, ...prev].slice(0, 5);
                return newFeed;
            });
        }, 3500); // New lead every 3.5s

        return () => clearInterval(interval);
    }, [isScanning]);

    return (
        <div className="mt-40 max-w-7xl mx-auto px-8">
            {/* HEADER: CONTROL DECK */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border border-dashed border-[#C9A34F]/30 rounded-full"
                        />
                        <div className="relative glass-card p-4 bg-black/40 border-[#C9A34F] shadow-[0_0_30px_rgba(201,163,79,0.2)]">
                            <Cpu className="w-10 h-10 text-[#C9A34F]" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-heading font-bold text-white tracking-tighter uppercase">
                            ANTIGRAVITY <span className="text-[#C9A34F]">CORE</span>
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                            <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">
                                Physics Engine: <span className="text-white">ACTIVE (v2.0)</span>
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* MANUAL OVERRIDE SWITCH */}
                <button 
                    onClick={() => setIsScanning(!isScanning)}
                    className={`
                        px-6 py-3 font-bold text-xs uppercase tracking-widest border transition-all
                        ${isScanning 
                            ? "bg-[#C9A34F]/10 border-[#C9A34F] text-[#C9A34F]" 
                            : "bg-red-500/10 border-red-500 text-red-500"}
                    `}
                >
                    {isScanning ? "STOP SCAN" : "RESUME FEED"}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* LEFT: SYSTEM METRICS (The Brain) */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="glass-card p-8 border-white/5 bg-white/5 relative overflow-hidden flex-1">
                        <div className="absolute top-0 right-0 p-4">
                            <Shield className="w-12 h-12 text-[#C9A34F] opacity-10 animate-pulse" />
                        </div>
                        <h3 className="text-[#C9A34F] font-black uppercase tracking-[0.2em] text-xs mb-6">Paramètres Physiques</h3>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/40 text-[10px] uppercase font-bold">Gravity Constant</span>
                                <span className="text-xs font-black text-white tracking-widest">-9.8 m/s² (INVERTED)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/40 text-[10px] uppercase font-bold">Density Limit</span>
                                <span className="text-xs font-black text-[#C9A34F] tracking-widest">5 UNITS (LUXURY)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <span className="text-white/40 text-[10px] uppercase font-bold">Lead Velocity</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                    <span className="text-xs font-black text-white tracking-widest">HIGH</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-black/40 border border-[#C9A34F]/30 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#C9A34F]/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                            <p className="text-[10px] text-white/60 font-medium italic relative z-10">
                                "Visual Engine running in `Float` mode. High-value assets are prioritizing Z-Index."
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: THE GLASS WALL (The Feed) */}
                <div className="lg:col-span-2 glass-card p-8 border-white/5 bg-black/40 relative overflow-hidden min-h-[500px]">
                    {/* Feed Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-[#C9A34F]" />
                            <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">
                                Live Extraction Feed
                            </h3>
                        </div>
                        <div className="text-[10px] text-white/30 font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#C9A34F] rounded-full animate-pulse" />
                            REALTIME
                        </div>
                    </div>

                    {/* THE PHYSICS CONTAINER */}
                    <div className="relative">
                        <AnimatePresence mode="popLayout">
                            {leads.map((lead, i) => (
                                <ZeroGItem key={lead.id} lead={lead} index={i} />
                            ))}
                        </AnimatePresence>
                        
                        {/* Empty State / Loading */}
                        {leads.length === 0 && (
                            <div className="text-center py-20 text-white/20 text-xs uppercase tracking-widest animate-pulse">
                                Scanning Frequency...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .cursor-crosshair { cursor: crosshair; }
            `}</style>
        </div>
    );
};

export default AntigravityCore;
