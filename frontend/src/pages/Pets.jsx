import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import PetCard from '../components/PetCard';
import Loading from '../components/Loading';

const Pets = () => {
  const { user, isAdmin } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/pets');
      setPets(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId, petName) => {
    if (window.confirm(`Are you sure you want to remove ${petName} from the system?`)) {
      try {
        await API.delete(`/pets/${petId}`);
        setSuccessMsg(`Pet "${petName}" successfully removed.`);
        setPets(pets.filter((p) => p._id !== petId));
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        alert(err.message || 'Failed to delete pet');
      }
    }
  };

  // Search and filter logic using React state (Syllabus items 7 & 17)
  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecies =
      speciesFilter === 'All' || pet.species?.toLowerCase() === speciesFilter.toLowerCase();

    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">{isAdmin ? 'All Registered Clinic Pets 🐕' : 'My Beloved Pets 🐾'}</h3>
            <p className="text-muted small mb-0">
              {isAdmin
                ? 'Overview of all patients and animals registered in the clinic'
                : 'Manage your pets, update biological stats, and track health history'}
            </p>
          </div>
          <Link to="/pets/add" className="btn btn-primary mt-2 mt-sm-0">
            <i className="bi bi-plus-circle me-1"></i> Register New Pet
          </Link>
        </div>

        {successMsg && <div className="alert alert-success py-2 small">{successMsg}</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {/* Search and Filters Bar */}
        <div className="card custom-card p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by pet name, breed, or species..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
              >
                <option value="All">All Species</option>
                <option value="Dog">Dogs 🐕</option>
                <option value="Cat">Cats 🐈</option>
                <option value="Bird">Birds 🦜</option>
                <option value="Rabbit">Rabbits 🐇</option>
                <option value="Other">Other Species</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading pet profiles..." />
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <span style={{ fontSize: '3rem' }}>🐾</span>
            <h5 className="fw-bold mt-2">No pets found</h5>
            <p className="text-muted small mb-3">
              {searchQuery ? 'Try changing your search terms.' : 'No pets registered yet.'}
            </p>
            <Link to="/pets/add" className="btn btn-primary btn-sm">
              <i className="bi bi-plus-circle me-1"></i> Add a Pet
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {filteredPets.map((pet) => (
              <div className="col-md-6 col-lg-4" key={pet._id}>
                <PetCard
                  pet={pet}
                  onDelete={handleDeletePet}
                  showOwner={isAdmin}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;
