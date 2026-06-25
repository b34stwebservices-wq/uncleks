import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import { logAuditEvent } from '../services/auditService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SuccessAlert } from '../components/SuccessAlert';
import { ErrorAlert } from '../components/ErrorAlert';
import { getUsers, createUserDoc, updateUserDoc, deleteUserDoc } from '../services/userService';
import { formatDate } from '../utils/helpers';

const initialForm = {
  email: '',
  displayName: '',
  role: 'customer',
};

export const UsersManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState(initialForm);
  const [userUpdates, setUserUpdates] = useState({});
  const [roleUpdates, setRoleUpdates] = useState({});

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
      setRoleUpdates(
        usersData.reduce((state, user) => {
          state[user.id] = user.role || 'customer';
          return state;
        }, {})
      );
      setUserUpdates(
        usersData.reduce((state, user) => {
          state[user.id] = {
            email: user.email || '',
            displayName: user.displayName || '',
          };
          return state;
        }, {})
      );
    } catch (error) {
      console.error('Failed to load users', error);
      setErrorMsg('Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.email) {
      setErrorMsg('Email is required to create a user record.');
      return;
    }

    try {
      await createUserDoc(formData);
      setSuccessMsg('User record created successfully.');
      await logAuditEvent({
        actorId: user?.uid,
        actorEmail: user?.email,
        actionType: 'user.record_created',
        entityType: 'user',
        entityId: formData.email,
        entityName: formData.displayName || formData.email,
        details: `Firestore user record created for ${formData.email}`,
      });
      setFormData(initialForm);
      setLoading(true);
      await loadUsers();
    } catch (error) {
      console.error('Failed to create user record', error);
      setErrorMsg('Failed to create user record.');
      setLoading(false);
    }
  };

  const handleUserChange = (userId, name, value) => {
    setUserUpdates((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [name]: value,
      },
    }));
  };

  const handleRoleChange = (userId, value) => {
    setRoleUpdates((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const handleSaveUser = async (userId) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const updates = {
        role: roleUpdates[userId],
        ...userUpdates[userId],
      };
      await updateUserDoc(userId, updates);
      setSuccessMsg('User record updated successfully.');
      await logAuditEvent({
        actorId: user?.uid,
        actorEmail: user?.email,
        actionType: 'user.updated',
        entityType: 'user',
        entityId: userId,
        entityName: updates.displayName || users.find((u) => u.id === userId)?.displayName || userId,
        details: `User updated: ${JSON.stringify(updates)}`,
      });
      setLoading(true);
      await loadUsers();
    } catch (error) {
      console.error('Failed to update user record', error);
      setErrorMsg('Failed to update user record.');
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user record? This does not remove a Firebase Auth account.')) {
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    try {
      await deleteUserDoc(userId);
      setSuccessMsg('User record deleted successfully.');
      await logAuditEvent({
        actorId: user?.uid,
        actorEmail: user?.email,
        actionType: 'user.record_deleted',
        entityType: 'user',
        entityId: userId,
        entityName: users.find((u) => u.id === userId)?.displayName || userId,
        details: 'User record removed from Firestore',
      });
      setLoading(true);
      await loadUsers();
    } catch (error) {
      console.error('Failed to delete user record', error);
      setErrorMsg('Failed to delete user record.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <SuccessAlert message={successMsg} onDismiss={() => setSuccessMsg('')} />
      <ErrorAlert message={errorMsg} onDismiss={() => setErrorMsg('')} />

      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage Firestore user records and roles.</p>
          </div>
          <Link
            to="/dashboard"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <Users size={18} />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 bg-white shadow-sm rounded-3xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Create User Record</h2>
            <p className="text-sm text-gray-600 mb-4">
              This creates a Firestore user record only. It does not create a Firebase Auth sign-in account.
            </p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Optional display name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">
                Create Record
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 card p-6 bg-white shadow-sm rounded-3xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Users</h2>
            {users.length === 0 ? (
              <p className="text-gray-600">No user records found.</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-3xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{user.email || 'No email'}</p>
                        <p className="text-sm text-gray-600">
                          {user.displayName || 'No display name'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Created: {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                          type="text"
                          value={userUpdates[user.id]?.displayName || ''}
                          onChange={(e) => handleUserChange(user.id, 'displayName', e.target.value)}
                          placeholder="Display Name"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                        />
                        <input
                          type="email"
                          value={userUpdates[user.id]?.email || ''}
                          onChange={(e) => handleUserChange(user.id, 'email', e.target.value)}
                          placeholder="Email"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                        />
                        <select
                          value={roleUpdates[user.id] || 'customer'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 text-base"
                        >
                          <option value="pending">Pending</option>
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleSaveUser(user.id)}
                          className="btn-secondary"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
