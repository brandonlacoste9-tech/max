import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, ChevronUp } from 'lucide-react';

const API_BASE = '/api';
const PANEL_ID = 'ask-max-panel';
const INPUT_ID = 'ask-max-input';

/** Chat message role */
export type MessageRole = 'user' | 'assistant' | 'system';

/** Chat message model */
export interface Message {
  role: MessageRole;
  text: string;
}

/** Shared props for both controlled and uncontrolled modes */
interface AskMaxPanelBaseProps {
  /** Called when user closes the panel. Convenience alias for onOpenChange?.(false). */
  onClose?: () => void;
  /** Custom send handler. When provided, replaces internal fetch to /api/max. */
  onSend?: (message: string) => Promise<string>;
  /** Override the empty-state hint (default: "status, run demo, ..."). */
  initialContext?: string;
  /** Override typing indicator. When provided, used instead of internal `sending`. */
  isStreaming?: boolean;
}

/** Controlled mode: parent owns open state. Cannot use defaultOpen. */
export interface AskMaxPanelControlledProps extends AskMaxPanelBaseProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
}

/** Uncontrolled mode: component owns state. Cannot use isOpen/onOpenChange. */
export interface AskMaxPanelUncontrolledProps extends AskMaxPanelBaseProps {
  isOpen?: never;
  onOpenChange?: never;
  defaultOpen?: boolean;
}

/**
 * AskMaxPanel props — strict controlled OR uncontrolled (never both).
 * @example Controlled: <AskMaxPanel isOpen={open} onOpenChange={setOpen} />
 * @example Uncontrolled: <AskMaxPanel /> or <AskMaxPanel defaultOpen />
 */
export type AskMaxPanelProps =
  | AskMaxPanelControlledProps
  | AskMaxPanelUncontrolledProps;

/**
 * AskMaxPanel — AI chat panel (UI Pro Max AI-Native + frontend-developer standards)
 * @see UI Pro Max: AI-Native UI (typing indicator, bubbles, minimal chrome)
 * @see frontend-developer: a11y, responsive, semantic HTML, data-testid for tests
 */
const AskMaxPanel: React.FC<AskMaxPanelProps> = ({
  isOpen: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  onClose,
  onSend,
  initialContext,
  isStreaming: controlledStreaming,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [internalSending, setInternalSending] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) onClose?.();
    },
    [isControlled, onOpenChange, onClose]
  );

  const showTyping = controlledStreaming ?? internalSending;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  const performSend = useCallback(
    async (text: string) => {
      setInput('');
      setMessages((prev) => [...prev, { role: 'user' as const, text }]);
      setInternalSending(true);

      try {
        const reply = onSend
          ? await onSend(text)
          : await (async () => {
              const res = await fetch(`${API_BASE}/max`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const data = await res.json();
              return data.reply ?? 'No response.';
            })();
        setMessages((prev) => [...prev, { role: 'assistant' as const, text: reply }]);
      } catch (err) {
        console.error('[AskMax]', err);
        const isNetworkError =
          err instanceof TypeError ||
          (err instanceof Error &&
            (err.message.includes('fetch') || err.message.includes('Network')));
        const friendlyMessage = isNetworkError
          ? 'Max is offline. Check the API server.'
          : `Max is offline. (${err instanceof Error ? err.message : 'Unknown error'})`;
        setMessages((prev) => [
          ...prev,
          { role: 'assistant' as const, text: friendlyMessage },
        ]);
      } finally {
        setInternalSending(false);
      }
    },
    [onSend]
  );

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || showTyping) return;
    void performSend(text);
  }, [input, showTyping, performSend]);

  const closePanel = useCallback(() => setOpen(false), [setOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const suggestedCommands =
    initialContext ?? 'status, run demo, check max-inky.vercel.app, help';

  const TypingIndicator: React.FC = () => (
    <div
      className="flex justify-start"
      role="status"
      aria-live="polite"
      aria-label="Max is thinking"
      data-testid="ask-max-typing"
    >
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white/70">
        <span className="w-2 h-2 rounded-full bg-[#C9A34F] animate-typing-dot" />
        <span className="w-2 h-2 rounded-full bg-[#C9A34F] animate-typing-dot-2" />
        <span className="w-2 h-2 rounded-full bg-[#C9A34F] animate-typing-dot-3" />
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? 'Close Ask Max chat' : 'Open Ask Max chat'}
        data-testid="ask-max-toggle"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 min-w-[44px] min-h-[44px] glass-card border-[#C9A34F]/40 flex items-center justify-center text-[#C9A34F] hover:bg-[#C9A34F] hover:text-black transition-colors duration-200 gold-glow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0A09]"
      >
        {isOpen ? (
          <X className="w-6 h-6" aria-hidden />
        ) : (
          <MessageSquare className="w-6 h-6" aria-hidden />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id={PANEL_ID}
            role="region"
            aria-label="Ask Max chat"
            aria-busy={showTyping}
            data-testid="ask-max-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-8 sm:w-[380px] z-40 max-h-[min(420px,70vh)] glass-card border-[#C9A34F]/30 flex flex-col overflow-hidden shadow-elevation-4"
            onKeyDown={(e) => e.key === 'Escape' && closePanel()}
          >
            <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
              <h2 className="font-heading font-bold text-[#C9A34F] uppercase tracking-wider flex items-center gap-2 text-sm">
                <ChevronUp className="w-4 h-4" aria-hidden />
                Ask Max
              </h2>
            </header>

            <div
              className="flex-1 overflow-y-auto p-4 min-h-[200px] max-h-[280px] flex flex-col gap-4"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.length === 0 && (
                <p id="ask-max-hint" className="text-white/30 text-sm italic">
                  Try: &quot;{suggestedCommands}&quot;
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}-${m.text.slice(0, 20)}`}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm transition-colors duration-200 ${
                      m.role === 'user'
                        ? 'bg-[#C9A34F] text-black'
                        : 'bg-white/10 text-white/90 border-l-2 border-[#C9A34F]/50'
                    }`}
                    role={m.role === 'user' ? 'log' : 'article'}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-inherit">
                      {m.text}
                    </pre>
                  </div>
                </div>
              ))}
              {showTyping && <TypingIndicator />}
              <div ref={messagesEndRef} aria-hidden />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-4 border-t border-white/10 flex gap-2 shrink-0"
            >
              <label htmlFor={INPUT_ID} className="sr-only">
                Message for Max
              </label>
              <input
                ref={inputRef}
                id={INPUT_ID}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={showTyping}
                autoComplete="off"
                aria-describedby={messages.length === 0 ? 'ask-max-hint' : undefined}
                aria-label="Message for Max"
                data-testid="ask-max-input"
                className="flex-1 h-12 min-h-[44px] bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:border-[#C9A34F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34F]/50 text-sm rounded-xl transition-colors duration-200"
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                disabled={showTyping || !input.trim()}
                aria-label="Send message"
                data-testid="ask-max-send"
                className="btn-imperial bg-[#C9A34F] text-black h-12 min-h-[44px] px-4 py-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs hover:bg-[#d4af5a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A34F] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 rounded-xl"
              >
                <Send className="w-4 h-4" aria-hidden />
                <span>Send</span>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskMaxPanel;
