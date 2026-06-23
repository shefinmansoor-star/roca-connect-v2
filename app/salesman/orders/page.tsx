import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Order, Profile } from '@/types/database'

const STATUS_COLORS: Record<string, string> = {
  new_order: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  quotation_sent: 'bg-purple-100 text-purple-800',
  payment_pending: 'bg-orange-100 text-orange-800',
  ready_for_delivery: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default async function SalesmanOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as { data: { role: string } | null; error: unknown }
  if (!profile || !['salesman', 'admin'].includes(profile.role)) redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, customer:profiles!customer_id(full_name, company_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">All Orders ({orders?.length ?? 0})</h1>
      <div className="space-y-3">
        {orders?.map((order: Order & { customer?: Profile }) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-gray-900">{order.order_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {order.customer?.full_name ?? 'Unknown'} · {order.customer?.company_name ?? ''}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  {order.total_amount && (
                    <span className="font-bold text-gray-900">SAR {order.total_amount.toFixed(2)}</span>
                  )}
                  <Link href={`/salesman/orders/${order.id}`}
                    className="text-sm text-red-700 font-semibold hover:underline">
                    View →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!orders || orders.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No orders yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
