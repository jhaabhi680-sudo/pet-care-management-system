import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet, onDelete, showOwner = false, onOpenPassport }) => {
  const defaultPetImage = pet.species?.toLowerCase() === 'cat'
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card custom-card card-aesthetic h-100 overflow-hidden">
      {/* High-res Pet Photography */}
      <div className="pet-img-box position-relative" style={{ height: '190px' }}>
        <img
          src={pet.image || defaultPetImage}
          alt={pet.name}
          className="w-100 h-100 object-fit-cover"
        />
        <span
          className={`badge position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2 ${
            pet.vaccinationStatus === 'Up to date'
              ? 'bg-success'
              : pet.vaccinationStatus === 'Pending'
              ? 'bg-warning text-dark'
              : 'bg-secondary'
          }`}
        >
          <i className="bi bi-shield-check me-1"></i> {pet.vaccinationStatus || 'Not Recorded'}
        </span>
      </div>

      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div>
            <h5 className="card-title mb-0 fw-bold">{pet.name}</h5>
            <span className="text-muted small">{pet.breed} • {pet.species}</span>
          </div>
          <span className="badge bg-light text-dark border">
            {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
          </span>
        </div>

        <div className="bg-light p-2 rounded-3 small mb-3">
          <div className="d-flex justify-content-between">
            <span className="text-muted">Weight:</span>
            <strong>{pet.weight ? `${pet.weight} kg` : 'N/A'}</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Microchip ID:</span>
            <span className="text-muted font-monospace small">{pet.microchipId || '985141002348912'}</span>
          </div>
        </div>

        {showOwner && pet.owner && (
          <div className="p-2 mb-2 rounded bg-light small">
            <i className="bi bi-person me-1 text-primary"></i>
            <span className="text-muted">Owner:</span> <strong>{pet.owner.name}</strong>
          </div>
        )}

        {pet.medicalNotes && (
          <p className="card-text text-muted small fst-italic mb-3 flex-grow-1">
            "{pet.medicalNotes}"
          </p>
        )}

        <div className="mt-auto pt-2 border-top d-flex gap-2 justify-content-between">
          {onOpenPassport && (
            <button
              onClick={() => onOpenPassport(pet)}
              className="btn btn-sm btn-outline-teal"
              title="View Digital Vaccination Passport"
            >
              <i className="bi bi-qr-code me-1"></i> Passport
            </button>
          )}

          <div className="d-flex gap-1 ms-auto">
            <Link to={`/pets/edit/${pet._id}`} className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-pencil"></i>
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(pet._id, pet.name)}
                className="btn btn-sm btn-outline-danger"
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
