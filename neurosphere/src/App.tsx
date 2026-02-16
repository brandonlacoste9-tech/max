import { useState, useEffect } from 'react'
import NeuralNetwork from './components/NeuralNetwork'
import ActivityStream from './components/ActivityStream'
import HeartbeatPulse from './components/HeartbeatPulse'
import CodexPanel from './components/CodexPanel'
import { fetchColonyData, type ColonyData } from './services/colonyData'

interface Node {
  id: string
  name: string
  type: 'max' | 'agent' | 'hive' | 'heartbeat'
  status: 'active' | 'idle' | 'sleeping'
}

function App() {
  const [colonyData, setColonyData] = useState<ColonyData | null>(null)
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'max', name: 'MAX', type: 'max', status: 'active' },
    { id: 'agent-1', name: 'Reasoner', type: 'agent', status: 'idle' },
    { id: 'agent-2', name: 'Coder', type: 'agent', status: 'idle' },
    { id: 'agent-3', name: 'Browser', type: 'agent', status: 'sleeping' },
    { id: 'hive-1', name: 'Zyeute', type: 'hive', status: 'active' },
    { id: 'hive-2', name: 'Floguru', type: 'hive', status: 'active' },
    { id: 'hive-3', name: 'Wacké', type: 'hive', status: 'sleeping' },
    { id: 'heartbeat-1', name: '❤️ Pulse', type: 'heartbeat', status: 'active' },
  ])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real data from OpenClaw Gateway
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchColonyData()
        setColonyData(data)
        
        // Update nodes based on real data
        const sessionNodes: Node[] = data.sessions.slice(0, 5).map((s, i) => ({
          id: `session-${i}`,
          name: s.displayName || s.channel,
          type: 'agent' as const,
          status: 'active' as const,
        }))
        
        setNodes(prev => [
          { id: 'max', name: 'MAX', type: 'max', status: 'active' },
          ...sessionNodes,
          { id: 'hive-1', name: 'Zyeute', type: 'hive', status: 'active' },
          { id: 'hive-2', name: 'Floguru', type: 'hive', status: 'active' },
          { id: 'heartbeat-1', name: '❤️ Pulse', type: 'heartbeat', status: 'active' },
        ])
        
        setError(null)
      } catch (err) {
        console.error("Failed to fetch colony data:", err)
        setError("Could not connect to OpenClaw Gateway")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const activeCount = nodes.filter(n => n.status === 'active').length
  const sessionCount = colonyData?.sessions.length || 0
  const cronCount = colonyData?.cronJobs.filter(j => j.enabled).length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="p-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              🌌 NEUROSPHERE
            </h1>
            <span className="text-white/50">|</span>
            <span className="text-purple-400">Colony OS</span>
            {loading && <span className="text-yellow-400 text-sm animate-pulse">Loading...</span>}
            {error && <span className="text-red-400 text-sm">{error}</span>}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/70">
                {activeCount} nodes active
              </span>
            </div>
            <div className="text-xs text-white/30">
              🐝 The Hive Never Sleeps
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-8 text-sm">
          <div>
            <span className="text-white/50">Sessions:</span>{' '}
            <span className="text-green-400 font-bold">{sessionCount}</span>
          </div>
          <div>
            <span className="text-white/50">Cron Jobs:</span>{' '}
            <span className="text-blue-400 font-bold">{cronCount}</span>
          </div>
          <div>
            <span className="text-white/50">Nodes:</span>{' '}
            <span className="text-purple-400 font-bold">{nodes.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Neural Network - Main Visual */}
          <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🧠 Neural Network
              <span className="text-xs text-white/50 ml-2">{nodes.length} nodes</span>
            </h2>
            <div className="h-[400px]">
              <NeuralNetwork 
                nodes={nodes} 
                onNodeClick={(node) => setSelectedNode(node)}
                selectedNode={selectedNode}
              />
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            {/* Heartbeat Pulse */}
            <HeartbeatPulse cronCount={cronCount} />

            {/* Codex Panel */}
            <CodexPanel />
          </div>
        </div>

        {/* Activity Stream */}
        <div className="mt-6">
          <ActivityStream sessionCount={sessionCount} />
        </div>
      </main>

      {/* Selected Node Detail */}
      {selectedNode && (
        <div className="fixed bottom-6 right-6 bg-slate-800 rounded-xl border border-white/20 p-4 w-80">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{selectedNode.name}</h3>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-white/70 space-y-1">
            <p>Type: <span className="text-purple-400">{selectedNode.type}</span></p>
            <p>Status: 
              <span className={`ml-2 ${
                selectedNode.status === 'active' ? 'text-green-400' : 
                selectedNode.status === 'idle' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {selectedNode.status}
              </span>
            </p>
            <p>ID: <span className="text-white/50">{selectedNode.id}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
