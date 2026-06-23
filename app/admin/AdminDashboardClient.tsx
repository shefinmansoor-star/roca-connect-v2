'use client'

import Link from 'next/link'
import { ShoppingCart, Clock, Users, DollarSign, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatusBadge } from '@/components/ui/StatusBadge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import type { Order, Profile } from '@/types/database'

interface AdminDashboardClientProps {
  stats: {
    totalOrders: number
    newOrders: number
    totalCustomers: number
    totalRevenue: number
  }
  recentOrders: (Order & { customer: Pick<Profile, 'full_name' | 'company_name'> | null })[]
}

const statCards = (stats: AdminDashboardClientProps['stats'], lang: Parameters<typeof t>[0], isAr: boolean) => [
  {
    title: t(lang, 'admin.stat.totalOrders'),
    value: stats.totalOrders,
    icon: ShoppingCart,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: t(lang, 'admin.stat.pending'),
    value: stats.newOrders,
    icon: Clock,
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    title: t(lang, 'admin.stat.customers'),
    value: stats.totalCustomers,
    icon: Users,
    color: 'bg-green-50 text-green-600',
  },
  {
    title: t(lang, 'admin.stat.revenue'),
    value: `${stats.totalRevenue.toFixed(0)} SAR`,
    icon: DollarSign,
    color: 'bg-red-50 text-red-600',
  },
]

export default function AdminDashboardClient({ stats, recentOrders }: AdminDashboardClientProps) {
  const { lang, isAr } = useLang()
  const cards = statCards(stats, lang, isAr)

  return (
    <div className="p-6 max-w-7xl" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t(lang, 'admin.dashboard')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t(lang, 'admin.dashboardDesc')}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                  <div className={`p-2 rounded-xl ${card.color}`}>
                    <card.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t(lang, 'admin.recentOrders')}</CardTitle>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="gap-1">
              {t(lang, 'admin.viewAll')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t(lang, 'orders.orderNumber')}</TableHead>
                <TableHead>{t(lang, 'admin.customer')}</TableHead>
                <TableHead>{t(lang, 'admin.date')}</TableHead>
                <TableHead>{t(lang, 'admin.status')}</TableHead>
                <TableHead className="text-right">{t(lang, 'orders.total')}</TableHead>
                <TableHead>{t(lang, 'admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
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
                  <TableCell>
                    <OrderStatusBadge status={order.status} isAr={isAr} />
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm">
                    {order.total_amount ? `${order.total_amount.toFixed(2)} SAR` : '-'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`}>
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
