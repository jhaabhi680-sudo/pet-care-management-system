import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'owner',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Client-side validation demonstrating Web Lab Experiment 1 & 2
  const validate = () => {
    const errs = {};

    // Name validation
    if (!formData.name.trim()) {
      errs.name = 'Full Name is required.';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.replace(/[- ]/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit phone number.';
    }

    // Password validation
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirming your password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      };

      const newUser = await register(payload);
      if (newUser.role === 'admin' || newUser.role === 'veterinarian') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card custom-card p-4">
            <div className="text-center mb-4">
              <span style={{ fontSize: '3rem' }}>🐾</span>
              <h3 className="fw-bold mt-2">Create an Account</h3>
              <p className="text-muted small">Register as a Pet Parent or Clinic Specialist</p>
            </div>

            {serverError && (
              <div className="alert alert-danger py-2 small" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-medium">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-medium">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-medium">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-3">
                <label className="form-label fw-medium">Account Role</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="owner">Pet Owner (Default)</option>
                  <option value="veterinarian">Veterinarian / Doctor</option>
                  <option value="admin">Clinic Administrator</option>
                </select>
                <small className="text-muted">Choose your role in the system</small>
              </div>

              {/* Password */}
              <div className="row g-2 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Min. 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="small fw-semibold text-teal text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
