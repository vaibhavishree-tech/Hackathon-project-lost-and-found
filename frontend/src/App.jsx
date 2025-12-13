import React, { useState, useEffect } from 'react';
import * as api from './services/api';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
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
    type: '',
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    imageUrl: ''
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
      console.log('Loading items...');
      const response = await api.getItems(filter);
      console.log('Items loaded:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleAuth = async () => {
    if (isLogin) {
      // Login
      if (!authForm.email || !authForm.password) {
        alert('Please enter email and password');
        return;
      }
    } else {
      // Signup
      if (!authForm.name || !authForm.email || !authForm.password || !authForm.phone) {
        alert('Please fill all fields');
        return;
      }
    }

    try {
      console.log('Auth attempt:', isLogin ? 'login' : 'signup');
      const response = isLogin 
        ? await api.login({ email: authForm.email, password: authForm.password })
        : await api.register(authForm);
      
      console.log('Auth response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setAuthForm({ name: '', email: '', password: '', phone: '' });
      loadItems();
      alert(isLogin ? 'Login successful!' : 'Account created successfully!');
    } catch (error) {
      console.error('Auth error:', error);
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
    console.log('=== CREATE ITEM ATTEMPT ===');
    console.log('Item form data:', itemForm);

    // Check each field
    if (!itemForm.type) {
      alert('Please select item type (Lost or Found)');
      return;
    }
    if (!itemForm.title) {
      alert('Please enter item title');
      return;
    }
    if (!itemForm.description) {
      alert('Please enter item description');
      return;
    }
    if (!itemForm.category) {
      alert('Please select a category');
      return;
    }
    if (!itemForm.location) {
      alert('Please enter location');
      return;
    }
    if (!itemForm.date) {
      alert('Please select a date');
      return;
    }

    try {
      setLoading(true);
      console.log('Sending request to create item...');
      
      const response = await api.createItem(itemForm);
      
      console.log('Item created successfully:', response.data);
      alert('✅ Item created successfully!');
      
      setShowCreateItem(false);
      setItemForm({ 
        type: '', 
        title: '', 
        description: '', 
        category: '', 
        location: '', 
        date: '', 
        imageUrl: '' 
      });
      
      await loadItems();
      
    } catch (error) {
      console.error('=== CREATE ITEM ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to create item'}`);
      } else if (error.request) {
        alert('No response from server. Is backend running?');
      } else {
        alert('Error: ' + error.message);
      }
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
      console.log('Searching for:', searchQuery);
      const response = await api.naturalSearch(searchQuery);
      console.log('Search results:', response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const displayItems = searchResults ? searchResults.items : items;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Lost & Found</h1>
          <p className="text-center text-gray-600 mb-6">University Lost & Found System</p>
          
          <div className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                value={authForm.name}
                onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            )}
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {!isLogin && (
              <input
                type="tel"
                value={authForm.phone}
                onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            )}
            <button
              onClick={handleAuth}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
          
          <p className="text-center mt-4 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Lost & Found</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateItem(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Post Item
            </button>
            <span className="text-gray-700">{user.name}</span>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search: 'I lost my iPhone near library yesterday'"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {searchResults && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-600">Found {searchResults.resultsCount} results</p>
              <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="text-sm text-blue-600">
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3">
          <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })} className="px-3 py-1 border rounded-lg">
            <option value="">All Items</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>
          <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} className="px-3 py-1 border rounded-lg">
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No items found. Post the first item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item) => (
              <div key={item._id} onClick={() => setSelectedItem(item)} className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{item.category}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description.substring(0, 100)}...</p>
                  <div className="text-xs text-gray-500">
                    <p>📍 {item.location}</p>
                    <p>📅 {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={showCreateItem} onClose={() => setShowCreateItem(false)}>
        <h2 className="text-2xl font-bold mb-4">Post Lost/Found Item</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select 
              value={itemForm.type} 
              onChange={(e) => {
                console.log('Type selected:', e.target.value);
                setItemForm({...itemForm, type: e.target.value});
              }} 
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select type</option>
              <option value="lost">Lost Item</option>
              <option value="found">Found Item</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input 
              type="text" 
              value={itemForm.title} 
              onChange={(e) => setItemForm({...itemForm, title: e.target.value})} 
              placeholder="e.g., iPhone 13 Pro" 
              className="w-full px-3 py-2 border rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea 
              value={itemForm.description} 
              onChange={(e) => setItemForm({...itemForm, description: e.target.value})} 
              rows="3" 
              placeholder="Provide detailed description..." 
              className="w-full px-3 py-2 border rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select 
              value={itemForm.category} 
              onChange={(e) => setItemForm({...itemForm, category: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input 
              type="text" 
              value={itemForm.location} 
              onChange={(e) => setItemForm({...itemForm, location: e.target.value})} 
              placeholder="e.g., Library 2nd Floor" 
              className="w-full px-3 py-2 border rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input 
              type="date" 
              value={itemForm.date} 
              onChange={(e) => setItemForm({...itemForm, date: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
            <input 
              type="url" 
              value={itemForm.imageUrl} 
              onChange={(e) => setItemForm({...itemForm, imageUrl: e.target.value})} 
              placeholder="https://example.com/image.jpg" 
              className="w-full px-3 py-2 border rounded-lg" 
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCreateItem} 
              disabled={loading} 
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
            <button 
              onClick={() => setShowCreateItem(false)} 
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
              <span className={`px-3 py-1 rounded font-semibold ${selectedItem.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {selectedItem.type.toUpperCase()}
              </span>
            </div>
            {selectedItem.imageUrl && <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-64 object-cover rounded-lg mb-4" />}
            <div className="space-y-3 mb-4">
              <p className="text-gray-700">{selectedItem.description}</p>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Location:</strong> {selectedItem.location}</p>
              <p><strong>Date:</strong> {new Date(selectedItem.date).toLocaleDateString()}</p>
              <p><strong>Posted by:</strong> {selectedItem.user.name}</p>
              <p><strong>Contact:</strong> {selectedItem.user.email}</p>
              <p><strong>Phone:</strong> {selectedItem.user.phone}</p>
            </div>
            <button onClick={() => setSelectedItem(null)} className="w-full mt-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;