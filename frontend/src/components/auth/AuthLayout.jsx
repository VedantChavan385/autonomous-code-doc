import React from 'react';
import { BrandPanel } from './BrandPanel';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex">
      {/* Left panel hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 border-r-2 border-[#1a1a1a]">
        <BrandPanel />
      </div>
      
      {/* Right panel (Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 relative bg-white">
        <div className="absolute inset-0 lg:hidden pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
