import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Settings as SettingsIcon, Shield, User, Activity, Zap, Cpu } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import { projectApi } from '../api/project.api';
import { Spinner } from '../components/ui/Spinner';

export default function Settings() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await projectApi.getSystemStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch system status", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

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
          <Card className="p-8 bg-white space-y-4 shadow-[4px_4px_0_#1a1a1a]">
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
            <Activity className="h-5 w-5 text-accent-cool" /> System Diagnostics
          </h2>
          <Card className="p-0 overflow-hidden bg-white shadow-[4px_4px_0_#1a1a1a]">
            <div className="p-6 border-b-2 border-[#1a1a1a] bg-slate-50">
                <p className="font-bold text-[#1a1a1a]">Groq AI Infrastructure</p>
            </div>
            
            <div className="p-8 space-y-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner size="md" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 border-2 border-emerald-500 text-emerald-600 shrink-0">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">API Key Status</p>
                        <p className={`text-lg font-black ${status?.groq_connection === 'active' ? 'text-emerald-600' : 'text-error'}`}>
                          {status?.groq_connection === 'active' ? 'AUTHENTICATED' : 'CONNECTION ERROR'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 border-2 border-blue-500 text-blue-600 shrink-0">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Credits Left (Testing)</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-black text-[#1a1a1a]">
                            {status?.credits_type || "N/A"}
                          </p>
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200 uppercase">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-50 border-2 border-purple-500 text-purple-600 shrink-0">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active Model</p>
                        <p className="text-lg font-black text-[#1a1a1a]">{status?.model || "Unknown"}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border-2 border-[#1a1a1a]/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Usage Quota</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase">Healthy</p>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 border-t-2 border-[#1a1a1a] p-4 text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest">
              Live Connection Status Verification • {new Date().toLocaleTimeString()}
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
