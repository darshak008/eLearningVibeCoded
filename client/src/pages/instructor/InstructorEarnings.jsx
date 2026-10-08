import { useState, useEffect } from 'react';
import { FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { paymentAPI } from '../../services/api';

export default function InstructorEarnings() {
  const [data, setData] = useState({ payments: [], stats: { totalEarnings: 0, totalSales: 0, platformFees: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentAPI.getEarnings()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Earnings</h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <p className="text-sm text-dark-500 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold gradient-text">${data.stats.totalEarnings}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-sm text-dark-500 mb-1">Total Sales</p>
            <p className="text-3xl font-bold gradient-text">{data.stats.totalSales}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <p className="text-sm text-dark-500 mb-1">Platform Fees</p>
            <p className="text-3xl font-bold text-dark-900 dark:text-white">${data.stats.platformFees}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-bold text-dark-900 dark:text-white mb-4">Transaction History</h2>
          {data.payments.length === 0 ? (
            <p className="text-dark-400 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {data.payments.map((p) => (
                <div key={p._id} className="flex items-center justify-between p-4 rounded-xl bg-dark-50 dark:bg-dark-800/50">
                  <div className="flex items-center gap-3">
                    <FiCreditCard className="text-primary-500" />
                    <div>
                      <p className="text-sm font-medium text-dark-900 dark:text-white">{p.course?.title}</p>
                      <p className="text-xs text-dark-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-success-500">+${p.instructorEarnings}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
