import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const LegalPage = () => (
  <div className="min-h-screen font-body bg-[#0C0A09] text-white gold-edge-lighting">
    <div className="fixed inset-0 bg-gradient-to-br from-[#8B000022] via-transparent to-[#C9A34F22] pointer-events-none" />
    <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
      <Link to="/" className="flex items-center gap-3" aria-label="Voyageur Luxury Home">
        <div className="p-2 glass-card border-[#C9A34F]/40">
          <Shield className="w-6 h-6 text-[#C9A34F]" />
        </div>
        <span className="font-heading text-xl font-bold">VOYAGEUR <span className="text-[#C9A34F]">LUXURY</span></span>
      </Link>
      <Link to="/" className="text-sm text-white/60 hover:text-[#C9A34F] transition-colors">← Accueil</Link>
    </nav>
    <main className="relative z-10 max-w-3xl mx-auto px-8 py-16">
      <h1 className="text-4xl font-heading font-bold text-[#C9A34F] mb-8">Légal (Bill 96)</h1>
      <div className="prose prose-invert prose-lg text-white/80 space-y-6">
        <p>Cette page respecte la Loi 96 sur la langue française au Québec. Le français est la langue officielle de nos services au Québec.</p>
        <p>Contenu juridique à venir. Pour toute question, contactez-nous à floguru@gmail.com.</p>
      </div>
      <Link to="/" className="inline-block mt-12 text-[#C9A34F] hover:underline">← Retour à l&apos;accueil</Link>
    </main>
  </div>
);

export default LegalPage;
