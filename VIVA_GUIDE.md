# 🎓 Pet Care Management System - College Lab & Viva Walkthrough Guide

Use this guide during your **Web Lab (Course Code: 2345117)** practical evaluation or project viva.

---

## ⏱️ 5-Minute Practical Demonstration Script

### Step 1: Show the Project Architecture (1 min)
1. Open the project in **VS Code**.
2. Point out the clean folder separation:
   - `frontend/`: React 18, Vite, React Router DOM, Bootstrap 5.
   - `backend/`: Node.js, Express.js, Mongoose, JWT authentication.
3. Mention that environment variables (`.env`) are used on both client and server to keep configuration independent and deployment-ready.

---

### Step 2: Show Database Seeding (30 seconds)
Open terminal in `backend/` and run:
```bash
npm run seed
```
Show the examiner the output in the console:
- Purged previous data.
- Created 1 Admin/Veterinarian (`admin@petcare.com`).
- Created 3 Pet Owners (`rahul@example.com`, `priya@example.com`, `amit@example.com`).
- Created 5 Pets with distinct breeds & species (Dog, Cat).
- Created 5 clinic services and 5 appointments with realistic statuses.
- Created 3 medical records with diagnoses and prescriptions.

---

### Step 3: Demonstrate Landing Page & Client-Side Validation (1 min)
1. Navigate to `http://localhost:3000/`.
2. Scroll through:
   - **Hero Section**: "Complete Care for Your Beloved Pets"
   - **Services Section**: 6 services (Consultation, Vaccination, Grooming, Health Checkup, Dental, Emergency).
   - **About Us & Contact Form**.
3. Click **Register** in the top navigation:
   - Try submitting the form empty.
   - Point out the instant client-side validation errors (Experiment 1 & 2): Name length, valid email regex format, 10-digit phone requirement, matching password check.

---

### Step 4: Demonstrate Pet Owner Capabilities (1.5 min)
1. Go to **Login** (`http://localhost:3000/login`).
2. Click the quick button **"Demo Owner"** (fills `rahul@example.com` / `password123`) and click **Sign In**.
3. **Owner Dashboard**:
   - Show the 4 stat cards (Total Pets, Upcoming Visits, Completed Visits, Medical Records).
4. Click **My Pets**:
   - View Bruno (Labrador) and Bella (Golden Retriever).
   - Click **Add Pet** to demonstrate inserting a new pet (e.g. "Charlie", Cat, Persian).
5. Click **Book Appointment**:
   - Select "Bruno".
   - Select service: "Vaccination & Immunization".
   - Select a future date and time slot.
   - Enter reason: "Booster vaccination".
   - Submit -> see the newly booked appointment with status **Pending**.
6. Click **Medical Records**:
   - Show that Rahul can view Dr. Aditi's diagnosis for Bruno ("Mild Food Allergy"), symptoms, and prescription ("Apoquel 5.4mg").
   - Emphasize that Pet Owners have **read-only** access to medical records.

---

### Step 5: Demonstrate Veterinarian / Admin Capabilities (1 min)
1. Click **Logout** from the sidebar or profile menu.
2. Click **"Demo Admin/Vet"** (fills `admin@petcare.com` / `password123`) and click **Sign In**.
3. **Admin Dashboard**:
   - Highlight the 5 clinic overview cards (Total Pet Owners, Total Pets, Today's Visits, Pending Requests, Completed).
4. Go to **Appointments**:
   - Filter by `Pending`.
   - Click **Confirm** on Rahul's appointment for Bruno. The status changes immediately to **Confirmed**.
   - Show that doctors can also mark appointments as **Completed**.
5. Go to **Medical Records**:
   - Click **Add Medical Record** (modal appears).
   - Enter diagnosis, symptoms, administered treatment, and prescription.
   - Save -> instantly added to MongoDB and visible to that pet's owner.
6. Go to **Services**:
   - Show how the clinic administrator can add a new service (e.g., "Microchipping", ₹900, 15 mins).

---

### Step 6: Demonstrate REST API in Postman (Optional if asked)
1. Open **Postman**.
2. Show the imported collection: `Pet Care Management System API`.
3. Execute `POST /api/auth/login`.
4. Execute `GET /api/pets` with the Bearer token.
5. Highlight proper HTTP status codes: `200 OK`, `201 Created`, `401 Unauthorized`, `403 Forbidden`.

---

## 🧠 Common Viva Questions & Model Answers

### Q: Why did you choose React for the frontend instead of vanilla HTML/JS?
**Answer:** React is a component-based library that allows us to build reusable UI elements (like `PetCard` and `AppointmentCard`). It maintains a Virtual DOM which updates only the modified elements efficiently without reloading the whole webpage, creating a seamless Single Page Application (SPA).

### Q: What is the purpose of React Router DOM?
**Answer:** Traditional multi-page applications trigger a full page reload for every URL navigation. React Router intercepts the browser URL changes client-side, swapping components in and out dynamically without reloading, preserving application state.

### Q: How does Mongoose help in this project?
**Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema definitions, data type validation (e.g. required fields, min/max values), middleware hooks (like our pre-save password hashing hook), and reference population (`populate('owner')`) which mimics SQL JOIN operations in a NoSQL database.

### Q: Why is password hashing done with bcrypt instead of plain text or MD5?
**Answer:** MD5 and plain text are vulnerable to rainbow table attacks and dictionary attacks. **bcryptjs** uses a cryptographic salt (10 rounds in our project) and a slow key derivation function, making brute-force cracking computationally infeasible.

### Q: How does JWT ensure security between client and server?
**Answer:** JWT (JSON Web Token) is stateless. When the user logs in, the server signs a payload containing the user's ID with a secret key (`JWT_SECRET`). On every subsequent request, the client sends this token in the `Authorization` header. The server verifies the cryptographic signature without needing to store sessions in memory or database.

### Q: How are unauthorized users prevented from accessing doctor-only features?
**Answer:** We implemented a two-tier protection:
1. **Frontend**: The `ProtectedRoute` component checks `user.role` from `AuthContext`. If an owner tries to navigate to `/admin/*`, they are redirected.
2. **Backend**: The `authorize('admin', 'veterinarian')` middleware intercepts API requests. If a non-admin token calls `POST /api/medical-records` or `POST /api/services`, the server returns HTTP `403 Forbidden`.
