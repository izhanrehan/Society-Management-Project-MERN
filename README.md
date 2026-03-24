````markdown
# 🏛️ SociNexus - Society Management System (MERN)

> A modern, automated workspace for university societies to manage events, registrations, and memberships seamlessly.

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel&logoColor=white)](https://society-management-project-mern-4yr.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**SociNexus** simplifies how academic and recreational societies operate. It bridges the communication gap between students and society admins by providing a unified platform for tracking upcoming events, managing historical records, and processing student registrations.

🔗 **Live Frontend:** [soci Nexus Web App](https://society-management-project-mern-4yr.vercel.app/)  
🔗 **Live API Base:** [SociNexus Backend API](https://society-management-project-mern.vercel.app/)

---

## 📑 Table of Contents
* [🌟 Project Overview](#-project-overview)
* [🚀 Core Features](#-core-features)
* [💻 Technology Stack](#-technology-stack)
* [📂 Repository Structure](#-repository-structure)
* [⚙️ Getting Started (Local Setup)](#️-getting-started-local-setup)
* [🔑 Environment Variables](#-environment-variables)
* [👥 Contributors](#-contributors)

---

## 🌟 Project Overview

Managing multiple societies, tracking active members, and publicizing events can be chaotic on paper or chat groups. SociNexus translates this ecosystem into an organized web application. It offers distinct privileges for **Students/Visitors** (browsing & registering) and **Admins** (approving & scheduling).

---

## 🚀 Core Features

* 🔐 **Role-Based Authentication:** Dedicated Login/Registration for Students and Society Administrators.
* 📅 **Event Management:** Create, filter, and display upcoming vs. past events effortlessly.
* 🤝 **Society Partnerships:** Browse official partner societies with their profiles.
* 📊 **Admin Dashboard:** Centralized metrics and control panels for society heads.
* 📱 **Responsive & Accessible UI:** Modern interface compatible across mobile, tablet, and desktop viewports.
* 🌐 **Cross-Origin (CORS) Configuration:** Secure deployments separating production frontend from node backend.

---

## 💻 Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js, Tailwind CSS | High-performance, interactive, and responsive user interfaces |
| **Backend** | Node.js, Express.js | Secure RESTful APIs with Router middlewares |
| **Database** | MongoDB (Atlas) | Cloud data storage for profiles, societies, and event records |
| **Deployment** | Vercel Serverless | Scalable automated hosting pipeline |

---

## 📂 Repository Structure

```directory
society-management-system/
├── 📂 client/                 # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI Blocks (Navbar, Sidebars)
│   │   ├── lib/              # Axios instance setup
│   │   ├── config/           # API environment variables handler
│   │   └── routes/           # Protected routing schemes
├── 📂 server/                 # Node.js Express Backend
│   ├── src/
│   │   ├── config/           # MongoDB Connection Setup
│   │   ├── models/           # Mongoose Schemas (Admin, Events, Registration)
│   │   └── routes/           # Endpoint handlers (auth, event, society)
│   ├── index.js              # Server entry point
│   └── vercel.json           # Serverless Routing rules
````

-----

## ⚙️ Getting Started (Local Setup)

### 📋 Prerequisites

  * Node.js LTS
  * MongoDB Local or Atlas Connection String

### 🔧 Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/izhanrehan/Society-Management-Project-MERN.git](https://github.com/izhanrehan/Society-Management-Project-MERN.git)
    cd Society-Management-Project-MERN
    ```

2.  **Initialize Backend:**

    ```bash
    cd server
    npm install
    npm run dev # or node index.js
    ```

3.  **Initialize Frontend:**

    ```bash
    cd ../client
    npm install
    npm start
    ```

-----

## 🔑 Environment Variables

Deploy with the following setups in your `.env` files for production:

**Backend Setup (`/server/.env`):**

```env
MONGO_URI=your_mongodb_cluster_url
PORT=5000
JWT_SECRET=your_secret_encryption_key
```

**Frontend Setup (`/client/.env`):**

```env
REACT_APP_API_URL=[https://society-management-project-mern.vercel.app/api](https://society-management-project-mern.vercel.app/api)
```

-----

## 👥 Contributors
  * **Izhan Rehan** - *Full Stack Developer* - [GitHub Profile](https://www.google.com/search?q=https://github.com/izhanrehan)

