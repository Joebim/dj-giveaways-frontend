import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import Button from '../Button/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-600/20',
          iconColor: 'text-red-500',
          borderColor: 'border-red-500/30',
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-600/20',
          iconColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/30',
        };
      default:
        return {
          iconBg: 'bg-gold-primary/20',
          iconColor: 'text-gold-primary',
          borderColor: 'border-gold-primary/30',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`relative bg-black border ${styles.borderColor} rounded-lg shadow-2xl w-full max-w-md m-4`}
            >
              {/* Header */}
              <div className="sticky top-0 bg-black border-b border-gold-primary/20 px-6 py-4 rounded-t-lg z-10 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                      <FaExclamationTriangle className={`w-5 h-5 ${styles.iconColor}`} />
                    </div>
                    <h2 className="text-xl font-light text-white  gold-text-glow">
                      {title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-gold-primary transition-colors p-2 hover:bg-gold-primary/10 rounded-full"
                    disabled={isLoading}
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-white/80 font-light leading-relaxed mb-6">
                  {message}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gold-primary/10">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    size="md"
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    variant={variant === 'danger' ? 'danger' : 'primary'}
                    size="md"
                    withBrackets={variant !== 'danger'}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : confirmText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
