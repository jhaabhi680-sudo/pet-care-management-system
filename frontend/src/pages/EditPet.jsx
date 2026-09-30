import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    age: '',
    dateOfBirth: '',
    weight: '',
    color: '',
    vaccinationStatus: 'Up to date',
    medicalNotes: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    fetchPet();
  }, [id]);

  const fetchPet = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/pets/${id}`);
      setFormData({
        name: data.name || '',
        species: data.species || 'Dog',
        breed: data.breed || '',
        gender: data.gender || 'Male',
        age: data.age !== undefined ? data.age : '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
        weight: data.weight !== undefined ? data.weight : '',
        color: data.color || '',
        vaccinationStatus: data.vaccinationStatus || 'Up to date',
        medicalNotes: data.medicalNotes || '',
      });
    } catch (err) {
      setServerError(err.message || 'Failed to load pet data.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Pet name is required.';
    if (!formData.species.trim()) errs.species = 'Species is required.';
    if (!formData.breed.trim()) errs.breed = 'Breed is required.';
    if (formData.age === '' || Number(formData.age) < 0) {
      errs.age = 'Age must be a valid positive number.';
    }
    if (formData.weight !== '' && Number(formData.weight) <= 0) {
      errs.weight = 'Weight must be greater than 0.';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setServerError('');

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight: formData.weight ? Number(formData.weight) : undefined,
      };

      await API.put(`/pets/${id}`, payload);
      navigate(-1); // return to previous page
    } catch (err) {
      setServerError(err.message || 'Failed to update pet');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex align-items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left"></i>
          </button>
          <div>
            <h3 className="fw-bold mb-0">Edit Pet Profile ✏️</h3>
            <p className="text-muted small mb-0">Update biological stats, vaccines, or medical notes</p>
          </div>
        </div>

        {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}

        {loading ? (
          <Loading message="Loading pet details..." />
        ) : (
          <div className="card custom-card p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Pet Name *</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-medium">Species *</label>
                  <select
                    name="species"
                    className="form-select"
                    value={formData.species}
                    onChange={handleChange}
                  >
                    <option value="Dog">Dog 🐕</option>
                    <option value="Cat">Cat 🐈</option>
                    <option value="Bird">Bird 🦜</option>
                    <option value="Rabbit">Rabbit 🐇</option>
                    <option value="Other">Other 🐾</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-medium">Breed *</label>
                  <input
                    type="text"
                    name="breed"
                    className={`form-control ${errors.breed ? 'is-invalid' : ''}`}
                    value={formData.breed}
                    onChange={handleChange}
                  />
                  {errors.breed && <div className="invalid-feedback">{errors.breed}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-medium">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-medium">Age (Years) *</label>
                  <input
                    type="number"
                    name="age"
                    min="0"
                    step="0.5"
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    value={formData.age}
                    onChange={handleChange}
                  />
                  {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-medium">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-medium">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    min="0"
                    step="0.1"
                    className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">Color / Coat Markings</label>
                  <input
                    type="text"
                    name="color"
                    className="form-control"
                    value={formData.color}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">Vaccination Status</label>
                  <select
                    name="vaccinationStatus"
                    className="form-select"
                    value={formData.vaccinationStatus}
                    onChange={handleChange}
                  >
                    <option value="Up to date">Up to date (Fully vaccinated)</option>
                    <option value="Pending">Pending (Vaccines due)</option>
                    <option value="Not Vaccinated">Not Vaccinated</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium">Medical Notes & Allergies</label>
                  <textarea
                    name="medicalNotes"
                    rows="3"
                    className="form-control"
                    value={formData.medicalNotes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Pet'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPet;
