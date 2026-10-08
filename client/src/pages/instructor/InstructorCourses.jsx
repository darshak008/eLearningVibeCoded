import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { courseAPI } from '../../services/api';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseAPI.getMy()
      .then((res) => setCourses(res.data.courses))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseAPI.delete(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">My Courses</h1>
            <p className="text-dark-500 dark:text-dark-400">{courses.length} courses</p>
          </div>
          <Link to="/instructor/courses/create" className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
            <FiPlus /> Create Course
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course._id} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <FiBookOpen className="text-primary-500 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark-900 dark:text-white truncate">{course.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-dark-500 mt-1">
                    <span>${course.price}</span>
                    <span>{course.totalStudents || 0} students</span>
                    <span>{course.avgRating?.toFixed(1) || '0.0'} rating</span>
                    <Badge variant={course.isPublished ? 'success' : 'warning'}>{course.isPublished ? 'Published' : 'Draft'}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/instructor/courses/${course._id}/edit`} className="p-3 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-primary-500 hover:text-white transition-colors">
                    <FiEdit2 />
                  </Link>
                  <button onClick={() => handleDelete(course._id)} className="p-3 rounded-xl bg-dark-100 dark:bg-dark-800 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
