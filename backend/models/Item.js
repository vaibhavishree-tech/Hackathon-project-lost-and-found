const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Documents', 'Accessories', 'Books', 'Clothing', 'Keys', 'Other']
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  imageUrl: String,
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiEmbedding: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

itemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);