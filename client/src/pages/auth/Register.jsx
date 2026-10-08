import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiBookOpen, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Tabs from '../../components/ui/Tabs';

export default function Register() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password, role });
      toast.success('Account created successfully!');
      if (role === 'student') navigate('/student/dashboard');
      else navigate('/instructor/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Create Account</h1>
            <p className="text-dark-500 dark:text-dark-400 mt-1">Start your learning journey</p>
          </div>

          <Tabs
            tabs={[
              { id: 'student', label: 'Student' },
              { id: 'instructor', label: 'Instructor' },
            ]}
            activeTab={role}
            onChange={setRole}
            className="mb-6"
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={FiUser}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
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
                placeholder="Min. 6 characters"
                icon={FiLock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-dark-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              icon={FiCheck}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />

            <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-500 dark:text-dark-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-primary-500 hover:text-primary-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
