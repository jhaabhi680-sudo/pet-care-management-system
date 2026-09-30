import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

const MedicalRecords = () => {
  const { user, isAdmin } = useAuth();
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Medical record form state (Admin / Vet only)
  const [formData, setFormData] = useState({
    pet: '',
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    symptoms: '',
    treatment: '',
    prescription: '',
    vaccination: '',
    notes: '',
  });

  useEffect(() => {
    fetchRecords();
    if (isAdmin) {
      fetchPets();
    }
  }, [isAdmin]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/medical-records');
      setRecords(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch medical records');
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const { data } = await API.get('/pets');
      setPets(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, pet: data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching pets for record modal:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!formData.pet || !formData.diagnosis || !formData.treatment) {
      alert('Please fill in Pet, Diagnosis, and Treatment.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await API.post('/medical-records', formData);
      setSuccess('Medical record recorded successfully!');
      setShowAddModal(false);
      setFormData({
        pet: pets.length > 0 ? pets[0]._id : '',
        visitDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        symptoms: '',
        treatment: '',
        prescription: '',
        vaccination: '',
        notes: '',
      });
      fetchRecords();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to create medical record.');
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
            <h3 className="fw-bold mb-1">Veterinary Medical Records 📋</h3>
            <p className="text-muted small mb-0">
              {isAdmin
                ? 'Clinical diagnosis, treatment histories, prescriptions, and vaccination notes'
                : "Official medical checkup reports and prescriptions for your pet's health"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary mt-2 mt-sm-0"
            >
              <i className="bi bi-file-earmark-plus me-1"></i> Add Medical Record
            </button>
          )}
        </div>

        {success && <div className="alert alert-success py-2 small">{success}</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {loading ? (
          <Loading message="Loading medical records..." />
        ) : records.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <span style={{ fontSize: '3rem' }}>📋</span>
            <h5 className="fw-bold mt-2">No Medical Records Found</h5>
            <p className="text-muted small">
              {isAdmin
                ? 'Click "Add Medical Record" above to record a clinical diagnosis for a patient.'
                : 'Your pets do not have any diagnostic records from the veterinary clinic yet.'}
            </p>
          </div>
        ) : (
          <div className="card custom-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Visit Date</th>
                    <th>Pet Name</th>
                    <th>Diagnosis</th>
                    <th>Doctor</th>
                    <th>Prescription / Rx</th>
                    <th className="text-end">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec._id}>
                      <td className="fw-semibold">
                        {new Date(rec.visitDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="fw-bold">{rec.pet?.name || 'Pet'}</span>
                        <div className="small text-muted">{rec.pet?.species} ({rec.pet?.breed})</div>
                      </td>
                      <td>
                        <span className="badge bg-teal-subtle text-teal border" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                          {rec.diagnosis}
                        </span>
                      </td>
                      <td className="small text-muted">
                        Dr. {rec.veterinarian?.name || 'Veterinarian'}
                      </td>
                      <td className="small text-truncate" style={{ maxWidth: '200px' }}>
                        {rec.prescription || 'No medications prescribed'}
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-eye me-1"></i> View Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Medical Record Modal */}
        {selectedRecord && (
          <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    Medical Record & Prescription 🩺
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedRecord(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="p-3 bg-light rounded-3 mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold mb-0">{selectedRecord.pet?.name}</h5>
                      <span className="text-muted small">
                        {selectedRecord.pet?.species} • {selectedRecord.pet?.breed}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="small text-muted d-block">Visit Date</span>
                      <strong>{new Date(selectedRecord.visitDate).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-muted small fw-bold text-uppercase">Doctor In-Charge</label>
                      <p className="fw-semibold">Dr. {selectedRecord.veterinarian?.name || 'Veterinary Specialist'}</p>
                    </div>

                    <div className="col-md-6">
                      <label className="text-muted small fw-bold text-uppercase">Diagnosis</label>
                      <p className="text-primary fw-semibold">{selectedRecord.diagnosis}</p>
                    </div>

                    <div className="col-12">
                      <label className="text-muted small fw-bold text-uppercase">Symptoms Reported</label>
                      <p className="bg-light p-2 rounded small">{selectedRecord.symptoms || 'None recorded'}</p>
                    </div>

                    <div className="col-12">
                      <label className="text-muted small fw-bold text-uppercase">Treatment Administered</label>
                      <p className="bg-light p-2 rounded small">{selectedRecord.treatment || 'Routine exam'}</p>
                    </div>

                    <div className="col-12">
                      <label className="text-muted small fw-bold text-uppercase text-success">
                        Prescription (Rx) & Medications
                      </label>
                      <div className="border border-success-subtle bg-success-subtle p-3 rounded small">
                        {selectedRecord.prescription || 'No medications required at this time.'}
                      </div>
                    </div>

                    {selectedRecord.vaccination && (
                      <div className="col-md-6">
                        <label className="text-muted small fw-bold text-uppercase">Vaccine Given</label>
                        <p className="fw-semibold">{selectedRecord.vaccination}</p>
                      </div>
                    )}

                    {selectedRecord.notes && (
                      <div className="col-12">
                        <label className="text-muted small fw-bold text-uppercase">Doctor's Follow-up Notes</label>
                        <p className="text-muted small fst-italic">{selectedRecord.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedRecord(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Medical Record Modal (Admin/Vet Only) */}
        {showAddModal && isAdmin && (
          <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <form onSubmit={handleCreateRecord}>
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      Add Medical Diagnosis / Treatment Record 🩺
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowAddModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Select Pet Patient *</label>
                        <select
                          name="pet"
                          className="form-select"
                          required
                          value={formData.pet}
                          onChange={handleFormChange}
                        >
                          <option value="">-- Choose Pet --</option>
                          {pets.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} ({p.species} - {p.breed})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Visit Date *</label>
                        <input
                          type="date"
                          name="visitDate"
                          className="form-control"
                          required
                          value={formData.visitDate}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold">Diagnosis *</label>
                        <input
                          type="text"
                          name="diagnosis"
                          placeholder="e.g. Canine Parvovirus, Flea Allergy Dermatitis, Ear Infection"
                          className="form-control"
                          required
                          value={formData.diagnosis}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold">Symptoms Observed</label>
                        <input
                          type="text"
                          name="symptoms"
                          placeholder="e.g. Mild fever, scratching ears, low energy"
                          className="form-control"
                          value={formData.symptoms}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold">Treatment Given *</label>
                        <textarea
                          name="treatment"
                          rows="2"
                          placeholder="e.g. Cleaned ear canal, administered subcutaneous fluid"
                          className="form-control"
                          required
                          value={formData.treatment}
                          onChange={handleFormChange}
                        ></textarea>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold text-success">
                          Prescription (Dosage & Instructions)
                        </label>
                        <textarea
                          name="prescription"
                          rows="2"
                          placeholder="e.g. Amoxicillin 250mg twice daily for 5 days with food"
                          className="form-control"
                          value={formData.prescription}
                          onChange={handleFormChange}
                        ></textarea>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Vaccine Administered (if any)</label>
                        <input
                          type="text"
                          name="vaccination"
                          placeholder="e.g. Rabies Booster (Rabisin)"
                          className="form-control"
                          value={formData.vaccination}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Doctor Notes</label>
                        <input
                          type="text"
                          name="notes"
                          placeholder="e.g. Follow-up after 7 days if condition persists"
                          className="form-control"
                          value={formData.notes}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Save Medical Record'}
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

export default MedicalRecords;
