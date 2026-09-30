import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

const Appointments = () => {
  const { user, isAdmin } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/appointments');
      setAppointments(data || []);
    } catch (err) {
      setFeedbackMsg({ text: err.message || 'Failed to fetch appointments', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/appointments/${id}`, { status: newStatus });
      setFeedbackMsg({ text: `Appointment updated to "${newStatus}"`, type: 'success' });
      fetchAppointments();
      setTimeout(() => setFeedbackMsg({ text: '', type: '' }), 4000);
    } catch (err) {
      setFeedbackMsg({ text: err.message || 'Failed to update status', type: 'danger' });
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment booking?')) {
      handleStatusUpdate(id, 'Cancelled');
    }
  };

  // Filter & Search using React state (Web Lab Syllabus Experiment 4 & 7)
  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
    const petName = appt.pet?.name || '';
    const ownerName = appt.owner?.name || '';
    const serviceName = appt.service?.name || appt.service || '';

    const matchesSearch =
      petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-primary';
      case 'Completed':
        return 'bg-success';
      case 'Cancelled':
        return 'bg-danger';
      case 'Pending':
      default:
        return 'bg-warning text-dark';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              {isAdmin ? 'All Clinic Appointments 📅' : 'My Pet Appointments 📅'}
            </h3>
            <p className="text-muted small mb-0">
              {isAdmin
                ? 'Review, approve, and track veterinary appointments across all clients'
                : 'Keep track of scheduled clinic visits, checkups, and vaccinations'}
            </p>
          </div>
          {!isAdmin && (
            <Link to="/appointments/book" className="btn btn-primary mt-2 mt-sm-0">
              <i className="bi bi-calendar-plus me-1"></i> Book New Appointment
            </Link>
          )}
        </div>

        {feedbackMsg.text && (
          <div className={`alert alert-${feedbackMsg.type} py-2 small`} role="alert">
            {feedbackMsg.text}
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="card custom-card p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by pet name, service, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading appointments..." />
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <span style={{ fontSize: '3rem' }}>📅</span>
            <h5 className="fw-bold mt-2">No appointments found</h5>
            <p className="text-muted small mb-3">
              {searchQuery || statusFilter !== 'All'
                ? 'Try resetting your filter parameters.'
                : "You don't have any appointments scheduled."}
            </p>
            {!isAdmin && (
              <Link to="/appointments/book" className="btn btn-primary btn-sm">
                <i className="bi bi-calendar-plus me-1"></i> Book Now
              </Link>
            )}
          </div>
        ) : (
          <div className="card custom-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date & Slot</th>
                    <th>Pet Name</th>
                    {isAdmin && <th>Owner</th>}
                    <th>Doctor & Service</th>
                    <th>Reason / Problem</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt) => (
                    <tr key={appt._id}>
                      <td>
                        <div className="fw-bold text-nowrap">
                          {new Date(appt.appointmentDate).toLocaleDateString()}
                        </div>
                        <small className="badge bg-light text-dark border">
                          <i className="bi bi-clock me-1"></i>
                          {appt.appointmentTime}
                        </small>
                      </td>
                      <td>
                        <div className="fw-bold">{appt.pet?.name || 'Pet'}</div>
                        <small className="text-muted">
                          {appt.pet?.species} • {appt.pet?.breed}
                        </small>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="fw-semibold">{appt.owner?.name || 'Unknown'}</div>
                          <small className="text-muted">{appt.owner?.phone || appt.owner?.email}</small>
                        </td>
                      )}
                      <td>
                        <div className="fw-semibold text-teal" style={{ color: '#0d9488' }}>
                          {appt.service?.name || appt.service}
                        </div>
                        <small className="text-muted">
                          Dr. {appt.veterinarian?.name || 'Assigned Vet'}
                        </small>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div className="small text-truncate">{appt.reason || 'Checkup'}</div>
                        {appt.notes && (
                          <div className="small text-muted fst-italic text-truncate">
                            {appt.notes}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(appt.status)}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="text-end">
                        {/* Owner action: cancel pending */}
                        {!isAdmin && appt.status === 'Pending' && (
                          <button
                            onClick={() => handleCancelBooking(appt._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel
                          </button>
                        )}

                        {/* Admin actions: confirm, complete, cancel */}
                        {isAdmin && (
                          <div className="btn-group btn-group-sm">
                            {appt.status !== 'Confirmed' && appt.status !== 'Completed' && (
                              <button
                                onClick={() => handleStatusUpdate(appt._id, 'Confirmed')}
                                className="btn btn-outline-primary"
                                title="Confirm Appointment"
                              >
                                Confirm
                              </button>
                            )}
                            {appt.status !== 'Completed' && (
                              <button
                                onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                                className="btn btn-outline-success"
                                title="Complete Appointment"
                              >
                                Complete
                              </button>
                            )}
                            {appt.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleStatusUpdate(appt._id, 'Cancelled')}
                                className="btn btn-outline-danger"
                                title="Cancel Appointment"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
