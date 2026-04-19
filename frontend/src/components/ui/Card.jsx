import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 text-slate-100 shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
