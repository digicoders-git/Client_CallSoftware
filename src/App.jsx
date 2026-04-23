import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/design-system.css';

const API_BASE = 'https://server-callsoftware.onrender.com/api';

// ── Icons ──────────────────────────────────────────────
const Icon = {
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.42z"/></svg>,
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  chart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  spin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  callBtn: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.42z"/></svg>,
  wa: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

// ── App ────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ total: 0, answered: 0, failed: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState({ start: today, end: today });

  const fetchData = async (start = dateRange.start, end = dateRange.end) => {
    setLoading(true);
    try {
      let url = `${API_BASE}/call-data`;
      const params = [];
      if (start) params.push(`startDate=${start}`);
      if (end)   params.push(`endDate=${end}`);
      if (params.length) url += '?' + params.join('&');

      const [callRes, campRes, stuRes] = await Promise.all([
        axios.get(url),
        axios.get(`${API_BASE}/campaigns`).catch(() => ({ data: [] })),
        axios.get(`${API_BASE}/students`).catch(() => ({ data: [] })),
      ]);
      const raw = callRes.data;
      const data = Array.isArray(raw) ? raw : (raw.data || []);
      const answered = data.filter(l => l.status === 'ANSWERED').length;
      setLogs(data);
      setCampaigns(campRes.data);
      setStudents(stuRes.data);
      setStats({ total: data.length, answered, failed: data.length - answered });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { if (localStorage.getItem('isLoggedIn')) setLoggedIn(true); }, []);
  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  if (!loggedIn) return <Login onLogin={() => { setLoggedIn(true); localStorage.setItem('isLoggedIn', 'true'); }} />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icon.dashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Icon.chart },
    { id: 'students',  label: 'Students',  icon: Icon.users },
  ];

  return (
    <div className="layout">
      {/* Overlay */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar glass-card ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="logo-icon">{Icon.phone}</span>
            <span className="logo-text">OBD Pro</span>
          </div>
          <button className="icon-btn sidebar__close" onClick={() => setSidebarOpen(false)}>{Icon.close}</button>
        </div>
        <nav className="sidebar__nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-item ${tab === n.id ? 'nav-item--active' : ''}`}
              onClick={() => { setTab(n.id); setSidebarOpen(false); }}>
              {n.icon} <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <button className="nav-item nav-item--danger" onClick={() => { setLoggedIn(false); localStorage.removeItem('isLoggedIn'); }}>
          {Icon.logout} <span>Logout</span>
        </button>
      </aside>

      {/* Main */}
      <div className="main-wrap">
        {/* Topbar */}
        <header className="topbar glass-card">
          <button className="icon-btn hamburger" onClick={() => setSidebarOpen(true)}>{Icon.menu}</button>
          <span className="topbar__title">{navItems.find(n => n.id === tab)?.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="live-badge"><span className="live-dot" />Live</span>
          </div>
        </header>

        <main className="main-content animate-fade-in">
          {tab === 'dashboard' && <Dashboard stats={stats} logs={logs} loading={loading} dateRange={dateRange} onDateChange={(s,e) => { setDateRange({start:s,end:e}); fetchData(s,e); }} />}
          {tab === 'campaigns' && <CampaignAnalysis campaigns={campaigns} />}
          {tab === 'students'  && <StudentManager students={students} onUpdate={fetchData} />}
        </main>
      </div>
    </div>
  );
}

function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true); setMsg('');
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await axios.post(`${API_BASE}/import`, form);
      setMsg(`✓ ${res.data.inserted} records imported`);
      setTimeout(() => setMsg(''), 4000);
    } catch (e) {
      setMsg('Import failed');
      setTimeout(() => setMsg(''), 3000);
    } finally { setLoading(false); e.target.value = ''; }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {msg && <span style={{ fontSize: '12px', color: '#10b981', whiteSpace: 'nowrap' }}>{msg}</span>}
      <label className="btn-primary" style={{ padding: '6px 14px', fontSize: '13px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {loading ? <>{Icon.spin} Importing...</> : <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Import CSV/Excel
        </>}
        <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={handleImport} disabled={loading} />
      </label>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────
function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { username, password } = e.target;
    try {
      await axios.post(`${API_BASE}/login`, { username: username.value, password: password.value });
      onLogin();
    } catch {
      if (username.value === 'DigiCoders' && password.value === '123456789') onLogin();
      else setError('Invalid username or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left__inner">
          <div className="login-logo">{Icon.phone}</div>
          <h1 className="login-title">OBD Pro</h1>
          <p className="login-subtitle">Outbound Dialer Campaign Management — Real-time call tracking & analytics</p>
          <ul className="login-features">
            {['Live call tracking', 'Webhook integration', 'DTMF response capture'].map(f => (
              <li key={f}><span className="feature-dot" />{f}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-wrap animate-fade-in">
          <h2>Welcome back</h2>
          <p className="login-form-sub">Sign in to your OBD dashboard</p>
          {error && <div className="alert alert--error">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label>Username</label>
              <div className="input-wrap">
                <span className="input-icon">{Icon.user}</span>
                <input name="username" className="input-field" placeholder="Enter username" defaultValue="DigiCoders" required />
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">{Icon.lock}</span>
                <input name="password" type="password" className="input-field" placeholder="Enter password" required />
              </div>
            </div>
            <button type="submit" className="btn-primary btn--full" disabled={loading}>
              {loading ? <>{Icon.spin} Signing in...</> : <>Sign In {Icon.arrow}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────
function Dashboard({ stats, logs, loading, dateRange, onDateChange }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [durationFilter, setDurationFilter] = useState('ALL');
  const [campaignFilter, setCampaignFilter] = useState('ALL');
  const [dtmfFilter, setDtmfFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [durationSort, setDurationSort] = useState(null); // null | 'asc' | 'desc'
  const PER_PAGE = 10;

  const sc = s => s === 'ANSWERED'
    ? { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' }
    : s === 'BUSY'
    ? { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' }
    : { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.25)' };

  const uniqueCampaigns = [...new Set(logs.map(l => l.campaignName).filter(Boolean))];
  const uniqueDtmf = [...new Set(logs.map(l => l.dtmf).filter(Boolean))].sort();

  const filtered = logs.filter(log => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      log.phone?.toLowerCase().includes(q) ||
      log.campaignName?.toLowerCase().includes(q) ||
      log.status?.toLowerCase().includes(q) ||
      log.dtmf?.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;

    const matchCampaign = campaignFilter === 'ALL' || log.campaignName === campaignFilter;
    const matchDtmf = dtmfFilter === 'ALL' || (dtmfFilter === 'NONE' ? !log.dtmf : log.dtmf === dtmfFilter);

    const dur = log.duration || 0;
    const matchDuration =
      durationFilter === 'ALL'  ? true :
      durationFilter === '0'    ? dur === 0 :
      durationFilter === '1-30' ? dur >= 1 && dur <= 30 :
      durationFilter === '31-60'? dur >= 31 && dur <= 60 :
      durationFilter === '60+'  ? dur > 60 : true;

    return matchSearch && matchStatus && matchCampaign && matchDtmf && matchDuration;
  });

  const clearFilters = () => { setSearch(''); setStatusFilter('ALL'); setDurationFilter('ALL'); setCampaignFilter('ALL'); setDtmfFilter('ALL'); setPage(1); setDurationSort(null); };
  const isFiltered = search || statusFilter !== 'ALL' || durationFilter !== 'ALL' || campaignFilter !== 'ALL' || dtmfFilter !== 'ALL' || durationSort;

  const sorted = durationSort
    ? [...filtered].sort((a, b) => durationSort === 'asc' ? a.duration - b.duration : b.duration - a.duration)
    : filtered;

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = v => { setSearch(v); setPage(1); };
  const handleStatus = v => { setStatusFilter(v); setPage(1); };
  const handleDuration = v => { setDurationFilter(v); setPage(1); };
  const handleCampaign = v => { setCampaignFilter(v); setPage(1); };
  const toggleDurationSort = () => { setDurationSort(s => s === null ? 'asc' : s === 'asc' ? 'desc' : null); setPage(1); };

  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total Calls"   value={stats.total}    color="#6366f1" />
        <StatCard label="Answered"      value={stats.answered} color="#10b981" />
        <StatCard label="Not Answered"  value={stats.failed}   color="#ef4444" />
        <StatCard label="Conversion"    value={`${stats.total ? Math.round((stats.answered/stats.total)*100) : 0}%`} color="#f59e0b" />
      </div>

      <div className="glass-card card-pad">
        <div className="card-header">
          <h3>Call Details</h3>
          <span className="badge">{sorted.length} records</span>
        </div>

        {/* Date Filter */}
        <div className="date-filter-row">
          <div className="field">
            <label>Start Date</label>
            <input type="date" className="input-field" value={dateRange.start} onChange={e => onDateChange(e.target.value, dateRange.end)} />
          </div>
          <div className="field">
            <label>End Date</label>
            <input type="date" className="input-field" value={dateRange.end} onChange={e => onDateChange(dateRange.start, e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => onDateChange('', '')} style={{ alignSelf: 'flex-end', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Clear Dates</button>
        </div>

        {/* Filters */}
        <div className="filters-row">
          <div className="search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="input-field search-input"
              placeholder="Search phone, campaign, status..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>

          <select className="input-field filter-select" value={statusFilter} onChange={e => handleStatus(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="ANSWERED">Answered</option>
            <option value="NO_ANSWER">No Answer</option>
            <option value="BUSY">Busy</option>
          </select>

          <select className="input-field filter-select" value={durationFilter} onChange={e => handleDuration(e.target.value)}>
            <option value="ALL">All Duration</option>
            <option value="0">0s (No Answer)</option>
            <option value="1-30">1s - 30s</option>
            <option value="31-60">31s - 60s</option>
            <option value="60+">60s+</option>
          </select>

          <select className="input-field filter-select" value={campaignFilter} onChange={e => handleCampaign(e.target.value)}>
            <option value="ALL">All Campaigns</option>
            {uniqueCampaigns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="input-field filter-select" value={dtmfFilter} onChange={e => { setDtmfFilter(e.target.value); setPage(1); }}>
            <option value="ALL">All Buttons</option>
            <option value="NONE">No Input</option>
            {uniqueDtmf.map(d => <option key={d} value={d}>Pressed {d}</option>)}
          </select>

          {isFiltered && (
            <button className="btn-clear" onClick={clearFilters}>✕ Clear</button>
          )}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Phone</th>
                <th onClick={toggleDurationSort} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                  Duration {durationSort === 'asc' ? '↑' : durationSort === 'desc' ? '↓' : '↕'}
                </th>
                <th>Button Pressed</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--text-muted)' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      <span style={{ fontSize: '14px' }}>Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? paginated.map((log, i) => {
                const s = sc(log.status);
                return (
                  <tr key={i}>
                    <td className="muted" style={{ fontWeight: 600, textAlign: 'center' }}>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td>
                      <div className="phone-cell">
                        <span>{log.phone}</span>
                        <a href={`tel:${log.phone}`} className="action-btn action-btn--call" title="Call">{Icon.callBtn}</a>
                        <a href={`https://wa.me/${log.phone}`} target="_blank" rel="noreferrer" className="action-btn action-btn--wa" title="WhatsApp">{Icon.wa}</a>
                      </div>
                    </td>
                    <td onClick={toggleDurationSort} style={{ cursor: 'pointer' }}>
                      {log.duration > 0
                        ? <span className="duration">{log.duration}s {durationSort === 'asc' ? '↑' : durationSort === 'desc' ? '↓' : ''}</span>
                        : <span className="muted">0s</span>}
                    </td>
                    <td>
                      {log.dtmf
                        ? <span className="dtmf-btn">Pressed {log.dtmf}</span>
                        : <span className="muted">No Input</span>}
                    </td>
                    <td>
                      <div className="campaign-cell">
                        <span className="campaign-name">{log.campaignName || '-'}</span>
                        <span className="campaign-id">#{log.campaignId}</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        {log.status === 'ANSWERED' ? Icon.check : Icon.x} {log.status}
                      </span>
                    </td>
                    <td className="muted">{log.agentNumber || '—'}</td>
                    <td className="muted time-cell">
                      {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="8" className="empty-row">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            {(() => {
              const pages = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 3) pages.push('...');
                for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
                if (page < totalPages - 2) pages.push('...');
                pages.push(totalPages);
              }
              return pages.map((p, i) => p === '...' ? (
                <span key={`d${i}`} className="page-dots">...</span>
              ) : (
                <button key={p} className={`page-btn ${page === p ? 'page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ));
            })()}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
            <span className="page-info">{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, sorted.length)} of {sorted.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Campaign Analysis ──────────────────────────────────
function CampaignAnalysis({ campaigns }) {
  const statusMap = { 0: ['Running','#10b981'], 1: ['Paused','#f59e0b'], 2: ['Complete','#818cf8'], 3: ['Stopped','#ef4444'] };
  const typeMap   = { 0:'Simple IVR', 1:'DTMF', 2:'Call Patch', 3:'Custom IVR', 7:'TTS Simple', 8:'TTS DTMF', 9:'TTS Patch' };

  return (
    <div>
      <div className="glass-card card-pad">
        <div className="card-header">
          <h3>Campaign Analysis</h3>
          <span className="badge">{campaigns.length} campaigns</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Type</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
                <th>Total</th>
                <th>Dialed</th>
                <th>Pending</th>
                <th>Connected</th>
                <th>DTMF</th>
                <th>DND</th>
                <th>Pulses</th>
                <th>Webhook</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length > 0 ? campaigns.map((c, i) => {
                const [stLabel, stColor] = statusMap[c.campaignStatus] || ['Unknown','#888'];
                const pending = (c.numbersUploaded||0) - (c.numbersProcessed||0);
                return (
                  <tr key={i}>
                    <td>
                      <div className="campaign-cell">
                        <span className="campaign-name">{c.campaignName}</span>
                        <span className="campaign-id">#{c.campaignId}</span>
                      </div>
                    </td>
                    <td><span className="type-badge">{typeMap[c.templateId]||'Simple IVR'}</span></td>
                    <td><span style={{ color: stColor, fontWeight: 600, fontSize: 12 }}>● {stLabel}</span></td>
                    <td className="muted time-cell">{c.scheduleTime||'—'}</td>
                    <td className="muted time-cell">{c.endTime||'—'}</td>
                    <td className="fw">{c.numbersUploaded||0}</td>
                    <td style={{ color:'#10b981', fontWeight:600 }}>{c.numbersProcessed||0}</td>
                    <td style={{ color: pending>0?'#f59e0b':'var(--text-muted)' }}>{pending}</td>
                    <td style={{ color:'#10b981', fontWeight:700 }}>{c.callsConnected||0}</td>
                    <td><span className="dtmf-badge">{c.dtmfCount||0}</span></td>
                    <td style={{ color:'#ef4444' }}>{c.dndCount||0}</td>
                    <td className="muted">{c.pulses||0}</td>
                    <td><span style={{ color: c.webhook?'#10b981':'var(--text-muted)', fontSize:12 }}>{c.webhook?'✓ On':'Off'}</span></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="13" className="empty-row">No campaign data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Student Manager ────────────────────────────────────
function StudentManager({ students, onUpdate }) {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post(`${API_BASE}/students`, { name: e.target.name.value, phone: e.target.phone.value });
      onUpdate(); setShowAdd(false);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="section-header">
        <h3>Student Database</h3>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {Icon.plus} {showAdd ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card card-pad" style={{ marginBottom: 20 }}>
          <form onSubmit={handleAdd} className="add-student-form">
            <div className="field">
              <label>Full Name</label>
              <input name="name" className="input-field" placeholder="Student Name" required />
            </div>
            <div className="field">
              <label>Phone (with 91)</label>
              <input name="phone" className="input-field" placeholder="91XXXXXXXXXX" required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', height: 46 }}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      )}

      <div className="students-grid">
        {students.map((s, i) => (
          <div key={i} className="glass-card student-card">
            <div className="student-avatar">{s.name[0]}</div>
            <div>
              <div className="student-name">{s.name}</div>
              <div className="student-phone">+{s.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────
function StatCard({ label, value, color }) {
  const icons = {
    'Total Calls':  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.42z"/></svg>,
    'Answered':     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    'Not Answered': <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    'Conversion':   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  };
  return (
    <div className="glass-card stat-card">
      <div className="stat-icon" style={{ background: `${color}20` }}>
        {icons[label]}
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}
