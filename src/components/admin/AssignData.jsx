import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../context/AuthContext';

export default function AssignData() {
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ userId: '', count: 800, startDate: '', endDate: '', campaignId: '', status: '' });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [u, a, c] = await Promise.all([
          axios.get(`${API_BASE}/admin/users`),
          axios.get(`${API_BASE}/admin/assignments`),
          axios.get(`${API_BASE}/campaigns`).catch(() => ({ data: [] }))
        ]);
        setUsers(u.data); setAssignments(a.data); setCampaigns(c.data);
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const filters = {};
      if (form.startDate) filters.startDate = form.startDate;
      if (form.endDate)   filters.endDate   = form.endDate;
      if (form.campaignId) filters.campaignId = form.campaignId;
      if (form.status)    filters.status    = form.status;

      const r = await axios.post(`${API_BASE}/admin/assign`, { userId: form.userId, count: parseInt(form.count), filters });
      setMsg({ text: `✓ ${r.data.assigned} records assigned successfully!`, type: 'success' });
      const a = await axios.get(`${API_BASE}/admin/assignments`);
      setAssignments(a.data);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Assignment failed', type: 'error' });
    } finally { setLoading(false); setTimeout(() => setMsg({ text: '', type: '' }), 4000); }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: '700' }}>Assign Data to Users</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Assignment Form */}
        <div className="glass-card card-pad">
          <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>New Assignment</h3>
          {msg.text && <div className={`alert alert--${msg.type}`} style={{ marginBottom: '16px' }}>{msg.text}</div>}
          <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="field">
              <label>Select User</label>
              <select className="input-field" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required>
                <option value="">-- Select User --</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name} (@{u.username})</option>)}
              </select>
            </div>
            <div className="field">
              <label>Number of Records</label>
              <input type="number" className="input-field" value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} min="1" max="10000" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="field">
                <label>Start Date (optional)</label>
                <input type="date" className="input-field" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="field">
                <label>End Date (optional)</label>
                <input type="date" className="input-field" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Campaign (optional)</label>
              <select className="input-field" value={form.campaignId} onChange={e => setForm({ ...form, campaignId: e.target.value })}>
                <option value="">All Campaigns</option>
                {campaigns.map(c => <option key={c.campaignId} value={c.campaignId}>{c.campaignName}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Status Filter (optional)</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="">All Status</option>
                <option value="ANSWERED">Answered</option>
                <option value="INITIATED">Not Answered</option>
                <option value="RINGING">Ringing</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: '46px' }}>
              {loading ? 'Assigning...' : `Assign ${form.count} Records`}
            </button>
          </form>
        </div>

        {/* Assignment Stats */}
        <div className="glass-card card-pad">
          <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>Assignment Summary</h3>
          {assignments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assignments.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{a.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@{a.username}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#6366f1' }}>{a.count.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>records assigned</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-row">No assignments yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
