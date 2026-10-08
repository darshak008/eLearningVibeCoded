import { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { notificationAPI } from '../../services/api';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationAPI.getAll({ limit: 50 })
      .then((res) => setNotifications(res.data.notifications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch {}
  };

  const markRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {}
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Notifications</h1>
          <button onClick={markAllRead} className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
            <FiCheck /> Mark all read
          </button>
        </div>

        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`glass-card rounded-2xl p-4 cursor-pointer transition-colors ${!n.isRead ? 'border-l-4 border-primary-500 bg-primary-500/5' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? 'bg-dark-100 dark:bg-dark-800' : 'bg-primary-500/20'}`}>
                  <FiBell className={n.isRead ? 'text-dark-400' : 'text-primary-500'} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-dark-500 mt-1">{n.message}</p>
                  <p className="text-xs text-dark-400 mt-2">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString()}</p>
                </div>
                {n.isRead && <FiCheckCircle className="text-dark-300 flex-shrink-0" />}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <EmptyState icon={<FiBell />} title="No notifications" description="You're all caught up!" />
          )}
        </div>
      </div>
    </div>
  );
}
