import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../context/AuthContext';

export default function AdminRemarks() {
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRemarks = async () => {
    try {
      const r = await axios.get(`${API_BASE}/admin/remarks`);
      setRemarks(r.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRemarks(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this remark?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/remarks/${id}`);
      setRemarks(prev => prev.filter(r => r._id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2 style={{ fontSize: '22px', fontWeight: '700' }}>All Remarks</h2>
        <span className="badge">{remarks.length} remarks</span>
      </div>

      <div className="glass-card card-pad">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Phone</th>
                <th>Campaign</th>
                <th>Remarked By</th>
                <th>Call Done</th>
                <th>Remark</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ padding: '60px', textAlign: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </td></tr>
              ) : remarks.length > 0 ? remarks.map((r, i) => (
                <tr key={r._id}>
                  <td className="muted">{i + 1}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{r.call_log_id?.phone || '—'}</td>
                  <td className="muted">{r.call_log_id?.campaign_name || '—'}</td>
                  <td style={{ fontWeight: '600' }}>{r.user_name}</td>
                  <td>
                    <span style={{ color: r.call_done ? '#10b981' : '#ef4444', fontWeight: '600', fontSize: '12px' }}>
                      {r.call_done ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {r.remark || '—'}
                  </td>
                  <td className="muted time-cell">
                    {new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(r._id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="empty-row">No remarks yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
