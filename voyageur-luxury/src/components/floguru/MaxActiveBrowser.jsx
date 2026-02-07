import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, MoreHorizontal } from 'lucide-react';

const DEFAULT_THOUGHTS = [
  'Clicking the submit button...',
  'Reading form fields...',
  'Filling in address...',
  'Checking availability...',
  'Navigating to checkout...',
];

const CURSOR_POSITIONS = [
  { x: '25%', y: '35%' },
  { x: '60%', y: '28%' },
  { x: '45%', y: '55%' },
  { x: '70%', y: '62%' },
  { x: '35%', y: '48%' },
  { x: '55%', y: '72%' },
];

/** Hook: prefers-reduced-motion (SSR-safe) */
const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    setPrefersReduced(mq.matches);
    const handler = () => setPrefersReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
};

/**
 * MaxActiveBrowser — Stylized browser window with "Max Active" state.
 * Shows a pulsing address bar, blurred page content, and animated cursor
 * with tooltip to communicate autonomous browser control without video.
 *
 * @param paused - When true, disables cycling (for tests or external control)
 * @param initialIndex - Starting index when paused or before first cycle
 */
const MaxActiveBrowser = ({
  thoughts = DEFAULT_THOUGHTS,
  cycleMs = 3000,
  paused = false,
  initialIndex = 0,
  className = '',
  'data-testid': testId,
}) => {
  const [index, setIndex] = useState(initialIndex);
  const prefersReducedMotion = usePrefersReducedMotion();

  const shouldCycle = !paused && !prefersReducedMotion && cycleMs > 0;

  useEffect(() => {
    if (!shouldCycle) return;
    const n = Math.max(thoughts.length, CURSOR_POSITIONS.length);
    const id = setInterval(() => setIndex((i) => (i + 1) % n), cycleMs);
    return () => clearInterval(id);
  }, [shouldCycle, thoughts.length, cycleMs]);

  const thought = thoughts[index % thoughts.length];
  const pos = CURSOR_POSITIONS[index % CURSOR_POSITIONS.length];
  const noMotion = prefersReducedMotion || paused;

  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-elevation-4 backdrop-blur-sm ${className}`}
      data-testid={testId ?? 'max-active-browser'}
      role="img"
      aria-label="Browser window with Max AI agent actively controlling the page"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-2.5 w-2.5 rounded-full border border-white/20 bg-white/10"
              aria-hidden
            />
          ))}
        </div>
        <div className="ml-2 flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
          <Lock className="h-3.5 w-3.5 shrink-0 text-cyan-400/80" aria-hidden />
          <span
            className="flex items-center gap-2 text-sm text-cyan-400"
            aria-live="polite"
          >
            <span
              className={`inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 text-emerald-400 ${noMotion ? 'animate-none' : 'animate-max-active motion-reduce:animate-none'}`}
              aria-hidden
            />
            Max Active
          </span>
        </div>
        <MoreHorizontal
          className="h-4 w-4 shrink-0 text-white/40"
          aria-hidden
        />
      </div>

      {/* Blurred page content */}
      <div className="relative aspect-video overflow-hidden bg-slate-900/80">
        <div
          className="absolute inset-0 blur-md"
          style={{
            background:
              'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          }}
        >
          {/* Fake page structure */}
          <div className="flex h-full flex-col gap-4 p-8 opacity-60">
            <div className="h-6 w-3/4 rounded bg-slate-500/50" />
            <div className="h-4 w-full rounded bg-slate-600/40" />
            <div className="h-4 w-5/6 rounded bg-slate-600/40" />
            <div className="mt-4 flex gap-4">
              <div className="h-24 flex-1 rounded bg-slate-500/30" />
              <div className="h-24 flex-1 rounded bg-slate-500/30" />
            </div>
            <div className="h-10 w-32 rounded bg-slate-400/50" />
          </div>
        </div>

        {/* Animated cursor + tooltip */}
        <motion.div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          initial={false}
          animate={{ left: pos.x, top: pos.y }}
          transition={
            noMotion
              ? { duration: 0 }
              : { type: 'tween', duration: 0.6, ease: 'easeInOut' }
          }
          style={noMotion ? {} : { willChange: 'left, top' }}
        >
          <div aria-hidden>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            >
              <path
                d="M5 3l14 9-6 2-4 4-4-15z"
                fill="white"
                stroke="rgb(34,211,238)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="absolute left-8 top-6 min-w-[140px] max-w-[200px] rounded-lg border border-cyan-500/30 bg-slate-900/95 px-3 py-2 text-xs text-cyan-100 shadow-lg backdrop-blur-sm">
            {thought}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MaxActiveBrowser;
