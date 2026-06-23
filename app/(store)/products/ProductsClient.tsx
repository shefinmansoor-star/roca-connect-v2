'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StaggerGrid, StaggerItem } from '@/components/ui/AnimateIn'
import { StockStatusBadge } from '@/components/ui/StatusBadge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Brand, Category, Product } from '@/types/database'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface ProductsClientProps {
  products: (Product & { brand: Brand | null; category: Category | null })[]
  brands: Brand[]
  categories: Category[]
  totalCount: number
  page: number
  pageSize: number
  filters: { search: string; brandSlug: string; categorySlug: string; featured: boolean }
}

export default function ProductsClient({
  products,
  brands,
  categories,
  totalCount,
  page,
  pageSize,
  filters,
}: ProductsClientProps) {
  const { lang, isAr } = useLang()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search)

  const totalPages = Math.ceil(totalCount / pageSize)

  const buildUrl = (overrides: Partial<typeof filters> & { page?: number }) => {
    const params = new URLSearchParams()
    const merged = { ...filters, page, ...overrides }
    if (merged.search) params.set('search', merged.search)
    if (merged.brandSlug) params.set('brand', merged.brandSlug)
    if (merged.categorySlug) params.set('category', merged.categorySlug)
    if (merged.featured) params.set('featured', 'true')
    if ((overrides.page ?? page) > 1) params.set('page', String(overrides.page ?? page))
    return `/products?${params.toString()}`
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(buildUrl({ search: searchInput, page: 1 }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className={`w-56 shrink-0 hidden lg:block`}>
          <div className="sticky top-24 space-y-6">
            {/* Brands Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                {t(lang, 'filter.brands')}
              </h3>
              <div className="space-y-2">
                <Link
                  href={buildUrl({ brandSlug: '', page: 1 })}
                  className={`block text-sm px-2 py-1 rounded transition-colors ${
                    !filters.brandSlug ? 'text-red-700 font-semibold bg-red-50' : 'text-gray-600 hover:text-red-700'
                  }`}
                >
                  {t(lang, 'filter.all')}
                </Link>
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={buildUrl({ brandSlug: brand.slug ?? '', page: 1 })}
                    className={`flex items-center gap-2 text-sm px-2 py-1 rounded transition-colors ${
                      filters.brandSlug === brand.slug
                        ? 'text-red-700 font-semibold bg-red-50'
                        : 'text-gray-600 hover:text-red-700'
                    }`}
                  >
                    {isAr && brand.name_ar ? brand.name_ar : brand.name}
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            {/* Categories Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                {t(lang, 'filter.categories')}
              </h3>
              <div className="space-y-2">
                <Link
                  href={buildUrl({ categorySlug: '', page: 1 })}
                  className={`block text-sm px-2 py-1 rounded transition-colors ${
                    !filters.categorySlug ? 'text-red-700 font-semibold bg-red-50' : 'text-gray-600 hover:text-red-700'
                  }`}
                >
                  {t(lang, 'filter.all')}
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={buildUrl({ categorySlug: cat.slug ?? '', page: 1 })}
                    className={`block text-sm px-2 py-1 rounded transition-colors ${
                      filters.categorySlug === cat.slug
                        ? 'text-red-700 font-semibold bg-red-50'
                        : 'text-gray-600 hover:text-red-700'
                    }`}
                  >
                    {isAr && cat.name_ar ? cat.name_ar : cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header + Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t(lang, 'products.title')}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalCount} {t(lang, 'products.results')}
              </p>
            </div>
            <div className="flex-1" />
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t(lang, 'search.placeholder')}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
                />
              </div>
              <Button type="submit" className="bg-red-700 hover:bg-red-800 text-white">
                {t(lang, 'search.button')}
              </Button>
            </form>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.brandSlug || filters.categorySlug || filters.featured) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  {t(lang, 'search.label')}: {filters.search}
                  <Link href={buildUrl({ search: '', page: 1 })}><X className="h-3 w-3" /></Link>
                </Badge>
              )}
              {filters.brandSlug && (
                <Badge variant="secondary" className="gap-1">
                  {t(lang, 'filter.brand')}: {brands.find((b) => b.slug === filters.brandSlug)?.name}
                  <Link href={buildUrl({ brandSlug: '', page: 1 })}><X className="h-3 w-3" /></Link>
                </Badge>
              )}
              {filters.categorySlug && (
                <Badge variant="secondary" className="gap-1">
                  {t(lang, 'filter.category')}: {categories.find((c) => c.slug === filters.categorySlug)?.name}
                  <Link href={buildUrl({ categorySlug: '', page: 1 })}><X className="h-3 w-3" /></Link>
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="gap-1">
                  {t(lang, 'filter.featured')}
                  <Link href={buildUrl({ featured: false, page: 1 })}><X className="h-3 w-3" /></Link>
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">{t(lang, 'products.noResults')}</p>
              <Link href="/products">
                <Button variant="outline" className="mt-4">{t(lang, 'filter.clearAll')}</Button>
              </Link>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🧴</div>
                        )}
                      </div>
                      <div className="p-3">
                        {product.brand && (
                          <p className="text-xs text-red-700 font-semibold mb-0.5 uppercase tracking-wide">
                            {product.brand.name}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-2">
                          {isAr && product.name_ar ? product.name_ar : product.name}
                        </p>
                        <div className="flex items-center justify-between">
                          {product.price && (
                            <span className="text-red-700 font-bold text-sm">{product.price.toFixed(2)} SAR</span>
                          )}
                          <StockStatusBadge status={product.stock_status} isAr={isAr} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Link href={buildUrl({ page: page - 1 })}>
                <Button variant="outline" disabled={page <= 1} size="sm">
                  {t(lang, 'pagination.prev')}
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Link key={pageNum} href={buildUrl({ page: pageNum })}>
                      <Button
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="sm"
                        className={pageNum === page ? 'bg-red-700 hover:bg-red-800 text-white' : ''}
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  )
                })}
              </div>
              <Link href={buildUrl({ page: page + 1 })}>
                <Button variant="outline" disabled={page >= totalPages} size="sm">
                  {t(lang, 'pagination.next')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
