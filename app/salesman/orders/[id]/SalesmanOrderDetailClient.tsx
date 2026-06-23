'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { OrderStatusBadge } from '@/components/ui/StatusBadge'
import { useLang } from '@/context/LanguageContext'
import { t } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Order, OrderItem, OrderFollowup, Product, Profile, OrderStatus } from '@/types/database'

// Salesman can only move through limited status transitions
const SALESMAN_STATUSES: OrderStatus[] = [
  'new_order', 'under_review', 'confirmed', 'quotation_sent',
  'payment_pending', 'ready_for_delivery', 'delivered', 'cancelled',
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  new_order: 'New Order', under_review: 'Under Review', confirmed: 'Confirmed',
  quotation_sent: 'Quotation Sent', payment_pending: 'Payment Pending',
  ready_for_delivery: 'Ready for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
}

interface SalesmanOrderDetailClientProps {
  order: Order & {
    customer: Pick<Profile, 'id' | 'full_name' | 'company_name' | 'email' | 'phone' | 'city'> | null
    order_items: (OrderItem & { product: Product | null })[]
    order_followups: (OrderFollowup & { author: Pick<Profile, 'full_name' | 'role'> | null })[]
  }
}

export default function SalesmanOrderDetailClient({ order }: SalesmanOrderDetailClientProps) {
  const { lang, isAr } = useLang()
  const supabase = createClient()

  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [savingStatus, setSavingStatus] = useState(false)
  const [message, setMessage] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [followups, setFollowups] = useState(order.order_followups)

  const handleSaveStatus = async () => {
    setSavingStatus(true)
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', order.id)
      if (error) throw error
      toast.success(isAr ? 'تم تحديث الحالة' : 'Status updated')
    } catch {
      toast.error(isAr ? 'فشل التحديث' : 'Update failed')
    } finally {
      setSavingStatus(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    setSendingMsg(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('order_followups')
        .insert({ order_id: order.id, author_id: user!.id, message: message.trim() })
        .select('*, author:profiles(full_name, role)')
        .single()
      if (error) throw error
      setFollowups((prev) => [...prev, data])
      setMessage('')
      toast.success(isAr ? 'تم الإرسال' : 'Sent')
    } catch {
      toast.error(isAr ? 'فشل الإرسال' : 'Failed')
    } finally {
      setSendingMsg(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t(lang, 'orders.orderNumber')} #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(order.created_at).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
          </p>
        </div>
        <OrderStatusBadge status={order.status} isAr={isAr} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t(lang, 'admin.customer')}</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-semibold">{order.customer?.full_name ?? '-'}</p>
            <p className="text-gray-500">{order.customer?.company_name ?? ''}</p>
            <p className="text-gray-500">{order.customer?.phone ?? ''}</p>
            <p className="text-gray-500">{order.customer?.city ?? ''}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">{isAr ? 'تحديث الحالة' : 'Update Status'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SALESMAN_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSaveStatus} disabled={savingStatus} className="w-full bg-red-700 hover:bg-red-800 text-white gap-2">
              <Save className="h-4 w-4" />
              {savingStatus ? '...' : (isAr ? 'حفظ' : 'Save')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t(lang, 'orders.items')}</CardTitle></CardHeader>
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
              {order.order_items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {isAr && item.product?.name_ar ? item.product.name_ar : (item.product?.name ?? '-')}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{item.product?.product_code ?? '-'}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.unit_price?.toFixed(2) ?? '-'}</TableCell>
                  <TableCell className="text-right font-semibold">{item.total_price?.toFixed(2) ?? '-'} SAR</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">{t(lang, 'orders.updates')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {followups.map((fu) => {
              const isStaff = fu.author?.role === 'admin' || fu.author?.role === 'salesman'
              return (
                <div key={fu.id} className={`flex gap-2 ${isStaff ? '' : 'flex-row-reverse'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${isStaff ? 'bg-gray-100' : 'bg-red-50'}`}>
                    <p className="text-xs font-semibold text-red-700 mb-0.5">{fu.author?.full_name}</p>
                    <p>{fu.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(fu.created_at).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <Separator />
          <div className="flex gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isAr ? 'اكتب رسالة...' : 'Type a message...'}
              rows={2}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700"
            />
            <Button onClick={handleSendMessage} disabled={sendingMsg || !message.trim()} className="bg-red-700 hover:bg-red-800 text-white px-4">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Link href="/salesman">
        <button className="text-sm text-gray-500 hover:text-red-700 transition-colors">
          ← {isAr ? 'العودة' : 'Back'}
        </button>
      </Link>
    </div>
  )
}
