import React, { useState, useEffect } from 'react';
import * as api from './services/api';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState({ type: '', category: '' });

  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [itemForm, setItemForm] = useState({
    type: '', title: '', description: '', category: '', location: '', date: '', imageUrl: ''
  });

  const categories = ['Electronics', 'Documents', 'Accessories', 'Books', 'Clothing', 'Keys', 'Other'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      loadItems();
    }
  }, []);

  useEffect(() => {
    if (user) loadItems();
  }, [filter]);

  const loadItems = async () => {
    try {
      const response = await api.getItems(filter);
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleAuth = async () => {
    if (isLogin) {
      if (!authForm.email || !authForm.password) {
        alert('Please enter email and password');
        return;
      }
    } else {
      if (!authForm.name || !authForm.email || !authForm.password || !authForm.phone) {
        alert('Please fill all fields');
        return;
      }
    }

    try {
      const response = isLogin 
        ? await api.login({ email: authForm.email, password: authForm.password })
        : await api.register(authForm);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setAuthForm({ name: '', email: '', password: '', phone: '' });
      loadItems();
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setItems([]);
  };

  const handleCreateItem = async () => {
    if (!itemForm.type || !itemForm.title || !itemForm.description || 
        !itemForm.category || !itemForm.location || !itemForm.date) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.createItem(itemForm);
      alert('✅ Item created successfully!');
      setShowCreateItem(false);
      setItemForm({ type: '', title: '', description: '', category: '', location: '', date: '', imageUrl: '' });
      await loadItems();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      const response = await api.naturalSearch(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      alert('Search failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const displayItems = searchResults ? searchResults.items : items;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full relative z-10 border-2 border-white/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl">
              <span className="text-4xl">🔍</span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Lost & Found
            </h1>
            <p className="text-gray-600 font-medium">AI-Powered Item Recovery</p>
          </div>
          
          <div className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                value={authForm.name}
                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
              />
            )}
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
            />
            {!isLogin && (
              <input
                type="tel"
                value={authForm.phone}
                onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                placeholder="Phone Number"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
              />
            )}
            <button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3.5 rounded-xl hover:shadow-2xl transition-all font-bold text-lg transform hover:scale-105 active:scale-95"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 hover:text-purple-800 font-semibold transition"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg border-b-4 border-purple-500 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Lost & Found
                </h1>
                <p className="text-xs text-gray-500 font-semibold">AI-Powered System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateItem(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-xl transition-all font-bold transform hover:scale-105 active:scale-95"
              >
                <span className="text-xl">+</span>
                <span className="hidden sm:inline">Post Item</span>
              </button>
              <div className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-xl shadow-inner">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-bold text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-2 border-purple-200 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                <span className="text-xl">🤖</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Try: 'I lost my blue backpack near the cafeteria yesterday'"
                className="w-full pl-12 pr-5 py-4 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition shadow-md text-lg bg-white outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500">
                <span className="text-xs font-bold bg-purple-100 px-2 py-1 rounded">AI Search</span>
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 font-bold shadow-lg transform hover:scale-105 active:scale-95 disabled:transform-none"
            >
              {loading ? '⏳' : '🔍'}
            </button>
          </div>
          {searchResults && (
            <div className="mt-4 flex items-center justify-between bg-white px-5 py-3 rounded-xl shadow-lg border-2 border-purple-200">
              <p className="text-sm font-bold text-gray-700">
                ✨ Found <span className="text-purple-600 text-lg">{searchResults.resultsCount}</span> results
              </p>
              <button
                onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                className="text-sm text-purple-600 hover:text-purple-800 font-bold hover:underline"
              >
                Clear ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer bg-white shadow-sm hover:shadow-md"
            >
              <option value="">📦 All Items</option>
              <option value="lost">😢 Lost Items</option>
              <option value="found">😊 Found Items</option>
            </select>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2 border-2 border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer bg-white shadow-sm hover:shadow-md"
            >
              <option value="">🏷️ All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>📁 {cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 shadow-lg"></div>
            <p className="mt-4 text-gray-600 font-bold text-lg">Loading...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 shadow-lg">
              <span className="text-5xl">📭</span>
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-6 font-medium">Be the first to post!</p>
            <button
              onClick={() => setShowCreateItem(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition font-bold transform hover:scale-105"
            >
              Post Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-300"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-6xl">
                      {item.category === 'Electronics' ? '📱' : 
                       item.category === 'Books' ? '📚' :
                       item.category === 'Clothing' ? '👕' :
                       item.category === 'Keys' ? '🔑' :
                       item.category === 'Documents' ? '📄' :
                       item.category === 'Accessories' ? '🎒' : '📦'}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-md ${
                      item.type === 'lost' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    }`}>
                      {item.type === 'lost' ? '😢 LOST' : '😊 FOUND'}
                    </span>
                    <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-black text-xl mb-2 text-gray-800 line-clamp-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 font-medium">{item.description}</p>
                  <div className="space-y-1.5 text-xs text-gray-500 font-semibold">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 py-2 rounded-lg hover:from-blue-100 hover:to-purple-100 transition font-bold text-sm shadow-sm hover:shadow-md">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={showCreateItem} onClose={() => setShowCreateItem(false)}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Post an Item</h2>
              <p className="text-gray-600 text-sm font-medium">Help connect people with their belongings</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-black mb-2 text-gray-700">Type *</label>
              <select 
                value={itemForm.type} 
                onChange={(e) => setItemForm({...itemForm, type: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 font-semibold outline-none"
              >
                <option value="">Select type</option>
                <option value="lost">😢 Lost Item</option>
                <option value="found">😊 Found Item</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-black mb-2 text-gray-700">Title *</label>
              <input 
                type="text" 
                value={itemForm.title} 
                onChange={(e) => setItemForm({...itemForm, title: e.target.value})} 
                placeholder="e.g., iPhone 13 Pro Max" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 outline-none font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-black mb-2 text-gray-700">Description *</label>
              <textarea 
                value={itemForm.description} 
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})} 
                rows="4" 
                placeholder="Provide detailed description - color, brand, distinguishing features..." 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none bg-gray-50 outline-none font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-black mb-2 text-gray-700">Category *</label>
              <select 
                value={itemForm.category} 
                onChange={(e) => setItemForm({...itemForm, category: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 font-semibold outline-none"
              >
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-black mb-2 text-gray-700">Location *</label>
              <input 
                type="text" 
                value={itemForm.location} 
                onChange={(e) => setItemForm({...itemForm, location: e.target.value})} 
                placeholder="e.g., Main Library, 2nd Floor" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 outline-none font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-black mb-2 text-gray-700">Date *</label>
              <input 
                type="date" 
                value={itemForm.date} 
                onChange={(e) => setItemForm({...itemForm, date: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 outline-none font-semibold" 
              />
            </div>
            <div>
              <label className="block text-sm font-black mb-2 text-gray-700">Image URL (optional)</label>
              <input 
                type="url" 
                value={itemForm.imageUrl} 
                onChange={(e) => setItemForm({...itemForm, imageUrl: e.target.value})} 
                placeholder="https://example.com/image.jpg" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-gray-50 outline-none font-medium" 
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={handleCreateItem} 
                disabled={loading} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-2xl disabled:opacity-50 transition font-black shadow-lg transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                {loading ? '⏳ Creating...' : '✨ Create Item'}
              </button>
              <button 
                onClick={() => setShowCreateItem(false)} 
                className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-black mb-3 text-gray-800">{selectedItem.title}</h2>
                <span className={`inline-block px-4 py-2 rounded-xl text-sm font-black shadow-lg ${
                  selectedItem.type === 'lost' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                }`}>
                  {selectedItem.type === 'lost' ? '😢 LOST ITEM' : '😊 FOUND ITEM'}
                </span>
              </div>
            </div>
            
            {selectedItem.imageUrl ? (
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-72 object-cover rounded-2xl mb-6 shadow-xl border-4 border-gray-100" />
            ) : (
              <div className="w-full h-72 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 shadow-xl border-4 border-gray-100">
                <span className="text-8xl">
                  {selectedItem.category === 'Electronics' ? '📱' : 
                   selectedItem.category === 'Books' ? '📚' :
                   selectedItem.category === 'Clothing' ? '👕' :
                   selectedItem.category === 'Keys' ? '🔑' :
                   selectedItem.category === 'Documents' ? '📄' :
                   selectedItem.category === 'Accessories' ? '🎒' : '📦'}
                </span>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border-2 border-gray-200 shadow-inner">
                <p className="text-gray-700 leading-relaxed font-medium">{selectedItem.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200 shadow-md">
                  <p className="text-xs font-black text-blue-600 mb-1">CATEGORY</p>
                  <p className="font-black text-gray-800">{selectedItem.category}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200 shadow-md">
                  <p className="text-xs font-black text-purple-600 mb-1">DATE</p>
                  <p className="font-black text-gray-800">{new Date(selectedItem.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border-2 border-pink-200 shadow-md">
                <p className="text-xs font-black text-pink-600 mb-1">📍 LOCATION</p>
                <p className="font-black text-gray-800">{selectedItem.location}</p>
              </div>
            </div>

            <div className="border-t-4 border-gray-200 pt-6">
              <h3 className="font-black text-lg mb-4 text-gray-800">📞 Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0 shadow-lg">
                    {selectedItem.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-gray-500">Posted by</p>
                    <p className="font-black text-gray-800 truncate">{selectedItem.user.name}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200 shadow-md">
                  <p className="text-xs font-black text-blue-600 mb-1">Email</p>
                  <p className="font-black text-blue-700">{selectedItem.user.email}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200 shadow-md">
                  <p className="text-xs font-black text-purple-600 mb-1">Phone</p>
                  <p className="font-black text-purple-700">{selectedItem.user.phone}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedItem(null)} 
              className="w-full mt-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition font-black shadow-md hover:shadow-lg border-2 border-gray-300"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;