import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../../context/AuthContext';

export default function RemarkModal({ log, isAdmin, onClose, onSaved }) {
  const [remark, setRemark] = useState(log.remark?.remark || '');
  const [callDone, setCallDone] = useState(log.remark?.call_done || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const r = await axios.post(`${API_BASE}/user/remark`, { call_log_id: log._id, remark, call_done: callDone });
      onSaved({ ...log, remark: r.data });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this remark?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/remarks/${log.remark._id}`);
      onSaved({ ...log, remark: null });
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Add Remark</h3>
          <button className="icon-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Call Info */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Phone</span>
            <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>{log.phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Campaign</span>
            <span style={{ fontWeight: '600' }}>{log.campaignName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Status</span>
            <span style={{ color: log.status === 'ANSWERED' ? '#10b981' : '#ef4444', fontWeight: '600', fontSize: '13px' }}>{log.status}</span>
          </div>
        </div>

        {/* Call Done Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '14px', background: callDone ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${callDone ? 'rgba(16,185,129,0.2)' : 'var(--glass-border)'}`, cursor: 'pointer' }} onClick={() => setCallDone(!callDone)}>
          <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: callDone ? '#10b981' : 'transparent', border: `2px solid ${callDone ? '#10b981' : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {callDone && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: callDone ? '#10b981' : 'var(--text-muted)' }}>Call Done / Contacted</span>
        </div>

        {/* Remark Text */}
        <div className="field" style={{ marginBottom: '20px' }}>
          <label>Remark / Notes</label>
          <textarea className="input-field" rows="4" placeholder="Add your notes here..." value={remark} onChange={e => setRemark(e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ flex: 1, height: '46px' }}>
            {loading ? 'Saving...' : 'Save Remark'}
          </button>
          {isAdmin && log.remark && (
            <button onClick={handleDelete} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              Delete
            </button>
          )}
        </div>

        {log.remark && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Last updated by <strong>{log.remark.user_name}</strong> · {new Date(log.remark.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </div>
        )}
      </div>
    </div>
  );
}
