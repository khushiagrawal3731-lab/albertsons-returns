import React from 'react';

export default function Navbar({ user, onLogout, setPage }) {
  return (
    <div className="navbar">
      <h1>🛒 Albertsons Returns System</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user.role === 'customer' && (
          <>
            <button className="btn btn-secondary" onClick={() => setPage('dashboard')}>Dashboard</button>
            <button className="btn btn-secondary" onClick={() => setPage('orders')}>My Orders</button>
            <button className="btn btn-secondary" onClick={() => setPage('my-returns')}>My Returns</button>
          </>
        )}
        <span style={{ color: '#ccc' }}>👤 {user.name}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}