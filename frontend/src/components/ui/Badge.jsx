import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-white text-[#1a1a1a] border-[1.5px] border-[#1a1a1a]',
    success: 'bg-success text-[#1a1a1a] border-[1.5px] border-[#1a1a1a]',
    warning: 'bg-warning text-[#1a1a1a] border-[1.5px] border-[#1a1a1a]',
    error: 'bg-error text-[#1a1a1a] border-[1.5px] border-[#1a1a1a]',
    accent: 'bg-accent-start text-[#1a1a1a] border-[1.5px] border-[#1a1a1a]',
  };

  return (
    <span
      className={cn(
        "mono-label inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] transition-colors focus:outline-none focus:ring-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
