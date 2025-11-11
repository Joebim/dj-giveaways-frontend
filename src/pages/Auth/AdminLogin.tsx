import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button/Button';
import { isValidEmail } from '../../utils/validators';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.adminLogin(formData);
      
      // Set auth state
      setAuth(data.user);
      
      // Show success message
      toast.success('Admin login successful!');
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src="https://res.cloudinary.com/dtaegi6gk/image/upload/v1761790589/RC_transp_landsc_tcykeq.png"
              alt="DJ Giveaways Logo"
              className="h-16 mx-auto"
            />
          </Link>
          <h1 className="text-4xl font-light text-white mt-4 mb-2  gold-text-glow">
            Admin Login
          </h1>
          <p className="text-gold-primary text-sm font-light uppercase tracking-wider">Super Admin Access</p>
        </div>

        <div className="bg-black border border-gold-primary/20 rounded-lg py-8 px-6 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@royalcompetitions.co.uk"
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-gold-primary/20 focus:border-gold-primary/50'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 font-light">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 bg-black border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-gold-primary/20 focus:border-gold-primary/50'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 font-light">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
                fullWidth
                withBrackets
              >
                Sign in as Admin
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold-primary/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-white/60 font-light">Regular User?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/auth/login" className="block">
                <Button variant="outline" className="w-full" fullWidth>
                  Go to User Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/40 font-light">
            ⚠️ Authorized personnel only. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

