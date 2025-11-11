import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useRegisterMutation } from '../../api/mutations/useAuthMutations';

const Register: React.FC = () => {
  const registerMutation = useRegisterMutation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    subscribedToNewsletter: false,
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^(\+44|0)[1-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid UK phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    registerMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phone: formData.phone || undefined,
      subscribedToNewsletter: formData.subscribedToNewsletter,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-light text-white mb-4  tracking-tight">
            Sign <span className="text-gold-primary">Up</span>
          </h1>
          <p className="text-white/60 text-sm font-light tracking-wide uppercase">Join DJ Giveaways today</p>
        </motion.div>

        <motion.div
          className="bg-black-soft border border-gold-primary/20 rounded-lg py-10 px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-light text-white/80 mb-2">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="First name"
                  className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-light text-white/80 mb-2">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Last name"
                  className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
                />
              </div>
            </div>

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
              <label htmlFor="phone" className="block text-sm font-light text-white/80 mb-2">
                Phone Number (Optional)
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+44 7xxx xxxxxx"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="At least 8 characters"
                className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-light text-white/80 mb-2">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
                className="bg-black border-gold-primary/30 text-white placeholder-white/50 focus:border-gold-primary"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="subscribedToNewsletter"
                  name="subscribedToNewsletter"
                  type="checkbox"
                  checked={formData.subscribedToNewsletter}
                  onChange={handleChange}
                  className="h-4 w-4 text-gold-primary focus:ring-gold-primary border-gold-primary/50 rounded bg-black"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="subscribedToNewsletter" className="font-light text-white/80">
                  Subscribe to our newsletter for updates and special offers
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-gold-primary focus:ring-gold-primary border-gold-primary/50 rounded bg-black"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="font-light text-white/80">
                  I accept the{' '}
                  <Link to="/legal/terms" className="text-gold-primary hover:text-gold-light transition-colors">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/legal/privacy" className="text-gold-primary hover:text-gold-light transition-colors">
                    Privacy Policy
                  </Link>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-400">{errors.acceptTerms}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                disabled={registerMutation.isPending}
                loading={registerMutation.isPending}
                variant="primary"
                size="lg"
                withBrackets
              >
                Create account
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold-primary/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black-soft text-white/60 font-light">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/auth/login">
                <Button variant="outline" fullWidth size="lg">
                  Sign in instead
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
