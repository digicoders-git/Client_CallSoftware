import { useState } from 'react';
import axios from 'axios';
import { useAuth, API_BASE } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { username, password } = e.target;
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username: username.value, password: password.value });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left__inner">
          <div className="login-logo">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.42z"/></svg>
          </div>
          <h1 className="login-title">OBD Pro</h1>
          <p className="login-subtitle">Outbound Dialer Campaign Management — Real-time call tracking & analytics</p>
          <ul className="login-features">
            {['Live call tracking', 'User assignment system', 'Remark & follow-up'].map(f => (
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
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input name="username" className="input-field" placeholder="Enter username" required />
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input name="password" type="password" className="input-field" placeholder="Enter password" required />
              </div>
            </div>
            <button type="submit" className="btn-primary btn--full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
