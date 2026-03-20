# 🔧 Fixora – Local Home Repair & Maintenance Platform

A production-ready full-stack MERN application connecting homeowners with skilled local technicians.

---

## 🗂 Project Structure

```
fixora/
├── package.json                  ← Root (monorepo scripts)
├── .gitignore
│
├── server/                       ← Node.js + Express backend
│   ├── server.js                 ← Entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   ├── db.js                 ← MongoDB connection
│   │   └── cloudinary.js         ← Cloudinary + Multer config
│   ├── models/
│   │   ├── User.js               ← User schema (homeowner + technician)
│   │   ├── Job.js                ← Job schema
│   │   └── Rating.js             ← Rating schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── userController.js
│   │   └── ratingController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── users.js
│   │   └── ratings.js
│   ├── middleware/
│   │   ├── auth.js               ← JWT protect + authorize
│   │   └── errorHandler.js
│   └── socket/
│       └── socketHandler.js      ← Socket.io real-time events
│
└── client/                       ← React frontend
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css              ← Tailwind + custom classes
        ├── App.jsx                ← Router + providers
        ├── context/
        │   ├── AuthContext.jsx    ← Auth state (JWT)
        │   ├── ThemeContext.jsx   ← Dark/light mode
        │   └── SocketContext.jsx  ← Socket.io client
        ├── utils/
        │   ├── api.js             ← Axios instance
        │   └── helpers.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Loader.jsx
        │   ├── JobCard.jsx
        │   ├── TechnicianCard.jsx
        │   ├── MockMap.jsx        ← Map placeholder (replace with Google Maps)
        │   └── StarRating.jsx
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── JobList.jsx
            ├── JobDetail.jsx
            ├── CreateJob.jsx
            ├── Profile.jsx
            ├── Technicians.jsx
            └── TechnicianProfile.jsx
```

---

## ⚡ Quick Start

### 1. Clone & install dependencies

```bash
git clone <your-repo>
cd fixora
npm run install:all
```

Or install manually:
```bash
# Root
npm install

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

### 2. Set up environment variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fixora
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Get these from https://cloudinary.com (free account)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:3000
```

**Frontend** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

### 3. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud) — update MONGO_URI in .env
```

---

### 4. Run the application

**Option A — Run both together from root:**
```bash
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 (backend)
cd server && npm run dev

# Terminal 2 (frontend)
cd client && npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/api/health

---

## 🌐 API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get current user |

### Jobs
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/jobs` | Private | List jobs (filtered by role) |
| POST | `/api/jobs` | Homeowner | Create job |
| GET | `/api/jobs/:id` | Private | Get job detail |
| PUT | `/api/jobs/:id/accept` | Technician | Accept a job |
| PUT | `/api/jobs/:id/status` | Technician | Update status |
| DELETE | `/api/jobs/:id` | Homeowner | Delete open job |

### Users
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/users/technicians` | Private | List technicians |
| GET | `/api/users/:id` | Private | Get user profile |
| PUT | `/api/users/profile` | Private | Update profile |
| POST | `/api/users/profile/image` | Private | Upload avatar |
| GET | `/api/users/notifications` | Private | Get notifications |
| PUT | `/api/users/notifications/read` | Private | Mark read |

### Ratings
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/ratings` | Homeowner | Submit rating |
| GET | `/api/ratings/technician/:id` | Public | Get technician ratings |

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Join personal notification room |
| `join:technicians` | Client → Server | Join technician broadcast room |
| `job:new` | Server → Technicians | New job posted |
| `job:accepted` | Server → Homeowner | Technician accepted their job |
| `job:statusUpdate` | Server → Homeowner | Job status changed |

---

## 🗺️ Google Maps Integration

The app uses **OpenStreetMap** (no API key needed) as a placeholder map.

To replace with real Google Maps:
1. Get an API key from https://console.cloud.google.com
2. Enable Maps JavaScript API + Geocoding API
3. Install: `npm install @react-google-maps/api`
4. Replace `MockMap.jsx` with actual Google Maps component
5. Replace mock coordinates with real geocoding in `jobController.js`
6. Comment in code: `"Replace with real Google Maps API key here"`

---

## ☁️ Cloudinary Setup

1. Sign up free at https://cloudinary.com
2. Copy your Cloud Name, API Key, API Secret from the dashboard
3. Paste into `server/.env`

---

## 🌗 Dark Mode

- Automatically follows system `prefers-color-scheme` on first visit
- Toggle button in Navbar (sun/moon icon)
- Persisted in `localStorage`
- All components fully support both themes via Tailwind `dark:` classes

---

## 🚀 Production Deployment

**Backend (e.g. Railway, Render, Heroku):**
- Set all environment variables
- `npm start` (runs `node server.js`)

**Frontend (e.g. Vercel, Netlify):**
- Build: `npm run build`
- Publish: `client/build/`
- Set `REACT_APP_API_URL` to your deployed backend URL

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io |
| File Upload | Multer, Cloudinary |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Toast | react-hot-toast |
| Icons | react-icons |

---

## ✅ Features Checklist

- [x] Role-based auth (Homeowner / Technician)
- [x] JWT protected routes (frontend + backend)
- [x] Job CRUD with image uploads (Cloudinary)
- [x] Job lifecycle: Open → Assigned → In Progress → Completed
- [x] Real-time notifications via Socket.io
- [x] Map integration (OpenStreetMap, Google Maps-ready)
- [x] Rate & review technicians
- [x] Dark mode / Light mode with localStorage persistence
- [x] Responsive mobile-first UI
- [x] Framer Motion page transitions & animations
- [x] Form validation (frontend + backend)
- [x] Toast notifications
- [x] Loading states
- [x] Pagination
