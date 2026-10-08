import { useState, useEffect } from 'react';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    adminAPI.getPayments({ page, limit: 20 })
      .then((res) => setPayments(res.data.payments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Payments</h1>

        {loading ? <TableSkeleton /> : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-50 dark:bg-dark-800/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Student</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Course</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Amount</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-dark-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-dark-50 dark:hover:bg-dark-800/30">
                      <td className="px-6 py-4 text-sm text-dark-900 dark:text-white">{p.student?.name}</td>
                      <td className="px-6 py-4 text-sm text-dark-500">{p.course?.title}</td>
                      <td className="px-6 py-4 text-sm font-medium gradient-text">${p.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-lg ${
                          p.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                          p.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-500">{new Date(p.createdAt).toLocaleDateString()}</td>
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
