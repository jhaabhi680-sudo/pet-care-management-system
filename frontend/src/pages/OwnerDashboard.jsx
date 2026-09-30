import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPets: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalRecords: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch pets and appointments in parallel
      const [petsRes, apptsRes, recordsRes] = await Promise.all([
        API.get('/pets'),
        API.get('/appointments'),
        API.get('/medical-records'),
      ]);

      const pets = petsRes.data || [];
      const appointments = apptsRes.data || [];
      const records = recordsRes.data || [];

      const upcoming = appointments.filter(
        (a) => a.status === 'Pending' || a.status === 'Confirmed'
      );
      const completed = appointments.filter((a) => a.status === 'Completed');

      setStats({
        totalPets: pets.length,
        upcomingAppointments: upcoming.length,
        completedAppointments: completed.length,
        totalRecords: records.length,
      });

      setMyPets(pets.slice(0, 4));
      setRecentAppointments(appointments.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Hello, {user?.name}! 👋</h3>
            <p className="text-muted small mb-0">
              Welcome back to your Pet Care Management Dashboard
            </p>
          </div>
          <div className="d-flex gap-2 mt-2 mt-sm-0">
            <Link to="/pets/add" className="btn btn-outline-primary">
              <i className="bi bi-plus-circle me-1"></i> Add Pet
            </Link>
            <Link to="/appointments/book" className="btn btn-primary">
              <i className="bi bi-calendar-plus me-1"></i> Book Appointment
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {loading ? (
          <Loading message="Loading your pet statistics..." />
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card custom-card card-stat h-100 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-muted small fw-medium">Total Pets</span>
                      <h3 className="fw-bold my-1">{stats.totalPets}</h3>
                      <Link to="/pets" className="small text-decoration-none text-teal">
                        View registered pets <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <div className="bg-light p-3 rounded-circle text-teal fs-3" style={{ color: '#0d9488' }}>
                      🐾
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="card custom-card card-stat warning h-100 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-muted small fw-medium">Upcoming Visits</span>
                      <h3 className="fw-bold my-1">{stats.upcomingAppointments}</h3>
                      <Link to="/appointments" className="small text-decoration-none text-warning">
                        View schedule <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <div className="bg-light p-3 rounded-circle text-warning fs-3">
                      <i className="bi bi-clock-history"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="card custom-card card-stat success h-100 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-muted small fw-medium">Completed Visits</span>
                      <h3 className="fw-bold my-1">{stats.completedAppointments}</h3>
                      <span className="small text-muted">Past checkups</span>
                    </div>
                    <div className="bg-light p-3 rounded-circle text-success fs-3">
                      <i className="bi bi-check-circle"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="card custom-card card-stat info h-100 p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-muted small fw-medium">Medical Records</span>
                      <h3 className="fw-bold my-1">{stats.totalRecords}</h3>
                      <Link to="/medical-records" className="small text-decoration-none text-primary">
                        View diagnoses <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <div className="bg-light p-3 rounded-circle text-primary fs-3">
                      <i className="bi bi-file-earmark-medical"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Pets Row */}
            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div className="card custom-card h-100 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">My Pets</h5>
                    <Link to="/pets" className="small text-teal text-decoration-none fw-semibold">
                      See All
                    </Link>
                  </div>
                  {myPets.length === 0 ? (
                    <div className="text-center py-4 bg-light rounded-3">
                      <p className="text-muted mb-2">You haven't added any pets yet.</p>
                      <Link to="/pets/add" className="btn btn-sm btn-primary">
                        <i className="bi bi-plus-lg me-1"></i> Add Your First Pet
                      </Link>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {myPets.map((pet) => (
                        <div
                          key={pet._id}
                          className="list-group-item d-flex align-items-center justify-content-between px-0 py-2"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <span style={{ fontSize: '1.8rem' }}>
                              {pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐈' : '🐾'}
                            </span>
                            <div>
                              <h6 className="mb-0 fw-bold">{pet.name}</h6>
                              <small className="text-muted">
                                {pet.breed} • {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
                              </small>
                            </div>
                          </div>
                          <span
                            className={`badge ${
                              pet.vaccinationStatus === 'Up to date'
                                ? 'bg-success'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {pet.vaccinationStatus || 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="col-lg-6">
                <div className="card custom-card h-100 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Recent Appointments</h5>
                    <Link to="/appointments" className="small text-teal text-decoration-none fw-semibold">
                      View All
                    </Link>
                  </div>
                  {recentAppointments.length === 0 ? (
                    <div className="text-center py-4 bg-light rounded-3">
                      <p className="text-muted mb-2">No appointments scheduled.</p>
                      <Link to="/appointments/book" className="btn btn-sm btn-primary">
                        <i className="bi bi-calendar-plus me-1"></i> Book Now
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle table-sm mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Pet</th>
                            <th>Date</th>
                            <th>Service</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentAppointments.map((appt) => (
                            <tr key={appt._id}>
                              <td className="fw-semibold">{appt.pet?.name || 'Pet'}</td>
                              <td className="small">
                                {new Date(appt.appointmentDate).toLocaleDateString()}
                              </td>
                              <td className="small text-muted">{appt.service?.name || appt.service}</td>
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
