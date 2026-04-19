import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Settings as SettingsIcon, Shield, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';

export default function Settings() {
  const { user } = useAuthStore();

  return (
    <DashboardLayout>
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg border border-white/10">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account and connected services.</p>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">
        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent-start" /> User Profile
          </h2>
          <Card className="p-6 bg-slate-900/30 border-white/5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <div className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5">
                  {user?.name || "Loading..."}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <div className="bg-white/5 border border-white/10 text-slate-400 rounded-lg px-4 py-2.5 cursor-not-allowed hidden md:block">
                  {user?.email || "Loading..."}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" /> API Connections
          </h2>
          <Card className="p-6 bg-slate-900/30 border-white/5 space-y-4">
             <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 px-4 py-3 rounded-lg text-sm mb-4">
               <strong>Note:</strong> API keys are currently centrally managed via environment variables. User-level API key rotation is scheduled for a future release.
             </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
