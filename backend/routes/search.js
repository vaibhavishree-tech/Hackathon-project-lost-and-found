const express = require('express');
const Item = require('../models/Item');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Natural language search
router.post('/natural', async (req, res) => {
  try {
    const { query } = req.body;
    
    console.log('🔍 Search query received:', query);

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query required' });
    }

    let analysis = {
      type: 'both',
      category: 'any',
      keywords: []
    };

    // Try Gemini first
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Analyze this lost and found search query. Return ONLY valid JSON with no markdown or extra text.

Query: "${query}"

Return this exact structure:
{
  "type": "lost" or "found" or "both",
  "category": "Electronics" or "Documents" or "Accessories" or "Books" or "Clothing" or "Keys" or "Other" or "any",
  "keywords": ["word1", "word2", "word3"]
}`;

      console.log('🤖 Asking Gemini...');
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      console.log('🤖 Gemini raw response:', responseText);
      
      // Clean up response
      const cleanText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log('🧹 Cleaned response:', cleanText);
      
      analysis = JSON.parse(cleanText);
      console.log('✅ Gemini analysis:', analysis);
      
    } catch (geminiError) {
      console.log('⚠️ Gemini error, using fallback:', geminiError.message);
      // Fallback: simple keyword extraction
      analysis.keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    }

    // Build MongoDB query
    const dbQuery = { status: 'active' };
    
    if (analysis.type !== 'both') {
      dbQuery.type = analysis.type;
    }
    
    if (analysis.category !== 'any') {
      dbQuery.category = analysis.category;
    }

    // Search across multiple fields
    if (analysis.keywords && analysis.keywords.length > 0) {
      const searchPattern = analysis.keywords.join('|');
      dbQuery.$or = [
        { title: { $regex: searchPattern, $options: 'i' } },
        { description: { $regex: searchPattern, $options: 'i' } },
        { location: { $regex: searchPattern, $options: 'i' } }
      ];
    }

    console.log('🗃️ MongoDB query:', JSON.stringify(dbQuery, null, 2));

    const items = await Item.find(dbQuery)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);

    console.log(`✅ Found ${items.length} items`);

    res.json({
      items,
      analysis,
      resultsCount: items.length
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ 
      message: 'Search failed', 
      error: error.message 
    });
  }
});

// Get recommendations for an item
router.get('/recommendations/:itemId', async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('🎯 Finding matches for:', item.title);

    // Find opposite type items
    const oppositeType = item.type === 'lost' ? 'found' : 'lost';
    const candidates = await Item.find({
      type: oppositeType,
      status: 'active',
      _id: { $ne: item._id }
    })
    .populate('user', 'name email phone')
    .limit(20);

    if (candidates.length === 0) {
      return res.json({ recommendations: [] });
    }

    let recommendations = [];

    // Try Gemini matching
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const candidateList = candidates.map((c, i) => 
        `${i}: ${c.title} - ${c.description} (${c.category}, ${c.location})`
      ).join('\n');

      const prompt = `Given this ${item.type} item:
Title: ${item.title}
Description: ${item.description}
Category: ${item.category}
Location: ${item.location}

Find the best matching ${oppositeType} items. Return ONLY valid JSON array:
[
  {"index": 0, "score": 8, "reason": "why it matches"},
  {"index": 1, "score": 6, "reason": "why it matches"}
]

Only include items with score >= 6.

${candidateList}`;

      console.log('🤖 Asking Gemini for matches...');
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const matches = JSON.parse(cleanText);
      console.log('✅ Gemini found matches:', matches.length);

      recommendations = matches
        .filter(m => m.score >= 6)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(m => ({
          ...candidates[m.index].toObject(),
          matchScore: m.score,
          matchReason: m.reason
        }));

    } catch (geminiError) {
      console.log('⚠️ Gemini matching failed, using category match');
      // Fallback: same category items
      recommendations = candidates
        .filter(c => c.category === item.category)
        .slice(0, 5)
        .map(c => ({
          ...c.toObject(),
          matchScore: 7,
          matchReason: 'Same category'
        }));
    }

    res.json({ recommendations });

  } catch (error) {
    console.error('❌ Recommendation error:', error);
    res.status(500).json({ 
      message: 'Failed to get recommendations', 
      error: error.message 
    });
  }
});

module.exports = router;