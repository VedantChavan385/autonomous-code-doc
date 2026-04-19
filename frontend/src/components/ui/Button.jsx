import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading = false, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none border-2 border-transparent';
  
  const variants = {
    primary: 'bg-accent-yellow border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-accent-yellow shadow-[2px_2px_0_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    secondary: 'bg-white border-[#1a1a1a] text-[#1a1a1a] hover:bg-slate-50 shadow-[2px_2px_0_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    outline: 'border-[#1a1a1a] bg-transparent text-[#1a1a1a] hover:bg-black/5 active:translate-x-[1px] active:translate-y-[1px]',
    ghost: 'hover:bg-black/5 text-text-secondary hover:text-text-primary',
    danger: 'bg-error border-[#1a1a1a] text-[#1a1a1a] hover:bg-red-400 shadow-[2px_2px_0_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
