import { useState, useEffect } from 'react'

interface HeartbeatProps {
  cronCount?: number
}

interface Heartbeat {
  name: string
  status: 'pulsing' | 'waiting' | 'failed'
  lastPulse: string
}

export default function HeartbeatPulse({ cronCount = 0 }: HeartbeatProps) {
  const [heartbeats, setHeartbeats] = useState<Heartbeat[]>([
    { name: 'MAX Main', status: 'pulsing', lastPulse: 'now' },
    { name: 'Zyeute Feed', status: 'pulsing', lastPulse: '2s ago' },
    { name: 'Floguru API', status: 'pulsing', lastPulse: '5s ago' },
    { name: 'Memory Sync', status: 'waiting', lastPulse: '30s ago' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeats(prev => prev.map(hb => ({
        ...hb,
        lastPulse: hb.status === 'pulsing' ? 'now' : 
          `${Math.floor(Math.random() * 60)}s ago`
      })))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Heartbeat['status']) => {
    switch (status) {
      case 'pulsing': return 'bg-green-400'
      case 'waiting': return 'bg-yellow-400'
      case 'failed': return 'bg-red-400'
    }
  }

  const getStatusGlow = (status: Heartbeat['status']) => {
    switch (status) {
      case 'pulsing': return 'shadow-green-400/50'
      case 'waiting': return 'shadow-yellow-400/50'
      case 'failed': return 'shadow-red-400/50'
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        ❤️ Heartbeats
        <span className="text-xs text-white/50 ml-2">{cronCount} active</span>
      </h2>
      
      <div className="space-y-4">
        {heartbeats.map((hb, i) => (
          <div 
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(hb.status)} ${
                hb.status === 'pulsing' ? `animate-pulse shadow-lg ${getStatusGlow(hb.status)}` : ''
              }`} />
              <span className="text-sm">{hb.name}</span>
            </div>
            <span className="text-xs text-white/40">{hb.lastPulse}</span>
          </div>
        ))}
      </div>

      {/* Pulse Visual */}
      <div className="mt-6 flex justify-center">
        <div className="relative w-24 h-24">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className="absolute inset-0 rounded-full border-2 border-purple-500/30"
              style={{
                animation: `pulse-ring 2s ease-out ${i * 0.5}s infinite`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🐝</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
