import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Check,
  Key,
  Server,
  ArrowRight,
} from 'lucide-react';
import AskMaxPanel from '../components/floguru/AskMaxPanel';

const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    desc: 'Try FloGuru and use it a bit each month.',
    sub: 'Great for testing it out or using it now and then.',
  },
  {
    id: 'pro',
    name: 'FloGuru Pro',
    price: '$20/month',
    desc: 'For people who use FloGuru regularly.',
    sub: 'Everything unlocked, runs faster, works better.',
    cta: 'Start Pro (14 days free)',
    featured: true,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    desc: 'Use your own AI account or run it on your own computer.',
    sub: 'Only for people who know what API keys and models are.',
    cta: 'Self-host / BYOK',
  },
];

const ONBOARDING_OPTIONS = [
  {
    id: 'recommended',
    title: 'Just make it work (recommended)',
    desc: 'FloGuru uses its own AI. Nothing to set up.',
    icon: Zap,
  },
  {
    id: 'byok',
    title: 'Use my own AI account',
    desc: 'For developers who already have OpenAI, Gemini, etc.',
    icon: Key,
  },
  {
    id: 'local',
    title: 'Run it on my computer',
    desc: 'Use Ollama to keep everything local. Free forever.',
    icon: Server,
    requirements: {
      storage: '~15 GB free space',
      ram: '8 GB minimum',
      os: 'Windows 10/11, macOS, or Linux',
      note: 'AI models are large files (4-8 GB each)',
    },
  },
];

const PricingPage = () => {
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
  useEffect(() => {
    if (window.location.hash === '#onboarding') {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCta = (tierId) => {
    if (tierId === 'free') return;
    document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Placeholder: in production, POST to API
  };

  return (
    <div className="min-h-screen font-body bg-[#0C0A09] text-white gold-edge-lighting">
      <div className="fixed inset-0 bg-gradient-to-br from-[#8B000022] via-transparent to-[#C9A34F22] pointer-events-none" />

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
          <Link to="/floguru" className="text-white/60 hover:text-[#C9A34F] transition-colors">
            FloGuru
          </Link>
          <Link to="/system-info" className="text-white/60 hover:text-[#C9A34F] transition-colors">
            System Info
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#C9A34F] mb-4">
            Pricing
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Choose the plan that fits. No surprises.
          </p>
        </motion.div>

        {/* Pricing tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {PRICING_TIERS.map((tier) => (
            <motion.article
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                tier.featured
                  ? 'border-[#C9A34F] bg-[#C9A34F]/5 gold-glow'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C9A34F] text-black text-xs font-bold uppercase">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              {tier.price && (
                <p className="text-3xl font-black text-[#C9A34F] mb-4">
                  {tier.price}
                </p>
              )}
              <p className="text-white/80 mb-2">{tier.desc}</p>
              <p className="text-white/50 text-sm mb-6">{tier.sub}</p>
              {tier.cta && (
                <button
                  type="button"
                  onClick={() => handleCta(tier.id)}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
                    tier.featured
                      ? 'bg-[#C9A34F] text-black hover:bg-[#d4af5a]'
                      : 'border border-white/20 hover:border-[#C9A34F]/50'
                  }`}
                >
                  {tier.cta}
                </button>
              )}
            </motion.article>
          ))}
        </div>

        {/* Onboarding: How do you want FloGuru to run? */}
        <section
          id="onboarding"
          className="scroll-mt-24"
          aria-labelledby="onboarding-heading"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              id="onboarding-heading"
              className="text-3xl md:text-4xl font-heading font-bold text-[#C9A34F] mb-4"
            >
              How do you want FloGuru to run?
            </h2>
            <p className="text-white/60">
              Pick one to get started — you can change this later.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {ONBOARDING_OPTIONS.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedOnboarding(opt.id)}
                className={`text-left p-6 rounded-2xl border transition-all ${
                  selectedOnboarding === opt.id
                    ? 'border-[#C9A34F] bg-[#C9A34F]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <opt.icon className="w-8 h-8 text-[#C9A34F] mb-4" />
                <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
                <p className="text-white/60 text-sm">{opt.desc}</p>
                {selectedOnboarding === opt.id && (
                  <Check className="w-5 h-5 text-[#C9A34F] mt-4" />
                )}
                {/* Show system requirements for local option */}
                {opt.requirements && selectedOnboarding === opt.id && (
                  <div className="mt-4 pt-4 border-t border-[#C9A34F]/20">
                    <p className="text-xs font-semibold text-[#C9A34F] mb-2">System Requirements:</p>
                    <ul className="text-xs text-white/50 space-y-1">
                      <li>💾 Storage: {opt.requirements.storage}</li>
                      <li>🧠 RAM: {opt.requirements.ram}</li>
                      <li>🖥️ OS: {opt.requirements.os}</li>
                    </ul>
                    <p className="text-xs text-white/40 mt-2 italic">{opt.requirements.note}</p>
                    <Link 
                      to="/system-info" 
                      className="inline-flex items-center gap-1 mt-3 text-xs text-[#C9A34F] hover:text-[#d4af5a] transition-colors"
                    >
                      View detailed requirements →
                    </Link>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Signup / next step */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            {submitted ? (
              <div className="text-center p-8 rounded-2xl border border-[#C9A34F]/30 bg-[#C9A34F]/5">
                <Check className="w-12 h-12 text-[#C9A34F] mx-auto mb-4" />
                <p className="font-bold text-lg">You're on the list.</p>
                <p className="text-white/60 text-sm mt-2">
                  We'll email you when we're ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <label htmlFor="signup-email" className="sr-only">
                  Email for early access
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A34F] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#C9A34F] text-black font-bold hover:bg-[#d4af5a] transition-colors"
                >
                  Get early access
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 py-12 border-t border-white/10 text-center text-sm text-white/40">
        <Link to="/" className="hover:text-[#C9A34F] transition-colors">
          ← Back to home
        </Link>
      </footer>

      <AskMaxPanel />
    </div>
  );
};

export default PricingPage;
