import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiPlay, FiCheckCircle, FiClock } from 'react-icons/fi';
import { enrollmentAPI } from '../../services/api';
import Badge from '../../components/ui/Badge';
import AnimatedSection from '../../components/animations/AnimatedSection';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    enrollmentAPI.getMy()
      .then((res) => setEnrollments(res.data.enrollments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter((e) => {
    if (filter === 'in-progress') return !e.isCompleted && e.progress > 0;
    if (filter === 'not-started') return e.progress === 0;
    if (filter === 'completed') return e.isCompleted;
    return true;
  });

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">My Courses</h1>
        <p className="text-dark-500 dark:text-dark-400 mb-6">{enrollments.length} courses enrolled</p>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'in-progress', 'not-started', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                filter === f ? 'bg-primary-500 text-white' : 'glass text-dark-600 dark:text-dark-400 hover:bg-white/20'
              }`}
            >
              {f.replace('-', ' ').charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FiBookOpen />}
            title="No courses found"
            description={filter === 'all' ? 'Enroll in your first course to get started!' : `No ${filter} courses`}
            action={<Link to="/courses" className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold">Browse Courses</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((enrollment, i) => (
              <AnimatedSection key={enrollment._id} delay={i * 0.05}>
                <Link to={`/courses/${enrollment.course?.slug}/learn`} className="group block">
                  <div className="glass-card rounded-2xl overflow-hidden card-hover">
                    <div className="h-44 bg-gradient-to-br from-primary-500/20 to-purple-500/20 relative">
                      {enrollment.course?.thumbnail?.url && (
                        <img src={enrollment.course.thumbnail.url} alt="" className="w-full h-full object-cover" />
                      )}
                      <Badge variant={enrollment.isCompleted ? 'success' : enrollment.progress > 0 ? 'primary' : 'warning'} className="absolute top-3 left-3">
                        {enrollment.isCompleted ? 'Completed' : enrollment.progress > 0 ? `${enrollment.progress}%` : 'Not Started'}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-dark-900 dark:text-white mb-2 line-clamp-2">{enrollment.course?.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-dark-500 dark:text-dark-400">
                        <span className="flex items-center gap-1"><FiPlay /> {enrollment.completedLessons?.length || 0} lessons</span>
                        <span className="flex items-center gap-1"><FiClock /> {new Date(enrollment.updatedAt).toLocaleDateString()}</span>
                      </div>
                      {!enrollment.isCompleted && (
                        <div className="mt-3 h-1.5 bg-dark-200 dark:bg-dark-700 rounded-full">
                          <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
