import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Protected Pet Owner pages
import OwnerDashboard from './pages/OwnerDashboard';
import Pets from './pages/Pets';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import MedicalRecords from './pages/MedicalRecords';
import Profile from './pages/Profile';

// Protected Admin / Veterinarian pages
import AdminDashboard from './pages/AdminDashboard';
import AdminPets from './pages/AdminPets';
import Services from './pages/Services';
import Users from './pages/Users';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />

          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes for Pet Owners */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<OwnerDashboard />} />
                <Route path="/pets" element={<Pets />} />
                <Route path="/pets/add" element={<AddPet />} />
                <Route path="/pets/edit/:id" element={<EditPet />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/appointments/book" element={<BookAppointment />} />
                <Route path="/medical-records" element={<MedicalRecords />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Protected Routes for Clinic Admin / Veterinarians */}
              <Route
                element={<ProtectedRoute allowedRoles={['admin', 'veterinarian']} />}
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/pets" element={<AdminPets />} />
                <Route path="/admin/appointments" element={<Appointments />} />
                <Route path="/admin/medical-records" element={<MedicalRecords />} />
                <Route path="/admin/services" element={<Services />} />
                <Route path="/admin/users" element={<Users />} />
              </Route>

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
