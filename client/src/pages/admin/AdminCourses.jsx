import { useState, useEffect } from 'react';
import { FiSearch, FiBookOpen, FiTrash2 } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const loadCourses = () => {
    setLoading(true);
    adminAPI.getCourses({ page, search, status, limit: 20 })
      .then((res) => { setCourses(res.data.courses); setTotalPages(res.data.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, [page, status]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Manage Courses</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm" />
          </div>
          <div className="flex gap-2">
            {['', 'published', 'draft'].map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }} className={`px-4 py-2 text-sm font-medium rounded-xl capitalize ${status === s ? 'bg-primary-500 text-white' : 'glass'}`}>{s || 'All'}</button>
            ))}
          </div>
        </div>

        {loading ? <TableSkeleton /> : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-50 dark:bg-dark-800/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Course</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Instructor</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Price</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Students</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-dark-50 dark:hover:bg-dark-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FiBookOpen className="text-primary-500" />
                          <span className="text-sm font-medium text-dark-900 dark:text-white truncate max-w-[200px]">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-500">{course.instructor?.name}</td>
                      <td className="px-6 py-4 text-sm font-medium text-dark-900 dark:text-white">${course.price}</td>
                      <td className="px-6 py-4 text-sm text-dark-500">{course.totalStudents}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-lg ${course.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-500">{new Date(course.createdAt).toLocaleDateString()}</td>
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
}
