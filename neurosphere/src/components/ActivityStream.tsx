import { useState, useEffect } from 'react'

interface ActivityStreamProps {
  sessionCount?: number
}

interface Activity {
  id: string
  message: string
  type: 'heartbeat' | 'memory' | 'session' | 'agent'
  timestamp: Date
}

const ACTIVITIES: Activity[] = [
  { id: '1', message: 'MAX responded to user query', type: 'agent', timestamp: new Date() },
  { id: '2', message: 'Heartbeat pulse detected', type: 'heartbeat', timestamp: new Date(Date.now() - 5000) },
  { id: '3', message: 'Memory updated: Zyeute status', type: 'memory', timestamp: new Date(Date.now() - 10000) },
  { id: '4', message: 'New session started', type: 'session', timestamp: new Date(Date.now() - 15000) },
  { id: '5', message: 'Reasoner agent activated', type: 'agent', timestamp: new Date(Date.now() - 20000) },
]

export default function ActivityStream({ sessionCount = 0 }: ActivityStreamProps) {
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES)

  useEffect(() => {
    const interval = setInterval(() => {
      const types: Activity['type'][] = ['heartbeat', 'memory', 'session', 'agent']
      const messages = [
        'MAX processed request',
        'Heartbeat pulse',
        'Memory sync complete',
        'Agent task completed',
        'New session connected',
        'Codex updated',
        `Active sessions: ${sessionCount}`,
      ]
      
      const newActivity: Activity = {
        id: Date.now().toString(),
        message: messages[Math.floor(Math.random() * messages.length)],
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: new Date()
      }
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)])
    }, 3000)
    
    return () => clearInterval(interval)
  }, [sessionCount])

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'heartbeat': return '❤️'
      case 'memory': return '📜'
      case 'session': return '🔗'
      case 'agent': return '🐝'
    }
  }

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'heartbeat': return 'text-red-400'
      case 'memory': return 'text-blue-400'
      case 'session': return 'text-green-400'
      case 'agent': return 'text-purple-400'
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        📡 Activity Stream
        <span className="text-xs text-white/50 ml-2">live</span>
      </h2>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities.map(activity => (
          <div 
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-lg">{getIcon(activity.type)}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${getColor(activity.type)}`}>{activity.message}</p>
              <p className="text-xs text-white/30 mt-1">
                {activity.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
