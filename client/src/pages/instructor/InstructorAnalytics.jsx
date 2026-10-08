import { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiBookOpen, FiDollarSign } from 'react-icons/fi';
import { courseAPI, paymentAPI } from '../../services/api';

export default function InstructorAnalytics() {
  const [courses, setCourses] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      courseAPI.getMy(),
      paymentAPI.getEarnings().catch(() => ({ data: { monthlyEarnings: [] } })),
    ])
      .then(([courseRes, earningRes]) => {
        setCourses(courseRes.data.courses);
        setEarnings(earningRes.data.monthlyEarnings || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((a, c) => a + (c.totalStudents || 0), 0);
  const totalRevenue = earnings.reduce((a, e) => a + e.earnings, 0);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Analytics</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `$${totalRevenue}`, icon: FiDollarSign, change: '+12%' },
            { label: 'Total Students', value: totalStudents, icon: FiUsers, change: '+8%' },
            { label: 'Active Courses', value: courses.filter((c) => c.isPublished).length, icon: FiBookOpen, change: '+2' },
            { label: 'Avg Rating', value: (courses.reduce((a, c) => a + (c.avgRating || 0), 0) / (courses.length || 1)).toFixed(1), icon: FiTrendingUp, change: '+0.2' },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="text-primary-500 text-xl" />
                <span className="text-xs font-medium text-success-500 bg-success-500/10 px-2 py-1 rounded-lg">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-dark-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-dark-900 dark:text-white mb-4">Monthly Earnings</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {earnings.length > 0 ? earnings.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-dark-500">${m.earnings}</span>
                <div
                  className="w-full bg-gradient-to-t from-primary-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(m.earnings / Math.max(...earnings.map((e) => e.earnings))) * 200}px` }}
                />
                <span className="text-xs text-dark-400">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m._id - 1]}</span>
              </div>
            )) : (
              <div className="w-full h-full flex items-center justify-center text-dark-400">No data available yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
