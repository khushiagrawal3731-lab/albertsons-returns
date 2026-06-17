const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const returnRoutes = require('./routes/returns');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
  origin: ['https://albertsons-returns.vercel.app', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ message: 'Returns System API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));