import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState('All');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState(null); // for clinical record modal
  const [showRxModal, setShowRxModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Rx form state
  const [rxForm, setRxForm] = useState({
    diagnosis: '',
    symptoms: '',
    treatment: '',
    prescription: '',
    vaccination: '',
    notes: '',
  });

  const [feedback, setFeedback] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [petsRes, usersRes] = await Promise.all([
        API.get('/pets'),
        API.get('/users'),
      ]);
      setPets(petsRes.data || []);
      const ownerUsers = (usersRes.data || []).filter((u) => u.role === 'owner');
      setOwners(ownerUsers);
    } catch (err) {
      setFeedback({ text: err.message || 'Failed to load hospital data', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRx = (pet) => {
    setSelectedPet(pet);
    setRxForm({
      diagnosis: '',
      symptoms: '',
      treatment: '',
      prescription: '',
      vaccination: '',
      notes: '',
    });
    setShowRxModal(true);
  };

  const handleSaveRx = async (e) => {
    e.preventDefault();
    if (!selectedPet) return;

    try {
      await API.post('/medical-records', {
        ...rxForm,
        pet: selectedPet._id,
      });
      setFeedback({
        text: `Clinical record & prescription issued for ${selectedPet.name}!`,
        type: 'success',
      });
      setShowRxModal(false);
      setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save clinical record.');
    }
  };

  const handleDeletePet = async (petId, petName) => {
    if (window.confirm(`Discharge & remove patient "${petName}" from hospital registry?`)) {
      try {
        await API.delete(`/pets/${petId}`);
        setPets(pets.filter((p) => p._id !== petId));
        setFeedback({ text: `Patient "${petName}" removed from records.`, type: 'success' });
        setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
      } catch (err) {
        alert(err.message || 'Failed to remove pet.');
      }
    }
  };

  // Advanced Filtering for Admin
  const filteredPets = pets.filter((pet) => {
    const matchesOwner =
      selectedOwner === 'All' ||
      (pet.owner && (pet.owner._id === selectedOwner || pet.owner === selectedOwner));

    const matchesSpecies =
      speciesFilter === 'All' || pet.species?.toLowerCase() === speciesFilter.toLowerCase();

    const matchesSearch =
      pet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.microchipId?.includes(searchQuery);

    return matchesOwner && matchesSpecies && matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-teal-subtle text-teal px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>
                🩺 Veterinary Medical Command
              </span>
            </div>
            <h3 className="fw-bold mt-1 mb-0">Hospital Patients & Clinical Registry</h3>
            <p className="text-muted small mb-0">
              Manage admitted animals, monitor vaccination compliance, and issue instant prescriptions
            </p>
          </div>

          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <div className="btn-group btn-group-sm">
              <button
                className={`btn ${viewMode === 'table' ? 'btn-teal text-white' : 'btn-outline-secondary'}`}
                style={viewMode === 'table' ? { backgroundColor: '#0d9488' } : {}}
                onClick={() => setViewMode('table')}
              >
                <i className="bi bi-table me-1"></i> Table View
              </button>
              <button
                className={`btn ${viewMode === 'grid' ? 'btn-teal text-white' : 'btn-outline-secondary'}`}
                style={viewMode === 'grid' ? { backgroundColor: '#0d9488' } : {}}
                onClick={() => setViewMode('grid')}
              >
                <i className="bi bi-grid me-1"></i> Grid View
              </button>
            </div>
            <Link to="/pets/add" className="btn btn-teal btn-sm">
              <i className="bi bi-plus-circle me-1"></i> Register New Patient
            </Link>
          </div>
        </div>

        {feedback.text && (
          <div className={`alert alert-${feedback.type} py-2 small`} role="alert">
            {feedback.text}
          </div>
        )}

        {/* Filter Bar */}
        <div className="card custom-card p-3 mb-4">
          <div className="row g-3 align-items-center">
            {/* Search */}
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by pet name, breed, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Owner Filter */}
            <div className="col-md-4">
              <select
                className="form-select"
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
              >
                <option value="All">All Registered Pet Owners ({owners.length})</option>
                {owners.map((ow) => (
                  <option key={ow._id} value={ow._id}>
                    👤 {ow.name} ({ow.phone || ow.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Species Filter */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
              >
                <option value="All">All Animal Species</option>
                <option value="Dog">Dogs 🐕</option>
                <option value="Cat">Cats 🐈</option>
                <option value="Bird">Birds 🦜</option>
                <option value="Rabbit">Rabbits 🐇</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading hospital patient registry..." />
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <span style={{ fontSize: '3rem' }}>🐾</span>
            <h5 className="fw-bold mt-2">No patients match your search criteria</h5>
            <p className="text-muted small">Try selecting "All Owners" or clearing the search query.</p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View for Administrator / Doctor */
          <div className="card custom-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Patient Details</th>
                    <th>Owner Contact</th>
                    <th>Biological Specs</th>
                    <th>Microchip ID</th>
                    <th>Vaccine Status</th>
                    <th className="text-end">Clinical Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={
                              p.image ||
                              (p.species === 'Cat'
                                ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
                                : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80')
                            }
                            alt={p.name}
                            className="rounded-3 shadow-sm"
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold fs-6">{p.name}</div>
                            <small className="text-muted">{p.breed} • {p.species}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{p.owner?.name || 'Walk-in Client'}</div>
                        <small className="text-muted">
                          <i className="bi bi-telephone me-1"></i> {p.owner?.phone || 'No phone'}
                        </small>
                      </td>
                      <td>
                        <div className="small"><strong>Age:</strong> {p.age} yrs | <strong>Weight:</strong> {p.weight ? `${p.weight} kg` : 'N/A'}</div>
                        <small className="text-muted">{p.gender} • {p.color || 'Standard'}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border font-monospace">
                          {p.microchipId || '985141002348912'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            p.vaccinationStatus === 'Up to date'
                              ? 'bg-success'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          <i className="bi bi-shield-check me-1"></i>
                          {p.vaccinationStatus}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleOpenRx(p)}
                            title="Issue Clinical Rx & Diagnosis"
                          >
                            <i className="bi bi-prescription2 me-1"></i> Issue Rx
                          </button>
                          <Link
                            to={`/pets/edit/${p._id}`}
                            className="btn btn-outline-secondary"
                            title="Edit Patient Profile"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeletePet(p._id, p.name)}
                            title="Discharge Patient"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="row g-4">
            {filteredPets.map((p) => (
              <div className="col-md-6 col-lg-4" key={p._id}>
                <div className="card custom-card card-aesthetic h-100">
                  <div className="pet-img-box position-relative" style={{ height: '180px' }}>
                    <img
                      src={
                        p.image ||
                        (p.species === 'Cat'
                          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
                          : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80')
                      }
                      alt={p.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <span
                      className={`badge position-absolute top-0 end-0 m-3 ${
                        p.vaccinationStatus === 'Up to date' ? 'bg-success' : 'bg-warning text-dark'
                      }`}
                    >
                      {p.vaccinationStatus}
                    </span>
                  </div>

                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h5 className="fw-bold mb-0">{p.name}</h5>
                      <span className="badge bg-light text-dark border">{p.age} yrs</span>
                    </div>
                    <span className="text-muted small mb-2">{p.breed} • {p.species}</span>

                    <div className="bg-light p-2 rounded-3 small mb-3">
                      <div><strong>Owner:</strong> {p.owner?.name} ({p.owner?.phone})</div>
                      <div><strong>Weight:</strong> {p.weight} kg | <strong>Color:</strong> {p.color}</div>
                      <div><strong>Microchip:</strong> <span className="font-monospace text-muted">{p.microchipId || '985141002348912'}</span></div>
                    </div>

                    <div className="mt-auto pt-2 border-top d-flex gap-2">
                      <button
                        className="btn btn-sm btn-teal flex-grow-1"
                        style={{ backgroundColor: '#0d9488', color: 'white' }}
                        onClick={() => handleOpenRx(p)}
                      >
                        <i className="bi bi-prescription2 me-1"></i> Issue Clinical Rx
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletePet(p._id, p.name)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Issue Rx Prescription Modal */}
        {showRxModal && selectedPet && (
          <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 rounded-4">
                <form onSubmit={handleSaveRx}>
                  <div className="modal-header border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-4">🩺</span>
                      <div>
                        <h5 className="modal-title fw-bold mb-0">Issue Clinical Diagnosis & Prescription</h5>
                        <small className="text-muted">
                          Patient: <strong>{selectedPet.name}</strong> ({selectedPet.species} • {selectedPet.breed})
                        </small>
                      </div>
                    </div>
                    <button type="button" className="btn-close" onClick={() => setShowRxModal(false)}></button>
                  </div>

                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Primary Diagnosis *</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="e.g. Canine Gastroenteritis, Otitis Externa, Flea Dermatitis"
                          value={rxForm.diagnosis}
                          onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Vaccine Administered (if any)</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Nobivac Rabies Booster"
                          value={rxForm.vaccination}
                          onChange={(e) => setRxForm({ ...rxForm, vaccination: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Symptoms / Clinical Observations</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Mild dehydration, head shaking, skin erythema"
                          value={rxForm.symptoms}
                          onChange={(e) => setRxForm({ ...rxForm, symptoms: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Clinical Treatment Performed *</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="e.g. Flushed auditory canal, administered subcutaneous antiemetic injection"
                          value={rxForm.treatment}
                          onChange={(e) => setRxForm({ ...rxForm, treatment: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold text-success">
                          Prescribed Medication Schedule (Rx) *
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          required
                          placeholder="e.g. Amoxicillin 250mg: 1 tablet twice daily for 5 days with food."
                          value={rxForm.prescription}
                          onChange={(e) => setRxForm({ ...rxForm, prescription: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Doctor's Care & Dietary Advice</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Bland diet for 3 days; schedule follow-up if vomiting recurs"
                          value={rxForm.notes}
                          onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top bg-light">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowRxModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-teal btn-sm" style={{ backgroundColor: '#0d9488', color: 'white' }}>
                      <i className="bi bi-check2-circle me-1"></i> Save & Issue Prescription
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

export default AdminPets;
