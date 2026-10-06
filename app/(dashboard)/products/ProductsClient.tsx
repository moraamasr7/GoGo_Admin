'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  Package, 
  Eye, 
  EyeOff,
  Sparkles,
  Palette,
  Tag,
  Layers,
  DollarSign,
  FileText
} from 'lucide-react';
import { Product, CategoryKey } from '@/types/database';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<CategoryKey>('trays');
  const [collection, setCollection] = useState<string>('');
  const [isUnfinished, setIsUnfinished] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(300);
  const [stock, setStock] = useState<number>(10);
  const [descriptionAr, setDescriptionAr] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  // Personalization fields
  const [allowPersonalization, setAllowPersonalization] = useState<boolean>(false);
  const [personalizationLabel, setPersonalizationLabel] = useState<string>('');
  const [personalizationMaxChars, setPersonalizationMaxChars] = useState<number>(50);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    action: 'toggle' | 'delete';
  }>({ isOpen: false, product: null, action: 'toggle' });

  const openCreateModal = () => {
    setEditingProduct(null);
    setNameAr('');
    setNameEn('');
    setSlug('');
    setCategory('trays');
    setCollection('');
    setIsUnfinished(false);
    setPrice(300);
    setStock(10);
    setDescriptionAr('');
    setDimensions('');
    setImageUrl('');
    setAllowPersonalization(false);
    setPersonalizationLabel('');
    setPersonalizationMaxChars(50);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setNameAr(p.name_ar);
    setNameEn(p.name_en || '');
    setSlug(p.slug);
    setCategory(p.category);
    setCollection(p.collection || '');
    setIsUnfinished(Boolean(p.is_unfinished));
    setPrice(Number(p.price));
    setStock(p.stock);
    setDescriptionAr(p.description_ar || '');
    setDimensions(p.dimensions || '');
    setImageUrl(p.image_url || '');
    setAllowPersonalization(p.allow_personalization ?? false);
    setPersonalizationLabel(p.personalization_label || '');
    setPersonalizationMaxChars(p.personalization_max_chars ?? 50);
    setIsModalOpen(true);
  };

  // Upload image to public product-images bucket
  const handleImageUpload = async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('صيغة الصورة يجب أن تكون JPG أو PNG أو WEBP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب ألا يتجاوز 5 ميجابايت');
      return;
    }

    setImageUploading(true);
    try {
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(path, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      setImageUrl(publicUrlData.publicUrl);
      toast.success('تم رفع الصورة بنجاح');
    } catch (err: any) {
      toast.error(err.message || 'فشل رفع الصورة');
    } finally {
      setImageUploading(false);
    }
  };

  // Auto-generate slug from name if empty
  const handleNameChange = (val: string) => {
    setNameAr(val);
    if (!editingProduct && !slug) {
      const generated = val.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0621-\u064A-]+/g, '');
      setSlug(generated || `product-${Date.now().toString().slice(-4)}`);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !slug.trim()) {
      toast.error('اسم المنتج والـ Slug مطلوبان');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name_ar: nameAr.trim(),
        name_en: nameEn.trim() || null,
        slug: slug.trim().toLowerCase(),
        category,
        collection: collection.trim() || null,
        is_unfinished: Boolean(isUnfinished),
        price: Number(price),
        stock: Number(stock),
        description_ar: descriptionAr.trim() || null,
        dimensions: dimensions.trim() || null,
        image_url: imageUrl || null,
        allow_personalization: Boolean(allowPersonalization),
        personalization_label: personalizationLabel.trim() || null,
        personalization_max_chars: Math.max(1, Number(personalizationMaxChars) || 50),
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        // Update
        const { data, error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (error) throw error;

        setProducts(prev => prev.map(p => p.id === editingProduct.id ? (data as Product) : p));
        toast.success('تم تحديث بيانات المنتج بنجاح');
      } else {
        // Create
        const { data, error } = await supabase
          .from('products')
          .insert({
            ...payload,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;

        setProducts(prev => [data as Product, ...prev]);
        toast.success('تمت إضافة المنتج الجديد بنجاح');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'فشل حفظ المنتج');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle active / soft delete
  const executeConfirmAction = async () => {
    if (!confirmModal.product) return;
    const p = confirmModal.product;
    const newStatus = !p.is_active;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', p.id);

      if (error) throw error;

      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_active: newStatus } : item));
      toast.success(newStatus ? 'تم تفعيل المنتج وظهوره بالمتجر' : 'تم إيقاف ظهور المنتج في المتجر');
    } catch (err: any) {
      toast.error(err.message || 'فشل تعديل حالة المنتج');
    } finally {
      setConfirmModal({ isOpen: false, product: null, action: 'toggle' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            إدارة المنتجات والقطع
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            إضافة وتعديل التصنيفات والمجموعات والأسعار والمخزون
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4 text-brass-400 dark:text-stone-950" />}
          className="self-start sm:self-auto"
        >
          إضافة قطعة جديدة
        </Button>
      </div>

      {/* Products Content: Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-stone-900 dark:text-white">لا توجد منتجات مسجلة بعد</p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">اضغط على زر "إضافة قطعة جديدة" لإضافة أول منتج</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< md) */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-sand-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name_ar}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                        صورة
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-stone-900 dark:text-white text-sm truncate">{product.name_ar}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-bold text-xs text-stone-900 dark:text-brass-400">{formatPrice(product.price)}</span>
                      <span className="text-[10px] text-stone-400">•</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        product.stock <= 3
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        مخزون: {product.stock}
                      </span>
                    </div>
                  </div>

                  <div>
                    {product.is_active ? (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" title="نشط" />
                    ) : (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-600" title="معطل" />
                    )}
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sand-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                    {getCategoryLabel(product.category)}
                  </span>

                  {product.collection && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {product.collection === 'ramadan' ? '🌙 رمضان' : product.collection}
                    </span>
                  )}

                  {product.is_unfinished && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600">
                      بدون فنش
                    </span>
                  )}

                  {product.allow_personalization && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-brass-700 dark:text-brass-400 bg-sand-100 dark:bg-stone-800 border border-sand-300 dark:border-stone-700">
                      تخصيص
                    </span>
                  )}
                </div>

                {/* Mobile action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    onClick={() => openEditModal(product)}
                    variant="secondary"
                    size="sm"
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                    className="flex-1"
                  >
                    تعديل
                  </Button>

                  <Button
                    onClick={() => setConfirmModal({ isOpen: true, product, action: 'toggle' })}
                    variant={product.is_active ? 'outline' : 'secondary'}
                    size="sm"
                    leftIcon={product.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  >
                    {product.is_active ? 'إخفاء' : 'تفعيل'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop & Tablet Table (>= md) */}
          <div className="hidden md:block bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-stone-50/80 dark:bg-stone-800/50 text-stone-400 dark:text-stone-400 border-b border-stone-100 dark:border-stone-800 font-semibold">
                    <th className="py-3.5 pr-6">الصورة</th>
                    <th className="py-3.5 px-4">اسم القطعة</th>
                    <th className="py-3.5 px-4">الفئة والخصائص</th>
                    <th className="py-3.5 px-4">السعر</th>
                    <th className="py-3.5 px-4">المخزون</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 pl-6 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 pr-6">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-sand-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name_ar}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                              صورة
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 dark:text-white text-sm">{product.name_ar}</div>
                        {product.dimensions && (
                          <div className="text-[11px] text-stone-400 dark:text-stone-500" dir="ltr">{product.dimensions}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                            product.category === 'gift_sets'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                              : product.category === 'ready_sets'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                              : 'bg-sand-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                          }`}>
                            {getCategoryLabel(product.category)}
                          </span>

                          {product.collection && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              <Tag className="w-2.5 h-2.5" />
                              <span>{product.collection === 'ramadan' ? '🌙 رمضان' : product.collection}</span>
                            </span>
                          )}

                          {product.is_unfinished && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-600">
                              <Palette className="w-2.5 h-2.5 text-stone-600 dark:text-stone-400" />
                              <span>بدون فنش</span>
                            </span>
                          )}

                          {product.allow_personalization && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-brass-700 dark:text-brass-400 bg-sand-100 dark:bg-stone-800 border border-sand-300 dark:border-stone-700 px-1.5 py-0.5 rounded-md">
                              <Sparkles className="w-2.5 h-2.5 text-brass-600 dark:text-brass-400" />
                              <span>تخصيص</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-white">
                        {formatPrice(product.price)}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-block font-mono font-bold px-2.5 py-1 rounded-xl text-[11px] border ${
                          product.stock <= 3 
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' 
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                        }`}>
                          {product.stock} قطعة
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {product.is_active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            نشط ومعروض
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                            معطل (مخفي)
                          </span>
                        )}
                      </td>

                      <td className="py-3 pl-6 text-left whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => openEditModal(product)}
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit className="w-3.5 h-3.5" />}
                          >
                            تعديل
                          </Button>

                          <Button
                            onClick={() => setConfirmModal({ isOpen: true, product, action: 'toggle' })}
                            variant={product.is_active ? 'outline' : 'secondary'}
                            size="sm"
                            leftIcon={product.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          >
                            {product.is_active ? 'إخفاء' : 'تفعيل'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Product Modal with 6 Grouped Sections & Sticky Header/Footer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative max-w-2xl w-full bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-100 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brass-500/10 text-brass-600 dark:text-brass-400 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">
                  {editingProduct ? 'تعديل قطعة الديكور' : 'إضافة قطعة ديكور جديدة'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-800 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="product-form" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* SECTION 1: Basic Product Information */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                  <FileText className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">1. البيانات الأساسية والتعريف</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      اسم المنتج (بالعربي) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="مثال: صينية بيضاوية ماربل"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      الاسم بالإنجليزية (اختياري)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="Oval Marble Tray"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white text-left"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      رابط المعرّف (Slug) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="oval-marble-tray"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white text-left"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      الوصف والتفاصيل اليدوية
                    </label>
                    <textarea
                      rows={2}
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      placeholder="صينية ديكورية بيضاوية متعددة الاستخدامات، مصبوبة يدوياً..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Commercial Pricing & Inventory */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                  <DollarSign className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">2. السعر والمخزون</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      السعر (ج.م) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      الكمية بالمخزون <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Catalog & Architecture */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                  <Layers className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">3. التصنيف والمجموعات</h4>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      الفئة الأساسية <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryKey)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                    >
                      <option value="trays">صواني ديكورية</option>
                      <option value="coasters">قواعد أكواب (Coasters)</option>
                      <option value="planters">أحواض نباتات وزريعة</option>
                      <option value="candle_holders">شمعدانات ومباخر</option>
                      <option value="decor">ديكور وتحف وفازات</option>
                      <option value="gift_sets">أطقم هدايا 🎁</option>
                      <option value="ready_sets">أطقم ديكورات جاهزة 🤎</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                        المجموعة / الموسم (Collection)
                      </label>
                      {collection && (
                        <button
                          type="button"
                          onClick={() => setCollection('')}
                          className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          مسح
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                      placeholder="مثال: ramadan أو wedding أو اتركها فارغة"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white mb-1.5"
                    />
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { key: 'ramadan', label: '🌙 رمضان' },
                        { key: 'wedding', label: '💍 زفاف' },
                        { key: 'giveaways', label: '🎁 توزيعات' },
                        { key: 'illuminated', label: '💡 مضيئة' },
                        { key: 'resin', label: '✨ ريزن' },
                      ].map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => setCollection(preset.key)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                            collection === preset.key
                              ? 'bg-stone-900 text-white dark:bg-brass-500 dark:text-stone-950 border-stone-900 dark:border-brass-500 font-bold'
                              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* is_unfinished Checkbox */}
                  <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900 dark:text-white block">
                        قطعة بدون فنش / للتلوين والإبداع 🎨
                      </span>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500">
                        قطعة مصبوبة سادة مجهزة للعميل ليلونها بنفسه
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-3">
                      <input
                        type="checkbox"
                        checked={isUnfinished}
                        onChange={(e) => setIsUnfinished(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900 dark:peer-checked:bg-brass-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Personalization */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brass-600 dark:text-brass-400" />
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">4. النقش والتخصيص</h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPersonalization}
                      onChange={(e) => setAllowPersonalization(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900 dark:peer-checked:bg-brass-500"></div>
                  </label>
                </div>

                {allowPersonalization && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        نص إرشاد العميل (Label)
                      </label>
                      <input
                        type="text"
                        value={personalizationLabel}
                        onChange={(e) => setPersonalizationLabel(e.target.value)}
                        placeholder="مثال: اكتب الاسم أو العبارة المطلوبة"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                        الحد الأقصى للأحرف
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={personalizationMaxChars}
                        onChange={(e) => setPersonalizationMaxChars(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 5: Specifications */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">5. الأبعاد والمواصفات</h4>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="مثال: 18سم × 9.5سم × 1.5سم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-stone-900 dark:focus:ring-brass-400 bg-white dark:bg-stone-800 dark:text-white"
                />
              </div>

              {/* SECTION 6: Media & Image */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">6. صورة المنتج</h4>

                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0">
                      <Image
                        src={imageUrl}
                        alt="معاينة الصورة"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="block w-full text-xs text-stone-500 file:mr-0 file:ml-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-900 dark:file:bg-brass-500 file:text-white dark:file:text-stone-950 hover:file:bg-stone-800 cursor-pointer"
                    />
                    {imageUploading && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">جاري رفع الصورة إلى التخزين السحابي...</p>
                    )}
                  </div>
                </div>

                <input
                  type="url"
                  dir="ltr"
                  placeholder="أو أدخل رابط الصورة مباشرة: https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-left bg-white dark:bg-stone-800 dark:text-white"
                />
              </div>

            </form>

            {/* Sticky Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur flex justify-end gap-2.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                form="product-form"
                disabled={isSaving || imageUploading}
                isLoading={isSaving}
                variant="primary"
                size="sm"
              >
                {editingProduct ? 'تحديث القطعة' : 'إضافة القطعة'}
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Modal for Toggle / Soft Delete */}
      {confirmModal.isOpen && confirmModal.product && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-base text-stone-900 dark:text-white mb-2">
              {confirmModal.product.is_active ? 'إخفاء المنتج من المتجر؟' : 'إعادة تفعيل المنتج؟'}
            </h3>

            <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
              {confirmModal.product.is_active
                ? `سيتم إخفاء "${confirmModal.product.name_ar}" من واجهة العميل مع الحفاظ على كافة بيانات الطلبات التاريخية المرتبطة به.`
                : `سيتم إظهار "${confirmModal.product.name_ar}" فوراً لعملاء المتجر للشراء.`}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmModal({ isOpen: false, product: null, action: 'toggle' })}
                className="flex-1"
              >
                تراجع
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={executeConfirmAction}
                className="flex-1"
              >
                تأكيد
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
