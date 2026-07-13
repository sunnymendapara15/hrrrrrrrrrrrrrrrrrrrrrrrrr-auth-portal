import React, { useCallback, useEffect, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser } from '../api';

const createFormDefaults = { name: '', email: '', password: '', role: 'hr' };
const editFormDefaults = { name: '', email: '', role: 'hr' };

function UserManagement({ token, onLogout, onNotify }) {
  const [users, setUsers] = useState([]);
  const [createForm, setCreateForm] = useState(createFormDefaults);
  const [editForm, setEditForm] = useState(editFormDefaults);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetchUsers(token);
      setUsers(payload.users);
    } catch (err) {
      if (err.code === 'UNAUTHORIZED') {
        onNotify?.('Session expired. Please log in again.');
        onLogout();
      } else {
        setStatus((err && err.message) || 'Unable to load users');
      }
    } finally {
      setLoading(false);
    }
  }, [token, onLogout, onNotify]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setStatus('');
    try {
      const payload = await createUser(token, createForm);
      setUsers((prev) => [payload.user, ...prev]);
      setCreateForm(createFormDefaults);
      onNotify?.('HR user created');
    } catch (err) {
      if (err.code === 'UNAUTHORIZED') {
        onNotify?.('Session expired. Please log in again.');
        onLogout();
      } else {
        setStatus((err && err.message) || 'Unable to create user');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleEditStart = (user) => {
    setEditId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setStatus('');
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm(editFormDefaults);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editId) {
      return;
    }
    setProcessing(true);
    setStatus('');
    try {
      const payload = await updateUser(token, editId, editForm);
      setUsers((prev) =>
        prev.map((user) => (user.id === editId ? payload.user : user))
      );
      onNotify?.('HR user updated');
      handleEditCancel();
    } catch (err) {
      if (err.code === 'UNAUTHORIZED') {
        onNotify?.('Session expired. Please log in again.');
        onLogout();
      } else {
        setStatus((err && err.message) || 'Unable to update user');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this HR user?')) {
      return;
    }
    setProcessing(true);
    setStatus('');
    try {
      await deleteUser(token, id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      onNotify?.('HR user removed');
    } catch (err) {
      if (err.code === 'UNAUTHORIZED') {
        onNotify?.('Session expired. Please log in again.');
        onLogout();
      } else {
        setStatus((err && err.message) || 'Unable to delete user');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="panel card">
      <div className="panel-header">
        <h2>HR user dashboard</h2>
        <p className="panel-subtitle">Create, edit, and remove HR users securely.</p>
      </div>
      <section className="panel-section">
        <h3>Add new HR user</h3>
        <form className="form-card" onSubmit={handleCreate}>
          {status && <p className="form-error">{status}</p>}
          <label>
            Full name
            <input
              name="name"
              value={createForm.name}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={createForm.email}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={createForm.password}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
              minLength={8}
            />
          </label>
          <label>
            Role
            <select
              name="role"
              value={createForm.role}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, role: event.target.value }))
              }
            >
              <option value="hr">HR Staff</option>
              <option value="manager">Manager</option>
            </select>
          </label>
          <button type="submit" disabled={processing}>
            {processing ? 'Saving…' : 'Create user'}
          </button>
        </form>
      </section>
      <section className="panel-section">
        <div className="table-header">
          <h3>Existing HR users</h3>
          <button type="button" className="ghost-btn" onClick={loadUsers}>
            Refresh
          </button>
        </div>
        {loading ? (
          <p>Loading users…</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {editId === user.id ? (
                        <input
                          value={editForm.name}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editId === user.id ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, email: event.target.value }))
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editId === user.id ? (
                        <select
                          value={editForm.role}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, role: event.target.value }))
                          }
                        >
                          <option value="hr">HR Staff</option>
                          <option value="manager">Manager</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td>{new Date(user.created_at).toLocaleString()}</td>
                    <td className="actions">
                      {editId === user.id ? (
                        <>
                          <button
                            type="button"
                            className="primary-btn"
                            onClick={handleEditSubmit}
                            disabled={processing}
                          >
                            Save
                          </button>
                          <button type="button" className="ghost-btn" onClick={handleEditCancel}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="primary-btn"
                            onClick={() => handleEditStart(user)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="danger-btn"
                            onClick={() => handleDelete(user.id)}
                            disabled={processing}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5}>No HR users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserManagement;
