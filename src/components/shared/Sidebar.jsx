import { useAuth } from '../../context/AuthContext';

const icons = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  users:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  assign:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  data:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  campaigns: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  logout:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  phone:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.42z"/></svg>,
  remarks:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard',   icon: icons.dashboard },
    { id: 'users',     label: 'Manage Users', icon: icons.users },
    { id: 'assign',    label: 'Assign Data',  icon: icons.assign },
    { id: 'data',      label: 'Call Data',    icon: icons.data },
    { id: 'campaigns', label: 'Campaigns',    icon: icons.campaigns },
    { id: 'remarks',   label: 'Remarks',      icon: icons.remarks },
  ];

  const userNav = [
    { id: 'mydata',   label: 'My Data',   icon: icons.data },
    { id: 'remarks',  label: 'My Remarks', icon: icons.remarks },
  ];

  const navItems = user?.role === 'admin' ? adminNav : userNav;

  return (
    <>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar glass-card ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="logo-icon">{icons.phone}</span>
            <span className="logo-text">OBD Pro</span>
          </div>
          <button className="icon-btn sidebar__close" onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '0 8px 16px', borderBottom: '1px solid var(--glass-border)', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Logged in as</div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.name || user?.username}</div>
          <span style={{ fontSize: '11px', background: user?.role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)', color: user?.role === 'admin' ? '#818cf8' : '#10b981', padding: '2px 8px', borderRadius: '20px' }}>
            {user?.role?.toUpperCase()}
          </span>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-item ${activeTab === n.id ? 'nav-item--active' : ''}`}
              onClick={() => { setActiveTab(n.id); setSidebarOpen(false); }}>
              {n.icon} <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <button className="nav-item nav-item--danger" onClick={logout}>
          {icons.logout} <span>Logout</span>
        </button>
      </aside>
    </>
  );
}
