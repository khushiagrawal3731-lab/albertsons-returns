import React from 'react';

export default function Dashboard({ user, setPage }) {
  return (
    <div>
      <h1 className="page-title">Welcome back, {user.name}! 👋</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>📦</h2>
          <p>View My Orders</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setPage('orders')}>
            View Orders
          </button>
        </div>
        <div className="stat-card">
          <h2>🔄</h2>
          <p>Request a Return</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setPage('create-return')}>
            New Return
          </button>
        </div>
        <div className="stat-card">
          <h2>📋</h2>
          <p>Track My Returns</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setPage('my-returns')}>
            My Returns
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>How Returns Work</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { step: '1', title: 'Select Order', desc: 'Choose the order you want to return' },
            { step: '2', title: 'Fill Details', desc: 'Provide reason and item condition' },
            { step: '3', title: 'Submit Request', desc: 'We validate and process your return' },
            { step: '4', title: 'Track Status', desc: 'Monitor approval in real-time' },
          ].map(item => (
            <div key={item.step} style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#e94560', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold' }}>
                {item.step}
              </div>
              <h4>{item.title}</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '0.5rem', color: '#1a1a2e' }}>Return Policy</h3>
        <ul style={{ color: '#666', lineHeight: '2', paddingLeft: '1.5rem' }}>
          <li>Returns accepted within <strong>30 days</strong> of purchase</li>
          <li>Item must be in <strong>good or better condition</strong></li>
          <li>Poor condition items are automatically rejected</li>
          <li>Approved returns processed within 3-5 business days</li>
        </ul>
      </div>
    </div>
  );
}