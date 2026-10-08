import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiShield, FiUser } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');

  const loadUsers = () => {
    setLoading(true);
    adminAPI.getUsers({ page, search, role: roleFilter || undefined, limit: 20 })
      .then((res) => { setUsers(res.data.users); setTotalPages(res.data.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleDelete = async (id, role) => {
    if (role === 'admin') return toast.error('Cannot delete admin');
    if (!confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminAPI.updateUser(id, { role });
      loadUsers();
      toast.success('Role updated');
    } catch {}
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Manage Users</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
          </form>
          <div className="flex gap-2">
            {['', 'student', 'instructor', 'admin'].map((r) => (
              <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }} className={`px-4 py-2 text-sm font-medium rounded-xl capitalize ${roleFilter === r ? 'bg-primary-500 text-white' : 'glass text-dark-600 dark:text-dark-400'}`}>
                {r || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? <TableSkeleton /> : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-50 dark:bg-dark-800/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">User</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Joined</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-dark-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-dark-50 dark:hover:bg-dark-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">{user.name?.charAt(0)}</div>
                          <span className="text-sm font-medium text-dark-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="text-sm px-3 py-1.5 rounded-lg bg-dark-100 dark:bg-dark-800 border-0 focus:ring-2 focus:ring-primary-500/50 capitalize">
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-lg ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(user._id, user.role)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl text-sm font-medium ${page === i + 1 ? 'bg-primary-500 text-white' : 'glass'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
