import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
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
            {sent ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-success-500 text-3xl" />
                </div>
                <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Check Your Email</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-2">
                  We've sent a password reset link to <strong className="text-dark-700 dark:text-dark-200">{email}</strong>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Forgot Password?</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">Enter your email and we'll send you a reset link</p>
              </>
            )}
          </div>

          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={FiMail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}

          <Link to="/auth/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-primary-500 hover:text-primary-600 font-medium">
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
