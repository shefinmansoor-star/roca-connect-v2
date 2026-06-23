'use client'

import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from '@/components/ui/StatusBadge'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Order } from '@/types/database'

interface OrdersClientProps {
  orders: (Order & { order_items: { count: number }[] })[]
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  const { lang, isAr } = useLang()

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" dir={isAr ? 'rtl' : 'ltr'}>
        <Package className="h-20 w-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t(lang, 'orders.empty')}</h1>
        <p className="text-gray-500 mb-8">{t(lang, 'orders.emptyDesc')}</p>
        <Link href="/products">
          <Button className="bg-red-700 hover:bg-red-800 text-white">
            {t(lang, 'cart.continueShopping')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir={isAr ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t(lang, 'orders.title')}</h1>
      <div className="space-y-4">
        {orders.map((order, i) => {
          const itemCount = order.order_items?.[0]?.count ?? 0
          return (
            <AnimateIn key={order.id} delay={i * 0.05}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {t(lang, 'orders.orderNumber')} #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                          {' · '}
                          {itemCount} {t(lang, 'orders.items')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} isAr={isAr} />
                      {order.total_amount && (
                        <span className="font-bold text-red-700">{order.total_amount.toFixed(2)} SAR</span>
                      )}
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          {t(lang, 'orders.viewDetails')}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          )
        })}
      </div>
    </div>
  )
}
