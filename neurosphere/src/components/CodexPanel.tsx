import { useState, useEffect } from 'react'

interface CodexEntry {
  id: string
  title: string
  date: string
  type: 'memory' | 'decision' | 'milestone'
}

const ENTRIES: CodexEntry[] = [
  { id: '1', title: 'MAX born - First conversation', date: '2026-02-13', type: 'milestone' },
  { id: '2', title: 'ZyeuteV5 launched', date: '2026-02-13', type: 'milestone' },
  { id: '3', title: 'Floguru blueprint created', date: '2026-02-13', type: 'decision' },
  { id: '4', title: 'Colony OS vision defined', date: '2026-02-13', type: 'memory' },
  { id: '5', title: 'Neurosphere project started', date: '2026-02-14', type: 'milestone' },
]

export default function CodexPanel() {
  const [entries, setEntries] = useState<CodexEntry[]>(ENTRIES)

  const getIcon = (type: CodexEntry['type']) => {
    switch (type) {
      case 'milestone': return '🚀'
      case 'decision': return '💡'
      case 'memory': return '📜'
    }
  }

  const getColor = (type: CodexEntry['type']) => {
    switch (type) {
      case 'milestone': return 'text-yellow-400'
      case 'decision': return 'text-blue-400'
      case 'memory': return 'text-purple-400'
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📜 THE CODEX
        <span className="text-xs text-white/50 ml-2">{entries.length} records</span>
      </h2>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {entries.map(entry => (
          <div 
            key={entry.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <span className="text-lg">{getIcon(entry.type)}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${getColor(entry.type)}`}>{entry.title}</p>
              <p className="text-xs text-white/40 mt-1">{entry.date}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-center text-white/30">
          Genesis Record — The memory of the hive
        </p>
      </div>
    </div>
  )
}
