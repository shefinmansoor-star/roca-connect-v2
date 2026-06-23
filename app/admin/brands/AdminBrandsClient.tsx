'use client'

import { useState } from 'react'
import { Plus, Pencil, Save, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useLang } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Brand } from '@/types/database'

interface AdminBrandsClientProps {
  brands: Brand[]
}

interface EditingBrand {
  id: string
  name: string
  name_ar: string
  slug: string
}

export default function AdminBrandsClient({ brands: initialBrands }: AdminBrandsClientProps) {
  const { isAr } = useLang()
  const supabase = createClient()

  const [brands, setBrands] = useState(initialBrands)
  const [editing, setEditing] = useState<EditingBrand | null>(null)
  const [adding, setAdding] = useState(false)
  const [newBrand, setNewBrand] = useState({ name: '', name_ar: '', slug: '' })

  const handleToggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('brands').update({ is_active: !current }).eq('id', id)
    if (error) { toast.error('Update failed'); return }
    setBrands((prev) => prev.map((b) => b.id === id ? { ...b, is_active: !current } : b))
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    const { error } = await supabase.from('brands')
      .update({ name: editing.name, name_ar: editing.name_ar || null, slug: editing.slug })
      .eq('id', editing.id)
    if (error) { toast.error('Update failed'); return }
    setBrands((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...editing } : b))
    setEditing(null)
    toast.success('Brand updated')
  }

  const handleAddBrand = async () => {
    if (!newBrand.name || !newBrand.slug) { toast.error('Name and slug are required'); return }
    const { data, error } = await supabase.from('brands')
      .insert({ name: newBrand.name, name_ar: newBrand.name_ar || null, slug: newBrand.slug, is_active: true })
      .select().single()
    if (error || !data) { toast.error('Failed to add'); return }
    setBrands((prev) => [...prev, data])
    setNewBrand({ name: '', name_ar: '', slug: '' })
    setAdding(false)
    toast.success('Brand added')
  }

  return (
    <div className="p-6 max-w-4xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'الماركات' : 'Brands'}</h1>
        <Button onClick={() => setAdding(true)} className="bg-red-700 hover:bg-red-800 text-white gap-2">
          <Plus className="h-4 w-4" />
          {isAr ? 'إضافة ماركة' : 'Add Brand'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Arabic Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Add Row */}
              {adding && (
                <TableRow>
                  <TableCell>
                    <Input value={newBrand.name} onChange={(e) => setNewBrand((p) => ({ ...p, name: e.target.value }))} placeholder="Brand name" className="h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value={newBrand.name_ar} onChange={(e) => setNewBrand((p) => ({ ...p, name_ar: e.target.value }))} placeholder="اسم عربي" dir="rtl" className="h-8" />
                  </TableCell>
                  <TableCell>
                    <Input value={newBrand.slug} onChange={(e) => setNewBrand((p) => ({ ...p, slug: e.target.value }))} placeholder="brand-slug" className="h-8" />
                  </TableCell>
                  <TableCell />
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleAddBrand} className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"><Save className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setAdding(false)} className="h-8 w-8 p-0"><X className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    {editing?.id === brand.id ? (
                      <Input value={editing.name} onChange={(e) => setEditing((p) => p ? { ...p, name: e.target.value } : p)} className="h-8" />
                    ) : (
                      <span className="font-medium">{brand.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === brand.id ? (
                      <Input value={editing.name_ar} onChange={(e) => setEditing((p) => p ? { ...p, name_ar: e.target.value } : p)} dir="rtl" className="h-8" />
                    ) : (
                      <span dir="rtl">{brand.name_ar ?? '-'}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editing?.id === brand.id ? (
                      <Input value={editing.slug} onChange={(e) => setEditing((p) => p ? { ...p, slug: e.target.value } : p)} className="h-8" />
                    ) : (
                      <span className="font-mono text-xs text-gray-500">{brand.slug}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => handleToggleActive(brand.id, brand.is_active)}>
                      <Badge className={brand.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} variant="outline">
                        {brand.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {editing?.id === brand.id ? (
                        <>
                          <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"><Save className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(null)} className="h-8 w-8 p-0"><X className="h-3.5 w-3.5" /></Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditing({ id: brand.id, name: brand.name, name_ar: brand.name_ar ?? '', slug: brand.slug ?? '' })} className="h-8 w-8 p-0">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
