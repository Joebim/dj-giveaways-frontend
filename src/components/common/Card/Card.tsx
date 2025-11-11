import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge Tailwind classes
const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined' | 'filled';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    clickable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = 'default',
            padding = 'md',
            hover = false,
            clickable = false,
            children,
            ...props
        },
        ref
    ) => {
        const baseClasses = 'rounded-lg transition-all duration-200';

        const variants = {
            default: 'bg-white border border-gray-200',
            elevated: 'bg-white shadow-lg hover:shadow-xl',
            outlined: 'bg-white border-2 border-gray-300',
            filled: 'bg-gray-50 border border-gray-200',
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        };

        const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-1' : '';
        const clickableClasses = clickable ? 'cursor-pointer' : '';

        return (
            <div
                className={cn(
                    baseClasses,
                    variants[variant],
                    paddings[padding],
                    hoverClasses,
                    clickableClasses,
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
