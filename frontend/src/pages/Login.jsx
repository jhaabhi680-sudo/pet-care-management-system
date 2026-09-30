import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Validate form client-side
  const validateForm = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
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
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');

    try {
      const loggedInUser = await login(formData.email, formData.password);
      // Route dynamically depending on user role
      if (loggedInUser.role === 'admin' || loggedInUser.role === 'veterinarian') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setServerError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Helper for viva and testing: autofill demo accounts
  const autofillDemo = (type) => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@petcare.com',
        password: 'password123',
      });
    } else {
      setFormData({
        email: 'rahul@example.com',
        password: 'password123',
      });
    }
    setErrors({});
    setServerError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card custom-card p-4">
            <div className="text-center mb-4">
              <span style={{ fontSize: '3rem' }}>🐾</span>
              <h3 className="fw-bold mt-2">Welcome Back</h3>
              <p className="text-muted small">Sign in to manage your pets and appointments</p>
            </div>

            {serverError && (
              <div className="alert alert-danger py-2 small" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-medium">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
                    Authenticating...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>



            <div className="text-center mt-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="small fw-semibold text-teal text-decoration-none">
                Register as Pet Owner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
