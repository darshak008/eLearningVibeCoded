import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      switch (data.user.role) {
        case 'student': navigate('/student/dashboard'); break;
        case 'instructor': navigate('/instructor/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Welcome Back</h1>
            <p className="text-dark-500 dark:text-dark-400 mt-1">Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={FiMail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={FiLock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-dark-400 hover:text-dark-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-dark-500 dark:text-dark-400">
                <input type="checkbox" className="rounded border-dark-300 dark:border-dark-600" /> Remember me
              </label>
              <Link to="/auth/forgot-password" className="text-primary-500 hover:text-primary-600 font-medium">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-500 dark:text-dark-400">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-primary-500 hover:text-primary-600 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
