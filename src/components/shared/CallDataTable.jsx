import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../context/AuthContext';
import RemarkModal from './RemarkModal';

export default function CallDataTable({ isAdmin }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dtmfFilter, setDtmfFilter] = useState('ALL');
  const [durationSort, setDurationSort] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '2026-04-23', end: '2026-04-23' });
  const PER_PAGE = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end)   params.append('endDate', dateRange.end);
      const r = await axios.get(`${API_BASE}/call-data?${params}`);
      setLogs(Array.isArray(r.data) ? r.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [dateRange]);

  const sc = s => s === 'ANSWERED'
    ? { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' }
    : s === 'RINGING'
    ? { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' }
    : { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.25)' };

  const uniqueDtmf = [...new Set(logs.map(l => l.dtmf).filter(Boolean))].sort();

  const filtered = logs.filter(log => {
    const q = search.toLowerCase();
    const matchSearch = !q || log.phone?.includes(q) || log.campaignName?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchDtmf = dtmfFilter === 'ALL' ? true : dtmfFilter === 'NONE' ? !log.dtmf : log.dtmf === dtmfFilter;
    return matchSearch && matchStatus && matchDtmf;
  });

  const sorted = durationSort ? [...filtered].sort((a, b) => durationSort === 'asc' ? a.duration - b.duration : b.duration - a.duration) : filtered;
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleRemarkSaved = (updatedLog) => {
    setLogs(prev => prev.map(l => l._id === updatedLog._id ? { ...l, remark: updatedLog.remark } : l));
    setSelectedLog(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h2 style={{ fontSize: '22px', fontWeight: '700' }}>{isAdmin ? 'All Call Data' : 'My Assigned Data'}</h2>
        <span className="badge">{sorted.length} records</span>
      </div>

      {/* Date Filter */}
      <div className="date-filter-row">
        <div className="field">
          <label>Start Date</label>
          <input type="date" className="input-field" value={dateRange.start} onChange={e => { setDateRange(p => ({ ...p, start: e.target.value })); setPage(1); }} />
        </div>
        <div className="field">
          <label>End Date</label>
          <input type="date" className="input-field" value={dateRange.end} onChange={e => { setDateRange(p => ({ ...p, end: e.target.value })); setPage(1); }} />
        </div>
        <button className="btn-primary" onClick={() => { setDateRange({ start: '', end: '' }); setPage(1); }} style={{ alignSelf: 'flex-end', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', height: '46px' }}>
          Clear
        </button>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <div className="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="input-field search-input" placeholder="Search phone, campaign..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input-field filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="ALL">All Status</option>
          <option value="ANSWERED">Answered</option>
          <option value="INITIATED">Initiated</option>
          <option value="RINGING">Ringing</option>
        </select>
        <select className="input-field filter-select" value={dtmfFilter} onChange={e => { setDtmfFilter(e.target.value); setPage(1); }}>
          <option value="ALL">All Buttons</option>
          <option value="NONE">No Input</option>
          {uniqueDtmf.map(d => <option key={d} value={d}>Pressed {d}</option>)}
        </select>
        {(search || statusFilter !== 'ALL' || dtmfFilter !== 'ALL') && (
          <button className="btn-clear" onClick={() => { setSearch(''); setStatusFilter('ALL'); setDtmfFilter('ALL'); setPage(1); }}>✕ Clear</button>
        )}
      </div>

      <div className="glass-card card-pad">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Phone</th>
                <th onClick={() => setDurationSort(s => s === null ? 'asc' : s === 'asc' ? 'desc' : null)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Duration {durationSort === 'asc' ? '↑' : durationSort === 'desc' ? '↓' : '↕'}
                </th>
                <th>Button Pressed</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Time</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ padding: '60px', textAlign: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </td></tr>
              ) : paginated.length > 0 ? paginated.map((log, i) => {
                const s = sc(log.status);
                return (
                  <tr key={log._id || i}>
                    <td className="muted" style={{ fontWeight: 600 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td>
                      <div className="phone-cell">
                        <span>{log.phone}</span>
                        <a href={`tel:${log.phone}`} className="action-btn action-btn--call" title="Call">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.42z"/></svg>
                        </a>
                        <a href={`https://wa.me/${log.phone}`} target="_blank" rel="noreferrer" className="action-btn action-btn--wa" title="WhatsApp">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                        </a>
                      </div>
                    </td>
                    <td>{log.duration > 0 ? <span className="duration">{log.duration}s</span> : <span className="muted">0s</span>}</td>
                    <td>{log.dtmf ? <span className="dtmf-btn">Pressed {log.dtmf}</span> : <span className="muted">No Input</span>}</td>
                    <td>
                      <div className="campaign-cell">
                        <span className="campaign-name">{log.campaignName || '-'}</span>
                        <span className="campaign-id">#{log.campaignId}</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        {log.status}
                      </span>
                    </td>
                    <td className="muted time-cell">
                      {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </td>
                    <td>
                      {log.remark ? (
                        <button onClick={() => setSelectedLog(log)} style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                          ✓ {log.remark.call_done ? 'Called' : 'Remarked'}
                        </button>
                      ) : (
                        <button onClick={() => setSelectedLog(log)} style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                          + Remark
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="8" className="empty-row">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            {(() => {
              const pages = [];
              if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
              else {
                pages.push(1);
                if (page > 3) pages.push('...');
                for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
                if (page < totalPages - 2) pages.push('...');
                pages.push(totalPages);
              }
              return pages.map((p, i) => p === '...' ? <span key={`d${i}`} className="page-dots">...</span> : (
                <button key={p} className={`page-btn ${page === p ? 'page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ));
            })()}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
            <span className="page-info">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, sorted.length)} of {sorted.length}</span>
          </div>
        )}
      </div>

      {selectedLog && (
        <RemarkModal log={selectedLog} isAdmin={isAdmin} onClose={() => setSelectedLog(null)} onSaved={handleRemarkSaved} />
      )}
    </div>
  );
}
