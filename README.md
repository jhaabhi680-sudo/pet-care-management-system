# 🐾 Pet Care Management System

A complete, modern, and clean Full-Stack **MERN (MongoDB, Express.js, React.js, Node.js)** web application built for the **Department of Information Technology — Web Lab (Course Code: 2345117)**.

Designed for veterinary clinics and pet owners to streamline appointment scheduling, manage biological pet profiles, preserve medical records & prescriptions, and maintain clinical services.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Syllabus Curriculum Mapping](#-syllabus-curriculum-mapping)
3. [Technology Stack](#-technology-stack)
4. [Key Features by Role](#-key-features-by-role)
5. [Complete Folder Structure](#-complete-folder-structure)
6. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
7. [Installation & Setup Guide](#-installation--setup-guide)
8. [Database Seeding & Demo Accounts](#-database-seeding--demo-accounts)
9. [RESTful API Endpoints Documentation](#-restful-api-endpoints-documentation)
10. [Testing with Postman](#-testing-with-postman)
11. [Troubleshooting & Common Errors](#-troubleshooting--common-errors)

---

## 🌟 Project Overview

The **Pet Care Management System** addresses the challenge of managing animal health history and clinic scheduling. In a typical veterinary clinic, paper prescriptions and phone bookings lead to misplaced records and missed booster vaccinations. 

This system provides:
- **For Pet Owners**: A secure self-service portal to register pets, book doctor appointments, view real-time status, and review medical prescriptions issued by veterinarians.
- **For Veterinarians & Administrators**: A central dashboard to manage incoming appointments (Confirm/Complete/Cancel), log diagnoses and prescriptions, manage service catalogs, and maintain client directories.

---

## 🎯 Syllabus Curriculum Mapping

This project directly implements all 10 practical experiments from the **Web Lab Practical Plan**:

| Exp No. | Syllabus Experiment Title | How It Is Implemented in This Project |
|:---:|:---|:---|
| **1** | Design a Responsive Registration Form using Bootstrap & Client-Side Validation | `frontend/src/pages/Register.jsx` uses Bootstrap 5 grid, floating controls, and real-time regex validation for email and 10-digit phone. |
| **2** | Develop JavaScript Programs using ES6 Features | ES6 arrow functions, destructuring, template literals, async/await, array methods (`map`, `filter`), and modular imports used throughout. |
| **3** | Create a React Application using Functional Components, JSX, Props, and State | Reusable components (`PetCard.jsx`, `AppointmentCard.jsx`) powered by React 18 functional components and JSX. |
| **4** | Develop a Single Page Application (SPA) using React Router, Hooks, and Lifecycle | `react-router-dom` v6 client-side routing, `useState`, `useEffect`, `useContext`, and protected route guards. |
| **5** | Install & Configure MongoDB. Create Database, Collections, Documents & CRUD | MongoDB database `petcare_db` with collections: `users`, `pets`, `appointments`, `medicalrecords`, `services`. |
| **6** | Develop a Node.js Application using Express.js and Mongoose | `backend/server.js` and `backend/config/db.js` connecting Mongoose schemas with validation hooks. |
| **7** | Node.js Core Capabilities (HTTP, Buffers, Streams, Event Loop) | RESTful API request-response pipelines, JSON streaming, and asynchronous event-driven I/O. |
| **8** | Build a RESTful API using Express.js & Test with Postman | Complete CRUD endpoints with standard HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `500`) and JSON responses. |
| **9** | Develop a Full-Stack MERN Application by Integrating React with Express via Axios | `frontend/src/services/api.js` centralized Axios instance with JWT Authorization interceptors. |
| **10**| Deploy a MERN Stack Web Application on Cloud Platform | Clean, decoupled frontend and backend architectures ready for Vercel/Netlify (frontend) and Render/Railway (backend). |

---

## 💻 Technology Stack

- **Frontend**:
  - **React 18** (Functional components, Hooks)
  - **Vite** (Next-generation blazing fast frontend tooling)
  - **Bootstrap 5.3** & **Bootstrap Icons** (Responsive mobile-first layout)
  - **React Router DOM v6** (Client-side declarative routing)
  - **Axios** (Promise-based HTTP client with interceptors)
- **Backend**:
  - **Node.js** (JavaScript runtime environment)
  - **Express.js** (Fast, minimalist backend web framework)
  - **MongoDB** & **Mongoose ODM** (NoSQL document database)
  - **JSON Web Token (JWT)** (Stateless authorization tokens)
  - **bcryptjs** (Salted password hashing)
  - **dotenv** & **cors** (Configuration management and cross-origin resource sharing)

---

## 👥 Key Features by Role

### 🐶 Pet Owner
- **Landing Page**: Overview of clinic services, doctor qualifications, and contact form.
- **Account Registration & Login**: Client-side validation with instant feedback.
- **Owner Dashboard**: Real-time summary cards (Total Pets, Upcoming Visits, Completed Visits, Medical Records).
- **Pet Management**: Add, view, edit, and delete pet profiles (Name, Species, Breed, Age, Weight, Vaccination status).
- **Appointment Booking**: Pick a pet, select preferred veterinarian, choose date & time slot, and specify reasons/symptoms.
- **Appointment Tracking**: Real-time status badges (`Pending`, `Confirmed`, `Completed`, `Cancelled`) with booking cancellation.
- **Medical Records**: View-only access to doctor diagnoses, treatments, and prescriptions.

### 🩺 Veterinarian & Clinic Administrator
- **Admin Dashboard**: Clinic health analytics (Total Owners, Total Pets, Today's Appointments, Pending Approvals, Completed Visits).
- **Appointment Approval Queue**: Filter appointments by status; confirm pending requests or mark as completed.
- **Diagnostic Medical Records**: Create comprehensive patient clinical records with prescription instructions and vaccination logs.
- **Service Catalog Management**: Add, update, or remove clinic services and adjust fee pricing.
- **Client Directory**: Browse all registered pet parents with contact phone and email.

---

## 📁 Complete Folder Structure

```text
pet-care-management-system/
├── postman_collection.json          # Ready-to-import Postman API collection
├── package.json                     # Root package metadata
├── README.md                        # Project documentation guide
│
├── frontend/                        # React Frontend (Vite)
│   ├── .env                         # Frontend environment variables
│   ├── .env.example
│   ├── index.html                   # HTML template + Bootstrap 5 CDN
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite dev server configuration
│   └── src/
│       ├── main.jsx                 # React root DOM render
│       ├── App.jsx                  # Master Router & route definitions
│       ├── index.css                # Custom theme styling & dashboard layout
│       ├── context/
│       │   └── AuthContext.jsx      # Global Auth context, login/register/logout
│       ├── services/
│       │   └── api.js               # Centralized Axios with Bearer token interceptor
│       ├── components/
│       │   ├── Navbar.jsx           # Responsive navigation header
│       │   ├── Sidebar.jsx          # Role-based dashboard sidebar
│       │   ├── Footer.jsx           # Clinic info and lab footer
│       │   ├── PetCard.jsx          # Pet profile card component
│       │   ├── AppointmentCard.jsx  # Status-badged appointment card
│       │   ├── Loading.jsx          # UI loading spinner
│       │   └── ProtectedRoute.jsx   # Role-based route guard
│       └── pages/
│           ├── Home.jsx             # Public landing page with hero & services
│           ├── Login.jsx            # Sign in page + one-click lab demo accounts
│           ├── Register.jsx         # Sign up form with regex validation
│           ├── OwnerDashboard.jsx   # Pet parent analytics & quick actions
│           ├── AdminDashboard.jsx   # Clinic administrator analytics
│           ├── Pets.jsx             # Pet inventory with live search & filters
│           ├── AddPet.jsx           # Biological & medical pet registration form
│           ├── EditPet.jsx          # Pet profile updater
│           ├── Appointments.jsx     # Appointments table with status filters
│           ├── BookAppointment.jsx  # Slot & doctor booking form
│           ├── MedicalRecords.jsx   # Clinical diagnoses & prescription modal
│           ├── Services.jsx         # Clinic services & pricing catalog
│           ├── Users.jsx            # Pet owners directory (Admin only)
│           ├── Profile.jsx          # User profile settings
│           └── NotFound.jsx         # 404 page
│
└── backend/                         # Node.js + Express + MongoDB Backend
    ├── .env                         # Backend port, MongoDB URI & JWT secret
    ├── .env.example
    ├── package.json                 # Backend dependencies & scripts
    ├── server.js                    # Express application entry point
    ├── seed.js                      # Database seeder (1 admin, 3 owners, 5 pets, etc.)
    ├── config/
    │   └── db.js                    # Mongoose database connector
    ├── models/
    │   ├── User.js                  # User schema with bcrypt password hashing
    │   ├── Pet.js                   # Pet schema with owner reference
    │   ├── Appointment.js           # Appointment schema (Pet + Owner + Doctor)
    │   ├── MedicalRecord.js         # Clinical record & Rx prescription schema
    │   └── Service.js               # Clinic service & price schema
    ├── middleware/
    │   ├── authMiddleware.js        # JWT token verification & role authorization
    │   └── errorMiddleware.js       # 404 handler & centralized error formatting
    ├── controllers/
    │   ├── authController.js        # Register and login controllers
    │   ├── petController.js         # Pet CRUD operations
    │   ├── appointmentController.js # Appointment scheduling & status updates
    │   ├── medicalRecordController.js # Veterinary diagnoses & treatments
    │   ├── serviceController.js     # Services catalog management
    │   └── userController.js        # User directory & profile updates
    └── routes/
        ├── authRoutes.js
        ├── petRoutes.js
        ├── appointmentRoutes.js
        ├── medicalRecordRoutes.js
        ├── serviceRoutes.js
        └── userRoutes.js
```

---

## ⚙️ Prerequisites & System Requirements

Before running the project locally, verify the following are installed:
1. **Node.js** (v18.0.0 or higher)
2. **npm** (v9.0.0 or higher)
3. **MongoDB** (Local Community Server running on `mongodb://127.0.0.1:27017` OR free cloud MongoDB Atlas cluster URI)
4. **VS Code** (Recommended code editor)
5. **Postman** (For testing REST APIs)

---

## 🚀 Installation & Setup Guide

### Step 1: Open Project in VS Code
Open the project folder `pet-care-management-system` in VS Code.

### Step 2: Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/petcare_db
JWT_SECRET=petcare_super_secret_jwt_key_2026
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string).*

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies

Open two separate terminals in VS Code:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
```

---

## 🌱 Database Seeding & Demo Accounts

To quickly test the project without manually typing data, run the built-in database seeder in the backend terminal:

```bash
cd backend
npm run seed
```

This seeds:
- **1 Admin / Veterinarian**
- **3 Pet Owners**
- **5 Pets** (Bruno, Milo, Rocky, Bella, Luna)
- **5 Clinic Services** (Consultation, Vaccination, Grooming, Dental, Emergency)
- **5 Appointments** (Confirmed, Pending, Completed)
- **3 Medical Records** (Prescriptions, Diagnoses, Treatments)

### 🔑 Pre-seeded Login Credentials:
| Role | Email | Password |
|:---|:---|:---|
| **Admin / Veterinarian** | `admin@petcare.com` | `password123` |
| **Pet Owner 1 (Rahul)** | `rahul@example.com` | `password123` |
| **Pet Owner 2 (Priya)** | `priya@example.com` | `password123` |
| **Pet Owner 3 (Amit)** | `amit@example.com` | `password123` |

> *Tip: On the frontend Login page, click the **"Demo Owner"** or **"Demo Admin/Vet"** buttons to auto-fill these credentials instantly!*

---

## ▶️ Starting the Application

### 1. Start the Express Backend:
In **Terminal 1**:
```bash
cd backend
npm run dev
# Or: npm start
```
You will see:
```text
✅ MongoDB Connected Successfully: 127.0.0.1
🚀 PetCare Server running in development mode on port 5000
🌐 Base API URL: http://localhost:5000/api
```

### 2. Start the React Frontend:
In **Terminal 2**:
```bash
cd frontend
npm run dev
```
You will see:
```text
  VITE v5.4.2  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```
Open **`http://localhost:3000`** in Google Chrome!

---

## 📡 RESTful API Endpoints Documentation

All endpoints are prefixed with `/api`.

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |

### 2. Pet Profiles (`/api/pets`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/pets` | Private | Get user's pets (or all pets for Admin) |
| `POST` | `/api/pets` | Private | Register a new pet profile |
| `GET` | `/api/pets/:id` | Private | Get detailed pet information by ID |
| `PUT` | `/api/pets/:id` | Private | Update pet details, weight, vaccines |
| `DELETE` | `/api/pets/:id` | Private | Delete pet & related appointments |

### 3. Appointments (`/api/appointments`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/appointments` | Private | Get appointments (Owner sees own, Admin sees all) |
| `POST` | `/api/appointments` | Private | Book a new clinic appointment |
| `GET` | `/api/appointments/:id` | Private | Get appointment details |
| `PUT` | `/api/appointments/:id` | Private | Update status (`Confirmed`, `Completed`, `Cancelled`) |
| `DELETE` | `/api/appointments/:id` | Private | Remove appointment record |

### 4. Medical Records (`/api/medical-records`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/medical-records` | Private | Get diagnostic & prescription records |
| `POST` | `/api/medical-records` | Admin/Vet | Add diagnosis, symptoms & Rx prescription |
| `GET` | `/api/medical-records/:id` | Private | View specific medical record |
| `PUT` | `/api/medical-records/:id` | Admin/Vet | Update medical record |
| `DELETE` | `/api/medical-records/:id` | Admin/Vet | Delete medical record |

### 5. Services Catalog (`/api/services`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/services` | Public | List all clinic procedures and prices |
| `POST` | `/api/services` | Admin/Vet | Create a new clinic service |
| `GET` | `/api/services/:id` | Public | Get service details |
| `PUT` | `/api/services/:id` | Admin/Vet | Update service title, duration, fee |
| `DELETE` | `/api/services/:id` | Admin/Vet | Delete service from catalog |

### 6. Users Directory (`/api/users`)
| Method | Endpoint | Access | Description |
|:---|:---|:---|:---|
| `GET` | `/api/users` | Admin/Vet | Get directory of registered users |
| `GET` | `/api/users/:id` | Private | Get specific user profile |
| `PUT` | `/api/users/profile` | Private | Update current user's profile info |
| `DELETE` | `/api/users/:id` | Admin | Delete a user account |

---

## 📮 Testing with Postman

1. Open **Postman**.
2. Click **Import** in the top left corner.
3. Select the file: `postman_collection.json` located at the root of the project.
4. Run the **"Login (Pet Owner)"** or **"Login (Admin / Vet)"** request.
5. The login request script automatically saves the `authToken` variable for all subsequent requests!
6. Test CRUD requests on Pets, Appointments, and Medical Records.

---

## 🛠️ Troubleshooting & Common Errors

| Error | Cause | Solution |
|:---|:---|:---|
| `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB service is not started locally. | Start MongoDB service from Windows Services or run `mongod` in command prompt, or use a MongoDB Atlas URI in `.env`. |
| `Network Error` in React | Backend server is not running or CORS blocked. | Ensure backend is running on `http://localhost:5000` and check `VITE_API_URL` in `frontend/.env`. |
| `401 Unauthorized: token invalid` | Token expired or missing. | Log out and log in again to generate a fresh JWT token in `localStorage`. |
| `Port 5000 or 3000 already in use` | Another process is holding the port. | Change `PORT=5001` in `backend/.env` and update `VITE_API_URL` in `frontend/.env`. |

---
