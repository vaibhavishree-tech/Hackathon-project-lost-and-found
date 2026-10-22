# 🔍 Lost & Found: AI-Powered Recovery System

<div align="center">

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A full-stack lost and found platform for campuses. You can search it in plain English, and Google Gemini helps match items.**

</div>

---

## Overview

On most campuses, lost items get reported on notice boards, in scattered WhatsApp groups or in spreadsheets. None of these are searchable, so people often give up.

**Lost & Found** puts every lost and found report in one searchable place:

- **MongoDB** is the core of the app. It stores users and items, handles filtering and sorting, and runs the searches.
- **Google Gemini** sits on top of MongoDB. It turns free-text searches like *"I lost my blue backpack near the cafeteria"* into structured database queries, summarises new posts, and scores possible lost ↔ found matches.

If Gemini is unavailable, every AI feature falls back to plain keyword or category logic, so the app keeps working.

> Built for the **Build with Gemini & MongoDB** hackathon (requirement: ~60% MongoDB, ~40% Gemini API).

---

## Features

### MongoDB: data and search
- **Two collections**, `users` and `items`. Each item references the user who posted it, and that user's details are filled in with Mongoose `populate`.
- **Schema validation** with enums for item `type` (`lost` / `found`), `category` and `status` (`active` / `resolved`).
- **Filtering** by type, category and status, with the newest items first.
- **Multi-field search** using case-insensitive regex across `title`, `description` and `location`.
- **A text index** on `title` and `description`.
- **Hosted on MongoDB Atlas.**

### Gemini API: the AI layer
- **Natural-language search.** Gemini pulls the item type, category and keywords out of a free-text query, and the backend builds the MongoDB query from them.
- **Auto-summary on post.** When an item is created, Gemini writes a short keyword summary that is stored in the `aiEmbedding` field.
- **Smart match recommendations.** Gemini compares an item with up to 20 items of the opposite type and returns match scores from 0 to 10 with a reason for each. Only scores of 6 or more are kept.
- **Graceful fallbacks.** If Gemini is down, search splits the query into keywords, posting stores a simple summary, and recommendations match on category.

### Authentication
- Register and log in with JWTs that expire after 7 days.
- Passwords are hashed with bcrypt (10 salt rounds).
- Creating an item requires a valid token.
- The session is kept in `localStorage`.

### Frontend
- A single-page React app styled with Tailwind CSS (gradients, cards, modal dialogs).
- Browse items with filters for type and category.
- A post-item form with an optional image URL.
- An item detail view with the poster's contact information.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite (rolldown-vite), Tailwind CSS 3, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas + Mongoose 9 |
| **AI** | Google Gemini via `@google/generative-ai` |
| **Auth** | `jsonwebtoken`, `bcryptjs` |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## Architecture

```
┌──────────────────┐   HTTPS / JSON   ┌──────────────────────┐
│  React (Vite)    │ ───────────────► │  Express API         │
│  Vercel          │ ◄─────────────── │  Render              │
└──────────────────┘   JWT in header  └─────────┬────────────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          ▼                                           ▼
                ┌──────────────────┐                        ┌──────────────────┐
                │  MongoDB Atlas   │                        │  Google Gemini   │
                │  users, items    │                        │  query analysis, │
                │  filter / search │                        │  summaries,      │
                └──────────────────┘                        │  match scoring   │
                                                            └──────────────────┘
```

**Natural-language search flow:**

1. The user types *"lost iPhone near library"*.
2. Gemini returns `{ "type": "lost", "category": "Electronics", "keywords": ["iphone", "library"] }`.
3. The backend turns that into a MongoDB query with filters on `type`, `category` and `status`, plus a regex `$or` across title, description and location.
4. MongoDB returns up to 50 matching items, newest first, with the poster's details filled in.

---

## Project Structure

```
Hackathon-project-lost-and-found/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Item.js          # Item schema + text index
│   ├── routes/
│   │   ├── auth.js          # Register / login
│   │   ├── items.js         # Create / list / get items (+ Gemini summary)
│   │   └── search.js        # Gemini natural-language search & recommendations
│   ├── server.js            # Express app + MongoDB connection
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── services/api.js  # Axios client (attaches JWT automatically)
    │   ├── App.jsx          # Main UI: auth, feed, search, modals
    │   ├── main.jsx
    │   └── index.css        # Tailwind entry
    ├── .env.production      # VITE_API_URL for deployment
    ├── tailwind.config.js
    └── package.json
```

## Known Limitations

- Images are added by URL only. Direct file upload is not supported.
- There is no UI yet for editing or deleting items, or for marking them as resolved.
- The recommendations endpoint exists in the backend but is not yet used by the frontend.
- The `aiEmbedding` field is a text summary, not a vector embedding, and it isn't used in search yet.
- There are no notifications (email or push) when a possible match appears.
- Gemini calls depend on the API key's quota. When the quota runs out, the app uses its non-AI fallbacks.

---

## Roadmap

- [ ] Image upload (e.g. Cloudinary or S3) and image-based matching with Gemini's multimodal input
- [ ] Use the recommendations endpoint in the UI ("Possible matches" on each item)
- [ ] Vector search with MongoDB Atlas Vector Search + Gemini embeddings
- [ ] Edit, delete and mark-as-resolved for item owners
- [ ] Email notifications for strong matches
- [ ] Admin moderation dashboard

---

## Acknowledgements

- [MongoDB Atlas](https://www.mongodb.com/atlas) for database hosting
- [Google Gemini API](https://ai.google.dev/) for the AI features
- [Vercel](https://vercel.com/) and [Render](https://render.com/) for hosting
- The **Build with Gemini & MongoDB** hackathon

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>
