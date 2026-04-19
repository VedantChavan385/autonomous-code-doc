import React from 'react';
import { BrandPanel } from './BrandPanel';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex">
      {/* Left panel hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2">
        <BrandPanel />
      </div>
      
      {/* Right panel (Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile decorative background */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-accent-start/10 blur-[120px]" />
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
