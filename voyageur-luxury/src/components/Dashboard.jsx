import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, AlertTriangle, CheckCircle2, Wifi, ServerCog } from 'lucide-react';

const ASSISTANT_BASE_URL = import.meta.env.VITE_ASSISTANT_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [brief, setBrief] = useState(null);
  const [briefLoading, setBriefLoading] = useState(true);
  const [briefError, setBriefError] = useState(null);

  // Simple placeholder until a dedicated leads endpoint exists.
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        setBriefLoading(true);
        setBriefError(null);
        const res = await fetch(`${ASSISTANT_BASE_URL}/brief/morning`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setBrief(data);
      } catch (err) {
        setBriefError('Assistant hors ligne ou inaccessible pour le moment.');
      } finally {
        setBriefLoading(false);
      }
    };

    // Initial load
    fetchBrief();
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#1C1917] border border-[#C9A34F]/40 shadow-lg shadow-black/40">
            <Shield className="w-8 h-8 text-[#C9A34F]" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-[#C9A34F]/70 uppercase">
              Tableau de Bord
            </p>
            <h1 className="text-3xl sm:text-4xl font-heading text-[#F8F2E8] tracking-tight">
              Poste de Commande — Marc
            </h1>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-[0.18em]">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)] items-start">
        {/* Morning Brief Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F1B16] via-[#151210] to-[#0C0A09] border border-[#C9A34F]/25 shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
        >
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-paper.png")' }} />
          <div className="absolute -right-24 -top-24 w-64 h-64 bg-[#C9A34F]/15 rounded-full blur-3xl" />

          <div className="relative px-6 sm:px-8 pt-6 pb-5 border-b border-[#C9A34F]/25 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-[#C9A34F]/80 uppercase">
                Brief du matin
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-heading text-[#F8F2E8] tracking-tight">
                Pendant que tu dors, ça travaille
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase tracking-[0.18em]">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Signal Max — Stable</span>
            </div>
          </div>

          <div className="relative px-6 sm:px-8 py-6 sm:py-8 space-y-6">
            <div className="min-h-[88px] text-left">
              {briefLoading && (
                <p className="text-white/40 text-sm italic">
                  Max prépare ton brief… une seconde.
                </p>
              )}
              {briefError && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {briefError}
                </p>
              )}
              {brief && !briefLoading && !briefError && (
                <p className="text-base sm:text-lg text-white/85 leading-relaxed font-body">
                  {brief.message_fr}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center text-[10px] sm:text-xs uppercase tracking-[0.18em]">
              <div className="rounded-2xl bg-black/40 border border-white/8 px-3 py-3 flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/40">Jobs aujourd&apos;hui</span>
                <span className="text-2xl sm:text-3xl font-heading text-[#C9A34F]">
                  {brief?.jobs_today ?? 0}
                </span>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/8 px-3 py-3 flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/40">Relances</span>
                <span className="text-2xl sm:text-3xl font-heading text-[#F8F2E8]">
                  {brief?.pending_followups ?? 0}
                </span>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/8 px-3 py-3 flex flex-col items-center gap-1">
                <span className="text-[10px] text-white/40">Nouveaux leads</span>
                <span className="text-2xl sm:text-3xl font-heading text-emerald-400">
                  {brief?.new_leads_today ?? 0}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs">
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-[#C9A34F] text-black font-black uppercase tracking-[0.18em] text-[10px] sm:text-[11px] hover:bg-[#e0bf6a] transition-colors cursor-pointer"
                onClick={async () => {
                  try {
                    setBriefLoading(true);
                    const res = await fetch(`${ASSISTANT_BASE_URL}/brief/morning`);
                    if (!res.ok) throw new Error();
                    const data = await res.json();
                    setBrief(data);
                  } catch {
                    setBriefError('Impossible de rafraîchir le brief pour l’instant.');
                  } finally {
                    setBriefLoading(false);
                  }
                }}
              >
                Rafraîchir le brief
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-full border border-white/10 text-white/70 font-bold uppercase tracking-[0.18em] text-[10px] sm:text-[11px] hover:border-[#C9A34F]/60 hover:text-[#C9A34F] transition-colors cursor-pointer"
              >
                Bloquer 30 min d&apos;appels demain
              </button>
            </div>
          </div>
        </motion.section>

        {/* Leads + Status column */}
        <div className="space-y-6">
          {/* Leads list placeholder */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
            className="rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black tracking-[0.28em] text-[#C9A34F]/80 uppercase">
                  Nouveaux Leads
                </p>
                <p className="text-xs text-white/45 mt-1">
                  Dérnières 24 heures — intégration détaillée à venir.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                <Activity className="w-3 h-3 text-emerald-400" />
                Bêta
              </span>
            </div>
            <div className="px-5 sm:px-6 py-6 text-sm text-white/50">
              <p className="mb-2">
                Max va bientôt lister ici tes leads un par un, avec niveau d&apos;urgence et prix déjà vérifiés.
              </p>
              <p className="text-xs text-white/30">
                Pour l’instant, consulte le brief ci‑haut pour voir le nombre de nouveaux leads.
              </p>
            </div>
          </motion.section>

          {/* System status strip */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.08 }}
            className="rounded-2xl bg-black/70 border border-white/8 px-4 sm:px-5 py-4 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em]"
          >
            <div className="flex items-center gap-2 text-white/60">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp — Géré par OpenClaw</span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <ServerCog className="w-3.5 h-3.5 text-[#C9A34F]" />
              <span>Cerveau — Antigravity + Gemini</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Mémoire — TAKIN (.jsonl)</span>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

