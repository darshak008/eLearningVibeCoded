import { useState, useEffect } from 'react';
import { FiCreditCard, FiCheckCircle, FiClock } from 'react-icons/fi';
import { paymentAPI } from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

export default function StudentPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentAPI.getHistory()
      .then((res) => setPayments(res.data.payments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Payment History</h1>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
        ) : payments.length === 0 ? (
          <EmptyState icon={<FiCreditCard />} title="No payments yet" description="Your purchase history will appear here" />
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p._id} className="glass-card rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.status === 'completed' ? 'bg-success-500/20' : 'bg-amber-500/20'}`}>
                    {p.status === 'completed' ? <FiCheckCircle className="text-success-500 text-xl" /> : <FiClock className="text-amber-500 text-xl" />}
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900 dark:text-white">{p.course?.title}</p>
                    <p className="text-sm text-dark-500">{new Date(p.createdAt).toLocaleDateString()} - <span className="capitalize">{p.status}</span></p>
                  </div>
                </div>
                <span className="text-lg font-bold gradient-text">${p.amount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
