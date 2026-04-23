import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/shared/Sidebar';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import AssignData from './components/admin/AssignData';
import AdminRemarks from './components/admin/AdminRemarks';
import Campaigns from './components/admin/Campaigns';
import CallDataTable from './components/shared/CallDataTable';
import './styles/design-system.css';

function AppContent() {
  const { user } = useAuth();
  const [tab, setTab] = useState(user?.role === 'admin' ? 'dashboard' : 'mydata');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Login />;

  const renderTab = () => {
    if (user.role === 'admin') {
      switch (tab) {
        case 'dashboard': return <AdminDashboard />;
        case 'users':     return <ManageUsers />;
        case 'assign':    return <AssignData />;
        case 'data':      return <CallDataTable isAdmin={true} />;
        case 'campaigns': return <Campaigns />;
        case 'remarks':   return <AdminRemarks />;
        default:          return <AdminDashboard />;
      }
    } else {
      switch (tab) {
        case 'mydata':  return <CallDataTable isAdmin={false} />;
        case 'remarks': return <CallDataTable isAdmin={false} />;
        default:        return <CallDataTable isAdmin={false} />;
      }
    }
  };

  const tabLabels = {
    dashboard: 'Dashboard', users: 'Manage Users', assign: 'Assign Data',
    data: 'Call Data', campaigns: 'Campaigns', remarks: user.role === 'admin' ? 'Remarks' : 'My Remarks',
    mydata: 'My Data'
  };

  return (
    <div className="layout">
      <Sidebar activeTab={tab} setActiveTab={setTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="main-wrap">
        <header className="topbar glass-card">
          <button className="icon-btn hamburger" onClick={() => setSidebarOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span className="topbar__title">{tabLabels[tab]}</span>
          <span className="live-badge"><span className="live-dot" />Live</span>
        </header>
        <main className="main-content animate-fade-in">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
