import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiBookOpen, FiArrowLeft } from 'react-icons/fi';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      toast.success('Password reset successfully! Please login.');
      navigate('/auth/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="absolute inset-0 hero-gradient" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FiBookOpen className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold gradient-text">LearnHub</span>
            </Link>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Reset Password</h1>
            <p className="text-dark-500 dark:text-dark-400 mt-1">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 6 characters"
              icon={FiLock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              icon={FiLock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
              Reset Password
            </Button>
          </form>

          <Link to="/auth/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-primary-500 hover:text-primary-600 font-medium">
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
