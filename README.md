# Agent & List Management System (MERN)

A modern, glassmorphism-inspired MERN stack application for managing agents and distributing task lists from CSV/Excel files.

## Features

- **Admin Login**: Secure JWT-based authentication for administrators.
- **Agent Management**: Admins can create and view agent profiles.
- **Task Distribution**: Upload CSV/Excel files; items are automatically distributed equally/sequentially among agents.
- **Agent Dashboard**: Agents can view tasks assigned specifically to them.
- **Premium UI**: Modern design with smooth transitions and responsive layout.

## Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer, CSV-Parser, XLSX.
- **Auth**: JSON Web Tokens (JWT) & BcryptJS.

## Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

## Setup Instructions

### 1. Database Configuration
Open `backend/.env` and update the `MONGODB_URI` with your connection string.
```env
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/your_db
```

### 2. Install Dependencies
Run the following in the project root:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Seed Admin User
In the `backend` directory, run the seeder script to create the initial admin account:
```bash
npm run seed
```
**Admin Credentials:**
- **Email**: `admin@example.com`
- **Password**: `admin123password`

### 4. Run the Application
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Usage
1. Log in as **Admin**.
2. Go to the **Agents** tab and create at least one agent.
3. Go to the **Upload** tab and upload a CSV/Excel file.
4. The system will distribute the tasks among agents and save them to the database.
5. Log in as an **Agent** to see the assigned tasks in their dashboard.
