import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../context/AuthContext';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    try { const r = await axios.get(`${API_BASE}/admin/users`); setUsers(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post(`${API_BASE}/admin/users`, form);
      setMsg('User created!'); setShowAdd(false); setForm({ username: '', password: '', name: '' });
      fetchUsers();
    } catch (err) { setMsg(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); setTimeout(() => setMsg(''), 3000); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await axios.delete(`${API_BASE}/admin/users/${id}`); fetchUsers(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Manage Users</h2>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {msg && <div className="alert alert--success" style={{ marginBottom: '16px' }}>{msg}</div>}

      {showAdd && (
        <div className="glass-card card-pad" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Create New User</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div className="field">
              <label>Full Name</label>
              <input className="input-field" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Username</label>
              <input className="input-field" placeholder="john123" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: '46px' }}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="glass-card card-pad">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((u, i) => (
                <tr key={u._id}>
                  <td className="muted">{i + 1}</td>
                  <td style={{ fontWeight: '600' }}>{u.name}</td>
                  <td className="muted">{u.username}</td>
                  <td><span className="type-badge">{u.role}</span></td>
                  <td className="muted time-cell">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td><span style={{ color: u.is_active ? '#10b981' : '#ef4444', fontSize: '12px', fontWeight: '600' }}>● {u.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button onClick={() => handleDelete(u._id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="empty-row">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
