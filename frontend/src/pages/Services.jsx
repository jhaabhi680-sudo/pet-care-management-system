import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

const Services = () => {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/services');
      setServices(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: '', duration: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete service "${name}"?`)) {
      try {
        await API.delete(`/services/${id}`);
        setSuccess(`Service "${name}" deleted.`);
        setServices(services.filter((s) => s._id !== id));
        setTimeout(() => setSuccess(''), 4000);
      } catch (err) {
        alert(err.message || 'Failed to delete service');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) {
      alert('Please fill in service name, price, and duration.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      if (editingService) {
        await API.put(`/services/${editingService._id}`, payload);
        setSuccess('Service updated successfully!');
      } else {
        await API.post('/services', payload);
        setSuccess('New service created successfully!');
      }

      setShowModal(false);
      fetchServices();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Clinic Services Catalog 🏷️</h3>
            <p className="text-muted small mb-0">
              Manage clinical offerings, medical procedures, grooming packages, and pricing
            </p>
          </div>
          {isAdmin && (
            <button onClick={handleOpenAdd} className="btn btn-primary mt-2 mt-sm-0">
              <i className="bi bi-plus-circle me-1"></i> Add New Service
            </button>
          )}
        </div>

        {success && <div className="alert alert-success py-2 small">{success}</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {loading ? (
          <Loading message="Loading services..." />
        ) : services.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <span style={{ fontSize: '3rem' }}>🏷️</span>
            <h5 className="fw-bold mt-2">No services available</h5>
            {isAdmin && (
              <button onClick={handleOpenAdd} className="btn btn-primary btn-sm mt-2">
                Create First Service
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {services.map((svc) => (
              <div className="col-md-6 col-lg-4" key={svc._id}>
                <div className="card custom-card h-100 p-3">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold mb-0">{svc.name}</h5>
                      <span className="badge bg-teal-subtle text-teal fs-6" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                        ₹{svc.price}
                      </span>
                    </div>

                    <div className="text-muted small mb-3">
                      <i className="bi bi-clock me-1 text-primary"></i>
                      Duration: <strong>{svc.duration}</strong>
                    </div>

                    <p className="card-text text-muted small flex-grow-1">
                      {svc.description || 'Comprehensive clinical care service.'}
                    </p>

                    {isAdmin && (
                      <div className="mt-3 pt-2 border-top d-flex justify-content-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(svc)}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(svc._id, svc.name)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add / Edit Service */}
        {showModal && (
          <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      {editingService ? 'Edit Service' : 'Add New Service'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Service Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Vaccination, Dental Cleaning, Grooming"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-medium">Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 500"
                          min="0"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-medium">Duration *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 30 mins, 1 hour"
                          required
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Provide details about what this service entails..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
