import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function AdminPanel() {
  const [returns, setReturns] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r, a] = await Promise.all([
        axios.get(`${API}/admin/returns`, { headers }),
        axios.get(`${API}/admin/analytics`, { headers })
      ]);
      setReturns(r.data);
      setAnalytics(a.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAction = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/returns/${id}`, { status, admin_comments: comment[id] || '' }, { headers });
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div>
      <h1 className="page-title">Admin Panel 🛠️</h1>
      {analytics && (
        <div className="stats-grid">
          <div className="stat-card"><h2>{analytics.total}</h2><p>Total Returns</p></div>
          <div className="stat-card"><h2 style={{ color: '#856404' }}>{analytics.pending}</h2><p>Pending</p></div>
          <div className="stat-card"><h2 style={{ color: '#155724' }}>{analytics.approved}</h2><p>Approved</p></div>
          <div className="stat-card"><h2 style={{ color: '#721c24' }}>{analytics.rejected}</h2><p>Rejected</p></div>
        </div>
      )}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>All Return Requests</h3>
        {returns.length === 0 ? (
          <div className="empty-state"><h3>No return requests yet</h3></div>
        ) : (
          <table>
            <thead>
              <tr><th>Customer</th><th>Order</th><th>Reason</th><th>Condition</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {returns.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.customer_name}</strong><br /><small>{r.customer_email}</small></td>
                  <td>{r.order_number}<br /><small>${r.total_amount}</small></td>
                  <td>{r.reason?.replace('_', ' ')}</td>
                  <td>{r.item_condition}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                  <td>
                    {r.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <input placeholder="Comment (optional)" style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd' }}
                          onChange={e => setComment({ ...comment, [r.id]: e.target.value })} />
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-success" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleAction(r.id, 'approved')}>✓ Approve</button>
                          <button className="btn btn-danger" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }} onClick={() => handleAction(r.id, 'rejected')}>✗ Reject</button>
                        </div>
                      </div>
                    )}
                    {r.status !== 'pending' && <span style={{ color: '#666', fontSize: '0.85rem' }}>{r.admin_comments || 'No comments'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}