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
import type { Category } from '@/types/database'

interface AdminCategoriesClientProps {
  categories: Category[]
}

interface EditingCategory {
  id: string
  name: string
  name_ar: string
  slug: string
}

export default function AdminCategoriesClient({ categories: initialCategories }: AdminCategoriesClientProps) {
  const { isAr } = useLang()
  const supabase = createClient()

  const [categories, setCategories] = useState(initialCategories)
  const [editing, setEditing] = useState<EditingCategory | null>(null)
  const [adding, setAdding] = useState(false)
  const [newCat, setNewCat] = useState({ name: '', name_ar: '', slug: '' })

  const handleToggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('categories').update({ is_active: !current }).eq('id', id)
    if (error) { toast.error('Update failed'); return }
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, is_active: !current } : c))
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    const { error } = await supabase.from('categories')
      .update({ name: editing.name, name_ar: editing.name_ar || null, slug: editing.slug })
      .eq('id', editing.id)
    if (error) { toast.error('Update failed'); return }
    setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...editing } : c))
    setEditing(null)
    toast.success('Category updated')
  }

  const handleAdd = async () => {
    if (!newCat.name || !newCat.slug) { toast.error('Name and slug required'); return }
    const { data, error } = await supabase.from('categories')
      .insert({ name: newCat.name, name_ar: newCat.name_ar || null, slug: newCat.slug, is_active: true })
      .select().single()
    if (error || !data) { toast.error('Failed'); return }
    setCategories((prev) => [...prev, data])
    setNewCat({ name: '', name_ar: '', slug: '' })
    setAdding(false)
    toast.success('Category added')
  }

  return (
    <div className="p-6 max-w-4xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'الفئات' : 'Categories'}</h1>
        <Button onClick={() => setAdding(true)} className="bg-red-700 hover:bg-red-800 text-white gap-2">
          <Plus className="h-4 w-4" />
          {isAr ? 'إضافة فئة' : 'Add Category'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Arabic</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adding && (
                <TableRow>
                  <TableCell><Input value={newCat.name} onChange={(e) => setNewCat((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className="h-8" /></TableCell>
                  <TableCell><Input value={newCat.name_ar} onChange={(e) => setNewCat((p) => ({ ...p, name_ar: e.target.value }))} dir="rtl" placeholder="اسم" className="h-8" /></TableCell>
                  <TableCell><Input value={newCat.slug} onChange={(e) => setNewCat((p) => ({ ...p, slug: e.target.value }))} placeholder="slug" className="h-8" /></TableCell>
                  <TableCell />
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"><Save className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setAdding(false)} className="h-8 w-8 p-0"><X className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {editing?.id === cat.id ? (
                      <Input value={editing.name} onChange={(e) => setEditing((p) => p ? { ...p, name: e.target.value } : p)} className="h-8" />
                    ) : <span className="font-medium">{cat.name}</span>}
                  </TableCell>
                  <TableCell>
                    {editing?.id === cat.id ? (
                      <Input value={editing.name_ar} onChange={(e) => setEditing((p) => p ? { ...p, name_ar: e.target.value } : p)} dir="rtl" className="h-8" />
                    ) : <span dir="rtl">{cat.name_ar ?? '-'}</span>}
                  </TableCell>
                  <TableCell>
                    {editing?.id === cat.id ? (
                      <Input value={editing.slug} onChange={(e) => setEditing((p) => p ? { ...p, slug: e.target.value } : p)} className="h-8" />
                    ) : <span className="font-mono text-xs text-gray-500">{cat.slug}</span>}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => handleToggleActive(cat.id, cat.is_active)}>
                      <Badge className={cat.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'} variant="outline">
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {editing?.id === cat.id ? (
                        <>
                          <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"><Save className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(null)} className="h-8 w-8 p-0"><X className="h-3.5 w-3.5" /></Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditing({ id: cat.id, name: cat.name, name_ar: cat.name_ar ?? '', slug: cat.slug ?? '' })} className="h-8 w-8 p-0">
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
