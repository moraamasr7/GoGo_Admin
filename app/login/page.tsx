'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, ArrowLeft, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success('مرحباً بك في لوحة تحكم Gogo Concrete 👋');
      router.push('/');
      router.refresh();
    } catch (err: any) {
      const msg = err.message === 'Invalid login credentials'
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : err.message || 'فشل تسجيل الدخول';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100/80 dark:bg-stone-950 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl p-8 sm:p-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 dark:bg-stone-800 text-sand-50 flex items-center justify-center mx-auto mb-4 shadow-md border border-stone-800 dark:border-stone-700">
            <span className="font-extrabold text-xl tracking-wider text-brass-400">G</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
            لوحة تحكم Gogo Concrete
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            تسجيل الدخول المخصص لمالك وإدارة المتجر
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              البريد الإلكتروني للإدارة
            </label>
            <div className="relative">
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gogoconcrete.com"
                className="w-full px-3.5 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white text-left font-mono"
              />
              <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-white text-left font-mono"
              />
              <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowLeft className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
            >
              تسجيل الدخول
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
          <p className="text-[11px] text-stone-400 dark:text-stone-500 leading-relaxed">
            هذه المنطقة محمية بالكامل بنظام التحقق السحابي المشفر لـ Supabase Auth.
          </p>
        </div>

      </div>
    </div>
  );
}
