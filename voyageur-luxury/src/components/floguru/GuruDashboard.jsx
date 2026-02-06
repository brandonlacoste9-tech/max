import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Zap, Brain, Eye, Code, MessageSquare, TrendingUp } from 'lucide-react';

const TIER_META = {
  reflex: { label: 'Reflex', icon: <Zap className="w-5 h-5" />, color: '#22c55e' },
  logic:  { label: 'Logic',  icon: <Brain className="w-5 h-5" />, color: '#3b82f6' },
  worker: { label: 'Worker', icon: <Code className="w-5 h-5" />, color: '#a855f7' },
  vision: { label: 'Vision', icon: <Eye className="w-5 h-5" />, color: '#f59e0b' },
};

const API_BASE = '/api';

const GuruDashboard = () => {
  const [gurus, setGurus] = useState([]);
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [taskResult, setTaskResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [guruRes, statsRes, healthRes] = await Promise.all([
        fetch(`${API_BASE}/gurus`).then(r => r.ok ? r.json() : { gurus: [] }),
        fetch(`${API_BASE}/gurus/stats`).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/health`).then(r => r.ok ? r.json() : null),
      ]);
      setGurus(guruRes.gurus || []);
      setStats(statsRes);
      setHealth(healthRes);
    } catch {
      // API not available — show empty state
    }
  };

  const submitTask = async () => {
    if (!taskInput.trim()) return;
    setSubmitting(true);
    setTaskResult(null);
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskInput, description: taskInput }),
      });
      const data = await res.json();
      setTaskResult(data);
    } catch (err) {
      setTaskResult({ error: err.message });
    }
    setSubmitting(false);
  };

  return (
    <section className="mt-60" id="floguru-dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mb-20 text-center"
      >
        <h2 className="text-5xl md:text-7xl font-heading text-[#C9A34F] mb-6 tracking-tighter uppercase font-bold">
          FloGuru Command Center
        </h2>
        <p className="text-white/40 text-lg max-w-2xl mx-auto">
          AI Reasoning Gurus working in concert — browser automation, self-improvement, and multi-channel chat.
        </p>
        <div className="w-24 h-1 bg-[#8B0000] mx-auto mt-6"></div>
      </motion.div>

      {/* Status Bar */}
      <div className="glass-card p-6 mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${health ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-bold uppercase tracking-widest text-white/60">
            {health ? 'System Online' : 'Connecting...'}
          </span>
        </div>
        {stats && (
          <div className="flex gap-8 text-sm text-white/50">
            <span>Executions: <strong className="text-[#C9A34F]">{stats.total_executions}</strong></span>
            <span>Success Rate: <strong className="text-[#C9A34F]">{(stats.overall_success_rate * 100).toFixed(0)}%</strong></span>
          </div>
        )}
      </div>

      {/* Guru Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {Object.entries(TIER_META).map(([tier, meta]) => {
          const tierGurus = gurus.filter(g => g.tier === tier);
          const tierStat = stats?.guru_stats?.[meta.label] || {};
          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 group hover:border-[#C9A34F] border-opacity-20 transition-all"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
              >
                {meta.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold mb-2" style={{ color: meta.color }}>
                {meta.label}
              </h3>
              <p className="text-white/40 text-sm mb-4">
                {tierGurus.length > 0
                  ? tierGurus.map(g => g.name).join(', ')
                  : 'No gurus registered'}
              </p>
              {tierStat.total > 0 && (
                <div className="text-xs text-white/30 space-y-1">
                  <div>Runs: {tierStat.total}</div>
                  <div>Success: {(tierStat.success_rate * 100).toFixed(0)}%</div>
                  <div>Avg: {tierStat.avg_duration?.toFixed(0)}ms</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Task Submission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-10"
      >
        <h3 className="text-2xl font-heading text-[#C9A34F] font-bold mb-6 flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          Submit a Task
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitTask()}
            placeholder="Describe your task... (e.g., 'Analyze competitor pricing strategy')"
            className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-white placeholder-white/30 focus:border-[#C9A34F] focus:outline-none transition-all"
          />
          <button
            onClick={submitTask}
            disabled={submitting}
            className="btn-imperial bg-[#C9A34F] text-black px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-[#d4af5a] transition-all disabled:opacity-50"
          >
            {submitting ? 'Routing...' : 'Execute'}
          </button>
        </div>

        <AnimatePresence>
          {taskResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-white/5 border border-white/10 overflow-hidden"
            >
              {taskResult.error ? (
                <p className="text-red-400 font-mono text-sm">{taskResult.error}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="text-white/60">
                    Status: <span className="text-[#C9A34F] font-bold">{taskResult.status}</span>
                    {' | '}Confidence: <span className="text-[#C9A34F] font-bold">{((taskResult.confidence || 0) * 100).toFixed(0)}%</span>
                    {' | '}{taskResult.duration_ms?.toFixed(0)}ms
                  </div>
                  <pre className="text-white/80 font-mono text-xs whitespace-pre-wrap mt-3 max-h-64 overflow-y-auto">
                    {typeof taskResult.output === 'string' ? taskResult.output : JSON.stringify(taskResult.output, null, 2)}
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Recommendations */}
      {stats?.recommendations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-10 glass-card p-8"
        >
          <h3 className="text-xl font-heading text-[#C9A34F] font-bold mb-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5" />
            HyperHealing Recommendations
          </h3>
          <ul className="space-y-3">
            {stats.recommendations.map((rec, i) => (
              <li key={i} className="text-white/50 text-sm flex items-start gap-3">
                <Activity className="w-4 h-4 text-[#C9A34F] mt-0.5 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </section>
  );
};

export default GuruDashboard;
