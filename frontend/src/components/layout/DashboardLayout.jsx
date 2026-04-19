import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
