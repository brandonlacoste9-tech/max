import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, ChevronUp } from 'lucide-react';

const API_BASE = '/api';

const AskMaxPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/max`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const reply = data.reply || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error('[AskMax]', err);
      const isNetworkError =
        err.name === 'TypeError' ||
        err.message?.includes('fetch') ||
        err.message?.includes('Network');
      const friendlyMessage = isNetworkError
        ? 'Max is offline. Check the API server.'
        : `Max is offline. Check the API server. (${err.message || 'Unknown error'})`;
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: friendlyMessage },
      ]);
    }
    setSending(false);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 glass-card border-[#C9A34F] border-opacity-40 flex items-center justify-center text-[#C9A34F] hover:bg-[#C9A34F] hover:text-black transition-all gold-glow"
        aria-label={isOpen ? 'Close Ask Max' : 'Open Ask Max'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-40 w-[380px] max-h-[420px] glass-card border-[#C9A34F] border-opacity-30 flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <span className="font-heading font-bold text-[#C9A34F] uppercase tracking-wider flex items-center gap-2">
                <ChevronUp className="w-4 h-4" />
                Ask Max
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[280px]">
              {messages.length === 0 && (
                <p className="text-white/30 text-sm italic">
                  Try: &quot;status&quot;, &quot;run demo&quot;, &quot;check max-inky.vercel.app&quot;, or &quot;help&quot;
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                      m.role === 'user'
                        ? 'bg-[#C9A34F] text-black'
                        : 'bg-white/10 text-white/90 border border-white/10'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-inherit">
                      {m.text}
                    </pre>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white/50 px-4 py-2 rounded-lg text-sm italic">
                    Max is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-[#C9A34F] focus:outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="btn-imperial bg-[#C9A34F] text-black px-4 py-3 flex items-center gap-2 font-bold uppercase tracking-wider text-xs hover:bg-[#d4af5a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskMaxPanel;
