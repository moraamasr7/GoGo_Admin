// app/api/admin/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateProfileSchema = z.object({
  currentPassword: z.string().min(6, 'كلمة المرور الحالية مطلوبة للتأكيد'),
  newEmail: z.string().email('صيغة البريد الإلكتروني غير صحيحة').optional().or(z.literal('')),
  newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف').optional().or(z.literal('')),
  fullName: z.string().min(2, 'الاسم يجب ألا يقل عن حرفين').optional().or(z.literal('')),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    // 1. Ensure user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user || !user.email) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.' }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = updateProfileSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.errors[0].message }, { status: 400 });
    }

    const { currentPassword, newEmail, newPassword, fullName } = parseResult.data;

    // Must provide either new email, new password, or full name
    if (!newEmail && !newPassword && !fullName) {
      return NextResponse.json({ error: 'يرجى إدخال بيانات جديدة لتحديثها.' }, { status: 400 });
    }

    // 2. Verify current password securely on the server
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة.' }, { status: 403 });
    }

    // 3. Prepare auth credentials updates
    const authUpdates: { email?: string; password?: string } = {};

    if (newEmail && newEmail.toLowerCase() !== user.email.toLowerCase()) {
      authUpdates.email = newEmail.toLowerCase().trim();
    }

    if (newPassword) {
      authUpdates.password = newPassword;
    }

    let authUpdated = false;
    if (Object.keys(authUpdates).length > 0) {
      const { error: updateError } = await supabase.auth.updateUser(authUpdates);
      if (updateError) {
        return NextResponse.json({ error: updateError.message || 'فشل تحديث بيانات الدخول في الخادم.' }, { status: 500 });
      }
      authUpdated = true;
    }

    // 4. Update profile full_name if provided
    let profileUpdated = false;
    if (fullName && fullName.trim()) {
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (profileError) {
        return NextResponse.json({ error: profileError.message || 'فشل تحديث الاسم في الملف الشخصي.' }, { status: 500 });
      }
      profileUpdated = true;
    }

    if (!authUpdated && !profileUpdated) {
      return NextResponse.json({ error: 'البيانات المدخلة مطابقة للبيانات الحالية بالفعل.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      emailChanged: Boolean(authUpdates.email),
      passwordChanged: Boolean(authUpdates.password),
      fullNameChanged: profileUpdated,
      newEmail: authUpdates.email || user.email,
      message: 'تم تحديث بيانات الحساب بنجاح وأمان.'
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'حدث خطأ غير متوقع في الخادم.' }, { status: 500 });
  }
}
