import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [totalOrdersRes, newOrdersRes, customersRes, revenueRes, recentOrdersRes] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'new_order'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('total_amount').not('total_amount', 'is', null),
    supabase
      .from('orders')
      .select('*, customer:profiles(full_name, company_name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const totalRevenue = (revenueRes.data ?? []).reduce(
    (sum, o) => sum + (o.total_amount ?? 0),
    0
  )

  return (
    <AdminDashboardClient
      stats={{
        totalOrders: totalOrdersRes.count ?? 0,
        newOrders: newOrdersRes.count ?? 0,
        totalCustomers: customersRes.count ?? 0,
        totalRevenue,
      }}
      recentOrders={recentOrdersRes.data ?? []}
    />
  )
}
