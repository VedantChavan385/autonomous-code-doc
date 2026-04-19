import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Settings as SettingsIcon, Shield, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';

export default function Settings() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="mb-12 flex items-center gap-4 border-b-2 border-[#1a1a1a] pb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-yellow border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] -rotate-3 transition-transform hover:rotate-0">
          <SettingsIcon className="h-6 w-6 text-[#1a1a1a]" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your account and connected services.</p>
        </div>
      </div>

      <div className="max-w-4xl space-y-10">
        <section>
          <h2 className="text-xl font-black text-[#1a1a1a] mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent-start" /> User Profile
          </h2>
          <Card className="p-8 bg-white space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Name</label>
                <div className="bg-slate-50 border-2 border-[#1a1a1a] text-[#1a1a1a] rounded-xl px-4 py-3 font-medium">
                  {user?.name || "Loading..."}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                <div className="bg-slate-100 border-2 border-[#1a1a1a]/20 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed font-medium">
                  {user?.email || "Loading..."}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#1a1a1a] mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent-cool" /> API Connections
          </h2>
          <Card className="p-8 bg-white space-y-4">
             <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 px-4 py-3 rounded-xl text-sm mb-4 font-medium flex items-start gap-3">
               <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 border border-amber-600 shrink-0" />
               <p>
                 <strong>Note:</strong> API keys are currently centrally managed via environment variables. User-level API key rotation is scheduled for a future release.
               </p>
             </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
