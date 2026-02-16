import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  Check,
  X,
  Key,
  Server,
  ArrowRight,
  Settings,
  Menu,
} from 'lucide-react';
import AskMaxPanel from '../components/floguru/AskMaxPanel';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'floguru@gmail.com';

const content = {
  qc: {
    title: 'Prix',
    subtitle: 'Choisis le forfait qui te convient. Pas de surprises.',
    tiers: [
      {
        id: 'free',
        name: 'Gratuit',
        price: '0$',
        desc: 'Essaie FloGuru un peu chaque mois.',
        sub: 'Parfait pour tester ou utiliser de temps en temps.',
        cta: 'Commencer',
        limits: [
          { label: '50 tâches/mois', included: true },
          { label: '1 canal (WhatsApp ou Telegram)', included: true },
          { label: 'Répertoire (lecture seule)', included: true },
          { label: 'Support communautaire', included: true },
          { label: 'Automatisation navigateur', included: false },
          { label: 'Support prioritaire', included: false },
        ],
      },
      {
        id: 'starter',
        name: 'Starter',
        price: '19$/mois',
        desc: 'Pour ceux qui utilisent FloGuru régulièrement.',
        sub: 'Tout débloqué, plus rapide, meilleur.',
        cta: 'Démarrer Starter',
        featured: true,
        limits: [
          { label: '500 tâches/mois', included: true },
          { label: '2 canaux', included: true },
          { label: 'Répertoire + export', included: true },
          { label: 'Automatisation navigateur', included: true },
          { label: 'Support par courriel', included: true },
          { label: 'Support prioritaire', included: false },
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '35$/mois',
        desc: 'Pleine puissance pour l\'automatisation sérieuse.',
        sub: 'Support prioritaire, plus de capacité, fonctionnalités avancées.',
        cta: 'Démarrer Pro',
        limits: [
          { label: '2 000 tâches/mois', included: true },
          { label: 'Tous les canaux (Quad-Bridge)', included: true },
          { label: 'Répertoire + scoring de leads', included: true },
          { label: 'Automatisation navigateur', included: true },
          { label: 'Support prioritaire', included: true },
          { label: 'Accès API', included: true },
        ],
      },
      {
        id: 'enterprise',
        name: 'Cadre supérieur',
        price: 'Sur mesure',
        desc: 'Support dédié, intégrations personnalisées, SLA.',
        sub: 'Pour les équipes et organisations avec des besoins spécifiques.',
        cta: 'Nous contacter',
        limits: [
          { label: 'Tâches illimitées', included: true },
          { label: 'Tous les canaux', included: true },
          { label: 'Intégrations personnalisées', included: true },
          { label: 'Support dédié', included: true },
          { label: 'Garantie SLA', included: true },
          { label: 'Option sur site', included: true },
        ],
      },
      {
        id: 'tokens',
        name: 'Paiement à l\'usage',
        price: 'Pay as you go',
        desc: 'Apporte tes clés. Paie seulement pour les tokens utilisés.',
        sub: 'OpenAI, Gemini, Ollama — tu contrôles le modèle et le coût.',
        cta: 'Configurer BYOK',
        limits: [
          { label: 'Tâches illimitées (ton API)', included: true },
          { label: 'Tous les canaux', included: true },
          { label: 'Accès complet au répertoire', included: true },
          { label: 'Auto-hébergé ou cloud', included: true },
          { label: 'Support communautaire', included: true },
          { label: 'Pas de plafond', included: true },
        ],
      },
    ],
    onboardingTitle: 'Comment veux-tu faire tourner FloGuru?',
    onboardingSub: 'Choisis une option pour commencer — tu pourras changer plus tard.',
    aiNameLabel: 'Nomme ton IA',
    aiNamePlaceholder: 'ex. Max, Mon assistant, Coco…',
    onboardingOptions: [
      { id: 'recommended', title: 'Que ça marche (recommandé)', desc: 'FloGuru utilise sa propre IA. Rien à configurer.', icon: Zap },
      { id: 'byok', title: 'Utiliser mon compte IA', desc: 'Pour les devs qui ont déjà OpenAI, Gemini, etc.', icon: Key },
      { id: 'local', title: 'L\'exécuter sur mon ordi', desc: 'Utilise Ollama pour tout garder local.', icon: Server },
    ],
    signupSuccess: 'Tu es sur la liste.',
    signupSub: (name) => name ? `Ton IA s'appellera ${name}. On t'écrira quand on sera prêts.` : "On t'écrira quand on sera prêts.",
    signupCta: 'Obtenir l\'accès anticipé',
    emailPlaceholder: 'toi@exemple.com',
    backHome: '← Retour à l\'accueil',
    popular: 'Populaire',
  },
  en: {
    title: 'Pricing',
    subtitle: 'Choose the plan that fits. No surprises.',
    tiers: [
      {
        id: 'free',
        name: 'Free',
        price: '$0',
        desc: 'Try FloGuru and use it a bit each month.',
        sub: 'Great for testing it out or using it now and then.',
        cta: 'Get started',
        limits: [
          { label: '50 tasks/month', included: true },
          { label: '1 channel (WhatsApp or Telegram)', included: true },
          { label: 'Directory search (read-only)', included: true },
          { label: 'Community support', included: true },
          { label: 'Browser automation', included: false },
          { label: 'Priority support', included: false },
        ],
      },
      {
        id: 'starter',
        name: 'Starter',
        price: '$19/month',
        desc: 'For people who use FloGuru regularly.',
        sub: 'Everything unlocked, runs faster, works better.',
        cta: 'Start Starter',
        featured: true,
        limits: [
          { label: '500 tasks/month', included: true },
          { label: '2 channels', included: true },
          { label: 'Directory search + export', included: true },
          { label: 'Browser automation', included: true },
          { label: 'Email support', included: true },
          { label: 'Priority support', included: false },
        ],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$35/month',
        desc: 'Full power for serious automation.',
        sub: 'Priority support, more capacity, advanced features.',
        cta: 'Start Pro',
        limits: [
          { label: '2,000 tasks/month', included: true },
          { label: 'All channels (Quad-Bridge)', included: true },
          { label: 'Directory + lead scoring', included: true },
          { label: 'Browser automation', included: true },
          { label: 'Priority support', included: true },
          { label: 'API access', included: true },
        ],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        desc: 'Dedicated support, custom integrations, SLA.',
        sub: 'For teams and organizations with specific needs.',
        cta: 'Contact us',
        limits: [
          { label: 'Unlimited tasks', included: true },
          { label: 'All channels', included: true },
          { label: 'Custom integrations', included: true },
          { label: 'Dedicated support', included: true },
          { label: 'SLA guarantee', included: true },
          { label: 'On-premise option', included: true },
        ],
      },
      {
        id: 'tokens',
        name: 'Pay for tokens',
        price: 'Pay as you go',
        desc: 'Bring your own keys. Pay only for tokens you use.',
        sub: 'OpenAI, Gemini, Ollama — you control the model and the cost.',
        cta: 'Set up BYOK',
        limits: [
          { label: 'Unlimited tasks (your API)', included: true },
          { label: 'All channels', included: true },
          { label: 'Full directory access', included: true },
          { label: 'Self-hosted or cloud', included: true },
          { label: 'Community support', included: true },
          { label: 'No usage caps', included: true },
        ],
      },
    ],
    onboardingTitle: 'How do you want FloGuru to run?',
    onboardingSub: 'Pick one to get started — you can change this later.',
    aiNameLabel: 'Name your AI',
    aiNamePlaceholder: 'e.g. Max, My assistant, Coco…',
    onboardingOptions: [
      { id: 'recommended', title: 'Just make it work (recommended)', desc: 'FloGuru uses its own AI. Nothing to set up.', icon: Zap },
      { id: 'byok', title: 'Use my own AI account', desc: 'For developers who already have OpenAI, Gemini, etc.', icon: Key },
      { id: 'local', title: 'Run it on my computer', desc: 'Use Ollama to keep everything local.', icon: Server },
    ],
    signupSuccess: "You're on the list.",
    signupSub: (name) => name ? `Your AI will be called ${name}. We'll email you when we're ready.` : "We'll email you when we're ready.",
    signupCta: 'Get early access',
    emailPlaceholder: 'you@example.com',
    backHome: '← Back to home',
    popular: 'Popular',
  },
};

const PricingPage = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showOtherLang, setShowOtherLang] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
  const [aiName, setAiName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#onboarding') {
      document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const t = isEnglish ? content.en : content.qc;

  const handleCta = (tierId) => {
    if (tierId === 'free') return;
    if (tierId === 'enterprise') {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=Enterprise%20inquiry`;
      return;
    }
    document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In production: POST { email, aiName, selectedOnboarding } to API
  };

  const navLinks = (
    <>
      <Link to="/" className="text-white/60 hover:text-[#C9A34F] transition-colors" onClick={() => setMobileNavOpen(false)}>
        Accueil
      </Link>
      <Link to="/dashboard" className="text-white/60 hover:text-[#C9A34F] transition-colors" onClick={() => setMobileNavOpen(false)}>
        Tableau de Bord
      </Link>
      <Link to="/floguru" className="text-white/60 hover:text-[#C9A34F] transition-colors" onClick={() => setMobileNavOpen(false)}>
        FloGuru
      </Link>
      <Link to="/system-info" className="text-white/60 hover:text-[#C9A34F] transition-colors" onClick={() => setMobileNavOpen(false)}>
        Info Système
      </Link>
    </>
  );

  return (
    <div className="min-h-screen font-body bg-[#0C0A09] text-white gold-edge-lighting">
      <div className="fixed inset-0 bg-gradient-to-br from-[#8B000022] via-transparent to-[#C9A34F22] pointer-events-none" />

      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-3" aria-label="Voyageur Luxury Home">
          <div className="p-2 glass-card border-[#C9A34F]/40">
            <Shield className="w-6 h-6 text-[#C9A34F]" />
          </div>
          <span className="font-heading text-xl font-bold">
            VOYAGEUR <span className="text-[#C9A34F]">LUXURY</span>
          </span>
        </Link>

        <div className="hidden lg:flex gap-6 text-sm">
          {navLinks}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 glass-card flex items-center justify-center text-[#C9A34F] hover:bg-[#C9A34F] hover:text-black transition-all cursor-pointer"
            aria-label="Paramètres"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden w-10 h-10 glass-card flex items-center justify-center text-[#C9A34F] hover:bg-[#C9A34F] hover:text-black transition-all cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute z-40 top-full left-0 right-0 bg-[#0C0A09]/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="flex flex-col gap-4 p-6 text-sm">
              {navLinks}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paramètres modal — Langue */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card border-[#C9A34F]/30 p-8 max-w-md w-full gold-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-heading font-bold text-[#C9A34F] mb-6 uppercase tracking-wider">
                Paramètres
              </h2>
              <div className="mb-6">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-3">Langue</h3>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsEnglish(false); setSettingsOpen(false); setShowOtherLang(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-body transition-all cursor-pointer ${!isEnglish ? 'bg-[#C9A34F] text-black font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                  >
                    Québécois
                  </button>
                  {!showOtherLang ? (
                    <button type="button" onClick={() => setShowOtherLang(true)} className="w-full text-left px-4 py-2 text-[10px] text-white/30 hover:text-white/50 uppercase tracking-widest cursor-pointer">
                      Autre langue…
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setIsEnglish(true); setSettingsOpen(false); setShowOtherLang(false); }}
                      className={`w-full text-left px-4 py-2 rounded-lg font-body text-[11px] transition-all cursor-pointer ${isEnglish ? 'bg-white/10 text-[#C9A34F]' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      English
                    </button>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setSettingsOpen(false)} className="text-xs text-white/40 hover:text-[#C9A34F] uppercase tracking-widest cursor-pointer">
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#C9A34F] mb-4">{t.title}</h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-32">
          {t.tiers.map((tier) => (
            <motion.article
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`relative rounded-2xl border p-8 ${tier.featured ? 'border-[#C9A34F] bg-[#C9A34F]/5 gold-glow' : 'border-white/10 bg-white/5'}`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C9A34F] text-black text-xs font-bold uppercase">
                  {t.popular}
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              {tier.price && <p className="text-3xl font-black text-[#C9A34F] mb-4">{tier.price}</p>}
              <p className="text-white/80 mb-2">{tier.desc}</p>
              <p className="text-white/50 text-sm mb-4">{tier.sub}</p>
              {tier.limits && (
                <ul className="space-y-2 mb-6 text-sm">
                  {tier.limits.map((limit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {limit.included ? <Check className="w-4 h-4 text-[#C9A34F] shrink-0" /> : <X className="w-4 h-4 text-white/30 shrink-0" />}
                      <span className={limit.included ? 'text-white/80' : 'text-white/40 line-through'}>{limit.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tier.cta && (
                <button
                  type="button"
                  onClick={() => handleCta(tier.id)}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${tier.featured ? 'bg-[#C9A34F] text-black hover:bg-[#d4af5a]' : 'border border-white/20 hover:border-[#C9A34F]/50'}`}
                >
                  {tier.cta}
                </button>
              )}
            </motion.article>
          ))}
        </div>

        <section id="onboarding" className="scroll-mt-24" aria-labelledby="onboarding-heading">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 id="onboarding-heading" className="text-3xl md:text-4xl font-heading font-bold text-[#C9A34F] mb-4">
              {t.onboardingTitle}
            </h2>
            <p className="text-white/60">{t.onboardingSub}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {t.onboardingOptions.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelectedOnboarding(opt.id)}
                className={`text-left p-6 rounded-2xl border transition-all ${selectedOnboarding === opt.id ? 'border-[#C9A34F] bg-[#C9A34F]/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
              >
                <opt.icon className="w-8 h-8 text-[#C9A34F] mb-4" />
                <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
                <p className="text-white/60 text-sm">{opt.desc}</p>
                {selectedOnboarding === opt.id && <Check className="w-5 h-5 text-[#C9A34F] mt-4" />}
                {/* Show system requirements for local option */}
                {opt.id === 'local' && selectedOnboarding === opt.id && (
                  <div className="mt-4 pt-4 border-t border-[#C9A34F]/20">
                    <p className="text-xs font-semibold text-[#C9A34F] mb-2">{isEnglish ? 'System Requirements:' : 'Configuration Requise:'}</p>
                    <ul className="text-xs text-white/50 space-y-1">
                      <li>{isEnglish ? '💾 Storage: ~15 GB free space' : '💾 Stockage: ~15 Go d\'espace libre'}</li>
                      <li>{isEnglish ? '🧠 RAM: 8 GB minimum (16 GB recommended)' : '🧠 RAM: 8 Go minimum (16 Go recommandé)'}</li>
                      <li>{isEnglish ? '🖥️ OS: Windows 10/11, macOS 12+, or Linux' : '🖥️ OS: Windows 10/11, macOS 12+, ou Linux'}</li>
                    </ul>
                    <p className="text-xs text-white/40 mt-2 italic">{isEnglish ? 'AI models are large files (4-8 GB each)' : 'Les modèles IA sont de gros fichiers (4-8 Go chacun)'}</p>
                    <Link 
                      to="/system-info" 
                      className="inline-flex items-center gap-1 mt-3 text-xs text-[#C9A34F] hover:text-[#d4af5a] transition-colors"
                    >
                      {isEnglish ? 'View detailed requirements →' : 'Voir les détails →'}
                    </Link>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <label htmlFor="ai-name" className="block text-sm font-bold text-[#C9A34F] mb-3">
              {t.aiNameLabel}
            </label>
            <input
              id="ai-name"
              type="text"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              placeholder={t.aiNamePlaceholder}
              maxLength={32}
              className="w-full max-w-md px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A34F] focus:outline-none"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-md mx-auto">
            {submitted ? (
              <div className="text-center p-8 rounded-2xl border border-[#C9A34F]/30 bg-[#C9A34F]/5">
                <Check className="w-12 h-12 text-[#C9A34F] mx-auto mb-4" />
                <p className="font-bold text-lg">{t.signupSuccess}</p>
                <p className="text-white/60 text-sm mt-2">{typeof t.signupSub === 'function' ? t.signupSub(aiName.trim()) : t.signupSub}</p>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <label htmlFor="signup-email" className="sr-only">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-[#C9A34F] focus:outline-none"
                />
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#C9A34F] text-black font-bold hover:bg-[#d4af5a] transition-colors">
                  {t.signupCta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="flex flex-col items-center gap-6 text-sm text-white/40">
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/" className="hover:text-[#C9A34F] transition-colors">{t.backHome}</Link>
            <Link to="/legal" className="hover:text-[#C9A34F] transition-colors">Légal (Bill 96)</Link>
            <Link to="/confidentialite" className="hover:text-[#C9A34F] transition-colors">Confidentialité</Link>
            <Link to="/souverainete" className="hover:text-[#C9A34F] transition-colors">Souveraineté</Link>
          </div>
        </div>
      </footer>

      <AskMaxPanel />
    </div>
  );
};

export default PricingPage;
