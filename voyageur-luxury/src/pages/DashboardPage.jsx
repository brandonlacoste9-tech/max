import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import AskMaxPanel from '../components/floguru/AskMaxPanel';

const DashboardPage = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
  <div className="min-h-screen font-body bg-[#0C0A09] text-white gold-edge-lighting">
    <div className="relative">
    <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
      <Link
        to="/"
        className="flex items-center gap-4 group cursor-pointer"
        aria-label="Retour à l'accueil"
      >
        <div className="p-3 glass-card border-[#C9A34F] border-opacity-40 gold-glow">
          <Shield className="w-8 h-8 text-[#C9A34F] group-hover:rotate-[360deg] transition-all duration-1000" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-2xl font-bold tracking-tighter leading-none">
            VOYAGEUR <span className="text-[#C9A34F]">LUXURY</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A34F] opacity-70 font-bold">
            Tableau de Bord
          </span>
        </div>
      </Link>
      <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-white/50">
        <Link to="/" className="hover:text-[#C9A34F] transition-all cursor-pointer">
          Accueil
        </Link>
        <Link
          to="/dashboard"
          className={`hover:text-[#C9A34F] transition-all cursor-pointer ${isDashboard ? 'text-[#C9A34F]' : ''}`}
          aria-current={isDashboard ? 'page' : undefined}
        >
          Tableau de Bord
        </Link>
        <Link to="/floguru" className="hover:text-[#C9A34F] transition-all cursor-pointer">
          FloGuru
        </Link>
        <Link to="/pricing" className="hover:text-[#C9A34F] transition-all cursor-pointer">
          Prix
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="lg:hidden w-10 h-10 glass-card flex items-center justify-center text-[#C9A34F] hover:bg-[#C9A34F] hover:text-black transition-all cursor-pointer"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </nav>
    <AnimatePresence>
      {mobileNavOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden absolute z-40 top-full left-0 right-0 bg-[#0C0A09]/95 backdrop-blur-xl border-b border-white/10"
        >
          <div className="flex flex-col gap-4 p-6 text-xs font-bold tracking-widest uppercase text-white/50">
            <Link to="/" className="hover:text-[#C9A34F] transition-all" onClick={() => setMobileNavOpen(false)}>Accueil</Link>
            <Link to="/dashboard" className="hover:text-[#C9A34F] transition-all" onClick={() => setMobileNavOpen(false)}>Tableau de Bord</Link>
            <Link to="/floguru" className="hover:text-[#C9A34F] transition-all" onClick={() => setMobileNavOpen(false)}>FloGuru</Link>
            <Link to="/pricing" className="hover:text-[#C9A34F] transition-all" onClick={() => setMobileNavOpen(false)}>Prix</Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
    <Dashboard />
    <AskMaxPanel />
  </div>
  );
};

export default DashboardPage;
