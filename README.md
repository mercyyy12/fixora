# Fixora - Local Home Repair and Maintenance Platform

Fixora is a production-ready full-stack MERN application connecting homeowners with skilled local technicians, featuring a high-performance analytics microservice built in Go.

---

## Project Structure

```text
fixora/
├── package.json                  <- Root (monorepo scripts)
├── .gitignore
│
├── server/                       <- Node.js + Express backend
│   ├── server.js                 <- Entry point
│   ├── package.json
│   ├── config/
│   │   ├── db.js                 <- MongoDB connection
│   │   └── cloudinary.js         <- Cloudinary + Multer config
│   ├── models/
│   │   ├── User.js               <- User schema (homeowner, technician, admin)
│   │   ├── Job.js                <- Job schema
│   │   ├── Rating.js             <- Rating schema
│   │   └── Report.js             <- Report schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── userController.js
│   │   ├── ratingController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── users.js
│   │   ├── ratings.js
│   │   └── reports.js
│   ├── middleware/
│   │   ├── auth.js               <- JWT protect + authorize
│   │   └── errorHandler.js
│   ├── socket/
│   │   └── socketHandler.js      <- Socket.io real-time events
│   └── fixora-analytics/         <- Go analytics microservice
│       ├── main.go
│       ├── go.mod
│       └── go.sum
│
└── client/                       <- React frontend
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css              <- Tailwind + custom classes
        ├── App.jsx                <- Router + providers
        ├── css/                   <- Theme and base styles
        │   ├── base.css
        │   └── theme.css
        ├── context/
        │   ├── AuthContext.jsx    <- Auth state (JWT)
        │   ├── ThemeContext.jsx   <- Dark/light mode
        │   └── SocketContext.jsx  <- Socket.io client
        ├── utils/
        │   ├── api.js             <- Axios instance
        │   └── helpers.js
        ├── components/
        │   ├── admin/             <- Admin moderation components
        │   │   ├── AdminSettings.jsx
        │   │   ├── JobManagement.jsx
        │   │   ├── ReportSystem.jsx
        │   │   └── StatsOverview.jsx
        │   ├── Navbar.jsx
        │   ├── Loader.jsx
        │   ├── JobCard.jsx
        │   ├── TechnicianCard.jsx
        │   ├── LeafletMap.jsx     <- Interactive Map
        │   └── StarRating.jsx
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── AdminDashboard.jsx <- Admin moderation interface
            ├── JobList.jsx
            ├── JobDetail.jsx
            ├── CreateJob.jsx
            ├── Profile.jsx
            ├── Technicians.jsx
            └── TechnicianProfile.jsx
```

---

## Quick Start

### 1. Clone and install dependencies

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
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=FIXORA_ADMIN_SECRET_2026

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Go Analytics
ANALYTICS_PORT=6000
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

# Or use MongoDB Atlas (cloud) - update MONGO_URI in .env
```

---

### 4. Run the application

**Option A - Run both together from root:**
```bash
npm run dev
```

**Option B - Run separately:**
```bash
# Terminal 1 (backend)
cd server && npm run dev

# Terminal 2 (frontend)
cd client && npm start

# Terminal 3 (analytics microservice)
cd server/fixora-analytics && go run main.go
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Analytics API: http://localhost:6000

---

## API Endpoints

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

### Users and Admin
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/users/technicians` | Private | List technicians |
| GET | `/api/users/:id` | Private | Get user profile |
| PUT | `/api/users/profile` | Private | Update profile |
| POST | `/api/reports` | Private | Submit a report |
| GET | `/api/reports` | Admin | Review platform reports |

---

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client -> Server | Join personal notification room |
| `join:technicians` | Client -> Server | Join technician broadcast room |
| `job:new` | Server -> Technicians | New job posted |
| `job:accepted` | Server -> Homeowner | Technician accepted their job |
| `job:statusUpdate` | Server -> Homeowner | Job status changed |

---

## Map Integration

The application uses Leaflet.js with OpenStreetMap for geolocation and map visualization.
It supports:
- Pinpointing job locations
- Displaying nearby technicians
- Interactive location selection for job creation

---

## Cloudinary Setup

1. Sign up free at https://cloudinary.com
2. Copy your Cloud Name, API Key, and API Secret from the dashboard
3. Paste into `server/.env`

---

## Dark Mode

- Automatically follows system preference
- Toggle button in Navbar
- Persisted in localStorage
- Full support across all components via Tailwind Dark Mode

---

## Production Deployment

**Backend (Railway, Render, etc.):**
- Set environment variables
- Entry point: `server/server.js`

**Frontend (Vercel, Netlify):**
- Build: `npm run build`
- Deploy `client/build/` folder

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Microservice | Go (net/http, mgo) |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Real-time | Socket.io |
| File Upload | Multer, Cloudinary |
| Routing | React Router v6 |
| HTTP Client | Axios |

---

## Features Checklist

- [x] Role-based auth (Homeowner, Technician, Admin)
- [x] JWT protected routes
- [x] Job CRUD with image uploads
- [x] Job lifecycle: Open -> Assigned -> In Progress -> Completed
- [x] Real-time notifications via Socket.io
- [x] Map integration with Leaflet
- [x] Rate & review technicians
- [x] Robust Admin Dashboard with Moderation
- [x] Report system for bad actors
- [x] Live Analytics via Go microservice
- [x] Dark mode support
- [x] Responsive layout
