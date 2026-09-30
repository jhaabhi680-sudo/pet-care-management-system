import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await API.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
      });

      updateUser(data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update profile.', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="mb-4">
          <h3 className="fw-bold mb-1">Account & Profile Settings ⚙️</h3>
          <p className="text-muted small mb-0">Update your contact information and manage credentials</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} py-2 small`} role="alert">
            {message.text}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card custom-card text-center p-4">
              <div
                className="rounded-circle bg-teal-subtle text-teal mx-auto d-flex align-items-center justify-content-center mb-3 fw-bold"
                style={{
                  width: '90px',
                  height: '90px',
                  fontSize: '2.5rem',
                  backgroundColor: '#ccfbf1',
                  color: '#0f766e',
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold mb-0">{user?.name}</h5>
              <span className="text-muted small">{user?.email}</span>
              <div className="mt-3">
                <span className="badge bg-secondary text-uppercase px-3 py-2">
                  Role: {user?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card custom-card p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Personal Information</h5>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Email Address</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={formData.email}
                      disabled
                    />
                    <small className="text-muted">Email address cannot be changed</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium">Designation / Role</label>
                    <input
                      type="text"
                      className="form-control bg-light text-capitalize"
                      value={user?.role}
                      disabled
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top text-end">
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
