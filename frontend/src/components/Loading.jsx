import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-teal" style={{ color: '#0d9488' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

export default Loading;
