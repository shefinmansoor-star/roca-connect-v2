'use client'

import Link from 'next/link'
import { ShoppingCart, Clock, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatusBadge } from '@/components/ui/StatusBadge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Order, Profile } from '@/types/database'

interface SalesmanDashboardClientProps {
  orders: (Order & { customer: Pick<Profile, 'full_name' | 'company_name'> | null })[]
  stats: { total: number; pending: number; thisMonth: number }
}

export default function SalesmanDashboardClient({ orders, stats }: SalesmanDashboardClientProps) {
  const { lang, isAr } = useLang()

  const statCards = [
    { title: isAr ? 'إجمالي الطلبات' : 'My Orders', value: stats.total, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { title: isAr ? 'قيد الانتظار' : 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { title: isAr ? 'هذا الشهر' : 'This Month', value: stats.thisMonth, icon: Calendar, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="p-6 max-w-7xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'لوحة المبيعات' : 'Sales Dashboard'}</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <div className={`p-2 rounded-xl ${card.color}`}><card.icon className="h-4 w-4" /></div>
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{isAr ? 'الطلبات' : 'Orders'}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(lang, 'orders.orderNumber')}</TableHead>
                <TableHead>{t(lang, 'admin.customer')}</TableHead>
                <TableHead>{t(lang, 'admin.date')}</TableHead>
                <TableHead>{t(lang, 'admin.status')}</TableHead>
                <TableHead className="text-right">{isAr ? 'المبلغ' : 'Amount'}</TableHead>
                <TableHead>{t(lang, 'admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-semibold">
                    #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{order.customer?.full_name ?? '-'}</p>
                    <p className="text-xs text-gray-500">{order.customer?.company_name ?? ''}</p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                  </TableCell>
                  <TableCell><OrderStatusBadge status={order.status} isAr={isAr} /></TableCell>
                  <TableCell className="text-right font-semibold text-sm">
                    {order.total_amount ? `${order.total_amount.toFixed(2)} SAR` : '-'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/salesman/orders/${order.id}`}>
                      <Button variant="outline" size="sm">{t(lang, 'orders.viewDetails')}</Button>
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
