const express = require('express');
const pool = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all return requests (admin)
router.get('/returns', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, o.order_number, o.total_amount, o.order_date, u.name as customer_name, u.email as customer_email
       FROM return_requests r
       JOIN orders o ON r.order_id = o.id
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or reject return (admin)
router.patch('/returns/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, admin_comments } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }
    const result = await pool.query(
      `UPDATE return_requests 
       SET status = $1, admin_comments = $2, approved_date = NOW()
       WHERE id = $3 RETURNING *`,
      [status, admin_comments, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Return request not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Analytics (admin)
router.get('/analytics', authenticateToken, isAdmin, async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM return_requests');
    const pending = await pool.query("SELECT COUNT(*) FROM return_requests WHERE status = 'pending'");
    const approved = await pool.query("SELECT COUNT(*) FROM return_requests WHERE status = 'approved'");
    const rejected = await pool.query("SELECT COUNT(*) FROM return_requests WHERE status = 'rejected'");
    res.json({
      total: parseInt(total.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      approved: parseInt(approved.rows[0].count),
      rejected: parseInt(rejected.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;