import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "editorial-card p-6 text-[var(--color-text-primary)] transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
