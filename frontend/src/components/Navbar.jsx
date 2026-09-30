import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <span style={{ fontSize: '1.7rem' }}>🐾</span>
          <span>PetCare</span>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active fw-medium" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="/#services">
                Services
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="/#about">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="/#contact">
                Contact
              </a>
            </li>
          </ul>

          {/* User Auth controls */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{user.name}</span>
                  <span className="badge bg-secondary text-uppercase" style={{ fontSize: '0.7rem' }}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                  <li>
                    <Link
                      className="dropdown-item"
                      to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                    >
                      <i className="bi bi-speedometer2 me-2"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i> My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary px-4">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary px-4">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
