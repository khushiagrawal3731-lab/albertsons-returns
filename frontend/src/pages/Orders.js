import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://albertsons-returns.onrender.com/api';

export default function Orders({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const daysSince = (date) => Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));

  if (loading) return <div className="card">Loading orders...</div>;

  return (
    <div>
      <h1 className="page-title">My Orders 📦</h1>
      {orders.length === 0 ? (
        <div className="empty-state"><h3>No orders found</h3><p>Your orders will appear here</p></div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => {
            const days = daysSince(order.order_date);
            const returnable = days <= 30;
            return (
              <div key={order.id} className="order-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{order.order_number}</strong>
                  <span className={`badge ${returnable ? 'badge-approved' : 'badge-rejected'}`}>
                    {returnable ? 'Returnable' : 'Expired'}
                  </span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Amount: <strong>${order.total_amount}</strong></p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{days} days ago</p>
                {returnable && (
                  <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}
                    onClick={() => { localStorage.setItem('selectedOrder', order.id); setPage('create-return'); }}>
                    Request Return
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}