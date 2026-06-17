import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://albertsons-returns.onrender.com/api';

export default function MyReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/returns`, { headers: { Authorization: `Bearer ${token}` } });
        setReturns(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="card">Loading returns...</div>;

  return (
    <div>
      <h1 className="page-title">My Returns 📋</h1>
      {returns.length === 0 ? (
        <div className="empty-state"><h3>No return requests yet</h3><p>Your return requests will appear here</p></div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Order</th><th>Reason</th><th>Condition</th><th>Date</th><th>Status</th><th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {returns.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.order_number}</strong><br /><small>${r.total_amount}</small></td>
                  <td>{r.reason?.replace('_', ' ')}</td>
                  <td>{r.item_condition}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                  <td>{r.admin_comments || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}