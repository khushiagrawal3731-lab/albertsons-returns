const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Submit return request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { order_id, reason, item_condition } = req.body;

    // Check order exists and belongs to user
    const order = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [order_id, req.user.id]
    );
    if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    // Validate return window (30 days)
    const orderDate = new Date(order.rows[0].order_date);
    const today = new Date();
    const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) return res.status(400).json({ error: 'Return window expired. Returns only accepted within 30 days of purchase.' });

    // Check no existing return for this order
    const existing = await pool.query(
      'SELECT * FROM return_requests WHERE order_id = $1',
      [order_id]
    );
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Return request already exists for this order' });

    // Auto approve/reject based on condition
    let status = 'pending';
    if (item_condition === 'poor') status = 'rejected';

    const result = await pool.query(
      `INSERT INTO return_requests (user_id, order_id, reason, item_condition, requested_date, status)
       VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *`,
      [req.user.id, order_id, reason, item_condition, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's return requests
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, o.order_number, o.total_amount, o.order_date 
       FROM return_requests r 
       JOIN orders o ON r.order_id = o.id 
       WHERE r.user_id = $1 
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single return request
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, o.order_number, o.total_amount, o.order_date 
       FROM return_requests r 
       JOIN orders o ON r.order_id = o.id 
       WHERE r.id = $1 AND r.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Return request not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;