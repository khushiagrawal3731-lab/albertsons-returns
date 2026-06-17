import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function CreateReturn({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order_id: '', reason: '', item_condition: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
      const selectedOrder = localStorage.getItem('selectedOrder');
      if (selectedOrder) { setForm(f => ({ ...f, order_id: selectedOrder })); localStorage.removeItem('selectedOrder'); }
    };
    fetchOrders();
  }, []);

  const handleSubmit = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/returns`, form, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Return request submitted successfully!');
      setTimeout(() => setPage('my-returns'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="page-title">Request a Return 🔄</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="form-group">
          <label>Select Order</label>
          <select value={form.order_id} onChange={e => setForm({ ...form, order_id: e.target.value })}>
            <option value="">-- Select an order --</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>{o.order_number} - ${o.total_amount} ({new Date(o.order_date).toLocaleDateString()})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Reason for Return</label>
          <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}>
            <option value="">-- Select reason --</option>
            <option value="defective">Defective / Damaged</option>
            <option value="wrong_item">Wrong Item Received</option>
            <option value="changed_mind">Changed My Mind</option>
            <option value="not_as_described">Not as Described</option>
            <option value="size_issue">Size / Fit Issue</option>
          </select>
        </div>
        <div className="form-group">
          <label>Item Condition</label>
          <select value={form.item_condition} onChange={e => setForm({ ...form, item_condition: e.target.value })}>
            <option value="">-- Select condition --</option>
            <option value="excellent">Excellent - Like new, unused</option>
            <option value="good">Good - Minor signs of use</option>
            <option value="fair">Fair - Visible wear but functional</option>
            <option value="poor">Poor - Heavily damaged (may be rejected)</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.order_id || !form.reason || !form.item_condition}>
            {loading ? 'Submitting...' : 'Submit Return Request'}
          </button>
          <button className="btn btn-secondary" onClick={() => setPage('orders')}>Cancel</button>
        </div>
      </div>
    </div>
  );
}