# Fixora - Local Home Repair Platform

Fixora is a full-stack, real-world platform designed to connect homeowners with local maintenance professionals (technicians). It features bidirectional feedback, an advanced administrative moderation dashboard, and real-time interactions.

## 🚀 True Tech Stack

This project is built using a modern **MERN** stack, augmented by a specialized **Go** microservice.

### Frontend
* **React 18** - UI building
* **Tailwind CSS** - Styling and layout
* **Leaflet.js** - Interactive map representations
* **Socket.io Client** - Real-time communication

### Backend (Node.js)
* **Node.js & Express** - Core REST API architecture
* **MongoDB Atlas + Mongoose** - Primary database and schema validation
* **JWT & bcryptjs** - Secure authentication and password hashing
* **Cloudinary** - Direct image uploads and storage
* **Socket.io** - WebSockets for real-time notifications

### Microservice (Golang)
* **Go (net/http)** - High-performance analytics engine
* **Goroutines & mgo driver** - Concurrent raw MongoDB aggregations

---

## 🏗️ Core Features

1. **Role-Based Workflows**: Tailored, distinct interfaces and workflows for Homeowners, Technicians, and Platform Administrators.
2. **Technician Verification System**: Technicians must be explicitly verified by an Administrator before they can appear in the public marketplace.
3. **Geo-Location Context**: Jobs utilize OpenStreetMap/Leaflet to pinpoint physical locations visually.
4. **Bidirectional Ratings & Accountability**: Both homeowners and technicians can privately rate each other upon job completion to maintain a high-trust platform.
5. **Real-Time Job States**: Live status updates via WebSockets securely coordinate job progression ("Open" -> "Accepted" -> "In Progress" -> "Completed").
6. **Robust Moderation Suite**: A secure Admin portal allows for reviewing reports, dismissing complaints, or banning/blocking bad actors from the platform instantly.
7. **Live Analytics**: The Golang microservice processes massive MongoDB collections in real-time, providing immediate statistical health overviews to Administrators.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
* **Node.js** (v18+)
* **Go** (v1.20+)
* **MongoDB** (Local or Atlas URI)

### 2. Environment Configuration
Create a `.env` file in the root `server/` directory:

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

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Backend (Node)
```bash
cd server
npm install
npm run dev
```

### 4. Start the Analytics Engine (Go)
```bash
cd server/fixora-analytics
go mod download
go run main.go
```

### 5. Start the Frontend (React)
```bash
cd client
npm install
npm start
```

---

## 🔐 Administrative Access

To access the platform's Admin Dashboard:
1. Navigate to the registration page (`/register`).
2. Select **"Admin"** as your role.
3. You will be prompted for the registration key.
4. Enter the `ADMIN_SECRET_KEY` defined in your `.env` (Default in code: `FIXORA_ADMIN_SECRET_2026`).
5. After registration, you can seamlessly moderate reports, verify technicians, and view live platform health.
