'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SettingItem, CategoryConfig, CollectionConfig, DEFAULT_CATEGORY_CONFIGS, DEFAULT_COLLECTION_CONFIGS } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { 
  Save, 
  Smartphone, 
  Coins, 
  Hammer, 
  ImageIcon, 
  Upload, 
  Trash2, 
  Sparkles, 
  Phone, 
  Mail, 
  Instagram, 
  Truck, 
  Search,
  AlertTriangle,
  CheckCircle2,
  Layers,
  LayoutTemplate,
  Plus,
  Grid,
  FolderPlus,
  BookOpen,
  ShieldCheck,
  FileText,
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface SettingsClientProps {
  initialSettings: SettingItem[];
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const supabase = createClient();

  // Convert array to key-value map
  const initialMap: Record<string, string> = {};
  initialSettings.forEach(s => { initialMap[s.key] = s.value; });

  // 1. Identity & Branding (Brand Safe Defaults)
  const [storeName, setStoreName] = useState(initialMap['store_name'] || 'Gogo Designs');
  const [storeSubtitle, setStoreSubtitle] = useState(
    initialMap['store_subtitle'] || 'براند مصري لديكورات وتحف منزلية مصبوبة يدوياً بتشطيب ناعم وألوان هادئة تضيف لمسة فنية دافئة وأنيقة لكل زاوية في منزلك.'
  );
  const [headerLogoUrl, setHeaderLogoUrl] = useState(initialMap['header_logo_url'] || '');

  // 2. Hero Presentation
  const [heroEyebrow, setHeroEyebrow] = useState(initialMap['hero_eyebrow'] || 'تصاميم فاخرة وقطع ديكور مصنوعة يدوياً بمحبة ✨');
  const [heroTitle, setHeroTitle] = useState(initialMap['hero_title'] || 'قطع مميزة لبيتك وهداياك / معمولـة بتركيز ودقة 🤍');
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialMap['hero_subtitle'] || 'تصميمات مودرن وبسيطة تليق بأي مساحة في بيتك. كل قطعة بنفذها يدويًا باهتمام فائق بالتفاصيل، بتشطيب ناعم وألوان هادية تمنح بيتك لمسة فنية دافئة.'
  );
  const [heroBannerUrl, setHeroBannerUrl] = useState(initialMap['hero_banner_url'] || '');

  // 3. Homepage Section Visibility Controls
  const [sectionCategoriesEnabled, setSectionCategoriesEnabled] = useState(initialMap['section_categories_enabled'] !== 'false');
  const [sectionFeaturedEnabled, setSectionFeaturedEnabled] = useState(initialMap['section_featured_enabled'] !== 'false');
  const [sectionSeasonalEnabled, setSectionSeasonalEnabled] = useState(initialMap['section_seasonal_enabled'] !== 'false');
  const [sectionCustomRequestEnabled, setSectionCustomRequestEnabled] = useState(initialMap['section_custom_request_enabled'] !== 'false');

  // 3.5. Catalog & Category Governance
  const [categoriesConfig, setCategoriesConfig] = useState<CategoryConfig[]>(() => {
    if (initialMap['catalog_categories_config']) {
      try {
        const parsed = JSON.parse(initialMap['catalog_categories_config']);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_CATEGORY_CONFIGS;
  });

  const [collectionsConfig, setCollectionsConfig] = useState<CollectionConfig[]>(() => {
    if (initialMap['catalog_collections_config']) {
      try {
        const parsed = JSON.parse(initialMap['catalog_collections_config']);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_COLLECTION_CONFIGS;
  });

  // State for adding a new collection
  const [newCollectionKey, setNewCollectionKey] = useState('');
  const [newCollectionLabel, setNewCollectionLabel] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [newCollectionBadge, setNewCollectionBadge] = useState('');
  const [newCollectionIcon, setNewCollectionIcon] = useState('✨');
  const [isAddingCollection, setIsAddingCollection] = useState(false);

  // 4. Commerce & Payments
  const [vodafoneCash, setVodafoneCash] = useState(initialMap['vodafone_cash'] || '01012345678');
  const [instapay, setInstapay] = useState(initialMap['instapay'] || 'gogo.designs@instapay');
  const [depositPercentage, setDepositPercentage] = useState(initialMap['deposit_percentage'] || '50');
  const [currency, setCurrency] = useState(initialMap['currency'] || 'ج.م');
  const [paymentInstructions, setPaymentInstructions] = useState(
    initialMap['payment_instructions'] || 'يرجى تحويل مبلغ العربون (50% من إجمالي الطلب) عبر فودافون كاش أو إنستاباي، ورفع لقطة شاشة للإيصال لتأكيد بدء الصب والتنفيذ اليدوي.'
  );

  // 5. Contact & Shipping
  const [whatsappNumber, setWhatsappNumber] = useState(initialMap['whatsapp_number'] || '201012345678');
  const [contactEmail, setContactEmail] = useState(initialMap['contact_email'] || 'contact@gogodesigns.com');
  const [instagramUrl, setInstagramUrl] = useState(initialMap['instagram_url'] || 'https://instagram.com/gogo_designs');
  const [shippingInstructions, setShippingInstructions] = useState(
    initialMap['shipping_instructions'] || 'مدة التنفيذ اليدوي من 3 إلى 7 أيام عمل. مصاريف الشحن تُحسب حسب المحافظة وتُسدد للمندوب عند الاستلام.'
  );

  // 6. Promotional Banner
  const [promoBannerActive, setPromoBannerActive] = useState(initialMap['promo_banner_active'] !== 'false');
  const [promoBannerTitle, setPromoBannerTitle] = useState(
    initialMap['promo_banner_title'] || 'عرض الموسم ✨ خصم خاص لفترة محدودة على تشكيلة الصواني والمباخر'
  );
  const [promoBannerBadge, setPromoBannerBadge] = useState(initialMap['promo_banner_badge'] || 'عرض خاص 🔥');
  const [promoBannerImageUrl, setPromoBannerImageUrl] = useState(
    initialMap['promo_banner_image_url'] || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80'
  );
  const [promoBannerLink, setPromoBannerLink] = useState(initialMap['promo_banner_link'] || '/products');

  // 7. Public Content & Policies (STEP 10I)
  // About Page
  const [aboutEyebrow, setAboutEyebrow] = useState(initialMap['about_eyebrow'] || 'حرفية يدوية مصرية معاصرة');
  const [aboutTitle, setAboutTitle] = useState(initialMap['about_title'] || 'شغف بالجمال، وصناعة يدوية / معمولة بتركيز ودقة 🤍');
  const [aboutStory, setAboutStory] = useState(
    initialMap['about_story'] || 'في Gogo Concrete Designs، نؤمن بأن تفاصيل المنزل الصغيرة هي التي تصنع روحه ودفئه. بدأنا من فكرة بسيطة: ابتكار قطع فنية راقية وناعمة الملمس، تدوم طويلاً وتضفي لمسة من الدفء والجمال على كل ركن.'
  );
  const [aboutCraftTitle, setAboutCraftTitle] = useState(initialMap['about_craft_title'] || 'فلسفة التصميم والتشطيب');
  const [aboutCraftText, setAboutCraftText] = useState(
    initialMap['about_craft_text'] || 'تتميز منتجاتنا بالتوازن بين البساطة والعملية؛ سواء كانت صينية تقديم ديكورية، مبخرة عصرية، حامل شموع دافئ، أو طقم هدايا متناسق. كل قطعة تمر بالصب الدقيق، الصنفرة الحريرية، طبقات العزل والحماية، مع لبادات حماية الطاولات.'
  );

  // Contact Page
  const [contactEyebrow, setContactEyebrow] = useState(initialMap['contact_eyebrow'] || 'خدمة العملاء والطلبات الخاصة');
  const [contactTitle, setContactTitle] = useState(initialMap['contact_title'] || 'يسعدنا تواصلك واستقبال استفساراتك 🤍');
  const [contactSubtitle, setContactSubtitle] = useState(
    initialMap['contact_subtitle'] || 'سواء كان لديكِ استفسار عن قطعة معينة، أو رغبة في تنسيق طقم بألوان مخصصة أو إضافة نقش إهداء بالاسم، نحن دائماً هنا لمساعدتك.'
  );
  const [contactHours, setContactHours] = useState(
    initialMap['contact_hours'] || 'يومياً من الساعة 10:00 صباحاً حتى 11:00 مساءً (الطلبات عبر الموقع متاحة 24/7).'
  );
  const [contactCoverage, setContactCoverage] = useState(
    initialMap['contact_coverage'] || 'شحن سريع ومغلف بعناية فائقة ضد الكسر لكافة محافظات جمهورية مصر العربية.'
  );

  // Shipping & Guarantee Page
  const [shippingEyebrow, setShippingEyebrow] = useState(initialMap['shipping_eyebrow'] || 'الشحن الآمن والعربون');
  const [shippingTitle, setShippingTitle] = useState(initialMap['shipping_title'] || 'سياسة الشحن والتسليم وضمان الجودة');
  const [shippingSubtitle, setShippingSubtitle] = useState(
    initialMap['shipping_subtitle'] || 'نحرص على أن تصلك كل قطعة يدوية بأعلى معايير الأمان والتغليف الفاخر وبأسرع وقت ممكن.'
  );
  const [shippingPrepTime, setShippingPrepTime] = useState(
    initialMap['shipping_prep_time'] || 'نظراً لأن القطع تُصب وتُعالج يدوياً، يستغرق التجهيز من 2 إلى 4 أيام عمل لضمان جفاف وتشطيب مثالي.'
  );
  const [shippingCoverageDetails, setShippingCoverageDetails] = useState(
    initialMap['shipping_coverage_details'] || 'القاهرة والجيزة والإسكندرية: 24-48 ساعة بعد انتهاء التجهيز | باقي المحافظات: 2-4 أيام عمل.'
  );
  const [shippingDamageGuarantee, setShippingDamageGuarantee] = useState(
    initialMap['shipping_damage_guarantee'] || 'في حال وصول أي قطعة متضررة أثناء الشحن، نتحمل إعادة تنفيذها وشحنها لكِ مجاناً أو رد قيمتها بالكامل فور إبلاغنا بصورة التلف.'
  );

  // Terms & Conditions Page
  const [termsTitle, setTermsTitle] = useState(initialMap['terms_title'] || 'الشروط والأحكام');
  const [termsSubtitle, setTermsSubtitle] = useState(
    initialMap['terms_subtitle'] || 'توضح هذه الشروط حقوق والتزامات كل من العميل ومتجر Gogo Designs لضمان تجربة شراء شفافة وموثوقة.'
  );
  const [termsCraftNature, setTermsCraftNature] = useState(
    initialMap['terms_craft_nature'] || 'جميع القطع مصنوعة ومصبوبة يدوياً، ولذلك قد توجد اختلافات طفيفة جداً في تموجات الألوان أو الملامس، وهو ما يعكس أصالة الحرفة اليدوية ولا يُعد عيباً.'
  );
  const [termsDepositPolicy, setTermsDepositPolicy] = useState(
    initialMap['terms_deposit_policy'] || 'يُعد الطلب مؤكداً فقط بعد تحويل عربون 50% من إجمالي قيمة المنتجات، حيث يبدأ تجهيز وصب القطع خصيصاً بناءً على هذا التأكيد.'
  );
  const [termsCancellationPolicy, setTermsCancellationPolicy] = useState(
    initialMap['terms_cancellation_policy'] || 'يمكن للعميل طلب تعديل الألوان أو إلغاء الطلب واسترداد العربون كاملاً خلال 12 ساعة من تقديم الطلب وقبل بدء مرحلة التنفيذ.'
  );
  const [termsCustomOrdersPolicy, setTermsCustomOrdersPolicy] = useState(
    initialMap['terms_custom_orders_policy'] || 'القطع المنقوشة بأسماء أو عبارات خاصة لا يمكن استرجاعها بعد التنفيذ إلا في حال وجود خطأ من جانبنا مخالف للمكتوب في نموذج الطلب.'
  );
  const [termsInspectionPolicy, setTermsInspectionPolicy] = useState(
    initialMap['terms_inspection_policy'] || 'يلتزم العميل بمعاينة الطرد في حضور مندوب شركة الشحن وسداد المبلغ المتبقي، وفي حال وجود تلف يتم توثيقه بالصورة فوراً للاستبدال الفوري.'
  );

  // Privacy Policy Page
  const [privacyTitle, setPrivacyTitle] = useState(initialMap['privacy_title'] || 'سياسة الخصوصية');
  const [privacySubtitle, setPrivacySubtitle] = useState(
    initialMap['privacy_subtitle'] || 'نلتزم بحماية خصوصيتك وضمان سرية كافة البيانات التي تشاركينها معنا أثناء إتمام وتوصيل طلبك.'
  );
  const [privacyCollectedData, setPrivacyCollectedData] = useState(
    initialMap['privacy_collected_data'] || 'نجمع فقط البيانات الأساسية اللازمة لتجهيز وشحن طلبك: الاسم، رقم الهاتف للتواصل عبر واتساب، عنوان الشحن بالتفصيل، وملاحظات التخصيص.'
  );
  const [privacyUsage, setPrivacyUsage] = useState(
    initialMap['privacy_usage'] || 'تُستخدم بياناتك حصرياً لتنفيذ طلبك، وتزويد مندوب الشحن بالعنوان، وإرسال إشعارات التتبع وتأكيد العربون عبر واتساب.'
  );
  const [privacyThirdParty, setPrivacyThirdParty] = useState(
    initialMap['privacy_third_party'] || 'نتعهد بعدم بيع أو تأجير أو مشاركة أي من بياناتك الشخصية مع أي أطراف ثالثة لأغراض دعائية أو إعلانية. بياناتك في سرية تامة.'
  );
  const [privacyReceiptsSecurity, setPrivacyReceiptsSecurity] = useState(
    initialMap['privacy_receipts_security'] || 'يتم تخزين صور إيصالات التحويل المرفوعة عبر قنوات آمنة ومشفرة، وتُستخدم فقط من قِبل إدارة المتجر لمطابقة مبالغ العربون.'
  );

  // 8. SEO & Meta
  const [seoMetaTitle, setSeoMetaTitle] = useState(
    initialMap['seo_meta_title'] || 'Gogo Designs | تحف وديكورات منزلية مصنوعة يدوياً بتركيز ودقة 🤍'
  );
  const [seoMetaDescription, setSeoMetaDescription] = useState(
    initialMap['seo_meta_description'] || 'متجر Gogo Designs للتحف والديكورات المنزلية وأطقم الهدايا المصبوبة يدوياً. صواني تقديم، مباخر، شمعدانات، كوسترات، وفازات بتشطيب ناعم وألوان هادئة ونقش مخصص بالاسم.'
  );
  const [seoOgImageUrl, setSeoOgImageUrl] = useState(initialMap['seo_og_image_url'] || '');

  // 9. Operations & Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(initialMap['maintenance_mode'] === 'true');

  // Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingPromo, setIsUploadingPromo] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);

  const handleToggleMaintenance = async () => {
    if (isTogglingMaintenance) return;
    const nextState = !maintenanceMode;
    setMaintenanceMode(nextState);
    setIsTogglingMaintenance(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert(
          {
            key: 'maintenance_mode',
            value: nextState ? 'true' : 'false',
            is_public: true,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        );
      if (error) throw error;
      if (nextState) {
        toast.success('تم تفعيل وضع الصيانة ⚠️ (المتجر مغلق أمام العملاء مؤقتاً)');
      } else {
        toast.success('تم إلغاء وضع الصيانة بنجاح! 🟢 (المتجر مفتوح ومتاح للعملاء الآن)');
      }
    } catch (err: any) {
      setMaintenanceMode(!nextState); // rollback
      toast.error('فشل تحديث وضع الصيانة: ' + (err.message || 'حدث خطأ'));
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'logo' | 'banner' | 'promo' | 'og') => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('صيغة الصورة يجب أن تكون JPG أو PNG أو WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب ألا يتجاوز 5 ميجابايت');
      return;
    }

    if (type === 'logo') setIsUploadingLogo(true);
    else if (type === 'banner') setIsUploadingBanner(true);
    else if (type === 'promo') setIsUploadingPromo(true);
    else setIsUploadingOg(true);

    try {
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `branding/${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      if (type === 'logo') {
        setHeaderLogoUrl(publicUrlData.publicUrl);
        toast.success('تم رفع لوجو الهيدر بنجاح! ✨');
      } else if (type === 'banner') {
        setHeroBannerUrl(publicUrlData.publicUrl);
        toast.success('تم رفع بانر المتجر بنجاح! ✨');
      } else if (type === 'promo') {
        setPromoBannerImageUrl(publicUrlData.publicUrl);
        toast.success('تم رفع صورة البنر الترويجي بنجاح! ✨');
      } else {
        setSeoOgImageUrl(publicUrlData.publicUrl);
        toast.success('تم رفع صورة المشاركة الاجتماعية (OG Image) بنجاح! ✨');
      }
    } catch (err: any) {
      toast.error(err.message || 'فشل رفع الصورة');
    } finally {
      if (type === 'logo') setIsUploadingLogo(false);
      else if (type === 'banner') setIsUploadingBanner(false);
      else if (type === 'promo') setIsUploadingPromo(false);
      else setIsUploadingOg(false);
    }
  };

  // Handlers for Category Governance
  const handleCategoryChange = (key: string, field: keyof CategoryConfig, val: any) => {
    setCategoriesConfig(prev => prev.map(c => c.key === key ? { ...c, [field]: val } : c));
  };

  // Handlers for Collection Governance
  const handleCollectionChange = (key: string, field: keyof CollectionConfig, val: any) => {
    setCollectionsConfig(prev => prev.map(c => c.key === key ? { ...c, [field]: val } : c));
  };

  const handleAddCollection = () => {
    if (!newCollectionKey.trim() || !newCollectionLabel.trim()) {
      toast.error('يرجى كتابة رمز واسم المجموعة');
      return;
    }
    const cleanKey = newCollectionKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (collectionsConfig.some(c => c.key === cleanKey)) {
      toast.error('رمز المجموعة موجود بالفعل');
      return;
    }
    const newCol: CollectionConfig = {
      key: cleanKey,
      label: newCollectionLabel.trim(),
      description: newCollectionDesc.trim() || 'تشكيلة ديكورية مميزة',
      badge: newCollectionBadge.trim() || undefined,
      icon: newCollectionIcon.trim() || '✨',
      is_active: true,
      homepage_visible: true,
      display_order: collectionsConfig.length + 1,
    };
    setCollectionsConfig(prev => [...prev, newCol]);
    setNewCollectionKey('');
    setNewCollectionLabel('');
    setNewCollectionDesc('');
    setNewCollectionBadge('');
    setNewCollectionIcon('✨');
    setIsAddingCollection(false);
    toast.success('تمت إضافة المجموعة بنجاح ✨');
  };

  const handleDeleteCollection = (key: string) => {
    setCollectionsConfig(prev => prev.filter(c => c.key !== key));
    toast.success('تم حذف المجموعة');
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation & normalization
    const cleanVodafone = vodafoneCash.replace(/[^0-9]/g, '');
    if (cleanVodafone.length < 10) {
      toast.error('رقم فودافون كاش يجب أن يتكون من 11 رقماً صالحاً');
      return;
    }

    const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanWhatsapp.length < 10) {
      toast.error('رقم الواتساب الرسمي يجب أن يحتوي على كود الدولة ورقم صحيح');
      return;
    }

    const numDeposit = Math.min(100, Math.max(10, Number(depositPercentage) || 50));

    setIsSaving(true);

    const updates = [
      // 1. Identity & Branding
      { key: 'store_name', value: storeName.trim() },
      { key: 'store_subtitle', value: storeSubtitle.trim() },
      { key: 'header_logo_url', value: headerLogoUrl.trim() },

      // 2. Hero Presentation
      { key: 'hero_eyebrow', value: heroEyebrow.trim() },
      { key: 'hero_title', value: heroTitle.trim() },
      { key: 'hero_subtitle', value: heroSubtitle.trim() },
      { key: 'hero_banner_url', value: heroBannerUrl.trim() },

      // 3. Homepage Section Visibility Controls
      { key: 'section_categories_enabled', value: sectionCategoriesEnabled ? 'true' : 'false' },
      { key: 'section_featured_enabled', value: sectionFeaturedEnabled ? 'true' : 'false' },
      { key: 'section_seasonal_enabled', value: sectionSeasonalEnabled ? 'true' : 'false' },
      { key: 'section_custom_request_enabled', value: sectionCustomRequestEnabled ? 'true' : 'false' },

      // 3.5. Catalog & Merchandising Governance
      { key: 'catalog_categories_config', value: JSON.stringify(categoriesConfig) },
      { key: 'catalog_collections_config', value: JSON.stringify(collectionsConfig) },

      // 4. Commerce & Payments
      { key: 'vodafone_cash', value: cleanVodafone },
      { key: 'instapay', value: instapay.trim() },
      { key: 'deposit_percentage', value: String(numDeposit) },
      { key: 'currency', value: currency.trim() || 'ج.م' },
      { key: 'payment_instructions', value: paymentInstructions.trim() },

      // 5. Contact & Shipping
      { key: 'whatsapp_number', value: cleanWhatsapp },
      { key: 'contact_email', value: contactEmail.trim() },
      { key: 'instagram_url', value: instagramUrl.trim() },
      { key: 'shipping_instructions', value: shippingInstructions.trim() },

      // 6. Promo Banner
      { key: 'promo_banner_active', value: promoBannerActive ? 'true' : 'false' },
      { key: 'promo_banner_title', value: promoBannerTitle.trim() },
      { key: 'promo_banner_badge', value: promoBannerBadge.trim() },
      { key: 'promo_banner_image_url', value: promoBannerImageUrl.trim() },
      { key: 'promo_banner_link', value: promoBannerLink.trim() },

      // 7. Public Content & Policies (STEP 10I)
      { key: 'about_eyebrow', value: aboutEyebrow.trim() },
      { key: 'about_title', value: aboutTitle.trim() },
      { key: 'about_story', value: aboutStory.trim() },
      { key: 'about_craft_title', value: aboutCraftTitle.trim() },
      { key: 'about_craft_text', value: aboutCraftText.trim() },

      { key: 'contact_eyebrow', value: contactEyebrow.trim() },
      { key: 'contact_title', value: contactTitle.trim() },
      { key: 'contact_subtitle', value: contactSubtitle.trim() },
      { key: 'contact_hours', value: contactHours.trim() },
      { key: 'contact_coverage', value: contactCoverage.trim() },

      { key: 'shipping_eyebrow', value: shippingEyebrow.trim() },
      { key: 'shipping_title', value: shippingTitle.trim() },
      { key: 'shipping_subtitle', value: shippingSubtitle.trim() },
      { key: 'shipping_prep_time', value: shippingPrepTime.trim() },
      { key: 'shipping_coverage_details', value: shippingCoverageDetails.trim() },
      { key: 'shipping_damage_guarantee', value: shippingDamageGuarantee.trim() },

      { key: 'terms_title', value: termsTitle.trim() },
      { key: 'terms_subtitle', value: termsSubtitle.trim() },
      { key: 'terms_craft_nature', value: termsCraftNature.trim() },
      { key: 'terms_deposit_policy', value: termsDepositPolicy.trim() },
      { key: 'terms_cancellation_policy', value: termsCancellationPolicy.trim() },
      { key: 'terms_custom_orders_policy', value: termsCustomOrdersPolicy.trim() },
      { key: 'terms_inspection_policy', value: termsInspectionPolicy.trim() },

      { key: 'privacy_title', value: privacyTitle.trim() },
      { key: 'privacy_subtitle', value: privacySubtitle.trim() },
      { key: 'privacy_collected_data', value: privacyCollectedData.trim() },
      { key: 'privacy_usage', value: privacyUsage.trim() },
      { key: 'privacy_third_party', value: privacyThirdParty.trim() },
      { key: 'privacy_receipts_security', value: privacyReceiptsSecurity.trim() },

      // 8. SEO Defaults
      { key: 'seo_meta_title', value: seoMetaTitle.trim() },
      { key: 'seo_meta_description', value: seoMetaDescription.trim() },
      { key: 'seo_og_image_url', value: seoOgImageUrl.trim() },

      // 9. Operations
      { key: 'maintenance_mode', value: maintenanceMode ? 'true' : 'false' },
    ];

    try {
      for (const item of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert(
            { key: item.key, value: item.value, is_public: true, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          );

        if (error) throw error;
      }

      toast.success('تم حفظ وتطبيق كافة إعدادات وحوكمة المتجر بنجاح! ✨');
    } catch (err: any) {
      toast.error(err.message || 'فشل حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          إعدادات وحوكمة المتجر والصفحة الرئيسية
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          التحكم الشامل في هوية المتجر، نصوص وبانرات الهيرو، ظهور أقسام الصفحة الرئيسية، وبيانات الدفع
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        
        {/* SECTION 1: Store Identity & Logo */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <Sparkles className="w-5 h-5 text-brass-500" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">1. هوية المتجر والشعار (Store Identity)</h2>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">اسم المتجر والنبذة التعريفية التي تظهر في الهيدر والفووتر</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                اسم المتجر الرسمي
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Gogo Concrete Store"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                العملة الرسمية
              </label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="ج.م"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                النبذة التعريفية للبراند (Footer Brand Story)
              </label>
              <textarea
                rows={2}
                value={storeSubtitle}
                onChange={(e) => setStoreSubtitle(e.target.value)}
                placeholder="براند مصري لديكورات وتحف منزلية مصبوبة يدوياً..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>
          </div>

          {/* Logo Upload Box */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                لوجو وشعار الهيدر (Header Logo)
              </label>
              {headerLogoUrl && (
                <button
                  type="button"
                  onClick={() => setHeaderLogoUrl('')}
                  className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>إزالة واستعادة الشعار النصي</span>
                </button>
              )}
            </div>

            {headerLogoUrl ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-xs mx-auto my-1">
                <Image
                  src={headerLogoUrl}
                  alt="Header Logo Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-stone-800/40 flex flex-col items-center justify-center text-stone-400 mx-auto my-1">
                <span className="text-base font-black text-brass-500">G</span>
                <span className="text-[8px]">افتراضي</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-stone-400 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>{isUploadingLogo ? 'جاري الرفع...' : 'رفع لوجو جديد'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={isUploadingLogo}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'logo');
                  }}
                />
              </label>

              <input
                type="url"
                dir="ltr"
                placeholder="أو أدخل رابط اللوجو مباشرة: https://..."
                value={headerLogoUrl}
                onChange={(e) => setHeaderLogoUrl(e.target.value)}
                className="w-full flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-left bg-white dark:bg-stone-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Hero Presentation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <ImageIcon className="w-5 h-5 text-brass-500" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">2. واجهة البانر الرئيسي (Hero Presentation)</h2>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">نصوص وصورة الواجهة الأولى التي يستقبل بها المتجر زواره</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                النص الترويجي العلوي الصغير (Hero Eyebrow)
              </label>
              <input
                type="text"
                value={heroEyebrow}
                onChange={(e) => setHeroEyebrow(e.target.value)}
                placeholder="قطع ديكورية وهدايا مصنوعة يدوياً بمحبة ✨"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                العنوان الرئيسي (Hero Title) <span className="text-[10px] text-stone-400">(استخدم / لتقسيم السطرين)</span>
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="قطع مميزة لبيتك وهداياك / معمولـة بتركيز ودقة 🤍"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                الفقرة الوصفية الرئيسية (Hero Subtitle)
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="تصميمات مودرن وبسيطة تليق بأي مساحة في بيتك. كل قطعة بنفذها يدويًا باهتمام فائق بالتفاصيل..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            {/* Hero Banner Image */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  صورة البانر الاستعراضي (Hero Image)
                </label>
                {heroBannerUrl && (
                  <button
                    type="button"
                    onClick={() => setHeroBannerUrl('')}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إزالة واستعادة الافتراضية</span>
                  </button>
                )}
              </div>

              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shadow-xs my-1">
                <Image
                  src={heroBannerUrl || "https://images.unsplash.com/photo-1594913785162-e678a0c23ee9?auto=format&fit=crop&w=1000&q=80"}
                  alt="Hero Banner Preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-stone-400 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>{isUploadingBanner ? 'جاري الرفع...' : 'رفع صورة بانر'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={isUploadingBanner}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'banner');
                    }}
                  />
                </label>

                <input
                  type="url"
                  dir="ltr"
                  placeholder="أو أدخل رابط الصورة مباشرة: https://..."
                  value={heroBannerUrl}
                  onChange={(e) => setHeroBannerUrl(e.target.value)}
                  className="w-full flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-left bg-white dark:bg-stone-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Homepage Section Visibility Controls */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <LayoutTemplate className="w-5 h-5 text-brass-500" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">3. التحكم في ظهور أقسام الصفحة الرئيسية (Section Controls)</h2>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">تفعيل أو إخفاء أي قسم في الصفحة الرئيسية بضغطة زر واحدة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Toggle 1: Categories */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-white block">أقسام وتشكيلات المتجر</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">شبكة بطاقات الأقسام السريعة (صواني، مباخر، فازات...)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-3">
                <input
                  type="checkbox"
                  checked={sectionCategoriesEnabled}
                  onChange={(e) => setSectionCategoriesEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900 dark:peer-checked:bg-brass-500"></div>
              </label>
            </div>

            {/* Toggle 2: Featured */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-white block">القطع الأكثر تميزاً وإعجاباً</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">معرض المنتجات الأكثر طلباً في المتجر</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-3">
                <input
                  type="checkbox"
                  checked={sectionFeaturedEnabled}
                  onChange={(e) => setSectionFeaturedEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900 dark:peer-checked:bg-brass-500"></div>
              </label>
            </div>

            {/* Toggle 3: Seasonal */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-white block">ركن الموسم والأجواء الدافئة (رمضان)</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">قسم التشكيلة الرمضانية/الموسمية الخاصة</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-3">
                <input
                  type="checkbox"
                  checked={sectionSeasonalEnabled}
                  onChange={(e) => setSectionSeasonalEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900 dark:peer-checked:bg-brass-500"></div>
              </label>
            </div>

            {/* Toggle 4: Custom Request */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-white block">بطاقة الطلب الخاص وتنسيق الألوان</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">بطاقة التواصل السريع عبر واتساب للتفصيل والنقش</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-3">
                <input
                  type="checkbox"
                  checked={sectionCustomRequestEnabled}
                  onChange={(e) => setSectionCustomRequestEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900 dark:peer-checked:bg-brass-500"></div>
              </label>
            </div>

          </div>
        </div>

        {/* SECTION 4: Category Governance (حوكمة التصنيفات الأساسية) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-brass-500" />
              <div>
                <h2 className="text-sm font-bold text-stone-900 dark:text-white">4. حوكمة تصنيفات الكتالوج (Category Governance)</h2>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">تعديل الأسماء الظاهرة، الأوصاف، الشارات، الترتيب، وإمكانية إخفاء أي تصنيف من المتجر</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-sand-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border border-sand-200 dark:border-stone-700">
              7 تصنيفات ثابتة
            </span>
          </div>

          <div className="space-y-4">
            {categoriesConfig.map((cat, idx) => (
              <div 
                key={cat.key} 
                className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-3.5 transition-all hover:border-stone-300 dark:hover:border-stone-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon || '📦'}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-stone-200/70 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                      {cat.key}
                    </span>
                    <span className="text-xs font-black text-stone-900 dark:text-white mr-1">
                      {cat.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Toggle: Active in Store */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-stone-700 dark:text-stone-300">
                      <span>نشط بالمتجر</span>
                      <input
                        type="checkbox"
                        checked={cat.is_active !== false}
                        onChange={(e) => handleCategoryChange(cat.key, 'is_active', e.target.checked)}
                        className="rounded text-brass-600 focus:ring-brass-500 w-3.5 h-3.5"
                      />
                    </label>

                    {/* Toggle: Homepage Visible */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-stone-700 dark:text-stone-300">
                      <span>ظاهر بالرئيسية</span>
                      <input
                        type="checkbox"
                        checked={cat.homepage_visible !== false}
                        onChange={(e) => handleCategoryChange(cat.key, 'homepage_visible', e.target.checked)}
                        className="rounded text-brass-600 focus:ring-brass-500 w-3.5 h-3.5"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الاسم الظاهر للعميل
                    </label>
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) => handleCategoryChange(cat.key, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الشارة (Badge)
                    </label>
                    <input
                      type="text"
                      value={cat.badge || ''}
                      placeholder="جاهز للإهداء 🎁"
                      onChange={(e) => handleCategoryChange(cat.key, 'badge', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الأيقونة / إيموجي
                    </label>
                    <input
                      type="text"
                      value={cat.icon || ''}
                      placeholder="🎁"
                      onChange={(e) => handleCategoryChange(cat.key, 'icon', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-center bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      ترتيب العرض
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={cat.display_order ?? (idx + 1)}
                      onChange={(e) => handleCategoryChange(cat.key, 'display_order', Number(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-center font-mono bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الوصف التسويقي للقسم
                    </label>
                    <input
                      type="text"
                      value={cat.description || ''}
                      placeholder="مجموعات منسقة راقية للإهداء والتوزيعات..."
                      onChange={(e) => handleCategoryChange(cat.key, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: Collection Governance (حوكمة المجموعات الموسمية والتجميعات) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-brass-500" />
              <div>
                <h2 className="text-sm font-bold text-stone-900 dark:text-white">5. حوكمة المجموعات الموسمية (Collection Governance)</h2>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">إدارة مجموعات المناسبات والمواسم المستقلة (رمضان، الأعراس، التوزيعات...)</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingCollection(!isAddingCollection)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مجموعة جديدة</span>
            </button>
          </div>

          {/* Add New Collection Form */}
          {isAddingCollection && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 space-y-3">
              <h3 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brass-500" />
                <span>إضافة مجموعة موسمية أو تجميعية جديدة</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    رمز المجموعة (Collection Key - إنجليزي)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newCollectionKey}
                    onChange={(e) => setNewCollectionKey(e.target.value)}
                    placeholder="e.g. eid, summer"
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    الاسم بالعربي
                  </label>
                  <input
                    type="text"
                    value={newCollectionLabel}
                    onChange={(e) => setNewCollectionLabel(e.target.value)}
                    placeholder="تشكيلة العيد المبارك"
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    الشارة (Badge)
                  </label>
                  <input
                    type="text"
                    value={newCollectionBadge}
                    onChange={(e) => setNewCollectionBadge(e.target.value)}
                    placeholder="فرحة العيد 🌸"
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    الإيموجي
                  </label>
                  <input
                    type="text"
                    value={newCollectionIcon}
                    onChange={(e) => setNewCollectionIcon(e.target.value)}
                    placeholder="🌸"
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-center bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    الوصف
                  </label>
                  <input
                    type="text"
                    value={newCollectionDesc}
                    onChange={(e) => setNewCollectionDesc(e.target.value)}
                    placeholder="قطع ديكورية مميزة لعيد الفطر المبارك..."
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingCollection(false)}
                  className="px-3 py-1 rounded-xl text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddCollection}
                  className="px-4 py-1.5 rounded-xl bg-brass-600 hover:bg-brass-700 text-white text-xs font-bold transition-colors"
                >
                  حفظ المجموعة في القائمة
                </button>
              </div>
            </div>
          )}

          {/* Collections List */}
          <div className="space-y-4">
            {collectionsConfig.map((col, idx) => (
              <div 
                key={col.key} 
                className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{col.icon || '✨'}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-brass-300">
                      {col.key}
                    </span>
                    <span className="text-xs font-black text-stone-900 dark:text-white mr-1">
                      {col.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Toggle: Active */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-stone-700 dark:text-stone-300">
                      <span>نشط بالمتجر</span>
                      <input
                        type="checkbox"
                        checked={col.is_active !== false}
                        onChange={(e) => handleCollectionChange(col.key, 'is_active', e.target.checked)}
                        className="rounded text-brass-600 focus:ring-brass-500 w-3.5 h-3.5"
                      />
                    </label>

                    {/* Toggle: Homepage Visible */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-stone-700 dark:text-stone-300">
                      <span>ظاهر بالرئيسية</span>
                      <input
                        type="checkbox"
                        checked={col.homepage_visible !== false}
                        onChange={(e) => handleCollectionChange(col.key, 'homepage_visible', e.target.checked)}
                        className="rounded text-brass-600 focus:ring-brass-500 w-3.5 h-3.5"
                      />
                    </label>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCollection(col.key)}
                      className="p-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="حذف المجموعة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الاسم الظاهر
                    </label>
                    <input
                      type="text"
                      value={col.label}
                      onChange={(e) => handleCollectionChange(col.key, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الشارة (Badge)
                    </label>
                    <input
                      type="text"
                      value={col.badge || ''}
                      placeholder="الموسم والبركة 🌙"
                      onChange={(e) => handleCollectionChange(col.key, 'badge', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الإيموجي
                    </label>
                    <input
                      type="text"
                      value={col.icon || ''}
                      placeholder="🌙"
                      onChange={(e) => handleCollectionChange(col.key, 'icon', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-center bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      ترتيب العرض
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={col.display_order ?? (idx + 1)}
                      onChange={(e) => handleCollectionChange(col.key, 'display_order', Number(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-center font-mono bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <label className="block text-[10px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      الوصف
                    </label>
                    <input
                      type="text"
                      value={col.description || ''}
                      placeholder="مباخر وصواني ضيافة ولمسات رمضانية دافئة..."
                      onChange={(e) => handleCollectionChange(col.key, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: Commerce & Payments */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <Coins className="w-5 h-5 text-brass-500" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">6. بيانات الدفع والعربون (Commerce & Payments)</h2>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">حسابات تحويل العربون ونسبة السداد التي تظهر في صفحة السلة والدفع</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                رقم محفظة فودافون كاش (11 رقماً)
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={vodafoneCash}
                onChange={(e) => setVodafoneCash(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                معرف إنستاباي (InstaPay Address)
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={instapay}
                onChange={(e) => setInstapay(e.target.value)}
                placeholder="gogo.designs@instapay"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white text-left"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                نسبة العربون المطلوبة لتأكيد الطلب (%)
              </label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  min="10"
                  max="100"
                  step="5"
                  required
                  value={depositPercentage}
                  onChange={(e) => setDepositPercentage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-stone-400 font-bold">%</span>
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
                ⚠️ هذه النسبة تتحكم مباشرة في احتساب عربون الطلبات الجديدة في السلة، ولا تؤثر على الطلبات السابقة.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                نص تعليمات سداد العربون
              </label>
              <textarea
                rows={2}
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 7: Contact, Support & Shipping */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <Phone className="w-5 h-5 text-brass-500" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">7. التواصل والشحن (Support & Shipping)</h2>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">رقم الواتساب، قنوات التواصل، ومواعيد الشحن والتجهيز اليدوي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                رقم واتساب المتجر الرسمي (مع كود الدولة)
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="2010XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white text-left"
              />
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">تصل إليه رسائل استفسارات العملاء وروابط الطلبات.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                البريد الإلكتروني للدعم (اختياري)
              </label>
              <input
                type="email"
                dir="ltr"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@gogodesigns.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white text-left"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                رابط حساب إنستجرام الرسمي
              </label>
              <input
                type="url"
                dir="ltr"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/gogo_designs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white text-left"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                سياسة ومدة التنفيذ اليدوي والشحن
              </label>
              <textarea
                rows={2}
                value={shippingInstructions}
                onChange={(e) => setShippingInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 7: Promotional Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brass-500" />
              <div>
                <h2 className="text-sm font-bold text-stone-900 dark:text-white">7. العروض الترويجية (Promotions & Banners)</h2>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">بنر عرض عريض يظهر في منتصف الصفحة الرئيسية للمتجر</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700 dark:text-stone-300 bg-sand-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-sand-300 dark:border-stone-700">
              <input
                type="checkbox"
                checked={promoBannerActive}
                onChange={(e) => setPromoBannerActive(e.target.checked)}
                className="rounded text-brass-600 focus:ring-brass-500 w-4 h-4"
              />
              <span>تفعيل ظهور البنر</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                عنوان البنر الرئيسي
              </label>
              <input
                type="text"
                value={promoBannerTitle}
                onChange={(e) => setPromoBannerTitle(e.target.value)}
                placeholder="عرض الموسم ✨ خصم خاص لفترة محدودة"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                شارة البنر (Badge)
              </label>
              <input
                type="text"
                value={promoBannerBadge}
                onChange={(e) => setPromoBannerBadge(e.target.value)}
                placeholder="عرض خاص 🔥"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                رابط التوجيه عند الضغط
              </label>
              <input
                type="text"
                dir="ltr"
                value={promoBannerLink}
                onChange={(e) => setPromoBannerLink(e.target.value)}
                placeholder="/products?category=gift_sets"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono text-left focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  صورة البنر الترويجي (Banner Image)
                </label>
                {promoBannerImageUrl && (
                  <button
                    type="button"
                    onClick={() => setPromoBannerImageUrl('')}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إزالة الصورة</span>
                  </button>
                )}
              </div>

              {promoBannerImageUrl && (
                <div className="relative w-full aspect-[21/9] sm:aspect-[28/8] rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shadow-xs my-1">
                  <Image
                    src={promoBannerImageUrl}
                    alt="Promo Banner Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-stone-400 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>{isUploadingPromo ? 'جاري الرفع...' : 'رفع صورة للبنر'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={isUploadingPromo}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'promo');
                    }}
                  />
                </label>

                <input
                  type="url"
                  dir="ltr"
                  placeholder="أو أدخل رابط الصورة مباشرة: https://..."
                  value={promoBannerImageUrl}
                  onChange={(e) => setPromoBannerImageUrl(e.target.value)}
                  className="w-full flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-left bg-white dark:bg-stone-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8: Public Content & Policies (STEP 10I) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <BookOpen className="w-5 h-5 text-brass-500" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">8. المحتوى العام والسياسات الرسمية (Public Content & Policies)</h2>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">التحكم في نصوص صفحات من نحن، التواصل، الشحن، الشروط والأحكام، وسياسة الخصوصية</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 8.1 About Page */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <Sparkles className="w-4 h-4 text-brass-500" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">صفحة من نحن (About Us)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الشارة / النص الصغير (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={aboutEyebrow}
                    onChange={(e) => setAboutEyebrow(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    العنوان الرئيسي لصفحة من نحن
                  </label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    قصة البراند (Brand Story)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutStory}
                    onChange={(e) => setAboutStory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان فلسفة الحرفة
                  </label>
                  <input
                    type="text"
                    value={aboutCraftTitle}
                    onChange={(e) => setAboutCraftTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    تفاصيل فلسفة الحرفة والملمس والحماية
                  </label>
                  <textarea
                    rows={3}
                    value={aboutCraftText}
                    onChange={(e) => setAboutCraftText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 8.2 Contact Info */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <Phone className="w-4 h-4 text-brass-500" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">صفحة التواصل وساعات العمل (Contact Info)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الشارة (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={contactEyebrow}
                    onChange={(e) => setContactEyebrow(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان صفحة التواصل
                  </label>
                  <input
                    type="text"
                    value={contactTitle}
                    onChange={(e) => setContactTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الوصف الترحيبي للتواصل
                  </label>
                  <textarea
                    rows={2}
                    value={contactSubtitle}
                    onChange={(e) => setContactSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ساعات عمل خدمة العملاء
                  </label>
                  <input
                    type="text"
                    value={contactHours}
                    onChange={(e) => setContactHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    نطاق التغطية والشحن
                  </label>
                  <input
                    type="text"
                    value={contactCoverage}
                    onChange={(e) => setContactCoverage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 8.3 Shipping & Guarantee */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <Truck className="w-4 h-4 text-brass-500" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">سياسة الشحن وضمان الكسر (Shipping & Guarantee)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الشارة (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={shippingEyebrow}
                    onChange={(e) => setShippingEyebrow(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان صفحة الشحن
                  </label>
                  <input
                    type="text"
                    value={shippingTitle}
                    onChange={(e) => setShippingTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الوصف العام لسياسة الشحن
                  </label>
                  <textarea
                    rows={2}
                    value={shippingSubtitle}
                    onChange={(e) => setShippingSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    مدة التجهيز والصب اليدوي
                  </label>
                  <textarea
                    rows={2}
                    value={shippingPrepTime}
                    onChange={(e) => setShippingPrepTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    تفاصيل مدة الشحن حسب المحافظات
                  </label>
                  <textarea
                    rows={2}
                    value={shippingCoverageDetails}
                    onChange={(e) => setShippingCoverageDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    ضمان الوصول السليم وسياسة التلف
                  </label>
                  <textarea
                    rows={2}
                    value={shippingDamageGuarantee}
                    onChange={(e) => setShippingDamageGuarantee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 8.4 Terms & Conditions */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <FileText className="w-4 h-4 text-brass-500" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">الشروط والأحكام (Terms & Conditions)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان صفحة الشروط
                  </label>
                  <input
                    type="text"
                    value={termsTitle}
                    onChange={(e) => setTermsTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الوصف التمهيدي
                  </label>
                  <input
                    type="text"
                    value={termsSubtitle}
                    onChange={(e) => setTermsSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    طبيعة الصناعة اليدوية واختلاف التموجات
                  </label>
                  <textarea
                    rows={2}
                    value={termsCraftNature}
                    onChange={(e) => setTermsCraftNature(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    سياسة تأكيد العربون (50%)
                  </label>
                  <textarea
                    rows={2}
                    value={termsDepositPolicy}
                    onChange={(e) => setTermsDepositPolicy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    مهلة التعديل والإلغاء (12 ساعة)
                  </label>
                  <textarea
                    rows={2}
                    value={termsCancellationPolicy}
                    onChange={(e) => setTermsCancellationPolicy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    سياسة الطلبات المخصصة والمنقوشة
                  </label>
                  <textarea
                    rows={2}
                    value={termsCustomOrdersPolicy}
                    onChange={(e) => setTermsCustomOrdersPolicy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    معاينة الطرد عند الاستلام
                  </label>
                  <textarea
                    rows={2}
                    value={termsInspectionPolicy}
                    onChange={(e) => setTermsInspectionPolicy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 8.5 Privacy Policy */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                <ShieldCheck className="w-4 h-4 text-brass-500" />
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">سياسة الخصوصية وسرية البيانات (Privacy Policy)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عنوان صفحة الخصوصية
                  </label>
                  <input
                    type="text"
                    value={privacyTitle}
                    onChange={(e) => setPrivacyTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    الوصف التمهيدي للخصوصية
                  </label>
                  <input
                    type="text"
                    value={privacySubtitle}
                    onChange={(e) => setPrivacySubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    البيانات المجمعة
                  </label>
                  <textarea
                    rows={2}
                    value={privacyCollectedData}
                    onChange={(e) => setPrivacyCollectedData(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    أوجه استخدام البيانات
                  </label>
                  <textarea
                    rows={2}
                    value={privacyUsage}
                    onChange={(e) => setPrivacyUsage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    عدم مشاركة البيانات مع أطراف ثالثة
                  </label>
                  <textarea
                    rows={2}
                    value={privacyThirdParty}
                    onChange={(e) => setPrivacyThirdParty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    أمان وسرية إيصالات التحويل
                  </label>
                  <textarea
                    rows={2}
                    value={privacyReceiptsSecurity}
                    onChange={(e) => setPrivacyReceiptsSecurity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 9: SEO Defaults & Google Readiness (STEP 10J) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <Search className="w-5 h-5 text-brass-500" />
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">9. محركات البحث والنشر (SEO & Google Readiness)</h2>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">التحكم في عنوان ووصف المتجر وصورة المعاينة في جوجل وتطبيقات التواصل (OpenGraph & Twitter)</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  عنوان الصفحة الافتراضي (SEO Title)
                </label>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className={seoMetaTitle.length >= 40 && seoMetaTitle.length <= 60 ? 'text-emerald-600 font-bold' : 'text-stone-400'}>
                    {seoMetaTitle.length}/70 حرف
                  </span>
                  <span className="text-stone-400">(المثالي: 40–60)</span>
                </div>
              </div>
              <input
                type="text"
                maxLength={70}
                value={seoMetaTitle}
                onChange={(e) => setSeoMetaTitle(e.target.value)}
                placeholder="Gogo Designs | تحف وديكورات منزلية مصنوعة يدوياً بتركيز ودقة 🤍"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  الوصف التعريفي الافتراضي (SEO Meta Description)
                </label>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className={seoMetaDescription.length >= 120 && seoMetaDescription.length <= 160 ? 'text-emerald-600 font-bold' : 'text-stone-400'}>
                    {seoMetaDescription.length}/180 حرف
                  </span>
                  <span className="text-stone-400">(المثالي: 120–160)</span>
                </div>
              </div>
              <textarea
                rows={3}
                maxLength={180}
                value={seoMetaDescription}
                onChange={(e) => setSeoMetaDescription(e.target.value)}
                placeholder="متجر Gogo Designs للتحف والديكورات المنزلية وأطقم الهدايا المصبوبة يدوياً..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-stone-50/50 dark:bg-stone-800 dark:text-white"
              />
            </div>

            {/* Default OG Social Image */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    صورة المعاينة في شبكات التواصل (OpenGraph / Twitter Social Image)
                  </label>
                  <p className="text-[10px] text-stone-400 mt-0.5">الصورة الافتراضية التي تظهر عند مشاركة رابط المتجر عبر واتساب وفيسبوك وتويتر (المقاس المثالي: 1200x630)</p>
                </div>
                {seoOgImageUrl && (
                  <button
                    type="button"
                    onClick={() => setSeoOgImageUrl('')}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إزالة الصورة</span>
                  </button>
                )}
              </div>

              {seoOgImageUrl && (
                <div className="relative w-full aspect-[1200/630] max-h-48 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shadow-xs my-1">
                  <Image
                    src={seoOgImageUrl}
                    alt="SEO Social Share Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-stone-400 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>{isUploadingOg ? 'جاري الرفع...' : 'رفع صورة للمشاركة'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={isUploadingOg}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'og');
                    }}
                  />
                </label>

                <input
                  type="url"
                  dir="ltr"
                  placeholder="أو رابط الصورة مباشرة: https://..."
                  value={seoOgImageUrl}
                  onChange={(e) => setSeoOgImageUrl(e.target.value)}
                  className="w-full flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-left bg-white dark:bg-stone-800 dark:text-white"
                />
              </div>
            </div>

            {/* Live Search & Social Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Google SERP Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 dark:text-stone-400 pb-1 border-b border-stone-100 dark:border-stone-800">
                  <span>معاينة نتيجة البحث في جوجل (Google SERP)</span>
                </div>
                <div className="space-y-1 pt-1" dir="ltr">
                  <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                    <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[9px] font-bold">G</span>
                    <span className="font-sans text-[11px] truncate">https://gogodesigns.com</span>
                  </div>
                  <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 text-right" dir="rtl">
                    {seoMetaTitle || 'Gogo Designs | تحف وديكورات منزلية مصنوعة يدوياً'}
                  </div>
                  <div className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed text-right" dir="rtl">
                    {seoMetaDescription || 'متجر Gogo Designs للتحف والديكورات المنزلية وأطقم الهدايا المصبوبة يدوياً...'}
                  </div>
                </div>
              </div>

              {/* Social Share Card Preview */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 dark:text-stone-400 pb-1 border-b border-stone-100 dark:border-stone-800">
                  <span>معاينة كارت واتساب وفيسبوك (Social Card)</span>
                </div>
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-stone-50 dark:bg-stone-900">
                  <div className="relative w-full aspect-[1200/630] max-h-24 bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
                    {seoOgImageUrl ? (
                      <Image src={seoOgImageUrl} alt="Social Card" fill className="object-cover" />
                    ) : (
                      <span className="text-[10px] text-stone-400 font-bold">صورة الهيرو / البنر الافتراضي</span>
                    )}
                  </div>
                  <div className="p-2.5 space-y-0.5 text-right">
                    <div className="text-[10px] text-stone-400 uppercase font-mono tracking-wider">GOGODESIGNS.COM</div>
                    <div className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">
                      {seoMetaTitle || 'Gogo Designs'}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                      {seoMetaDescription || 'متجر التحف والديكورات المنزلية'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 10: Maintenance Mode */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <Hammer className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-white">10. الحالة التشغيلية ووضع الصيانة (Operations)</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-stone-900 dark:text-white">وضع الصيانة المؤقت</span>
                {maintenanceMode ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
                    <span>المتجر مغلق ومحمي أمام الزوار</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>المتجر مفتوح ومتاح للزوار</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                الضغط على المفتاح يقوم بالتحويل الفوري، ويمنع استقبال أي طلبات جديدة من واجهة المتجر أثناء الصيانة أو الإجازات.
              </p>
            </div>

            <button
              type="button"
              disabled={isTogglingMaintenance}
              onClick={handleToggleMaintenance}
              aria-label="تبديل وضع الصيانة"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                maintenanceMode ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  maintenanceMode ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button Sticky Bar */}
        <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-xl flex items-center justify-between gap-4">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            اضغط حفظ لتطبيق التحديثات لحظياً على واجهة المتجر وقاعدة البيانات
          </div>
          <Button
            type="submit"
            disabled={isSaving}
            isLoading={isSaving}
            variant="primary"
            size="lg"
            leftIcon={<Save className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
          >
            حفظ ونشر الإعدادات
          </Button>
        </div>

      </form>

    </div>
  );
}
