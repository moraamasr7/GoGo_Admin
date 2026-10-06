import React from 'react';
import Link from 'next/link';
import { Search, Eye, ShoppingBag, Receipt, Phone, User, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate, getStatusLabel } from '@/lib/utils';
import { Order } from '@/types/database';

export const revalidate = 0;

interface OrdersPageProps {
  searchParams?: {
    status?: string;
    q?: string;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const supabase = createClient();
  const activeStatus = searchParams?.status || 'all';
  const query = searchParams?.q?.trim() || '';

  let dbQuery = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (activeStatus !== 'all') {
    dbQuery = dbQuery.eq('status', activeStatus);
  }

  if (query) {
    dbQuery = dbQuery.or(`order_number.ilike.%${query}%,customer_name.ilike.%${query}%,customer_phone.ilike.%${query}%`);
  }

  const { data: ordersData } = await dbQuery;
  const orders: Order[] = ordersData || [];

  const statusFilters = [
    { key: 'all', label: 'جميع الطلبات' },
    { key: 'pending', label: 'معلق' },
    { key: 'confirmed', label: 'مؤكد' },
    { key: 'processing', label: 'قيد الصب' },
    { key: 'ready_for_shipping', label: 'جاهز للشحن' },
    { key: 'completed', label: 'مكتمل' },
    { key: 'cancelled', label: 'ملغي' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            إدارة الطلبات والمبيعات
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            متابعة إيصالات العربون وتحديث مراحل تصنيع وشحن القطع
          </p>
        </div>

        <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3.5 py-2 rounded-2xl shadow-xs self-start">
          إجمالي النتائج: <span className="font-mono font-bold text-stone-950 dark:text-brass-400">{orders.length}</span> طلب
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
        
        {/* Search input form */}
        <form method="GET" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ابحث برقم الطلب (مثال: GOGO-8F) أو اسم العميل أو الهاتف..."
            className="w-full pr-10 pl-24 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white placeholder:text-stone-400"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
          
          {activeStatus !== 'all' && (
            <input type="hidden" name="status" value={activeStatus} />
          )}

          <button
            type="submit"
            className="absolute left-1.5 top-1.5 bottom-1.5 px-3.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-bold hover:bg-stone-800 dark:hover:bg-brass-400 transition-colors shadow-xs"
          >
            بحث
          </button>
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusFilters.map((tab) => {
            const isActive = activeStatus === tab.key;
            const queryParams = new URLSearchParams();
            if (tab.key !== 'all') queryParams.set('status', tab.key);
            if (query) queryParams.set('q', query);
            const href = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

            return (
              <Link
                key={tab.key}
                href={href}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-brass-500 dark:text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200/80 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

      </div>

      {/* Orders Content: Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-stone-900 dark:text-white">لا توجد طلبات مطابقة</p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">جرّب تغيير فلتر الحالة أو كلمة البحث</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< md) */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => {
              const statusInfo = getStatusLabel(order.status);
              const hasReceipt = Boolean(order.payment_screenshot_path);

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-stone-900 dark:text-white">
                        #{order.order_number}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {hasReceipt ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        <Receipt className="w-3 h-3" />
                        <span>إيصال ✓</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">
                        بدون إيصال
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100 dark:border-stone-800/80">
                    <div>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 block">العميل</span>
                      <span className="font-bold text-stone-900 dark:text-white truncate block">{order.customer_name}</span>
                      <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400" dir="ltr">{order.customer_phone}</span>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 block">الإجمالي / العربون</span>
                      <span className="font-mono font-bold text-stone-900 dark:text-white block">{formatPrice(order.total_amount)}</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">عربون: {formatPrice(order.deposit_amount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400 dark:text-stone-500">
                      {formatDate(order.created_at)}
                    </span>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 text-xs font-bold hover:bg-stone-800 dark:hover:bg-brass-400 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>عرض وتحديث</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Table (>= md) */}
          <div className="hidden md:block bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-stone-50/80 dark:bg-stone-800/50 text-stone-400 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800 font-semibold">
                    <th className="py-3.5 pr-6">رقم الطلب</th>
                    <th className="py-3.5 px-4">بيانات العميل</th>
                    <th className="py-3.5 px-4">الإجمالي</th>
                    <th className="py-3.5 px-4">العربون</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4">الإيصال</th>
                    <th className="py-3.5 px-4">التاريخ</th>
                    <th className="py-3.5 pl-6 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                  {orders.map((order) => {
                    const statusInfo = getStatusLabel(order.status);
                    const hasReceipt = Boolean(order.payment_screenshot_path);

                    return (
                      <tr key={order.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                        <td className="py-4 pr-6 font-mono font-bold text-stone-900 dark:text-white">
                          #{order.order_number}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-stone-900 dark:text-white">{order.customer_name}</div>
                          <div className="text-[11px] text-stone-400 dark:text-stone-500 font-mono" dir="ltr">{order.customer_phone}</div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-stone-900 dark:text-white">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {formatPrice(order.deposit_amount)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {hasReceipt ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              مرفوع ✓
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-400 dark:text-stone-500">
                              بدون
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-[11px] text-stone-400 dark:text-stone-500 whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-4 pl-6 text-left whitespace-nowrap">
                          <Link
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-brass-500 text-sand-50 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-brass-400 text-xs font-semibold shadow-xs transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>عرض وتحديث</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
