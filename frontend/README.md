# 🔍 SMART LOST AND FOUND SYSTEM

# 🔍 Lost & Found - AI-Powered Recovery System

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://lost-and-found-fs0zv4wcd-vaibhavishree-techs-projects.vercel.app/)
[![Backend](https://img.shields.io/badge/backend-render-blueviolet)](https://lost-and-found-xusi.onrender.com/)

**🌐 Live Demo:** https://lost-and-found-fs0zv4wcd-vaibhavishree-techs-projects.vercel.app/
**⚠️ Note: First load may take 30 seconds as the backend wakes up from sleep mode**
<div align="center">

![Lost & Found Banner](https://img.shields.io/badge/Build%20With-Gemini%20API-blue?style=for-the-badge&logo=google)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

**A modern, AI-powered lost and found management system for universities**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Usage](#usage) • [API Documentation](#api-documentation)

</div>

---

## 🎯 Problem Statement

Traditional lost and found systems in universities are inefficient, relying on physical bulletin boards, scattered WhatsApp groups, or manual spreadsheets. Students often give up searching for lost items due to the lack of a centralized, searchable platform.

## 💡 Solution

Lost & Found is a full-stack web application that leverages **Google's Gemini AI** to intelligently match lost and found items through natural language understanding. The system goes beyond simple keyword matching to understand context, synonyms, and semantic meaning.

---

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **Natural Language Search**: Type queries like "I lost my phone near library yesterday" and Gemini AI extracts intent, category, and keywords
- **Smart Matching**: Gemini analyzes item descriptions and provides match scores (0-10) with reasoning
- **Automatic Summarization**: AI generates concise summaries of item descriptions for faster matching

### 🔐 **Security & Authentication**
- JWT-based authentication with secure token management
- Password hashing using bcrypt (10 salt rounds)
- Protected API routes with middleware authentication
- Session persistence with localStorage

### 📱 **User Experience**
- Beautiful, modern UI with gradient designs and animations
- Responsive layout that works on desktop, tablet, and mobile
- Real-time search with instant results
- Category-based filtering (Electronics, Documents, Books, etc.)
- Type-based filtering (Lost/Found items)

### 📊 **Data Management**
- MongoDB Atlas cloud database for scalability
- Efficient schema design with user-item relationships
- Text search indexes for fast queries
- Date-based sorting for recent items

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Component-based UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### **AI/ML**
- **Google Gemini Pro** - Large language model for natural language processing
- **@google/generative-ai** - Official Gemini API SDK

### **Security & Authentication**
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure
```
lost-and-found/
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.jsx              # Main React component
│   │   ├── index.css            # Tailwind styles
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Item.js              # Item schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── items.js             # Item CRUD routes
│   │   └── search.js            # AI-powered search routes
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server setup
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google AI Studio account (for Gemini API key)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/lost-and-found.git
cd lost-and-found
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

**Get your credentials:**
- **MongoDB**: https://www.mongodb.com/cloud/atlas
- **Gemini API**: https://makersuite.google.com/app/apikey

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser! 🎉

---

## 📖 Usage

### 1️⃣ **Sign Up / Login**
- Create a new account with name, email, password, and phone number
- Login with your credentials to access the dashboard

### 2️⃣ **Post an Item**
- Click the "**+ Post Item**" button
- Select type: **Lost** or **Found**
- Fill in title, description, category, location, and date
- Gemini AI automatically analyzes and summarizes your item

### 3️⃣ **Search with Natural Language**
- Type queries like:
  - "blue backpack near cafeteria"
  - "I lost my iPhone 13 yesterday"
  - "found keys in library"
- Gemini AI understands context and finds relevant matches

### 4️⃣ **Filter & Browse**
- Use category filters: Electronics, Books, Documents, etc.
- Filter by type: Lost Items or Found Items
- Click on any item to view full details and contact information

---

## 🔌 API Documentation

### Authentication Endpoints

#### **POST** `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

#### **POST** `/api/auth/login`
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Item Endpoints

#### **POST** `/api/items`
Create a new lost/found item (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "type": "lost",
  "title": "iPhone 13 Pro",
  "description": "Black iPhone 13 Pro lost in library",
  "category": "Electronics",
  "location": "Main Library 2nd Floor",
  "date": "2024-12-13",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### **GET** `/api/items`
Get all items with optional filters.

**Query Parameters:**
- `type`: lost | found
- `category`: Electronics | Documents | Accessories | Books | Clothing | Keys | Other
- `status`: active | resolved

---

### Search Endpoints

#### **POST** `/api/search/natural`
AI-powered natural language search.

**Request Body:**
```json
{
  "query": "blue backpack near cafeteria"
}
```

**Response:**
```json
{
  "items": [...],
  "analysis": {
    "type": "both",
    "category": "Accessories",
    "keywords": ["blue", "backpack", "cafeteria"]
  },
  "resultsCount": 5
}
```

#### **GET** `/api/search/recommendations/:itemId`
Get AI-powered match recommendations for an item.

**Response:**
```json
{
  "recommendations": [
    {
      "item": {...},
      "matchScore": 8,
      "matchReason": "Color and location match closely"
    }
  ]
}
```

---

## 🧠 How Gemini AI Integration Works

### 1. **Item Creation Analysis**
When a user posts an item:
```javascript
const prompt = `Summarize this ${type} item in 2-3 keywords: ${title}. ${description}`;
const result = await model.generateContent(prompt);
```
Gemini extracts key features and stores them as an "embedding" for faster matching.

### 2. **Natural Language Search**
When a user searches:
```javascript
const prompt = `Analyze this search query and extract:
- Type: lost or found or both
- Category: Electronics, Books, etc.
- Keywords: important search terms
Query: "${userQuery}"`;
```
Gemini converts natural language into structured database queries.

### 3. **Smart Matching**
For finding similar items:
```javascript
const prompt = `Given this lost item: "${description}"
Rank these found items by similarity (0-10 score)`;
```
Gemini compares descriptions semantically, understanding that "blue backpack" matches "navy bag".

### 4. **Fallback System**
If Gemini API is unavailable, the system gracefully falls back to regex-based keyword search, ensuring the application never breaks.

---

## 🎨 Design Principles

- **Gradient-based Color System**: Indigo and purple gradients for modern aesthetics
- **Glassmorphism**: Frosted glass effects on login page
- **Micro-interactions**: Smooth hover effects and transitions
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized React rendering with proper state management

---

## 🔒 Security Features

1. **Password Security**: All passwords hashed with bcrypt (10 salt rounds)
2. **JWT Tokens**: Secure token-based authentication with 7-day expiry
3. **Protected Routes**: Middleware authentication for sensitive operations
4. **Environment Variables**: Secrets stored in `.env` files (not committed to Git)
5. **CORS Configuration**: Controlled cross-origin requests
6. **Input Validation**: Server-side validation for all user inputs

---

## 🚧 Known Limitations

- **Gemini API Quota**: Free tier has rate limits (60 requests/minute)
- **Image Upload**: Currently supports URLs only, not direct file uploads
- **Real-time Updates**: No WebSocket implementation (uses polling)
- **Email Notifications**: Not implemented in current version

---

## 🔮 Future Enhancements

### Phase 1
- [ ] Direct image upload with cloud storage (Cloudinary/AWS S3)
- [ ] Email notifications for matches
- [ ] User profile management
- [ ] Item edit/delete functionality

### Phase 2
- [ ] Real-time updates with WebSockets
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Admin dashboard for moderation

### Phase 3
- [ ] Multi-modal AI (image recognition with Gemini Vision)
- [ ] Geolocation-based search
- [ ] QR code generation for items
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vaibhavi Shree**
- GitHub: [@vaibhavishree-tech](https://github.com/@vaibhavishree-tech)
- Email: vaibhavishree27@gmail.com

---

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the powerful language model
- **MongoDB Atlas** for free cloud database hosting
- **Anthropic** for Claude AI assistance during development
- **Tailwind CSS** for the amazing utility-first framework
- **Build w/ Gemini and MongoDB** for the opportunity and inspiration

---

## 📊 Project Stats

- **Lines of Code**: ~2000+
- **Development Time**: 4 hours
- **API Endpoints**: 8
- **Database Collections**: 2
- **React Components**: 1 main + 1 modal
- **AI Integration Points**: 3

---

## 🎓 Learning Outcomes

Through this project, I learned:
- Full-stack web development with MERN stack
- AI/ML integration using Gemini API
- RESTful API design principles
- JWT authentication implementation
- MongoDB schema design and relationships
- Responsive UI design with Tailwind CSS

---


## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

<div align="center">

**Built for Build w/ Gemini and MongoDB**

Made by Vaibhavi Shree | 2025

</div>