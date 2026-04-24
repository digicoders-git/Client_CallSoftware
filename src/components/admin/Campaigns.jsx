import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../context/AuthContext';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/campaigns`).then(r => setCampaigns(Array.isArray(r.data) ? r.data : [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statusMap = { 0: ['Running','#10b981'], 1: ['Paused','#f59e0b'], 2: ['Complete','#818cf8'], 3: ['Stopped','#ef4444'] };
  const typeMap   = { 0:'Simple IVR', 1:'DTMF', 2:'Call Patch', 3:'Custom IVR', 7:'TTS Simple', 8:'TTS DTMF', 9:'TTS Patch' };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Campaign Analysis</h2>
        <span className="badge">{campaigns.length} campaigns</span>
      </div>
      <div className="glass-card card-pad">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Campaign</th><th>Type</th><th>Status</th><th>Start</th><th>End</th>
                <th>Total</th><th>Dialed</th><th>Connected</th><th>DTMF</th><th>DND</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" style={{ padding: '60px', textAlign: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </td></tr>
              ) : campaigns.map((c, i) => {
                const [stLabel, stColor] = statusMap[c.campaignStatus] || ['Unknown','#888'];
                return (
                  <tr key={i}>
                    <td><div className="campaign-cell"><span className="campaign-name">{c.campaignName}</span><span className="campaign-id">#{c.campaignId}</span></div></td>
                    <td><span className="type-badge">{typeMap[c.templateId] || 'Simple IVR'}</span></td>
                    <td><span style={{ color: stColor, fontWeight: 600, fontSize: 12 }}>● {stLabel}</span></td>
                    <td className="muted time-cell">{c.scheduleTime || '—'}</td>
                    <td className="muted time-cell">{c.endTime || '—'}</td>
                    <td className="fw">{c.numbersUploaded || 0}</td>
                    <td style={{ color:'#10b981', fontWeight:600 }}>{c.numbersProcessed || 0}</td>
                    <td style={{ color:'#10b981', fontWeight:700 }}>{c.callsConnected || 0}</td>
                    <td><span className="dtmf-btn">{c.dtmfCount || 0}</span></td>
                    <td style={{ color:'#ef4444' }}>{c.dndCount || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
