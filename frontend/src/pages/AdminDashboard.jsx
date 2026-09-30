import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOwners: 0,
    totalPets: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, petsRes, apptsRes] = await Promise.all([
        API.get('/users'),
        API.get('/pets'),
        API.get('/appointments'),
      ]);

      const users = usersRes.data || [];
      const pets = petsRes.data || [];
      const appts = apptsRes.data || [];

      // Calculate statistics
      const owners = users.filter((u) => u.role === 'owner');
      const todayStr = new Date().toISOString().split('T')[0];

      const todayAppts = appts.filter((a) => {
        if (!a.appointmentDate) return false;
        const apptDateStr = new Date(a.appointmentDate).toISOString().split('T')[0];
        return apptDateStr === todayStr;
      });

      const pending = appts.filter((a) => a.status === 'Pending');
      const completed = appts.filter((a) => a.status === 'Completed');

      setStats({
        totalOwners: owners.length,
        totalPets: pets.length,
        todayAppointments: todayAppts.length,
        pendingAppointments: pending.length,
        completedAppointments: completed.length,
      });

      setAppointments(appts.slice(0, 6));
    } catch (err) {
      console.error(err);
      setError('Failed to load administration analytics.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/appointments/${id}`, { status: newStatus });
      fetchAdminStats();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Clinic Administration Overview 🩺</h3>
            <p className="text-muted small mb-0">
              Manage hospital appointments, veterinary patient records, and registered pet owners
            </p>
          </div>
          <button onClick={fetchAdminStats} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
          </button>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {loading ? (
          <Loading message="Loading clinic statistics..." />
        ) : (
          <>
            {/* 5 Stats Cards Required by Syllabus / Prompt */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6 col-lg-4 col-xl">
                <div className="card custom-card card-stat h-100 p-3">
                  <span className="text-muted small fw-medium">Total Pet Owners</span>
                  <h3 className="fw-bold my-1 text-teal" style={{ color: '#0d9488' }}>
                    {stats.totalOwners}
                  </h3>
                  <Link to="/admin/users" className="small text-decoration-none text-muted">
                    Manage owners &rarr;
                  </Link>
                </div>
              </div>

              <div className="col-sm-6 col-lg-4 col-xl">
                <div className="card custom-card card-stat info h-100 p-3">
                  <span className="text-muted small fw-medium">Total Pets</span>
                  <h3 className="fw-bold my-1 text-primary">{stats.totalPets}</h3>
                  <Link to="/admin/pets" className="small text-decoration-none text-muted">
                    View patients &rarr;
                  </Link>
                </div>
              </div>

              <div className="col-sm-6 col-lg-4 col-xl">
                <div className="card custom-card card-stat h-100 p-3" style={{ borderLeftColor: '#8b5cf6' }}>
                  <span className="text-muted small fw-medium">Today's Visits</span>
                  <h3 className="fw-bold my-1" style={{ color: '#8b5cf6' }}>
                    {stats.todayAppointments}
                  </h3>
                  <span className="small text-muted">Scheduled today</span>
                </div>
              </div>

              <div className="col-sm-6 col-lg-4 col-xl">
                <div className="card custom-card card-stat warning h-100 p-3">
                  <span className="text-muted small fw-medium">Pending Requests</span>
                  <h3 className="fw-bold my-1 text-warning">{stats.pendingAppointments}</h3>
                  <Link to="/admin/appointments" className="small text-decoration-none text-muted">
                    Requires action &rarr;
                  </Link>
                </div>
              </div>

              <div className="col-sm-6 col-lg-4 col-xl">
                <div className="card custom-card card-stat success h-100 p-3">
                  <span className="text-muted small fw-medium">Completed</span>
                  <h3 className="fw-bold my-1 text-success">{stats.completedAppointments}</h3>
                  <span className="small text-muted">Treated patients</span>
                </div>
              </div>
            </div>

            {/* Recent Appointments Action Center */}
            <div className="card custom-card p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Recent Appointment Schedule</h5>
                <Link to="/admin/appointments" className="btn btn-sm btn-primary">
                  View All Appointments
                </Link>
              </div>

              {appointments.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No appointments recorded in system.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date & Time</th>
                        <th>Pet & Owner</th>
                        <th>Service</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt._id}>
                          <td>
                            <div className="fw-semibold">
                              {new Date(appt.appointmentDate).toLocaleDateString()}
                            </div>
                            <small className="text-muted">{appt.appointmentTime}</small>
                          </td>
                          <td>
                            <div className="fw-bold">{appt.pet?.name || 'Unknown'}</div>
                            <small className="text-muted">
                              Owner: {appt.owner?.name || 'N/A'} ({appt.owner?.phone || 'No phone'})
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {appt.service?.name || appt.service}
                            </span>
                          </td>
                          <td className="small text-truncate" style={{ maxWidth: '180px' }}>
                            {appt.reason || 'Routine Checkup'}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                appt.status === 'Confirmed'
                                  ? 'bg-primary'
                                  : appt.status === 'Completed'
                                  ? 'bg-success'
                                  : appt.status === 'Cancelled'
                                  ? 'bg-danger'
                                  : 'bg-warning text-dark'
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              {appt.status === 'Pending' && (
                                <button
                                  onClick={() => handleStatusUpdate(appt._id, 'Confirmed')}
                                  className="btn btn-outline-primary"
                                  title="Confirm Appointment"
                                >
                                  <i className="bi bi-check-lg"></i> Confirm
                                </button>
                              )}
                              {appt.status !== 'Completed' && (
                                <button
                                  onClick={() => handleStatusUpdate(appt._id, 'Completed')}
                                  className="btn btn-outline-success"
                                  title="Mark as Completed"
                                >
                                  <i className="bi bi-check2-all"></i> Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
