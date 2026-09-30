import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/users');
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users by name/email and role (Experiment 17)
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery);

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Registered Users & Pet Owners 👥</h3>
            <p className="text-muted small mb-0">
              Directory of registered client accounts, veterinarians, and clinic administrators
            </p>
          </div>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        {/* Search & Filter Bar */}
        <div className="card custom-card p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by owner name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="owner">Pet Owners</option>
                <option value="veterinarian">Veterinarians</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading message="Loading registered users..." />
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-3 shadow-sm">
            <span style={{ fontSize: '3rem' }}>👥</span>
            <h5 className="fw-bold mt-2">No users found</h5>
            <p className="text-muted small">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="card custom-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User Details</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Member Since</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-teal-subtle text-teal d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: '38px',
                              height: '38px',
                              backgroundColor: '#ccfbf1',
                              color: '#0f766e',
                            }}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold">{u.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="small">{u.email}</td>
                      <td className="small">{u.phone || 'N/A'}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin'
                              ? 'bg-danger'
                              : u.role === 'veterinarian'
                              ? 'bg-primary'
                              : 'bg-secondary'
                          } text-uppercase`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
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

export default Users;
