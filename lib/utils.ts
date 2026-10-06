// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CategoryKey, OrderStatus } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "ج.م"): string {
  return `${Number(amount).toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getCategoryLabel(category: CategoryKey): string {
  const map: Record<CategoryKey, string> = {
    trays: "صواني ديكورية",
    coasters: "قواعد أكواب (Coasters)",
    planters: "أحواض نباتات",
    candle_holders: "حوامل شموع ومباخر",
    decor: "تحف وفازات",
    gift_sets: "أطقم هدايا جاهزة",
    ready_sets: "أطقم ديكورات جاهزة",
  };
  return map[category] || category;
}

export function getStatusLabel(status: OrderStatus): { label: string; bg: string; text: string; border: string } {
  const map: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
    pending: { label: "معلق (في انتظار التحويل)", bg: "bg-amber-50 dark:bg-amber-950/60", text: "text-amber-800 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800/80" },
    confirmed: { label: "مؤكد (تم استلام العربون)", bg: "bg-blue-50 dark:bg-blue-950/60", text: "text-blue-800 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800/80" },
    processing: { label: "قيد الصب والتنفيذ", bg: "bg-purple-50 dark:bg-purple-950/60", text: "text-purple-800 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800/80" },
    ready_for_shipping: { label: "جاهز للتسليم والشحن", bg: "bg-indigo-50 dark:bg-indigo-950/60", text: "text-indigo-800 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800/80" },
    completed: { label: "تم التسليم بنجاح", bg: "bg-emerald-50 dark:bg-emerald-950/60", text: "text-emerald-800 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800/80" },
    cancelled: { label: "ملغي", bg: "bg-rose-50 dark:bg-rose-950/60", text: "text-rose-800 dark:text-rose-300", border: "border-rose-200 dark:border-rose-900/80" },
  };
  return map[status] || { label: status, bg: "bg-stone-50 dark:bg-stone-800", text: "text-stone-800 dark:text-stone-300", border: "border-stone-200 dark:border-stone-700" };
}
