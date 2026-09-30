import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

const AddPet = () => {
  const { user, isAdmin } = useAuth();
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
    owner: '', // Only needed if admin is assigning to a specific owner
  });

  const [ownersList, setOwnersList] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If admin is adding, fetch list of owners to pick from
    if (isAdmin) {
      API.get('/users')
        .then((res) => {
          const owners = res.data.filter((u) => u.role === 'owner');
          setOwnersList(owners);
          if (owners.length > 0) {
            setFormData((prev) => ({ ...prev, owner: owners[0]._id }));
          }
        })
        .catch((err) => console.error('Error fetching owners:', err));
    }
  }, [isAdmin]);

  // Client-side validation
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
    if (isAdmin && !formData.owner) {
      errs.owner = 'Please select a pet owner.';
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

    setLoading(true);
    setServerError('');

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight: formData.weight ? Number(formData.weight) : undefined,
      };

      // If owner is creating, API defaults owner to logged in user's id
      if (!isAdmin) {
        delete payload.owner;
      }

      await API.post('/pets', payload);
      navigate(isAdmin ? '/admin/pets' : '/pets');
    } catch (err) {
      setServerError(err.message || 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to={isAdmin ? '/admin/pets' : '/pets'} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <div>
            <h3 className="fw-bold mb-0">Register New Pet 🐾</h3>
            <p className="text-muted small mb-0">Enter your pet's biological and health details</p>
          </div>
        </div>

        {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}

        <div className="card custom-card p-4">
          <form onSubmit={handleSubmit} noValidate>
            {/* If Admin, allow selecting owner */}
            {isAdmin && (
              <div className="mb-3 p-3 bg-light rounded-3">
                <label className="form-label fw-bold">Select Pet Owner *</label>
                <select
                  name="owner"
                  className={`form-select ${errors.owner ? 'is-invalid' : ''}`}
                  value={formData.owner}
                  onChange={handleChange}
                >
                  <option value="">-- Choose registered owner --</option>
                  {ownersList.map((owner) => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name} ({owner.email}) - {owner.phone}
                    </option>
                  ))}
                </select>
                {errors.owner && <div className="invalid-feedback">{errors.owner}</div>}
              </div>
            )}

            <div className="row g-3">
              {/* Pet Name */}
              <div className="col-md-6">
                <label className="form-label fw-medium">Pet Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Bruno or Milo"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Species */}
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

              {/* Breed */}
              <div className="col-md-3">
                <label className="form-label fw-medium">Breed *</label>
                <input
                  type="text"
                  name="breed"
                  placeholder="e.g. Labrador or Persian"
                  className={`form-control ${errors.breed ? 'is-invalid' : ''}`}
                  value={formData.breed}
                  onChange={handleChange}
                />
                {errors.breed && <div className="invalid-feedback">{errors.breed}</div>}
              </div>

              {/* Gender */}
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

              {/* Age */}
              <div className="col-md-3">
                <label className="form-label fw-medium">Age (Years) *</label>
                <input
                  type="number"
                  name="age"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 2"
                  className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                  value={formData.age}
                  onChange={handleChange}
                />
                {errors.age && <div className="invalid-feedback">{errors.age}</div>}
              </div>

              {/* Date of Birth */}
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

              {/* Weight */}
              <div className="col-md-3">
                <label className="form-label fw-medium">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 15.5"
                  className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
                  value={formData.weight}
                  onChange={handleChange}
                />
                {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
              </div>

              {/* Color */}
              <div className="col-md-6">
                <label className="form-label fw-medium">Color / Coat Markings</label>
                <input
                  type="text"
                  name="color"
                  placeholder="e.g. Golden brown, White spotted"
                  className="form-control"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              {/* Vaccination Status */}
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

              {/* Medical Notes */}
              <div className="col-12">
                <label className="form-label fw-medium">Medical Notes & Allergies</label>
                <textarea
                  name="medicalNotes"
                  rows="3"
                  placeholder="Any allergies, previous medical conditions, dietary restrictions..."
                  className="form-control"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Link to={isAdmin ? '/admin/pets' : '/pets'} className="btn btn-outline-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? 'Saving...' : 'Save Pet Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPet;
