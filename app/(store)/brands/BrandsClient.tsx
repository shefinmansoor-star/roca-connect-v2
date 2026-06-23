'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { StaggerGrid, StaggerItem, AnimateIn } from '@/components/ui/AnimateIn'
import type { Brand } from '@/types/database'

const BRAND_ICONS: Record<string, string> = {
  labocosmetica: '🇮🇹', mafra: '🇮🇹', meguiars: '🇺🇸', sonax: '🇩🇪',
  roca: '🇸🇦', detroit: '🇺🇸', 'q-range': '🌍', ezi: '🌍',
}

export default function BrandsClient({ brands }: { brands: Brand[] }) {
  const { lang, isAr } = useLang()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimateIn className="mb-10">
        <h1 className="text-3xl font-black text-gray-900">{t(lang, 'brands_title')}</h1>
        <p className="text-gray-500 mt-2">{t(lang, 'brands_sub')}</p>
        <div className="h-1 w-12 bg-red-700 rounded-full mt-3" />
      </AnimateIn>

      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map(brand => (
          <StaggerItem key={brand.id}>
            <Link href={`/products?brand=${brand.slug}`}>
              <Card className="hover:shadow-lg hover:border-red-200 hover:-translate-y-1 transition-all duration-200 group cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-red-100 transition-colors flex-shrink-0">
                      {BRAND_ICONS[brand.slug] ?? '🏷️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-black text-gray-900 group-hover:text-red-700 transition-colors">
                        {isAr && brand.name_ar ? brand.name_ar : brand.name}
                      </h2>
                      {brand.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{brand.description}</p>
                      )}
                      <div className="mt-3 flex items-center text-sm text-red-700 font-semibold gap-1 group-hover:gap-2 transition-all">
                        {t(lang, 'brands_browse')} <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>

      {brands.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-lg">No brands available yet.</p>
        </div>
      )}
    </div>
  )
}
