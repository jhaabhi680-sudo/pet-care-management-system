import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center my-auto">
      <div className="py-5">
        <span style={{ fontSize: '5rem' }}>🐾 404</span>
        <h2 className="fw-bold mt-3">Page Not Found</h2>
        <p className="text-muted">
          Oops! The page or pet record you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary px-4 mt-2">
          <i className="bi bi-house-door me-2"></i> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
