'use client';

import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface AdminSecuritySettingsProps {
  currentEmail: string;
}

export default function AdminSecuritySettings({ currentEmail }: AdminSecuritySettingsProps) {
  const [email, setEmail] = useState(currentEmail);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('يرجى إدخال كلمة المرور الحالية لتأكيد هويتك');
      return;
    }

    if (!newEmail && !newPassword) {
      toast.error('يرجى تحديد البريد الإلكتروني الجديد أو كلمة المرور الجديدة لتحديثها');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      toast.error('كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور');
      return;
    }

    setIsUpdating(true);

    try {
      // Send secure request to server endpoint
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail.trim() || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل تحديث بيانات الحساب');
      }

      toast.success(data.message || 'تم تحديث البيانات بأمان تام! 🔐');

      if (data.newEmail) {
        setEmail(data.newEmail);
      }

      // Reset sensitive fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNewEmail('');

    } catch (err: any) {
      toast.error(err.message || 'تعذر تحديث البيانات');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 flex items-center justify-center shadow-xs">
            <KeyRound className="w-5 h-5 text-brass-400 dark:text-stone-950" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-white">أمان حساب المدير والمسؤول</h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              تغيير البريد الإلكتروني أو كلمة المرور بشكل آمن ومشفر عبر الخادم
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>حماية مشفرة</span>
        </span>
      </div>

      {/* Current Email Display */}
      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-stone-400 dark:text-stone-400" />
          <span className="text-stone-500 dark:text-stone-400 font-medium">البريد الإلكتروني الحالي:</span>
          <span className="font-mono font-bold text-stone-900 dark:text-white" dir="ltr">{email}</span>
        </div>
      </div>

      <form onSubmit={handleUpdateCredentials} className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* New Email */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              تغيير البريد الإلكتروني (اختياري)
            </label>
            <div className="relative">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin-new@gogoconcrete.com"
                dir="ltr"
                className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Current Password (Required for verification) */}
          <div>
            <label className="block text-xs font-bold text-stone-900 dark:text-white mb-1.5 flex items-center gap-1">
              <span>كلمة المرور الحالية</span>
              <span className="text-rose-500">* (مطلوبة للتحقق)</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>

        {/* New Password & Confirmation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              كلمة المرور الجديدة (اختياري)
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8 أحرف أو أكثر..."
                dir="ltr"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="إعادة كتابة الجديدة..."
                dir="ltr"
                className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>
          </div>

        </div>

        {/* Security Alert Note */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            تتم عملية التأكيد والتحديث بالكامل على الخادم (Server-Side) بعد التحقق من كلمة مرورك الحالية، ولن يتم كشف التوكن أو البيانات في المتصفح.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={isUpdating}
            isLoading={isUpdating}
            variant="primary"
            size="md"
          >
            تحديث بيانات الدخول
          </Button>
        </div>

      </form>

    </div>
  );
}
