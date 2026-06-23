'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLang } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Brand, Category, Product, StockStatus } from '@/types/database'

const STOCK_STATUSES: StockStatus[] = ['in_stock', 'out_of_stock', 'limited_stock']

export default function EditProductPage() {
  const { isAr } = useLang()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [form, setForm] = useState({
    product_code: '', name: '', name_ar: '', slug: '', brand_id: '', category_id: '',
    description: '', usage: '', dilution: '', packing: '',
    price: '', stock_status: 'in_stock' as StockStatus,
    moq: '1', barcode: '', image_url: '', is_featured: false, is_active: true,
  })

  useEffect(() => {
    const load = async () => {
      const [b, c, p] = await Promise.all([
        supabase.from('brands').select('*').order('name'),
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').eq('id', id).single(),
      ])
      setBrands(b.data ?? [])
      setCategories(c.data ?? [])
      if (p.data) {
        const pr = p.data as Product
        setForm({
          product_code: pr.product_code ?? '',
          name: pr.name,
          name_ar: pr.name_ar ?? '',
          slug: pr.slug ?? '',
          brand_id: pr.brand_id ?? '',
          category_id: pr.category_id ?? '',
          description: pr.description ?? '',
          usage: pr.usage ?? '',
          dilution: pr.dilution ?? '',
          packing: pr.packing ?? '',
          price: pr.price?.toString() ?? '',
          stock_status: pr.stock_status,
          moq: pr.moq?.toString() ?? '1',
          barcode: pr.barcode ?? '',
          image_url: pr.image_url ?? '',
          is_featured: pr.is_featured,
          is_active: pr.is_active,
        })
      }
      setFetching(false)
    }
    load()
  }, [id])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('products').update({
        product_code: form.product_code || null,
        name: form.name,
        name_ar: form.name_ar || null,
        slug: form.slug,
        brand_id: form.brand_id || null,
        category_id: form.category_id || null,
        description: form.description || null,
        usage: form.usage || null,
        dilution: form.dilution || null,
        packing: form.packing || null,
        price: form.price ? parseFloat(form.price) : null,
        stock_status: form.stock_status,
        moq: form.moq ? parseInt(form.moq) : 1,
        barcode: form.barcode || null,
        image_url: form.image_url || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
      }).eq('id', id)
      if (error) throw error
      toast.success(isAr ? 'تم تحديث المنتج' : 'Product updated')
      router.push('/admin/products')
    } catch {
      toast.error(isAr ? 'فشل التحديث' : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="p-6 text-gray-500">Loading...</div>

  return (
    <div className="p-6 max-w-3xl" dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isAr ? 'تعديل المنتج' : 'Edit Product'}</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Code</Label>
                <Input value={form.product_code} onChange={set('product_code')} />
              </div>
              <div className="space-y-1.5">
                <Label>Barcode</Label>
                <Input value={form.barcode} onChange={set('barcode')} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={set('name')} required />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>الاسم عربي</Label>
                <Input value={form.name_ar} onChange={set('name_ar')} dir="rtl" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={set('slug')} required />
              </div>
              <div className="space-y-1.5">
                <Label>Brand</Label>
                <Select value={form.brand_id} onValueChange={(v) => setForm((p) => ({ ...p, brand_id: v ?? '' }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm((p) => ({ ...p, category_id: v ?? '' }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Price (SAR)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={set('price')} />
              </div>
              <div className="space-y-1.5">
                <Label>MOQ</Label>
                <Input type="number" min="1" value={form.moq} onChange={set('moq')} />
              </div>
              <div className="space-y-1.5">
                <Label>Packing</Label>
                <Input value={form.packing} onChange={set('packing')} />
              </div>
              <div className="space-y-1.5">
                <Label>Dilution</Label>
                <Input value={form.dilution} onChange={set('dilution')} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Stock Status</Label>
                <Select value={form.stock_status} onValueChange={(v) => setForm((p) => ({ ...p, stock_status: (v ?? 'in_stock') as StockStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STOCK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={set('image_url')} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Description</Label>
                <textarea value={form.description} onChange={set('description')} rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Usage</Label>
                <textarea value={form.usage} onChange={set('usage')} rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_featured" checked={form.is_featured}
                  onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))} className="rounded" />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded" />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-red-700 hover:bg-red-800 text-white">
                {loading ? 'Saving...' : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
