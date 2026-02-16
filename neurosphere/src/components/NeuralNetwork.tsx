import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface Node {
  id: string
  name: string
  type: 'max' | 'agent' | 'hive' | 'heartbeat'
  status: 'active' | 'idle' | 'sleeping'
}

interface NeuralNetworkProps {
  nodes: Node[]
  onNodeClick: (node: Node) => void
  selectedNode: Node | null
}

export default function NeuralNetwork({ nodes, onNodeClick, selectedNode }: NeuralNetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Clear previous
    svg.selectAll('*').remove()

    // Create center node (MAX)
    const centerX = width / 2
    const centerY = height / 2

    // Create links from center to all nodes
    const links: { source: string; target: string }[] = []
    nodes.forEach(node => {
      if (node.id !== 'max') {
        links.push({ source: 'max', target: node.id })
      }
    })

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', (_, i) => {
        const angle = (i / (nodes.length - 1)) * 2 * Math.PI - Math.PI / 2
        return centerX + Math.cos(angle) * 120
      })
      .attr('y2', (_, i) => {
        const angle = (i / (nodes.length - 1)) * 2 * Math.PI - Math.PI / 2
        return centerY + Math.sin(angle) * 120
      })
      .attr('stroke', 'rgba(139, 92, 246, 0.3)')
      .attr('stroke-width', 2)

    // Animate links
    link
      .attr('stroke-dasharray', function() { return this.getTotalLength() })
      .attr('stroke-dashoffset', function() { return this.getTotalLength() })
      .transition()
      .duration(1500)
      .delay((_, i) => i * 100)
      .attr('stroke-dashoffset', 0)

    // Draw nodes
    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d, i) => {
        if (d.id === 'max') {
          return `translate(${centerX}, ${centerY})`
        }
        const angle = (i / (nodes.length - 1)) * 2 * Math.PI - Math.PI / 2
        const radius = 120
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        return `translate(${x}, ${y})`
      })
      .style('cursor', 'pointer')
      .on('click', (_, d) => onNodeClick(d))

    // Node circles
    nodeGroups.append('circle')
      .attr('r', d => d.id === 'max' ? 40 : 25)
      .attr('fill', d => {
        if (d.id === 'max') return '#F59E0B' // Gold for MAX
        if (d.type === 'agent') return '#8B5CF6' // Purple
        if (d.type === 'hive') return '#EC4899' // Pink
        return '#10B981' // Green for heartbeat
      })
      .attr('opacity', d => d.status === 'active' ? 1 : 0.4)
      .attr('stroke', 'rgba(255,255,255,0.3)')
      .attr('stroke-width', 2)

    // Pulsing animation for active nodes
    nodeGroups.filter(d => d.status === 'active')
      .append('circle')
      .attr('r', d => d.id === 'max' ? 40 : 25)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.id === 'max') return '#F59E0B'
        if (d.type === 'agent') return '#8B5CF6'
        if (d.type === 'hive') return '#EC4899'
        return '#10B981'
      })
      .attr('stroke-width', 2)
      .attr('opacity', 0.5)
      .transition()
      .duration(2000)
      .repeat()
      .attr('r', d => (d.id === 'max' ? 40 : 25) + 15)
      .attr('opacity', 0)
      .transition()
      .duration(0)
      .attr('r', d => d.id === 'max' ? 40 : 25)
      .attr('opacity', 0.5)

    // Node labels
    nodeGroups.append('text')
      .text(d => d.name)
      .attr('dy', d => d.id === 'max' ? 55 : 40)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', d => d.id === 'max' ? '14px' : '11px')
      .attr('font-weight', d => d.id === 'max' ? 'bold' : 'normal')
      .attr('opacity', 0.8)

    // Status indicators
    nodeGroups.append('circle')
      .attr('cx', d => (d.id === 'max' ? 30 : 18))
      .attr('cy', d => d.id === 'max' ? -30 : -18)
      .attr('r', 5)
      .attr('fill', d => d.status === 'active' ? '#10B981' : d.status === 'idle' ? '#F59E0B' : '#6B7280')

  }, [nodes, onNodeClick, selectedNode])

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full"
      style={{ background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)' }}
    />
  )
}
