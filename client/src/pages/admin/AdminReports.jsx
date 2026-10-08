import { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiBookOpen, FiDollarSign } from 'react-icons/fi';
import { adminAPI } from '../../services/api';

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getReports()
      .then((res) => setData(res.data.reports))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Reports</h1>
        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2"><FiTrendingUp /> Enrollment Report</h2>
              {data?.enrollmentReport?.length > 0 ? (
                <div className="h-48 flex items-end gap-2">
                  {data.enrollmentReport.slice(-14).map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-dark-400">{d.enrollments}</span>
                      <div className="w-full bg-primary-500 rounded-t" style={{ height: `${(d.enrollments / Math.max(...data.enrollmentReport.map((e) => e.enrollments))) * 150}px` }} />
                    </div>
                  ))}
                </div>
              ) : <p className="text-dark-400 text-center py-8">No data</p>}
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2"><FiDollarSign /> Revenue Report</h2>
              {data?.revenueReport?.length > 0 ? (
                <div className="h-48 flex items-end gap-2">
                  {data.revenueReport.slice(-14).map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-dark-400">${d.revenue}</span>
                      <div className="w-full bg-gradient-to-t from-primary-500 to-purple-500 rounded-t" style={{ height: `${(d.revenue / Math.max(...data.revenueReport.map((r) => r.revenue))) * 150}px` }} />
                    </div>
                  ))}
                </div>
              ) : <p className="text-dark-400 text-center py-8">No data</p>}
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-dark-900 dark:text-white mb-4">Top Courses</h2>
              <div className="space-y-3">
                {data?.topCourses?.map((c, i) => (
                  <div key={c._id} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-bold text-dark-400">#{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark-900 dark:text-white">{c.title}</p>
                      <p className="text-xs text-dark-400">{c.totalStudents} students</p>
                    </div>
                    <span className="text-sm font-medium text-dark-500">{c.avgRating?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-bold text-dark-900 dark:text-white mb-4">Top Instructors</h2>
              <div className="space-y-3">
                {data?.topInstructors?.map((inst, i) => (
                  <div key={inst._id} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-bold text-dark-400">#{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark-900 dark:text-white">{inst.name}</p>
                      <p className="text-xs text-dark-400">{inst.totalStudents} students across {inst.totalCourses} courses</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
