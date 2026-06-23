'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatusBadge } from '@/components/ui/StatusBadge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Order, Profile, OrderStatus } from '@/types/database'

const ALL_STATUSES: OrderStatus[] = [
  'new_order', 'under_review', 'confirmed', 'quotation_sent',
  'payment_pending', 'ready_for_delivery', 'delivered', 'cancelled',
]

const STATUS_LABELS: Record<OrderStatus, { en: string; ar: string }> = {
  new_order: { en: 'New Order', ar: 'طلب جديد' },
  under_review: { en: 'Under Review', ar: 'قيد المراجعة' },
  confirmed: { en: 'Confirmed', ar: 'مؤكد' },
  quotation_sent: { en: 'Quotation Sent', ar: 'تم إرسال العرض' },
  payment_pending: { en: 'Payment Pending', ar: 'في انتظار الدفع' },
  ready_for_delivery: { en: 'Ready for Delivery', ar: 'جاهز للتسليم' },
  delivered: { en: 'Delivered', ar: 'تم التسليم' },
  cancelled: { en: 'Cancelled', ar: 'ملغى' },
}

interface AdminOrdersClientProps {
  orders: (Order & { customer: Pick<Profile, 'full_name' | 'company_name' | 'email'> | null })[]
}

export default function AdminOrdersClient({ orders }: AdminOrdersClientProps) {
  const { lang, isAr } = useLang()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus)

  return (
    <div className="p-6 max-w-7xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t(lang, 'admin.orders')}</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} {isAr ? 'طلب' : 'orders'}</p>
        </div>
        <div className="w-48">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? 'all')}>
            <SelectTrigger>
              <SelectValue placeholder={isAr ? 'تصفية حسب الحالة' : 'Filter by status'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isAr ? 'الكل' : 'All'}</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {isAr ? STATUS_LABELS[s].ar : STATUS_LABELS[s].en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(lang, 'orders.orderNumber')}</TableHead>
                <TableHead>{t(lang, 'admin.customer')}</TableHead>
                <TableHead>{isAr ? 'الشركة' : 'Company'}</TableHead>
                <TableHead>{t(lang, 'admin.date')}</TableHead>
                <TableHead>{t(lang, 'admin.status')}</TableHead>
                <TableHead className="text-right">{isAr ? 'المبلغ' : 'Amount'}</TableHead>
                <TableHead>{t(lang, 'admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    {isAr ? 'لا توجد طلبات' : 'No orders found'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{order.customer?.full_name ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{order.customer?.company_name ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                    </TableCell>
                    <TableCell><OrderStatusBadge status={order.status} isAr={isAr} /></TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {order.total_amount ? `${order.total_amount.toFixed(2)} SAR` : '-'}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">{t(lang, 'orders.viewDetails')}</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
