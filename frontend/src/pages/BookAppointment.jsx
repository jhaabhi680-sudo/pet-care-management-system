import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

const BookAppointment = () => {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    pet: '',
    veterinarian: '',
    service: '',
    appointmentDate: '',
    appointmentTime: '10:00 AM',
    reason: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ];

  useEffect(() => {
    fetchPrerequisites();
  }, []);

  const fetchPrerequisites = async () => {
    setLoading(true);
    try {
      const [petsRes, usersRes, servicesRes] = await Promise.all([
        API.get('/pets'),
        API.get('/users'),
        API.get('/services'),
      ]);

      const myPets = petsRes.data || [];
      const veterinarians = (usersRes.data || []).filter(
        (u) => u.role === 'veterinarian' || u.role === 'admin'
      );
      const clinicServices = servicesRes.data || [];

      setPets(myPets);
      setVets(veterinarians);
      setServices(clinicServices);

      // Pre-select defaults if available
      setFormData((prev) => ({
        ...prev,
        pet: myPets.length > 0 ? myPets[0]._id : '',
        veterinarian: veterinarians.length > 0 ? veterinarians[0]._id : '',
        service: clinicServices.length > 0 ? clinicServices[0].name : 'General Consultation',
      }));
    } catch (err) {
      setServerError('Could not load appointment options. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.pet) errs.pet = 'Please select a pet.';
    if (!formData.service) errs.service = 'Please select a service.';
    if (!formData.appointmentDate) {
      errs.appointmentDate = 'Appointment date is required.';
    } else {
      const selected = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.appointmentDate = 'Appointment date cannot be in the past.';
      }
    }
    if (!formData.appointmentTime) errs.appointmentTime = 'Please select a time slot.';
    if (!formData.reason.trim()) {
      errs.reason = 'Please state the reason or symptom for the visit.';
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

    setSubmitting(true);
    setServerError('');

    try {
      await API.post('/appointments', formData);
      navigate('/appointments');
    } catch (err) {
      setServerError(err.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to="/appointments" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <div>
            <h3 className="fw-bold mb-0">Book Veterinary Appointment 📅</h3>
            <p className="text-muted small mb-0">
              Schedule a visit with our veterinary doctors for your pet
            </p>
          </div>
        </div>

        {serverError && <div className="alert alert-danger py-2 small">{serverError}</div>}

        {loading ? (
          <Loading message="Loading booking options..." />
        ) : pets.length === 0 ? (
          <div className="card custom-card text-center p-5">
            <span style={{ fontSize: '3rem' }}>🐾</span>
            <h5 className="fw-bold mt-2">No Registered Pets Found</h5>
            <p className="text-muted small mb-3">
              You must register at least one pet before scheduling a veterinary visit.
            </p>
            <div>
              <Link to="/pets/add" className="btn btn-primary">
                <i className="bi bi-plus-circle me-1"></i> Register a Pet First
              </Link>
            </div>
          </div>
        ) : (
          <div className="card custom-card p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {/* Select Pet */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Select Pet *</label>
                  <select
                    name="pet"
                    className={`form-select ${errors.pet ? 'is-invalid' : ''}`}
                    value={formData.pet}
                    onChange={handleChange}
                  >
                    <option value="">-- Choose your pet --</option>
                    {pets.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.species} - {p.breed})
                      </option>
                    ))}
                  </select>
                  {errors.pet && <div className="invalid-feedback">{errors.pet}</div>}
                </div>

                {/* Service */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Select Service *</label>
                  <select
                    name="service"
                    className={`form-select ${errors.service ? 'is-invalid' : ''}`}
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">-- Choose clinic service --</option>
                    {services.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name} {s.price ? `(₹${s.price})` : ''}
                      </option>
                    ))}
                    {services.length === 0 && (
                      <>
                        <option value="General Checkup">General Checkup</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Grooming">Grooming</option>
                        <option value="Dental Checkup">Dental Checkup</option>
                        <option value="Emergency Consultation">Emergency Consultation</option>
                      </>
                    )}
                  </select>
                  {errors.service && <div className="invalid-feedback">{errors.service}</div>}
                </div>

                {/* Select Doctor / Veterinarian */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Preferred Veterinarian</label>
                  <select
                    name="veterinarian"
                    className="form-select"
                    value={formData.veterinarian}
                    onChange={handleChange}
                  >
                    <option value="">Any Available Specialist</option>
                    {vets.map((v) => (
                      <option key={v._id} value={v._id}>
                        Dr. {v.name} ({v.email})
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">You can request a specific doctor</small>
                </div>

                {/* Appointment Date */}
                <div className="col-md-3">
                  <label className="form-label fw-bold">Preferred Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    min={new Date().toISOString().split('T')[0]}
                    className={`form-control ${errors.appointmentDate ? 'is-invalid' : ''}`}
                    value={formData.appointmentDate}
                    onChange={handleChange}
                  />
                  {errors.appointmentDate && (
                    <div className="invalid-feedback">{errors.appointmentDate}</div>
                  )}
                </div>

                {/* Appointment Time Slot */}
                <div className="col-md-3">
                  <label className="form-label fw-bold">Time Slot *</label>
                  <select
                    name="appointmentTime"
                    className={`form-select ${errors.appointmentTime ? 'is-invalid' : ''}`}
                    value={formData.appointmentTime}
                    onChange={handleChange}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.appointmentTime && (
                    <div className="invalid-feedback">{errors.appointmentTime}</div>
                  )}
                </div>

                {/* Reason / Symptoms */}
                <div className="col-12">
                  <label className="form-label fw-bold">Reason for Visit / Symptoms *</label>
                  <input
                    type="text"
                    name="reason"
                    placeholder="e.g. Annual booster vaccine, loss of appetite, itching, or routine checkup"
                    className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                    value={formData.reason}
                    onChange={handleChange}
                  />
                  {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                </div>

                {/* Additional Notes */}
                <div className="col-12">
                  <label className="form-label fw-bold">Additional Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows="3"
                    placeholder="Any special behavioral notes, medication questions, or previous history to share with the vet..."
                    className="form-control"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <Link to="/appointments" className="btn btn-outline-secondary">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={submitting}
                >
                  {submitting ? 'Confirming Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
