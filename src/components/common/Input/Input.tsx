import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-colors duration-200';

        const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
        const widthClasses = fullWidth ? 'w-full' : '';
        const iconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

        return (
            <div className={cn('space-y-1', widthClasses)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">{leftIcon}</span>
                        </div>
                    )}

                    <input
                        id={inputId}
                        className={cn(
                            baseClasses,
                            errorClasses,
                            iconClasses,
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">{rightIcon}</span>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
