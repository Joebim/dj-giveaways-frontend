import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Button from "../../../components/common/Button/Button";
import type { User, UserRole } from "../../../types";

const roleOptions: UserRole[] = ["user", "admin", "moderator", "super_admin"];

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  isActive: boolean;
  subscribedToNewsletter: boolean;
}

const defaultFormValues: UserFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "user",
  password: "",
  confirmPassword: "",
  isVerified: false,
  isActive: true,
  subscribedToNewsletter: false,
};

interface UserFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  user: User | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  mode,
  user,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState<UserFormValues>(defaultFormValues);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormValues(defaultFormValues);
      setError(null);
      return;
    }

    if (mode === "edit" && user) {
      setFormValues({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        role: user.role ?? "user",
        password: "",
        confirmPassword: "",
        isVerified: Boolean(user.isVerified),
        isActive: Boolean(user.isActive),
        subscribedToNewsletter: Boolean(user.subscribedToNewsletter),
      });
    } else {
      setFormValues(defaultFormValues);
    }
    setError(null);
  }, [isOpen, mode, user]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = event.target;
    const { name, value } = target;
    const isCheckbox =
      target instanceof HTMLInputElement && target.type === "checkbox";
    const nextValue = isCheckbox ? target.checked : value;
    setFormValues((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!formValues.firstName.trim() || !formValues.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (!formValues.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (mode === "create") {
      if (!formValues.password.trim()) {
        setError("A password is required for new users.");
        return;
      }
      if (formValues.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      if (formValues.password !== formValues.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    await onSubmit(formValues);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={isSubmitting ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl mx-4 bg-black border border-gold-primary/20 rounded-lg shadow-2xl overflow-hidden"
          >
            <header className="flex items-center justify-between px-6 py-4 border-b border-gold-primary/20 bg-black/80 backdrop-blur-lg">
              <div>
                <h2 className="text-2xl font-light text-white gold-text-glow">
                  {mode === "create" ? "Create New User" : "Edit User"}
                </h2>
                <p className="text-white/60 text-sm font-light">
                  {mode === "create"
                    ? "Add a new customer or admin account."
                    : "Update user details and preferences."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-gold-primary transition-colors p-2 rounded-full hover:bg-gold-primary/10"
                disabled={isSubmitting}
                aria-label="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    placeholder="jane.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                    placeholder="+447123456789"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formValues.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-white/70 text-sm font-light">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={formValues.isVerified}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gold-primary/30 bg-black text-gold-primary focus:ring-gold-primary/50"
                    />
                    <span>Verified</span>
                  </label>
                  <label className="flex items-center gap-2 text-white/70 text-sm font-light">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formValues.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gold-primary/30 bg-black text-gold-primary focus:ring-gold-primary/50"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2 text-white/70 text-sm font-light">
                    <input
                      type="checkbox"
                      name="subscribedToNewsletter"
                      checked={formValues.subscribedToNewsletter}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gold-primary/30 bg-black text-gold-primary focus:ring-gold-primary/50"
                    />
                    <span>Newsletter</span>
                  </label>
                </div>
              </div>

              {mode === "create" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formValues.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                      placeholder="Provide a secure password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formValues.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 border border-red-500/40 bg-red-500/5 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gold-primary/10">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  size="md"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  withBrackets
                  loading={isSubmitting}
                >
                  {mode === "create" ? "Create User" : "Save Changes"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserFormModal;

