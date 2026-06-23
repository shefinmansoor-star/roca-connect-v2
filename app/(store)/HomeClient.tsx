'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Truck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StaggerGrid, StaggerItem, FadeSlide } from '@/components/ui/AnimateIn'
import { StockStatusBadge } from '@/components/ui/StatusBadge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Brand, Category, Product } from '@/types/database'

interface HomeClientProps {
  brands: Brand[]
  categories: Category[]
  featured: (Product & { brand: Brand | null; category: Category | null })[]
}

const categoryIcons: Record<string, string> = {
  default: '🧴',
  shampoo: '🫧',
  wax: '✨',
  polish: '💫',
  interior: '🪑',
  tire: '🔵',
  engine: '⚙️',
  detailing: '🧽',
}

const features = [
  { icon: Sparkles, key: 'home.feature.premium' },
  { icon: ShieldCheck, key: 'home.feature.certified' },
  { icon: Truck, key: 'home.feature.delivery' },
]

export default function HomeClient({ brands, categories, featured }: HomeClientProps) {
  const { lang, isAr } = useLang()

  return (
    <div dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative min-h-[600px] bg-gradient-to-br from-gray-900 via-gray-900 to-red-950 flex items-center overflow-hidden">
        {/* Animated blobs */}
        <motion.div
          className="absolute top-16 left-1/4 w-64 h-64 rounded-full bg-red-700/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-8 right-1/4 w-96 h-96 rounded-full bg-red-900/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <FadeSlide delay={0.1}>
              <span className="inline-flex items-center gap-2 bg-red-700/20 border border-red-700/30 text-red-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                {t(lang, 'home.hero.badge')}
              </span>
            </FadeSlide>

            <FadeSlide delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {t(lang, 'home.hero.title')}
                <span className="text-red-400 block mt-1">{t(lang, 'home.hero.titleAccent')}</span>
              </h1>
            </FadeSlide>

            <FadeSlide delay={0.35}>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                {t(lang, 'home.hero.description')}
              </p>
            </FadeSlide>

            <FadeSlide delay={0.5}>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/products">
                  <Button size="lg" className="bg-red-700 hover:bg-red-600 text-white gap-2 px-7 text-base">
                    {t(lang, 'home.hero.cta')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-7 text-base bg-transparent"
                  >
                    {t(lang, 'home.hero.register')}
                  </Button>
                </Link>
              </div>
            </FadeSlide>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-red-700 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white">
            {features.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center justify-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm sm:text-base">{t(lang, key as Parameters<typeof t>[1])}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t(lang, 'home.categories.title')}</h2>
              <p className="text-gray-500">{t(lang, 'home.categories.subtitle')}</p>
            </div>
            <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <StaggerItem key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 cursor-pointer hover:border-red-200 hover:shadow-md transition-all"
                    >
                      <div className="text-4xl mb-3">
                        {categoryIcons[cat.slug ?? 'default'] ?? categoryIcons.default}
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {isAr && cat.name_ar ? cat.name_ar : cat.name}
                      </p>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{t(lang, 'home.featured.title')}</h2>
                <p className="text-gray-500">{t(lang, 'home.featured.subtitle')}</p>
              </div>
              <Link href="/products?featured=true" className="hidden sm:block">
                <Button variant="outline" className="gap-2">
                  {t(lang, 'home.featured.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <StaggerItem key={product.id}>
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">🧴</div>
                        )}
                      </div>
                      <div className="p-4">
                        {product.brand && (
                          <p className="text-xs text-red-700 font-semibold uppercase tracking-wide mb-1">
                            {product.brand.name}
                          </p>
                        )}
                        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
                          {isAr && product.name_ar ? product.name_ar : product.name}
                        </p>
                        <div className="flex items-center justify-between">
                          {product.price && (
                            <span className="text-red-700 font-bold text-sm">
                              {product.price.toFixed(2)} SAR
                            </span>
                          )}
                          <StockStatusBadge status={product.stock_status} isAr={isAr} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t(lang, 'home.brands.title')}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/products?brand=${brand.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <span className="font-semibold text-gray-700 text-sm">
                      {isAr && brand.name_ar ? brand.name_ar : brand.name}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-red-950 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
          style={{ background: 'radial-gradient(circle at 30% 50%, #b91c1c 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <FadeSlide>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t(lang, 'home.cta.title')}</h2>
            <p className="text-gray-300 text-lg mb-8">{t(lang, 'home.cta.description')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-red-700 hover:bg-red-600 text-white px-8">
                  {t(lang, 'home.cta.register')}
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 bg-transparent">
                  {t(lang, 'home.cta.browse')}
                </Button>
              </Link>
            </div>
          </FadeSlide>
        </div>
      </section>
    </div>
  )
}
