'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  MessageCircle, 
  Receipt, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Check, 
  X, 
  ZoomIn, 
  Save, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '@/types/database';
import { formatPrice, formatDate, getStatusLabel } from '@/lib/utils';
import { generateAdminCustomerWhatsAppUrl, defaultStatusMessages, getWhatsAppStatusTemplate } from '@/lib/whatsapp';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface OrderDetailClientProps {
  initialOrder: Order;
}

export default function OrderDetailClient({ initialOrder }: OrderDetailClientProps) {
  const supabase = createClient();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status);
  const [adminNotes, setAdminNotes] = useState<string>(initialOrder.admin_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Receipt Modal State
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Fetch Signed URL on demand
  const handleViewReceipt = async () => {
    if (!order.payment_screenshot_path) {
      toast.error('لم يقم العميل برفع صورة إيصال لهذا الطلب');
      return;
    }

    if (receiptUrl) {
      setShowReceiptModal(true);
      return;
    }

    setIsLoadingReceipt(true);
    try {
      const res = await fetch('/api/receipt-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: order.payment_screenshot_path }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل جلب رابط الإيصال');

      setReceiptUrl(data.signedUrl);
      setShowReceiptModal(true);
    } catch (err: any) {
      toast.error(err.message || 'تعذر تحميل الإيصال');
    } finally {
      setIsLoadingReceipt(false);
    }
  };

  const [customerMessage, setCustomerMessage] = useState<string>(
    defaultStatusMessages[initialOrder.status] || ''
  );

  // When status changes in dropdown, auto-suggest the matching message
  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    setCustomerMessage(defaultStatusMessages[newStatus] || '');
  };

  // Update Status & Notes
  const handleUpdateOrder = async (openWhatsAppImmediately = false) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          admin_notes: adminNotes.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (error) throw error;

      setOrder(prev => ({
        ...prev,
        status,
        admin_notes: adminNotes.trim() || null,
      }));

      toast.success('تم تحديث حالة الطلب لحظياً بنجاح! ✨');

      if (openWhatsAppImmediately) {
        const url = generateAdminCustomerWhatsAppUrl(
          order.customer_phone,
          order.customer_name,
          order.order_number,
          status,
          getWhatsAppStatusTemplate(order.customer_name, order.order_number, status, customerMessage, order.order_items)
        );
        window.open(url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'فشل تحديث الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusInfo = getStatusLabel(order.status);
  const whatsappUrl = generateAdminCustomerWhatsAppUrl(
    order.customer_phone,
    order.customer_name,
    order.order_number,
    status,
    getWhatsAppStatusTemplate(order.customer_name, order.order_number, status, customerMessage, order.order_items)
  );

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="font-mono font-black text-2xl text-stone-900 dark:text-white">
              #{order.order_number}
            </span>
            <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            تاريخ التسجيل: {formatDate(order.created_at)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تواصل مع العميل عبر واتساب</span>
          </a>

          {order.payment_screenshot_path && (
            <Button
              onClick={handleViewReceipt}
              disabled={isLoadingReceipt}
              isLoading={isLoadingReceipt}
              variant="secondary"
              size="md"
              leftIcon={<Receipt className="w-4 h-4 text-brass-500 dark:text-brass-400" />}
            >
              معاينة إيصال التحويل
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Items and Customer Info */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Items Breakdown Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-800">
              القطع المطلوبة ({order.order_items?.length || 0})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-stone-400 dark:text-stone-500 border-b border-stone-100 dark:border-stone-800 font-semibold">
                    <th className="pb-3">المنتج</th>
                    <th className="pb-3">اللون</th>
                    <th className="pb-3">الكمية</th>
                    <th className="pb-3">سعر الوحدة</th>
                    <th className="pb-3 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                  {order.order_items?.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                      <td className="py-3 font-semibold text-stone-900 dark:text-white">
                        <div>{item.product_name_ar}</div>
                        {item.custom_attributes?.custom_text && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-normal text-brass-700 dark:text-brass-400 bg-sand-100 dark:bg-stone-800 border border-sand-300 dark:border-stone-700 px-2 py-0.5 rounded-md mt-1">
                            <Sparkles className="w-3 h-3 text-brass-600 dark:text-brass-400 shrink-0" />
                            <span>النقش المخصص: <strong className="font-bold text-stone-900 dark:text-white">{item.custom_attributes.custom_text}</strong></span>
                          </div>
                        )}
                        {item.custom_attributes?.finish && (
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                            التشطيب: <span className="font-semibold text-stone-700 dark:text-stone-300">{item.custom_attributes.finish}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-stone-600 dark:text-stone-400">
                        {item.selected_color || 'افتراضي'}
                      </td>
                      <td className="py-3 font-mono font-bold text-stone-800 dark:text-stone-200">
                        {item.quantity}
                      </td>
                      <td className="py-3 font-mono text-stone-600 dark:text-stone-400">
                        {formatPrice(item.unit_price)}
                      </td>
                      <td className="py-3 font-mono font-bold text-stone-900 dark:text-white text-left">
                        {formatPrice(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Breakdown */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>إجمالي قيمة المنتجات:</span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                <span>العربون المطلوب ({order.deposit_percentage}%):</span>
                <span className="font-mono text-sm">{formatPrice(order.deposit_amount)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>المتبقي عند التسليم:</span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">{formatPrice(order.remaining_amount)}</span>
              </div>
            </div>

          </div>

          {/* Customer Details Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-800">
              بيانات العميل والتوصيل
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 dark:text-stone-500 block text-[10px]">الاسم:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{order.customer_name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 dark:text-stone-500 block text-[10px]">الهاتف (واتساب):</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white" dir="ltr">{order.customer_phone}</span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 dark:text-stone-500 block text-[10px]">عنوان التوصيل:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 leading-relaxed">{order.customer_address}</span>
                </div>
              </div>

              {order.customer_email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 dark:text-stone-500 block text-[10px]">البريد الإلكتروني:</span>
                    <span className="font-mono text-stone-800 dark:text-stone-300" dir="ltr">{order.customer_email}</span>
                  </div>
                </div>
              )}

              {order.customer_notes && (
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-sand-100 dark:bg-stone-800/80 border border-sand-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px] font-bold mb-0.5">ملاحظات العميل:</span>
                  <span>{order.customer_notes}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Status Transition & Internal Notes */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-800">
              تحديث حالة الطلب
            </h2>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                اختر الحالة الجديدة:
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              >
                <option value="pending">معلق (بانتظار العربون)</option>
                <option value="confirmed">مؤكد (تم استلام العربون)</option>
                <option value="processing">قيد الصب والتنفيذ اليدوي</option>
                <option value="ready_for_shipping">جاهز للتسليم والشحن</option>
                <option value="completed">تم التسليم بنجاح</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            {/* Customer Facing WhatsApp Message */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  نص الرسالة للعميل (واتساب):
                </label>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">تلقائي</span>
              </div>
              <textarea
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                rows={3}
                placeholder="اكتب هنا الرسالة التي ستصل للعميل مع رابط الطلب..."
                className="w-full px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white dark:bg-stone-800 dark:text-white"
              />
            </div>

            {/* Internal Admin Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                ملاحظات الإدارة الداخلية (خاصة):
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                placeholder="مثال: تم التأكد من تحويل فودافون كاش..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            {/* Action Buttons: Save & Save + Send */}
            <div className="space-y-2 pt-1">
              <Button
                onClick={() => handleUpdateOrder(true)}
                disabled={isUpdating}
                isLoading={isUpdating}
                variant="success"
                size="md"
                leftIcon={<MessageCircle className="w-4 h-4" />}
                className="w-full"
              >
                حفظ وتحديث وإرسال واتساب للعميل
              </Button>

              <Button
                onClick={() => handleUpdateOrder(false)}
                disabled={isUpdating}
                variant="secondary"
                size="md"
                leftIcon={<Save className="w-3.5 h-3.5 text-brass-500" />}
                className="w-full"
              >
                {isUpdating ? 'جاري الحفظ...' : 'حفظ التحديث في النظام فقط'}
              </Button>
            </div>
          </div>

          {/* Payment receipt quick thumbnail */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-stone-900 dark:text-white">إيصال التحويل المرفوع</h3>
            {order.payment_screenshot_path ? (
              <div>
                <Button
                  onClick={handleViewReceipt}
                  variant="secondary"
                  size="sm"
                  leftIcon={<ZoomIn className="w-4 h-4 text-stone-600 dark:text-stone-300" />}
                  className="w-full"
                >
                  عرض وتكبير الإيصال
                </Button>
              </div>
            ) : (
              <p className="text-xs text-stone-400 dark:text-stone-500">لم يُرفق العميل إيصال تحويل.</p>
            )}
          </div>

        </div>

      </div>

      {/* Payment Receipt Zoom Modal */}
      {showReceiptModal && receiptUrl && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white">
                إيصال تحويل العربون - طلب #{order.order_number}
              </h3>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[3/4] max-h-[70vh] w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Image
                src={receiptUrl}
                alt="إيصال التحويل"
                fill
                className="object-contain"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowReceiptModal(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
