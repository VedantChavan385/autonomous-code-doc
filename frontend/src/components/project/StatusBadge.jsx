import React from 'react';
import { Badge } from '../ui/Badge';

export function StatusBadge({ status }) {
  const config = {
    pending: { label: 'Pending', variant: 'default' },
    processing: { label: 'Processing', variant: 'warning', animate: true },
    ready: { label: 'Ready', variant: 'success' },
    failed: { label: 'Failed', variant: 'error' },
  };

  const { label, variant, animate } = config[status] || config.pending;

  return (
    <Badge 
      variant={variant} 
      className={animate ? "animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.2)]" : ""}
    >
      {label}
    </Badge>
  );
}
