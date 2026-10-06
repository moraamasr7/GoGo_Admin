// types/database.ts

export type CategoryKey = 'trays' | 'coasters' | 'planters' | 'candle_holders' | 'decor' | 'gift_sets' | 'ready_sets';

export interface Product {
  id: string;
  name_ar: string;
  name_en: string | null;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  category: CategoryKey;
  stock: number;
  is_active: boolean;
  colors: string[];
  dimensions: string | null;
  weight_approx: string | null;
  allow_personalization?: boolean;
  personalization_label?: string | null;
  personalization_max_chars?: number;
  collection?: string | null;
  is_unfinished?: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'ready_for_shipping' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  subtotal: number;
  total_amount: number;
  deposit_percentage: number;
  deposit_amount: number;
  remaining_amount: number;
  payment_screenshot_path: string | null;
  status: OrderStatus;
  customer_notes: string | null;
  admin_notes: string | null;
  whatsapp_sent: boolean;
  telegram_sent: boolean;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface ItemCustomAttributes {
  custom_text?: string;
  finish?: string;
  [key: string]: unknown;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name_ar: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_color: string | null;
  custom_attributes?: ItemCustomAttributes;
  created_at: string;
  product?: Product;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  badge_text: string | null;
  image_url: string | null;
  discount_percentage: number | null;
  is_active: boolean;
  sort_order: number;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettingItem {
  id: string;
  key: string;
  value: string;
  is_public: boolean;
  description: string | null;
  updated_at: string;
}

export interface CategoryConfig {
  key: CategoryKey;
  label: string;
  description: string;
  badge?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  homepage_visible: boolean;
  display_order: number;
}

export interface CollectionConfig {
  key: string;
  label: string;
  description: string;
  badge?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  homepage_visible: boolean;
  display_order: number;
}

export const DEFAULT_CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    key: 'gift_sets',
    label: 'أطقم هدايا جاهزة',
    description: 'مجموعات منسقة راقية للإهداء والتوزيعات الفاخرة',
    badge: 'جاهز للإهداء 🎁',
    icon: '🎁',
    is_active: true,
    homepage_visible: true,
    display_order: 1,
  },
  {
    key: 'ready_sets',
    label: 'أطقم ديكورات جاهزة',
    description: 'أطقم مختارة بعناية لطاولتك ومكتبك بتناغم مثالي',
    badge: 'تنسيق البيت 🤎',
    icon: '🤎',
    is_active: true,
    homepage_visible: true,
    display_order: 2,
  },
  {
    key: 'trays',
    label: 'صواني وديكورات',
    description: 'صواني بيضاوية ودائرية متعددة الاستخدام وتقديم راقي',
    badge: 'تقديم وأناقة ✨',
    icon: '🍽️',
    is_active: true,
    homepage_visible: true,
    display_order: 3,
  },
  {
    key: 'candle_holders',
    label: 'شمعدانات ومباخر',
    description: 'مباخر عصرية وحوامل شموع فاخرة لأجواء دافئة',
    badge: 'أجواء دافئة 🕯️',
    icon: '🪵',
    is_active: true,
    homepage_visible: true,
    display_order: 4,
  },
  {
    key: 'planters',
    label: 'فازات وأحواض',
    description: 'فازات مينيمال وأحواض ميني ناعمة للمسات خضراء',
    badge: 'لمسات خضراء 🌸',
    icon: '🏺',
    is_active: true,
    homepage_visible: true,
    display_order: 5,
  },
  {
    key: 'coasters',
    label: 'كوسترات وقواعد',
    description: 'قواعد أكواب بتصميمات وتموجات مودرن وضيافة أنيقة',
    badge: 'ضيافة راقية ☕',
    icon: '☕',
    is_active: true,
    homepage_visible: true,
    display_order: 6,
  },
  {
    key: 'decor',
    label: 'تحف ومجسمات',
    description: 'قطع فنية ومجسمات ديكورية مميزة لأي ركن',
    badge: 'لمسات فنية ✨',
    icon: '🎨',
    is_active: true,
    homepage_visible: true,
    display_order: 7,
  },
];

export const DEFAULT_COLLECTION_CONFIGS: CollectionConfig[] = [
  {
    key: 'ramadan',
    label: 'تشكيلة رمضان المبارك',
    description: 'مباخر وصواني ضيافة ولمسات رمضانية دافئة للموسم والبركة',
    badge: 'الموسم والبركة 🌙',
    icon: '🌙',
    is_active: true,
    homepage_visible: true,
    display_order: 1,
  },
  {
    key: 'wedding',
    label: 'توزيعات الأفراح والمناسبات',
    description: 'توزيعات وهدايا تذكارية راقية للمناسبات السعيدة',
    badge: 'أفراح ومناسبات 💍',
    icon: '💍',
    is_active: true,
    homepage_visible: false,
    display_order: 2,
  },
  {
    key: 'giveaways',
    label: 'توزيعات وهدايا ميني',
    description: 'قطع مصغرة أنيقة ومخصصة للتوزيع والضيافة',
    badge: 'توزيعات مميزة ✨',
    icon: '✨',
    is_active: true,
    homepage_visible: false,
    display_order: 3,
  },
];

export interface StorePublicSettings {
  // 1. Identity & Branding
  store_name: string;
  store_subtitle?: string;
  header_logo_url?: string;
  brand_mark?: string;
  favicon_url?: string;
  // 2. Hero Presentation
  hero_eyebrow?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_banner_url?: string;
  // 3. Promo Banner
  promo_banner_active?: boolean;
  promo_banner_title?: string;
  promo_banner_badge?: string;
  promo_banner_image_url?: string;
  promo_banner_link?: string;
  // 4. Contact & Social
  whatsapp_number: string;
  contact_email?: string;
  instagram_url?: string;
  // 5. Commercial & Payments
  vodafone_cash: string;
  instapay: string;
  deposit_percentage: number;
  currency: string;
  payment_instructions: string;
  shipping_instructions: string;
  // 6. Operations & Maintenance
  maintenance_mode: boolean;
  // 7. Homepage Section Visibility
  section_categories_enabled?: boolean;
  section_featured_enabled?: boolean;
  section_seasonal_enabled?: boolean;
  section_custom_request_enabled?: boolean;
  // 8. Catalog & Merchandising Governance
  catalog_categories_config?: CategoryConfig[];
  catalog_collections_config?: CollectionConfig[];
  catalog_featured_product_ids?: string[];
  // 9. SEO Defaults
  seo_meta_title?: string;
  seo_meta_description?: string;
  seo_og_image_url?: string;
  // 10. Public Content (About & Story)
  about_eyebrow?: string;
  about_title?: string;
  about_story?: string;
  about_craft_title?: string;
  about_craft_text?: string;
  // 11. Support & Contact Information
  contact_eyebrow?: string;
  contact_title?: string;
  contact_subtitle?: string;
  contact_hours?: string;
  contact_coverage?: string;
  // 12. Shipping Details
  shipping_eyebrow?: string;
  shipping_title?: string;
  shipping_subtitle?: string;
  shipping_prep_time?: string;
  shipping_coverage_details?: string;
  shipping_damage_guarantee?: string;
  // 13. Terms & Policies
  terms_title?: string;
  terms_subtitle?: string;
  terms_craft_nature?: string;
  terms_deposit_policy?: string;
  terms_cancellation_policy?: string;
  terms_custom_orders_policy?: string;
  terms_inspection_policy?: string;
  // 14. Privacy Policy
  privacy_title?: string;
  privacy_subtitle?: string;
  privacy_collected_data?: string;
  privacy_usage?: string;
  privacy_third_party?: string;
  privacy_receipts_security?: string;
}


export interface DashboardStats {
  newOrders: number;
  processingOrders: number;
  readyOrders: number;
  completedOrders: number;
  totalSales: number;
  collectedDeposits: number;
  outstandingBalance: number;
}

