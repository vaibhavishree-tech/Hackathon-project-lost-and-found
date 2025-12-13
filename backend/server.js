const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Let frontend talk to backend
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Connect routes
// Connect routes with error checking
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const searchRoutes = require('./routes/search');

console.log('Auth routes:', authRoutes);
console.log('Item routes:', itemRoutes);
console.log('Search routes:', searchRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/search', searchRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Lost & Found API Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});