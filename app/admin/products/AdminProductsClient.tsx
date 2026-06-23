'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StockStatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { useLang } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Brand, Category, Product } from '@/types/database'

interface AdminProductsClientProps {
  products: (Product & { brand: Brand | null; category: Category | null })[]
}

export default function AdminProductsClient({ products: initialProducts }: AdminProductsClientProps) {
  const { lang, isAr } = useLang()
  const supabase = createClient()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (p.name_ar ?? '').toLowerCase().includes(q) ||
      (p.product_code ?? '').toLowerCase().includes(q)
    )
  })

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', id)
    if (error) {
      toast.error(isAr ? 'ÙØ´Ù„ Ø§Ù„ØªØ­Ø¯ÙŠØ«' : 'Update failed')
    } else {
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p))
    }
  }

  return (
    <div className="p-6 max-w-7xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª' : 'Products'}</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} {isAr ? 'Ù…Ù†ØªØ¬' : 'products'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isAr ? 'Ø¨Ø­Ø«...' : 'Search...'}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 w-48"
            />
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-red-700 hover:bg-red-800 text-white gap-2">
              <Plus className="h-4 w-4" />
              {isAr ? 'Ø¥Ø¶Ø§ÙØ© Ù…Ù†ØªØ¬' : 'Add Product'}
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isAr ? 'Ø§Ù„ØµÙˆØ±Ø©' : 'Image'}</TableHead>
                <TableHead>{isAr ? 'Ø§Ù„ÙƒÙˆØ¯' : 'Code'}</TableHead>
                <TableHead>{isAr ? 'Ø§Ù„Ø§Ø³Ù…' : 'Name'}</TableHead>
                <TableHead>{isAr ? 'Ø§Ù„Ù…Ø§Ø±ÙƒØ©' : 'Brand'}</TableHead>
                <TableHead>{isAr ? 'Ø§Ù„ÙØ¦Ø©' : 'Category'}</TableHead>
                <TableHead className="text-right">{isAr ? 'Ø§Ù„Ø³Ø¹Ø±' : 'Price'}</TableHead>
                <TableHead>{isAr ? 'Ø§Ù„Ù…Ø®Ø²ÙˆÙ†' : 'Stock'}</TableHead>
                <TableHead>{isAr ? 'Ù†Ø´Ø·' : 'Active'}</TableHead>
                <TableHead>{isAr ? 'ØªØ¹Ø¯ÙŠÙ„' : 'Edit'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-gray-50 rounded-lg relative overflow-hidden border border-gray-100">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill className="object-contain p-1" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-lg">ðŸ§´</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.product_code ?? '-'}</TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{product.name}</p>
                    {product.name_ar && <p className="text-xs text-gray-400" dir="rtl">{product.name_ar}</p>}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{product.brand?.name ?? '-'}</TableCell>
                  <TableCell className="text-sm text-gray-500">{product.category?.name ?? '-'}</TableCell>
                  <TableCell className="text-right text-sm font-semibold">
                    {product.price ? `${product.price.toFixed(2)} SAR` : '-'}
                  </TableCell>
                  <TableCell><StockStatusBadge status={product.stock_status} isAr={isAr} /></TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(product.id, product.is_active)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        product.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        product.is_active ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
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

