import React from 'react';

const AppointmentCard = ({ appointment, onStatusChange, onCancel, isAdmin = false }) => {
  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Status badge styling
  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      case 'pending':
      default:
        return 'bg-warning text-dark';
    }
  };

  return (
    <div className="card custom-card mb-3">
      <div className="card-body">
        <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-2 mb-3">
          <div>
            <span className="badge bg-light text-dark border me-2">
              <i className="bi bi-calendar-event me-1 text-primary"></i>
              {formatDate(appointment.appointmentDate)}
            </span>
            <span className="badge bg-light text-dark border">
              <i className="bi bi-clock me-1 text-primary"></i>
              {appointment.appointmentTime}
            </span>
          </div>
          <span className={`badge ${getBadgeClass(appointment.status)} px-3 py-2 text-uppercase`}>
            {appointment.status}
          </span>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <h6 className="text-muted small mb-1">Pet Information</h6>
            <div className="fw-bold">{appointment.pet?.name || 'Unnamed Pet'}</div>
            <div className="small text-muted">{appointment.pet?.species} ({appointment.pet?.breed})</div>
          </div>

          <div className="col-md-4">
            <h6 className="text-muted small mb-1">Service & Doctor</h6>
            <div className="fw-semibold text-teal" style={{ color: '#0d9488' }}>
              {appointment.service?.name || appointment.service || 'General Consultation'}
            </div>
            <div className="small text-muted">
              Dr. {appointment.veterinarian?.name || 'Available Vet'}
            </div>
          </div>

          <div className="col-md-4">
            <h6 className="text-muted small mb-1">Reason / Notes</h6>
            <div className="small text-dark text-truncate">{appointment.reason || 'Routine Checkup'}</div>
            {appointment.notes && (
              <div className="small text-muted fst-italic text-truncate">
                Notes: {appointment.notes}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
          {/* Owner can cancel pending appointments */}
          {!isAdmin && appointment.status === 'Pending' && onCancel && (
            <button
              onClick={() => onCancel(appointment._id)}
              className="btn btn-sm btn-outline-danger"
            >
              <i className="bi bi-x-circle me-1"></i> Cancel Booking
            </button>
          )}

          {/* Admin status change actions */}
          {isAdmin && onStatusChange && (
            <div className="btn-group btn-group-sm">
              {appointment.status !== 'Confirmed' && appointment.status !== 'Completed' && (
                <button
                  onClick={() => onStatusChange(appointment._id, 'Confirmed')}
                  className="btn btn-outline-primary"
                >
                  <i className="bi bi-check-circle me-1"></i> Confirm
                </button>
              )}
              {appointment.status !== 'Completed' && (
                <button
                  onClick={() => onStatusChange(appointment._id, 'Completed')}
                  className="btn btn-outline-success"
                >
                  <i className="bi bi-check-all me-1"></i> Complete
                </button>
              )}
              {appointment.status !== 'Cancelled' && (
                <button
                  onClick={() => onStatusChange(appointment._id, 'Cancelled')}
                  className="btn btn-outline-danger"
                >
                  <i className="bi bi-slash-circle me-1"></i> Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
