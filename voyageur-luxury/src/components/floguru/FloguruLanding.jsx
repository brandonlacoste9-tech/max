import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Globe,
  Zap,
  Bot,
  ArrowRight,
  Check,
  Menu,
} from 'lucide-react';
import MaxActiveBrowser from './MaxActiveBrowser';
import AskMaxPanel from './AskMaxPanel';

const FEATURES = [
  {
    icon: Bot,
    title: 'Autonomous browsing',
    desc: 'Max navigates, fills forms, and clicks for you. Watch it work in real time.',
  },
  {
    icon: Globe,
    title: 'Omni-channel',
    desc: 'WhatsApp, Telegram, Discord, Slack. One AI, every channel.',
  },
  {
    icon: Shield,
    title: 'Your keys, your data',
    desc: 'BYOK and local options. Sovereignty without compromise.',
  },
];

const CTA_THOUGHTS = [
  'Clicking the submit button...',
  'Reading form fields...',
  'Filling in address...',
  'Checking availability...',
  'Navigating to checkout...',
];

/**
 * FloguruLanding — Dark futuristic landing with cyan/indigo gradients
 * and "Max Active" browser simulation. UI Pro Max + frontend-developer standards.
 */
const FloguruLanding = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const goToPricing = () => navigate('/pricing');
  const goToOnboarding = () => navigate('/pricing#onboarding');

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white font-body gold-edge-lighting"
      data-testid="floguru-landing"
    >
      {/* Background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,211,238,0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(99,102,241,0.1), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(34,211,238,0.08), transparent)',
        }}
      />

      {/* Nav */}
      <div className="relative">
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Shield className="h-5 w-5 text-cyan-400" aria-hidden />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Flo<span className="text-cyan-400">Guru</span>
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-sm text-white/60">
          <Link to="/" className="hover:text-cyan-400 transition-colors duration-200">Accueil</Link>
          <Link to="/dashboard" className="hover:text-cyan-400 transition-colors duration-200">Tableau de Bord</Link>
          <a href="#features" className="hover:text-cyan-400 transition-colors duration-200">Features</a>
          <Link to="/pricing" className="hover:text-cyan-400 transition-colors duration-200">Prix</Link>
          <Link to="/system-info" className="hover:text-cyan-400 transition-colors duration-200">Info Système</Link>
          <Link to="/pricing" className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors duration-200">Get started</Link>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute z-40 top-full left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="flex flex-col gap-4 p-6 text-sm text-white/60">
              <Link to="/" className="hover:text-cyan-400 transition-colors" onClick={() => setMobileNavOpen(false)}>Accueil</Link>
              <Link to="/dashboard" className="hover:text-cyan-400 transition-colors" onClick={() => setMobileNavOpen(false)}>Tableau de Bord</Link>
              <a href="#features" className="hover:text-cyan-400 transition-colors" onClick={() => setMobileNavOpen(false)}>Features</a>
              <Link to="/pricing" className="hover:text-cyan-400 transition-colors" onClick={() => setMobileNavOpen(false)}>Prix</Link>
              <Link to="/system-info" className="hover:text-cyan-400 transition-colors" onClick={() => setMobileNavOpen(false)}>Info Système</Link>
              <Link to="/pricing" className="rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-400 border border-cyan-500/30 w-fit" onClick={() => setMobileNavOpen(false)}>Get started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Hero */}
      <main className="relative z-10 pt-12 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-8">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Max is live
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your AI does the browsing.
              <span className="block text-cyan-400 mt-2">
                You stay in control.
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-xl">
              FloGuru runs tasks in the browser — forms, checkouts, research —
              while you watch. No screen recording. No puppeteer config. Just Max.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={goToPricing}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-black font-semibold hover:bg-cyan-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
              >
                Start free trial
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-white/90 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors duration-200"
              >
                See Max in action
              </button>
            </div>
          </motion.div>

          {/* Max Active browser simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MaxActiveBrowser thoughts={CTA_THOUGHTS} cycleMs={2500} />
            <p className="mt-4 text-center text-sm text-white/40">
              Autonomous browser control — no video required
            </p>
          </motion.div>
        </div>

        {/* Features */}
        <section
          id="features"
          className="pt-24 grid md:grid-cols-3 gap-8"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">
            Features
          </h2>
          {FEATURES.map((feat, i) => (
            <motion.article
              key={feat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm hover:border-cyan-500/20 transition-colors duration-200"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <feat.icon className="h-6 w-6 text-cyan-400" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
              <p className="text-white/60 leading-relaxed">{feat.desc}</p>
            </motion.article>
          ))}
        </section>

        {/* CTA strip */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to let Max work for you?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Start free. No credit card. Max runs in your browser, on your terms.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2 text-sm text-white/60">
              <Check className="h-4 w-4 text-emerald-400" aria-hidden />
              14-day free trial
            </span>
            <span className="flex items-center gap-2 text-sm text-white/60">
              <Check className="h-4 w-4 text-emerald-400" aria-hidden />
              BYOK supported
            </span>
            <span className="flex items-center gap-2 text-sm text-white/60">
              <Check className="h-4 w-4 text-emerald-400" aria-hidden />
              Cancel anytime
            </span>
          </div>
          <button
            type="button"
            onClick={goToOnboarding}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-4 text-black font-semibold text-lg hover:bg-cyan-400 transition-colors duration-200"
          >
            <Zap className="h-5 w-5" aria-hidden />
            Get started free
          </button>
        </motion.section>
      </main>

      {/* Ask Max — chat panel */}
      <AskMaxPanel />

      <footer className="relative z-10 py-12 border-t border-white/10 text-center text-sm text-white/40">
        <p>© {new Date().getFullYear()} FloGuru. Your keys, your data.</p>
        <Link to="/" className="mt-4 inline-block hover:text-cyan-400 transition-colors">
          ← Voyageur
        </Link>
      </footer>
    </div>
  );
};

export default FloguruLanding;
