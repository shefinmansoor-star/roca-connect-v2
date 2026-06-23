'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StaggerGrid, StaggerItem, AnimateIn } from '@/components/ui/AnimateIn'
import { StockStatusBadge } from '@/components/ui/StatusBadge'
import AddToCartButton from './AddToCartButton'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Brand, Category, Product } from '@/types/database'

interface ProductDetailClientProps {
  product: Product & { brand: Brand | null; category: Category | null }
  related: (Product & { brand: Brand | null })[]
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const { lang, isAr } = useLang()

  const displayName = isAr && product.name_ar ? product.name_ar : product.name

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-700 transition-colors">{t(lang, 'nav.home')}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-red-700 transition-colors">{t(lang, 'nav.products')}</Link>
        {product.brand && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/products?brand=${product.brand.slug}`} className="hover:text-red-700 transition-colors">
              {product.brand.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{displayName}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <AnimateIn direction="left">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100">
            {product.image_url ? (
              <motion.div whileHover={{ scale: 1.04 }} className="w-full h-full relative">
                <Image
                  src={product.image_url}
                  alt={displayName}
                  fill
                  className="object-contain p-8"
                  priority
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🧴</div>
            )}
          </div>
        </AnimateIn>

        {/* Info */}
        <AnimateIn direction="right">
          <div className="flex flex-col gap-4">
            {/* Brand + Status */}
            <div className="flex items-center justify-between">
              {product.brand && (
                <Link href={`/products?brand=${product.brand.slug}`}>
                  <span className="text-red-700 font-bold text-sm uppercase tracking-widest hover:text-red-800 transition-colors">
                    {product.brand.name}
                  </span>
                </Link>
              )}
              <StockStatusBadge status={product.stock_status} isAr={isAr} />
            </div>

            {/* Name */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {displayName}
              </h1>
              {product.name_ar && !isAr && (
                <p className="text-gray-500 text-sm mt-1" dir="rtl">{product.name_ar}</p>
              )}
            </div>

            {/* Price */}
            {product.price && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-700">{product.price.toFixed(2)}</span>
                <span className="text-gray-500 font-medium">SAR</span>
              </div>
            )}

            <Separator />

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {product.product_code && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{t(lang, 'product.code')}</p>
                  <p className="font-semibold text-gray-900 text-sm">{product.product_code}</p>
                </div>
              )}
              {product.packing && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{t(lang, 'product.packing')}</p>
                  <p className="font-semibold text-gray-900 text-sm">{product.packing}</p>
                </div>
              )}
              {product.dilution && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{t(lang, 'product.dilution')}</p>
                  <p className="font-semibold text-gray-900 text-sm">{product.dilution}</p>
                </div>
              )}
              {product.moq && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">{t(lang, 'product.moq')}</p>
                  <p className="font-semibold text-gray-900 text-sm">{product.moq}</p>
                </div>
              )}
              {product.barcode && (
                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-gray-500 mb-0.5">{t(lang, 'product.barcode')}</p>
                  <p className="font-semibold text-gray-900 text-sm font-mono">{product.barcode}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Add to Cart */}
            <AddToCartButton product={product} />
          </div>
        </AnimateIn>
      </div>

      {/* Description + Usage */}
      {(product.description || product.usage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {product.description && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-gray-900 mb-3">{t(lang, 'product.description')}</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
              </CardContent>
            </Card>
          )}
          {product.usage && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold text-gray-900 mb-3">{t(lang, 'product.usage')}</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.usage}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t(lang, 'product.related')}</h2>
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((rel) => (
              <StaggerItem key={rel.id}>
                <Link href={`/products/${rel.slug}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      {rel.image_url ? (
                        <Image
                          src={rel.image_url}
                          alt={rel.name}
                          fill
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🧴</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">
                        {isAr && rel.name_ar ? rel.name_ar : rel.name}
                      </p>
                      {rel.price && (
                        <p className="text-red-700 font-bold text-sm">{rel.price.toFixed(2)} SAR</p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      )}
    </div>
  )
}
