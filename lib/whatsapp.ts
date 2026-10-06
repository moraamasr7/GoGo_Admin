// lib/whatsapp.ts
import { OrderStatus, OrderItem } from "@/types/database";

export const defaultStatusMessages: Record<OrderStatus, string> = {
  pending: "طلبك مسجل ونحن في انتظار مراجعة إيصال تحويل العربون لتأكيد الحجز.",
  confirmed: "تم تأكيد استلام العربون بنجاح! بدأنا في جدولة وتجهيز طلبك.",
  processing: "قطع الكونكريت الخاصة بك قيد الصب والمعالجة اليدوية الآن بعناية لتجف تماماً.",
  ready_for_shipping: "طلبك جاهز تماماً وتم تغليفه وجاري تسليمه لشركة الشحن للتوصيل إلى عنوانك.",
  completed: "تم تسليم طلبك بنجاح! نتمنى أن تنال القطع إعجابك وتسعدنا مشاركتك لصورها ❤️",
  cancelled: "نود إعلامك بأنه تم إلغاء الطلب. يرجى التواصل معنا إن كان هناك أي استفسار.",
};

export function getWhatsAppStatusTemplate(
  customerName: string,
  orderNumber: string,
  status: OrderStatus,
  customBody?: string,
  orderItems?: OrderItem[]
): string {
  const bodyText = customBody?.trim() || defaultStatusMessages[status] || `حالته الحالية: ${status}`;

  let itemsCustomizationText = '';
  if (orderItems && Array.isArray(orderItems)) {
    const customizedItems = orderItems.filter(
      i => i.custom_attributes && (i.custom_attributes.custom_text || i.custom_attributes.finish)
    );
    if (customizedItems.length > 0) {
      itemsCustomizationText = `\n\n*تفاصيل التخصيص المطلوبة:*\n` +
        customizedItems.map(i => {
          let line = `• ${i.product_name_ar}`;
          if (i.custom_attributes?.custom_text) line += ` - نقش: "${i.custom_attributes.custom_text}"`;
          if (i.custom_attributes?.finish) line += ` (${i.custom_attributes.finish})`;
          return line;
        }).join('\n');
    }
  }

  return `مرحباً ${customerName} 👋
معك إدارة *Gogo Concrete Store* بخصوص طلبك رقم *#${orderNumber}*:

${bodyText}${itemsCustomizationText}

يسعدنا دائماً خدمتك لأي استفسار 🏺✨`;
}

export function generateAdminCustomerWhatsAppUrl(
  customerPhone: string,
  customerName: string,
  orderNumber: string,
  status: OrderStatus,
  customMessage?: string
): string {
  const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
  const message = customMessage || getWhatsAppStatusTemplate(customerName, orderNumber, status);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
