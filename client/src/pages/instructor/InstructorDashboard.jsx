import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBookOpen, FiUsers, FiStar, FiDollarSign, FiTrendingUp,
  FiPlus, FiArrowRight, FiBarChart2,
} from 'react-icons/fi';
import { courseAPI, paymentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import AnimatedSection from '../../components/animations/AnimatedSection';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState({ totalEarnings: 0, totalSales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      courseAPI.getMy(),
      paymentAPI.getEarnings().catch(() => ({ data: { stats: {} } })),
    ])
      .then(([courseRes, earningRes]) => {
        setCourses(courseRes.data.courses);
        setEarnings(earningRes.data.stats || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: FiBookOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Students', value: courses.reduce((a, c) => a + (c.totalStudents || 0), 0), icon: FiUsers, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Reviews', value: courses.reduce((a, c) => a + (c.totalReviews || 0), 0), icon: FiStar, color: 'from-amber-500 to-orange-500' },
    { label: 'Earnings', value: `$${earnings.totalEarnings || 0}`, icon: FiDollarSign, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-dark-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Instructor Dashboard</h1>
            <p className="text-dark-500 dark:text-dark-400">Manage your courses and track performance</p>
          </div>
          <Link to="/instructor/courses/create" className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
            <FiPlus /> New Course
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="glass-card rounded-2xl p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="text-white" />
                  </div>
                  <span className={`text-2xl font-bold gradient-text`}>{stat.value}</span>
                </div>
                <p className="text-sm text-dark-500 dark:text-dark-400 font-medium">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">Your Courses</h2>
              <Link to="/instructor/courses" className="text-sm text-primary-500 font-medium flex items-center gap-1">View All <FiArrowRight /></Link>
            </div>
            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <Link key={course._id} to={`/instructor/courses/${course._id}/edit`} className="block glass-card rounded-2xl p-4 card-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                      <FiBookOpen className="text-primary-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-900 dark:text-white text-sm">{course.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-dark-500 mt-1">
                        <span>{course.totalStudents || 0} students</span>
                        <span>{course.avgRating?.toFixed(1) || '0.0'} rating</span>
                        <span className={`${course.isPublished ? 'text-success-500' : 'text-amber-500'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <FiBarChart2 className="text-dark-400" />
                  </div>
                </Link>
              ))}
              {courses.length === 0 && (
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-dark-500 mb-3">No courses yet</p>
                  <Link to="/instructor/courses/create" className="text-primary-500 font-medium text-sm">Create your first course</Link>
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="glass-card rounded-2xl p-6 space-y-3">
              {[
                { label: 'Create New Course', to: '/instructor/courses/create', icon: FiPlus, color: 'text-primary-500' },
                { label: 'View Analytics', to: '/instructor/analytics', icon: FiTrendingUp, color: 'text-emerald-500' },
                { label: 'Earnings Report', to: '/instructor/earnings', icon: FiDollarSign, color: 'text-amber-500' },
              ].map((action) => (
                <Link key={action.to} to={action.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors">
                  <FiTrendingUp className={action.color} />
                  <span className="text-sm font-medium text-dark-700 dark:text-dark-200">{action.label}</span>
                  <FiArrowRight className="ml-auto text-dark-400" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
