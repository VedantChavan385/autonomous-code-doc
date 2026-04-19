import React from 'react';
import { Header } from './Header';

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-10 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
