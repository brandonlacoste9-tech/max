/**
 * OpenClaw Data Service
 * Connects Neurosphere to real OpenClaw data
 * 
 * Uses OpenClaw Gateway API to fetch:
 * - Active sessions
 * - Cron jobs
 * - Node status
 */

const OPENCLAW_URL = "http://localhost:7420"; // Default OpenClaw Gateway port

export interface Session {
  key: string
  kind: string
  channel: string
  displayName: string
  updatedAt: number
  model: string
  contextTokens: number
  totalTokens: number
}

export interface CronJob {
  id: string
  name: string
  schedule: string
  enabled: boolean
  lastRun?: string
  status: "active" | "paused" | "error"
}

export interface Node {
  id: string
  name: string
  status: "online" | "offline" | "busy"
  type: string
}

export interface ColonyData {
  sessions: Session[]
  cronJobs: CronJob[]
  nodes: Node[]
  timestamp: number
}

/**
 * Fetch all colony data from OpenClaw Gateway
 */
export async function fetchColonyData(): Promise<ColonyData> {
  const [sessions, cronJobs] = await Promise.all([
    fetchSessions(),
    fetchCronJobs(),
  ])

  return {
    sessions,
    cronJobs,
    nodes: [], // Nodes would come from nodes.list() when available
    timestamp: Date.now(),
  }
}

/**
 * Fetch active sessions from OpenClaw Gateway
 */
async function fetchSessions(): Promise<Session[]> {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn("[ColonyData] Failed to fetch sessions:", response.status)
      return []
    }

    const data = await response.json()
    return data.sessions || []
  } catch (error) {
    console.warn("[ColonyData] Sessions fetch error:", error)
    return []
  }
}

/**
 * Fetch cron jobs from OpenClaw Gateway
 */
async function fetchCronJobs(): Promise<CronJob[]> {
  try {
    const response = await fetch(`${OPENCLAW_URL}/api/cron/jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn("[ColonyData] Failed to fetch cron jobs:", response.status)
      return []
    }

    const data = await response.json()
    return data.jobs || []
  } catch (error) {
    console.warn("[ColonyData] Cron jobs fetch error:", error)
    return []
  }
}

/**
 * Get summary stats for the dashboard
 */
export function getColonyStats(data: ColonyData) {
  return {
    activeSessions: data.sessions.length,
    activeCronJobs: data.cronJobs.filter(j => j.enabled).length,
    totalNodes: data.nodes.length,
    uptime: calculateUptime(data.sessions),
  }
}

function calculateUptime(sessions: Session[]): string {
  if (sessions.length === 0) return "0s"
  
  // Calculate oldest session to get colony uptime
  const oldest = Math.min(...sessions.map(s => s.updatedAt))
  const uptimeMs = Date.now() - oldest
  
  if (uptimeMs < 60000) return `${Math.floor(uptimeMs / 1000)}s`
  if (uptimeMs < 3600000) return `${Math.floor(uptimeMs / 60000)}m`
  return `${Math.floor(uptimeMs / 3600000)}h`
}
