import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiSave, FiCamera } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', headline: user?.headline || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Profile Settings</h1>

        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera className="text-white text-xl" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">{user?.name}</h2>
              <p className="text-dark-500 dark:text-dark-400 capitalize">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon={FiUser} />
            <Input label="Email" value={user?.email || ''} disabled icon={FiMail} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-dark-900 dark:text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <Input label="Headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Full Stack Developer" />

            <Button type="submit" variant="gradient" loading={loading} icon={FiSave} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
