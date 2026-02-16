/**
 * Sensor Bee 🐝
 * Continuous niche scouting for the Weekly SaaS Factory
 * 
 * Scans:
 * - Quebec SMBs without social presence
 * - Reddit for friction signals
 * - Product Hunt for gaps
 */

import { web_search } from './tools/web_search'
import { write, read } from './tools/files'

const LEADS_FILE = 'revenue/hot_leads.md'
const HISTORY_FILE = 'revenue/scout_history.md'

interface Lead {
  source: 'quebec' | 'reddit' | 'producthunt'
  title: string
  description: string
  score: number // 1-10
  timestamp: string
  url?: string
}

/**
 * Main scout function
 */
export async function sensorBee(): Promise<Lead[]> {
  const leads: Lead[] = []
  
  console.log('🐝 Sensor Bee scouting...')
  
  // Scout Quebec SMBs
  const quebecLeads = await scoutQuebecSMBs()
  leads.push(...quebecLeads)
  
  // Scout Reddit
  const redditLeads = await scoutReddit()
  leads.push(...redditLeads)
  
  // Scout Product Hunt
  const phLeads = await scoutProductHunt()
  leads.push(...phLeads)
  
  // Log leads
  await logLeads(leads)
  
  console.log(`🐝 Found ${leads.length} leads`)
  return leads
}

/**
 * Scan Quebec SMBs without social presence
 */
async function scoutQuebecSMBs(): Promise<Lead[]> {
  const leads: Lead[] = []
  
  const queries = [
    'Quebec restaurant without Instagram',
    'Quebec salon without TikTok',
    'Quebec gym local directory',
    'Montreal boutique no social media',
  ]
  
  for (const query of queries) {
    try {
      const results = await web_search({
        query: `${query} site:google.com/maps OR site:pagesjaunes.ca`,
        count: 3,
      })
      
      results.forEach((r: any) => {
        leads.push({
          source: 'quebec',
          title: query,
          description: r.title || '',
          score: 7,
          timestamp: new Date().toISOString(),
          url: r.url,
        })
      })
    } catch (e) {
      console.warn('Quebec scout error:', e)
    }
  }
  
  return leads
}

/**
 * Hunt Reddit for "I wish there was..."
 */
async function scoutReddit(): Promise<Lead[]> {
  const leads: Lead[] = []
  
  const queries = [
    'I wish there was an app for site:reddit.com',
    'any tool for task automation site:reddit.com/r/smallbusiness',
    'looking for software solution site:reddit.com/r/Entrepreneur',
  ]
  
  for (const query of queries) {
    try {
      const results = await web_search({
        query,
        count: 5,
      })
      
      results.forEach((r: any) => {
        if (r.title?.toLowerCase().includes('wish') || 
            r.title?.toLowerCase().includes('looking for')) {
          leads.push({
            source: 'reddit',
            title: r.title?.substring(0, 80),
            description: r.description || '',
            score: 8,
            timestamp: new Date().toISOString(),
            url: r.url,
          })
        }
      })
    } catch (e) {
      console.warn('Reddit scout error:', e)
    }
  }
  
  return leads
}

/**
 * Scan Product Hunt for gaps
 */
async function scoutProductHunt(): Promise<Lead[]> {
  const leads: Lead[] = []
  
  try {
    const results = await web_search({
      query: 'Product Hunt new launches productivity tool',
      count: 5,
    })
    
    results.forEach((r: any) => {
      leads.push({
        source: 'producthunt',
        title: r.title || '',
        description: r.description || '',
        score: 5,
        timestamp: new Date().toISOString(),
        url: r.url,
      })
    })
  } catch (e) {
    console.warn('Product Hunt scout error:', e)
  }
  
  return leads
}

/**
 * Log leads to file
 */
async function logLeads(leads: Lead[]): Promise<void> {
  if (leads.length === 0) return
  
  const timestamp = new Date().toISOString()
  let content = `# Hot Leads 🐝\n\n`
  content += `*Last updated: ${timestamp}*\n\n`
  
  // Sort by score
  leads.sort((a, b) => b.score - a.score)
  
  for (const lead of leads) {
    const emoji = lead.source === 'quebec' ? '🏪' : 
                  lead.source === 'reddit' ? '💬' : '🎯'
    
    content += `## ${emoji} ${lead.title}\n`
    content += `- **Source:** ${lead.source}\n`
    content += `- **Score:** ${lead.score}/10\n`
    content += `- **Description:** ${lead.description}\n`
    if (lead.url) content += `- **Link:** ${lead.url}\n`
    content += `- **Found:** ${lead.timestamp}\n\n`
  }
  
  await write(content, LEADS_FILE)
  console.log(`🐝 Leads logged to ${LEADS_FILE}`)
}

// Run if called directly
if (require.main === module) {
  sensorBee().then(() => process.exit(0))
}
