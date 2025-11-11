import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useLoginMutation } from '../../api/mutations/useAuthMutations';
import { isValidEmail } from '../../utils/validators';

const Login: React.FC = () => {
  const loginMutation = useLoginMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-md mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-light text-white mb-4  tracking-tight">
            Sign <span className="text-gold-primary">In</span>
          </h1>
          <p className="text-white/60 text-sm font-light tracking-wide uppercase">Welcome back to DJ Giveaways</p>
        </motion.div>

        <motion.div
          className="bg-black-soft border border-gold-primary/20 rounded-lg py-10 px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-light text-white/80 mb-2">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
                className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-white/80 mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gold-primary focus:ring-gold-primary border-gold-primary/50 rounded bg-black"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80 font-light">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="font-light text-gold-primary hover:text-gold-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                loading={loginMutation.isPending}
                fullWidth
                variant="primary"
                size="lg"
                withBrackets
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold-primary/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black-soft text-white/60 font-light">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/auth/register">
                <Button variant="outline" className="w-full" size="lg">
                  Create an account
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
