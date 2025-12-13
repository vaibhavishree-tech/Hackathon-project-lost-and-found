const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create new item
router.post('/', auth, async (req, res) => {
  try {
    console.log('📝 Received item data:', req.body);
    console.log('👤 User ID:', req.userId);
    
    const { type, title, description, category, location, date, imageUrl } = req.body;

    // Validate required fields
    if (!type || !title || !description || !category || !location || !date) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { type, title, description, category, location, date }
      });
    }

    let aiEmbedding = '';
    
    // Try to use Gemini, but don't fail if it doesn't work
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Summarize this ${type} item in 2-3 keywords for matching: ${title}. ${description}. Category: ${category}`;
      const result = await model.generateContent(prompt);
      aiEmbedding = result.response.text();
      console.log('✅ Gemini summary:', aiEmbedding);
    } catch (geminiError) {
      console.log('⚠️ Gemini unavailable, using simple summary');
      aiEmbedding = `${category} ${title}`;
    }

    const item = new Item({
      type,
      title,
      description,
      category,
      location,
      date: new Date(date), // Make sure date is properly formatted
      imageUrl: imageUrl || '',
      user: req.userId,
      aiEmbedding,
      status: 'active'
    });

    console.log('💾 Saving item to database...');
    const savedItem = await item.save();
    console.log('✅ Item saved successfully:', savedItem._id);

    // Populate user data before sending response
    await savedItem.populate('user', 'name email phone');

    res.status(201).json({ 
      item: savedItem,
      message: 'Item created successfully!' 
    });
    
  } catch (error) {
    console.error('❌ Error creating item:', error);
    res.status(500).json({ 
      message: 'Error creating item', 
      error: error.message 
    });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    console.log('📥 Fetching items with filters:', req.query);
    
    const { type, category, status } = req.query;
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'active';

    const items = await Item.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${items.length} items`);
    res.json(items);
    
  } catch (error) {
    console.error('❌ Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Get one item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
});

module.exports = router;