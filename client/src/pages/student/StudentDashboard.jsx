import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBookOpen, FiClock, FiAward, FiTrendingUp, FiArrowRight,
  FiPlay, FiStar, FiBarChart2, FiCalendar, FiCheckCircle,
} from 'react-icons/fi';
import { enrollmentAPI, courseAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Rating from '../../components/ui/Rating';
import Badge from '../../components/ui/Badge';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import AnimatedSection from '../../components/animations/AnimatedSection';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      enrollmentAPI.getMy(),
      courseAPI.getFeatured(),
    ])
      .then(([enrollRes]) => {
        const data = enrollRes.data.enrollments;
        setEnrollments(data);
        setStats({
          total: data.length,
          inProgress: data.filter(e => e.progress > 0 && e.progress < 100).length,
          completed: data.filter(e => e.isCompleted).length,
          hours: data.reduce((acc, e) => acc + (e.course?.totalDuration || 0), 0),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const statCards = [
    { label: 'Enrolled Courses', value: stats.total, icon: FiBookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'In Progress', value: stats.inProgress, icon: FiClock, color: 'from-amber-500 to-orange-500' },
    { label: 'Completed', value: stats.completed, icon: FiCheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Hours Learned', value: Math.round(stats.hours / 3600), suffix: 'h', icon: FiTrendingUp, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-dark-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-dark-500 dark:text-dark-400">Continue your learning journey</p>
          </div>
          <Link to="/courses" className="px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
            Browse Courses
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="glass-card rounded-2xl p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="text-white" />
                  </div>
                  <span className={`text-2xl font-bold gradient-text ${stat.color}`}>
                    {stat.value}{stat.suffix || ''}
                  </span>
                </div>
                <p className="text-sm text-dark-500 dark:text-dark-400 font-medium">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatedSection>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-dark-900 dark:text-white">Continue Learning</h2>
                <Link to="/student/my-courses" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                  View All <FiArrowRight />
                </Link>
              </div>
              <div className="space-y-3">
                {enrollments.filter(e => !e.isCompleted).slice(0, 5).map((enrollment, i) => (
                  <Link
                    key={enrollment._id}
                    to={`/courses/${enrollment.course?.slug}/learn/${enrollment.course?.modules?.[0]?.lessons?.[0]?._id || ''}`}
                    className="block glass-card rounded-2xl p-4 card-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        {enrollment.course?.thumbnail?.url ? (
                          <img src={enrollment.course.thumbnail.url} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <FiBookOpen className="text-primary-500 text-xl" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-dark-900 dark:text-white text-sm truncate">{enrollment.course?.title}</h3>
                        <p className="text-xs text-dark-500 dark:text-dark-400 mb-2">{enrollment.course?.instructor?.name}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-dark-200 dark:bg-dark-700 rounded-full">
                            <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <span className="text-xs font-medium text-primary-500">{enrollment.progress}%</span>
                        </div>
                      </div>
                      <FiPlay className="text-primary-500 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
                {enrollments.filter(e => !e.isCompleted).length === 0 && (
                  <div className="glass-card rounded-2xl p-8 text-center">
                    <FiBookOpen className="text-3xl text-dark-300 dark:text-dark-600 mx-auto mb-3" />
                    <p className="text-dark-500 dark:text-dark-400">No courses in progress</p>
                    <Link to="/courses" className="mt-3 inline-flex items-center gap-1 text-sm text-primary-500 font-medium">
                      Start learning <FiArrowRight />
                    </Link>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>

          <div>
            <AnimatedSection direction="right" delay={0.1}>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Quick Stats</h2>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                {[
                  { label: 'Courses Completed', value: stats.completed, total: stats.total },
                  { label: 'Average Progress', value: Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / (enrollments.length || 1)), total: 100 },
                  { label: 'Certificates Earned', value: stats.completed, total: stats.completed },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-600 dark:text-dark-400">{s.label}</span>
                      <span className="font-medium text-dark-900 dark:text-white">{s.value}/{s.total}</span>
                    </div>
                    <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${(s.value / (s.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.2}>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mt-6 mb-4">Recent Activity</h2>
              <div className="glass-card rounded-2xl p-6">
                <div className="space-y-4">
                  {enrollments.slice(0, 3).map((e) => (
                    <div key={e._id} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-dark-700 dark:text-dark-200">
                          {e.isCompleted ? 'Completed' : 'Continued'}{' '}
                          <span className="font-medium text-primary-500">{e.course?.title}</span>
                        </p>
                        <p className="text-xs text-dark-400">{new Date(e.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
