import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaKey, FaTimes } from "react-icons/fa";
import Button from "../../../components/common/Button/Button";

interface ResetPasswordModalProps {
  isOpen: boolean;
  userName?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void> | void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  userName,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    await onSubmit(password);
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
            className="relative w-full max-w-md mx-4 bg-black border border-gold-primary/20 rounded-lg shadow-2xl overflow-hidden"
          >
            <header className="flex items-center justify-between px-6 py-4 border-b border-gold-primary/20 bg-black/80 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center">
                  <FaKey className="w-5 h-5 text-gold-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-light text-white gold-text-glow">
                    Reset Password
                  </h2>
                  <p className="text-white/60 text-sm font-light">
                    {userName
                      ? `Provide a new password for ${userName}.`
                      : "Provide a new password for this user."}
                  </p>
                </div>
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

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-white/70 text-sm font-light mb-2 uppercase tracking-wider">
                  New Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                  placeholder="Enter a secure password"
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
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  required
                />
              </div>

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
                  Reset Password
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordModal;

