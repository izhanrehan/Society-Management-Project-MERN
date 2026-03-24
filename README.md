# 🏛️ SociNexus - Society Management System (MERN)

> A modern, automated workspace for university societies to manage events, registrations, and memberships seamlessly.

[![Deployment](https://img.shields.io/badge/Live-Vercel-black?logo=vercel)](https://society-management-project-mern-4yr.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)

**SociNexus** simplifies how academic and recreational societies operate by providing a unified platform for managing events, registrations, and communication between students and administrators.

🔗 **Live App:** https://society-management-project-mern-4yr.vercel.app/
🔗 **API Base URL:** https://society-management-project-mern.vercel.app/

---

## 📑 Table of Contents

* [🌟 Project Overview](#-project-overview)
* [🚀 Core Features](#-core-features)
* [💻 Technology Stack](#-technology-stack)
* [📂 Repository Structure](#-repository-structure)
* [⚙️ Getting Started](#️-getting-started-local-setup)
* [🔑 Environment Variables](#-environment-variables)
* [👥 Contributors](#-contributors)

---

## 🌟 Project Overview

Managing societies, members, and events manually can be inefficient and disorganized.
**SociNexus** digitizes this process with a structured system.

### 👤 User Roles:

* **Students / Visitors** → Browse societies & register for events
* **Admins** → Manage events, approve registrations, control data

---

## 🚀 Core Features

* 🔐 Role-Based Authentication (Admin / Student)
* 📅 Event Management (Upcoming & Past Events)
* 🤝 Society Listings & Partnerships
* 📊 Admin Dashboard (Centralized Controls)
* 📱 Fully Responsive UI
* 🌐 Secure CORS-enabled Deployment

---

## 💻 Technology Stack

| Layer      | Technology             |
| ---------- | ---------------------- |
| Frontend   | React.js, Tailwind CSS |
| Backend    | Node.js, Express.js    |
| Database   | MongoDB Atlas          |
| Deployment | Vercel Serverless      |

---

## 📂 Repository Structure

```bash
society-management-system/
│
├── client/                  # React Frontend
│   └── src/
│       ├── components/     # UI Components
│       ├── lib/            # Axios Setup
│       ├── config/         # API Config
│       └── routes/         # Protected Routes
│
├── server/                  # Express Backend
│   └── src/
│       ├── config/         # DB Connection
│       ├── models/         # Schemas
│       └── routes/         # API Routes
│
├── index.js                # Server Entry
└── vercel.json             # Deployment Config
```

---

## ⚙️ Getting Started (Local Setup)

### 📋 Prerequisites

* Node.js (LTS recommended)
* MongoDB (Local or Atlas)

---

### 🔧 Installation

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/izhanrehan/Society-Management-Project-MERN.git
cd Society-Management-Project-MERN
```

---

#### 2️⃣ Setup Backend

```bash
cd server
npm install
npm run dev   # or: node index.js
```

---

#### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
npm start
```

---

## 🔑 Environment Variables

### 📦 Backend (`/server/.env`)

```env
MONGO_URI=your_mongodb_cluster_url
PORT=5000
JWT_SECRET=your_secret_key
```

---

### 🌐 Frontend (`/client/.env`)

```env
REACT_APP_API_URL=https://society-management-project-mern.vercel.app/api
```

---

## ▶️ Running the Project

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm start
```

---

## 👥 Contributors

* **Izhan Rehan** – Full Stack Developer
  🔗 https://github.com/izhanrehan

---

## 💡 Note

Built as a MERN Stack project for academic and practical implementation of full-stack development concepts.
