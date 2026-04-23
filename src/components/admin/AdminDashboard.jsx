import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../context/AuthContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, answered: 0, failed: 0, assigned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dataRes, assignRes] = await Promise.all([
          axios.get(`${API_BASE}/call-data`),
          axios.get(`${API_BASE}/admin/assignments`)
        ]);
        const data = dataRes.data;
        const answered = data.filter(l => l.status === 'ANSWERED').length;
        const totalAssigned = assignRes.data.reduce((s, u) => s + u.count, 0);
        setStats({ total: data.length, answered, failed: data.length - answered, assigned: totalAssigned });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Total Records', value: stats.total,    color: '#6366f1' },
    { label: 'Answered',      value: stats.answered, color: '#10b981' },
    { label: 'Not Answered',  value: stats.failed,   color: '#ef4444' },
    { label: 'Assigned',      value: stats.assigned, color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Dashboard Overview</h2>
      {loading ? <Loader /> : (
        <div className="stats-grid">
          {cards.map(c => (
            <div key={c.label} className="glass-card stat-card">
              <div className="stat-icon" style={{ background: `${c.color}20` }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div>
                <div className="stat-label">{c.label}</div>
                <div className="stat-value" style={{ color: c.color }}>{c.value.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </div>
  );
}
