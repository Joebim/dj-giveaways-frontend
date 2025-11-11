import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import GoldBracketLeft from '../../../assets/gold-bracket-left.svg';
import GoldBracketRight from '../../../assets/gold-bracket-right.svg';

// Utility function to merge Tailwind classes
const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};

type MotionButtonProps = React.ComponentProps<typeof motion.button>;

export interface ButtonProps
    extends Omit<MotionButtonProps, 'children'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'enter';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    withBrackets?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            loading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            withBrackets = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

        const variants = {
            primary: 'gold-gradient text-white hover:opacity-90 focus:ring-2 focus:ring-gold-primary focus:ring-offset-2 focus:ring-offset-black shadow-lg hover:shadow-xl font-bold gold-glow hover:gold-glow',
            enter: 'bg-[#00FF85] text-black hover:bg-[#00E677] focus:ring-2 focus:ring-[#00FF85] focus:ring-offset-2 focus:ring-offset-black shadow-lg hover:shadow-xl font-bold electric-green-glow hover:electric-green-glow',
            secondary: 'bg-black-soft border-2 border-gold-primary text-gold-primary hover:bg-gold-primary/10 hover:border-gold-light focus:ring-2 focus:ring-gold-primary gold-hover-glow',
            outline: 'border-2 border-gold-primary/50 text-gold-primary hover:border-gold-primary hover:bg-gold-primary/10 focus:ring-2 focus:ring-gold-primary bg-transparent',
            ghost: 'text-gold-primary hover:bg-gold-primary/10 focus:ring-2 focus:ring-gold-primary',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 shadow-lg hover:shadow-xl',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm rounded-md',
            md: 'px-6 py-3 text-base rounded-lg',
            lg: 'px-8 py-4 text-lg rounded-xl',
        };

        const widthClasses = fullWidth ? 'w-full' : '';

        const buttonContent = (
            <>
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                <span className="relative z-10">{children}</span>
                {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
                
                {/* Shimmer effect for primary buttons */}
                {variant === 'primary' && !disabled && (
                    <div className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}
            </>
        );

        if (withBrackets) {
            return (
                <motion.button
                    className={cn(
                        baseClasses,
                        variants[variant],
                        sizes[size],
                        widthClasses,
                        'relative group',
                        className
                    )}
                    disabled={disabled || loading}
                    ref={ref}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    {...props}
                >
                    {/* Left Bracket */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <img src={GoldBracketLeft} alt="" className="h-24 w-auto" />
                    </div>
                    
                    {/* Button Content */}
                    <div className="relative z-10 flex items-center">
                        {buttonContent}
                    </div>
                    
                    {/* Right Bracket */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <img src={GoldBracketRight} alt="" className="h-24 w-auto" />
                    </div>
                </motion.button>
            );
        }

        return (
            <motion.button
                className={cn(
                    baseClasses,
                    variants[variant],
                    sizes[size],
                    widthClasses,
                    className
                )}
                disabled={disabled || loading}
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {buttonContent}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
