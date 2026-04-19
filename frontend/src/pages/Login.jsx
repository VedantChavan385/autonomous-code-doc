import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const data = await authApi.login(formData);
      setAuth(data.user, data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tight">Sign in</h2>
        <p className="text-slate-500 mt-3 font-medium">Welcome back to codebase.docs</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            type="email"
            name="email"
            placeholder="you@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">Password</label>
              <a href="#" className="text-sm font-bold text-slate-500 hover:text-[#1a1a1a] transition-colors underline decoration-2 underline-offset-2">
                Forgot password?
              </a>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" className="w-full group" isLoading={isLoading}>
            Sign In
            <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#1a1a1a] hover:text-accent-yellow transition-colors underline decoration-2 underline-offset-2">
            Create an account
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
