import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const url = isRegister ? `${API}/auth/register` : `${API}/auth/login`;
      const res = await axios.post(url, form);
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🛒 Returns System</h2>
        <p>Albertsons Order Returns Portal</p>

        <div className="tabs">
          <button className={`tab ${!isRegister ? 'active' : ''}`} onClick={() => setIsRegister(false)}>Login</button>
          <button className={`tab ${isRegister ? 'active' : ''}`} onClick={() => setIsRegister(true)}>Register</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {isRegister && (
          <div className="form-group">
            <label>Full Name</label>
            <input placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '0.85rem' }}>
          Test: customer@test.com / password123<br />
          Admin: admin@test.com / password123
        </p>
      </div>
    </div>
  );
}