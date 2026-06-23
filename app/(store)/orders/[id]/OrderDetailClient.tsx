'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatusBadge } from '@/components/ui/StatusBadge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Order, OrderItem, OrderFollowup, Product, Profile } from '@/types/database'

const ORDER_STEPS: Array<{ key: string; labelEn: string; labelAr: string }> = [
  { key: 'new_order', labelEn: 'New Order', labelAr: 'طلب جديد' },
  { key: 'under_review', labelEn: 'Under Review', labelAr: 'قيد المراجعة' },
  { key: 'confirmed', labelEn: 'Confirmed', labelAr: 'مؤكد' },
  { key: 'quotation_sent', labelEn: 'Quotation Sent', labelAr: 'تم إرسال العرض' },
  { key: 'payment_pending', labelEn: 'Payment', labelAr: 'الدفع' },
  { key: 'ready_for_delivery', labelEn: 'Ready', labelAr: 'جاهز للتسليم' },
  { key: 'delivered', labelEn: 'Delivered', labelAr: 'تم التسليم' },
]

interface OrderDetailClientProps {
  order: Order & {
    order_items: (OrderItem & { product: Product | null })[]
    order_followups: (OrderFollowup & { author: Pick<Profile, 'full_name' | 'role'> | null })[]
  }
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const { lang, isAr } = useLang()
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === '1'

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Success Banner */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">
              {isAr ? 'تم إرسال طلبك بنجاح!' : 'Your order has been submitted successfully!'}
            </p>
            <p className="text-sm text-green-600">
              {isAr ? 'سنتواصل معك قريباً.' : 'Our team will review it and get back to you shortly.'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t(lang, 'orders.orderNumber')}</p>
              <h1 className="text-xl font-bold text-gray-900">
                #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} isAr={isAr} />
          </div>
        </CardContent>
      </Card>

      {/* Progress Stepper */}
      {!isCancelled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t(lang, 'orders.progress')}</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center gap-0">
              {ORDER_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                const isLast = index === ORDER_STEPS.length - 1

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          isCompleted
                            ? 'bg-red-700 border-red-700 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-red-700/20' : ''}`}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <span className={`text-xs text-center leading-tight max-w-[60px] ${
                        isCompleted ? 'text-red-700 font-medium' : 'text-gray-400'
                      }`}>
                        {isAr ? step.labelAr : step.labelEn}
                      </span>
                    </div>
                    {!isLast && (
                      <div className={`h-0.5 flex-1 transition-all ${
                        index < currentStepIndex ? 'bg-red-700' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t(lang, 'orders.items')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(lang, 'product.name')}</TableHead>
                <TableHead>{t(lang, 'product.code')}</TableHead>
                <TableHead className="text-center">{t(lang, 'orders.qty')}</TableHead>
                <TableHead className="text-right">{t(lang, 'orders.unitPrice')}</TableHead>
                <TableHead className="text-right">{t(lang, 'orders.total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items.map((item) => {
                const name = isAr && item.product?.name_ar ? item.product.name_ar : (item.product?.name ?? '-')
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell className="text-gray-500 font-mono text-xs">{item.product?.product_code ?? '-'}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unit_price?.toFixed(2) ?? '-'}</TableCell>
                    <TableCell className="text-right font-semibold text-red-700">
                      {item.total_price?.toFixed(2) ?? '-'} SAR
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {order.total_amount && (
            <div className="flex justify-end p-4 border-t">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">{t(lang, 'cart.total')}:</span>
                <span className="text-xl font-bold text-red-700">{order.total_amount.toFixed(2)} SAR</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t(lang, 'cart.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm leading-relaxed">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Followups */}
      {order.order_followups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t(lang, 'orders.updates')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.order_followups.map((followup) => {
              const isStaff = followup.author?.role === 'admin' || followup.author?.role === 'salesman'
              return (
                <div
                  key={followup.id}
                  className={`flex gap-3 ${isStaff ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                      isStaff
                        ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                        : 'bg-red-700 text-white rounded-tr-sm'
                    }`}
                  >
                    {isStaff && (
                      <p className="text-xs font-semibold mb-1 text-red-700">{followup.author?.full_name ?? 'Staff'}</p>
                    )}
                    <p>{followup.message}</p>
                    <p className={`text-xs mt-1 ${isStaff ? 'text-gray-400' : 'text-red-200'}`}>
                      {new Date(followup.created_at).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-start">
        <Link href="/orders">
          <button className="text-sm text-gray-500 hover:text-red-700 transition-colors">
            ← {t(lang, 'orders.backToOrders')}
          </button>
        </Link>
      </div>
    </div>
  )
}
