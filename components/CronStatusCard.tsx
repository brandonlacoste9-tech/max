/**
 * MAX Command Center - Cron Status Card
 * Linear-style "Imperial Minimalism" aesthetic
 */

import React, { useState, useEffect } from 'react';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  status: 'active' | 'paused' | 'running';
  lastRun: string;
  nextRun: string;
}

const cronJobs: CronJob[] = [
  {
    id: 'nightly-hive',
    name: 'NightlyHiveAudit',
    schedule: '0 3 * * *',
    status: 'active',
    lastRun: '2026-02-13T03:00:00Z',
    nextRun: '2026-02-14T03:00:00Z'
  },
  {
    id: 'zyeute-health',
    name: 'ZyeuteHealth',
    schedule: '*/30 * * * *',
    status: 'active',
    lastRun: '2026-02-13T00:14:00Z',
    nextRun: '2026-02-13T00:30:00Z'
  },
  {
    id: 'git-watch',
    name: 'GitWatch',
    schedule: '0 */6 * * *',
    status: 'active',
    lastRun: '2026-02-13T18:00:00Z',
    nextRun: '2026-02-14T00:00:00Z'
  },
  {
    id: 'qc-hunter',
    name: 'QCLeadHunter',
    schedule: '0 */12 * * *',
    status: 'active',
    lastRun: '2026-02-13T12:00:00Z',
    nextRun: '2026-02-14T00:00:00Z'
  }
];

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export default function CronStatusCard() {
  const [jobs, setJobs] = useState(cronJobs);

  return (
    <div style={{
      background: '#0A0A0A',
      border: '1px solid #1F1F1F',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #1F1F1F'
      }}>
        <h3 style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: '#EDEDED',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#D4AF37', // Imperial Gold
            boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)'
          }} />
          Worker Bees
        </h3>
        <span style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '11px',
          color: '#666'
        }}>
          {jobs.filter(j => j.status === 'active').length} active
        </span>
      </div>

      {/* Job List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {jobs.map(job => (
          <div key={job.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            background: '#111111',
            borderRadius: '6px',
            border: '1px solid #1A1A1A'
          }}>
            <div>
              <div style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#EDEDED'
              }}>
                {job.name}
              </div>
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                color: '#555',
                marginTop: '2px'
              }}>
                {job.schedule}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 500,
                background: job.status === 'active' 
                  ? 'rgba(212, 175, 55, 0.15)' 
                  : 'rgba(100, 100, 100, 0.15)',
                color: job.status === 'active' 
                  ? '#D4AF37' 
                  : '#666',
                border: job.status === 'active'
                  ? '1px solid rgba(212, 175, 55, 0.3)'
                  : '1px solid transparent'
              }}>
                {job.status === 'active' && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#D4AF37'
                  }} />
                )}
                {Case()}
              </span>
              <div style={{
                fontFamily: '"job.status.toUpperIBM Plex Mono", monospace',
                fontSize: '10px',
                color: '#444',
                marginTop: '4px'
              }}>
                next {formatTime(job.nextRun)}
              </div>
            </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop</div>
          : '12px',
        paddingTop: '12px',
        borderTop: '1px solid #1F1F1F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '11px',
          color: '#666',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'all 0.2s'
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#1A1A1A';
          e.currentTarget.style.color = '#D4AF37';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#666';
        }}
        >
          + Spawn Worker
        </button>
        
        <span style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '10px',
          color: '#333'
        }}>
          Hive Uptime: 99.9%
        </span>
      </div>
    </div>
  );
}
