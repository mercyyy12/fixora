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
│   ├── render.yaml               <- Render deployment config
│   ├── config/
│   │   ├── db.js                 <- MongoDB connection
│   │   └── cloudinary.js         <- Cloudinary + Multer config
│   ├── models/
│   │   ├── User.js               <- User schema (homeowner, technician, admin)
│   │   ├── Job.js                <- Job schema
│   │   ├── Rating.js             <- Rating schema
│   │   └── Report.js             <- Report schema
│   ├── controllers/
│   │   ├── authController.js     <- Includes Admin Registration logic
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
│       ├── main.go               <- High-speed MongoDB aggregations
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
        │   │   ├── RatingsManagement.jsx
        │   │   ├── ReportSystem.jsx
        │   │   ├── StatsOverview.jsx
        │   │   ├── TechnicianManagement.jsx
        │   │   ├── UserManagement.jsx
        │   │   └── UserRatingsModal.jsx
        │   ├── Navbar.jsx
        │   ├── Loader.jsx
        │   ├── JobCard.jsx
        │   ├── TechnicianCard.jsx
        │   ├── LeafletMap.jsx     <- Interactive Map
        │   ├── MockMap.jsx        <- Map placeholder for Job Detail
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
            ├── EditJob.jsx        <- Full job editing with image management
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

## Administrative Access

To access moderation tools:
1. Navigate to the **Registration** page.
2. Select **"Admin"** as the role.
3. You must provide the `ADMIN_SECRET_KEY` (Default: `FIXORA_ADMIN_SECRET_2026`).
4. Once logged in, visit `/admin-fixora-dashboard` to view statistics and manage reports.

---

## API Endpoints

### Core API (Node.js)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register (Homeowner, Technician, or Admin) |
| GET | `/api/auth/me` | Private | Get current user profile |
| GET | `/api/jobs` | Private | List jobs (filtered by role) |
| POST | `/api/jobs` | Homeowner | Create job |
| POST | `/api/ratings` | Homeowner | Submit feedback for a technician |
| GET | `/api/reports` | Admin | Review platform reports |
| PUT | `/api/reports/:id` | Admin | Update report status |

### Analytics API (Go Microservice)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/admin/stats` | Admin | High-speed MongoDB stats aggregation |
| GET | `/api/technicians` | Public | Optimized technician listing with filtering |

---

## Key Features

### Geolocation & Maps
- **Leaflet.js**: Used in `CreateJob` and `EditJob` for interactive location picking via OpenStreetMap.
- **Reverse Geocoding**: Automatically detects address names from map coordinates.
- **Mock Integration**: Uses placeholders for job details to minimize API load.

### Real-Time Interactions
- **Socket.io**: Real-time job status updates and notification broadcasting.
- Bidirectional feedback loop for homeowners and technicians.

### Production Readiness
- **Render Support**: Includes `render.yaml` for instant deployment.
- **Image Management**: Multiple image uploads per job via Multer and Cloudinary.
- **Security**: JWT authentication with bcrypt password hashing and Admin registration guards.
- **Dark Mode**: Full support across all components via Tailwind Dark Mode.

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
