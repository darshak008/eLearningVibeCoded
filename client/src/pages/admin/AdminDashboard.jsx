import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiBookOpen, FiDollarSign, FiStar, FiArrowRight,
  FiTrendingUp, FiActivity,
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import AnimatedSection from '../../components/animations/AnimatedSection';

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, recentUsers: [], recentCourses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const stats = [
    { label: 'Total Users', value: data.stats.totalUsers, icon: FiUsers, color: 'from-blue-500 to-cyan-500', link: '/admin/users' },
    { label: 'Total Courses', value: data.stats.totalCourses, icon: FiBookOpen, color: 'from-purple-500 to-pink-500', link: '/admin/courses' },
    { label: 'Revenue', value: `$${data.stats.totalRevenue || 0}`, icon: FiDollarSign, color: 'from-green-500 to-emerald-500', link: '/admin/payments' },
    { label: 'Reviews', value: data.stats.totalReviews, icon: FiStar, color: 'from-amber-500 to-orange-500', link: '/admin/reports' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-dark-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <Link to={stat.link} className="block glass-card rounded-2xl p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="text-white" />
                  </div>
                  <span className="text-2xl font-bold gradient-text">{stat.value}</span>
                </div>
                <p className="text-sm text-dark-500 dark:text-dark-400 font-medium">{stat.label}</p>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatedSection>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Recent Users</h2>
            <div className="glass-card rounded-2xl p-4 space-y-2">
              {data.recentUsers?.map((user) => (
                <div key={user._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-dark-400">{user.email}</p>
                  </div>
                  <span className="text-xs capitalize px-2 py-1 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-500">{user.role}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Recent Courses</h2>
            <div className="glass-card rounded-2xl p-4 space-y-2">
              {data.recentCourses?.map((course) => (
                <div key={course._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800/50">
                  <FiBookOpen className="text-primary-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dark-900 dark:text-white">{course.title}</p>
                    <p className="text-xs text-dark-400">${course.price}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg ${course.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
