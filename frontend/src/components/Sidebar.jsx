import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar shadow-sm">
      <div className="mb-4 px-2">
        <h6 className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          {isAdmin ? 'Clinic Administration' : 'Pet Parent Portal'}
        </h6>
        <div className="fw-semibold text-truncate">{user?.name}</div>
        <small className="text-muted text-capitalize">{user?.role}</small>
      </div>

      <ul className="sidebar-nav">
        {isAdmin ? (
          // Admin & Veterinarian Navigation
          <>
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/pets"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-heart-pulse"></i>
                <span>All Pets</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/appointments"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-calendar-check"></i>
                <span>Appointments</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/medical-records"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-file-earmark-medical"></i>
                <span>Medical Records</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/services"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-tags"></i>
                <span>Services</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-people"></i>
                <span>Pet Owners</span>
              </NavLink>
            </li>
          </>
        ) : (
          // Pet Owner Navigation
          <>
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pets"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-feather"></i>
                <span>My Pets</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pets/add"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-plus-circle"></i>
                <span>Add Pet</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/appointments"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-calendar3"></i>
                <span>My Appointments</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/appointments/book"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-calendar-plus"></i>
                <span>Book Appointment</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/medical-records"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <i className="bi bi-file-earmark-text"></i>
                <span>Medical Records</span>
              </NavLink>
            </li>
          </>
        )}

        <hr className="my-3 text-secondary" />

        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-person-gear"></i>
            <span>Profile Settings</span>
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="sidebar-link w-100 text-start border-0 bg-transparent text-danger"
          >
            <i className="bi bi-box-arrow-left"></i>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
