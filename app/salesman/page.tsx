import { createClient } from '@/lib/supabase/server'
import SalesmanDashboardClient from './SalesmanDashboardClient'

export default async function SalesmanDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  // If admin show all, if salesman show their orders
  const baseQuery = supabase
    .from('orders')
    .select('*, customer:profiles(full_name, company_name)')
    .order('created_at', { ascending: false })

  const { data: orders } = profile?.role === 'admin'
    ? await baseQuery
    : await baseQuery.eq('salesman_id', user!.id)

  const allOrders = orders ?? []
  const newOrders = allOrders.filter((o) => o.status === 'new_order').length
  const thisMonth = allOrders.filter((o) => {
    const d = new Date(o.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <SalesmanDashboardClient
      orders={allOrders}
      stats={{ total: allOrders.length, pending: newOrders, thisMonth }}
    />
  )
}
