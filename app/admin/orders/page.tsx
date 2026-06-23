import { createClient } from '@/lib/supabase/server'
import AdminOrdersClient from './AdminOrdersClient'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, customer:profiles(full_name, company_name, email)')
    .order('created_at', { ascending: false })

  return <AdminOrdersClient orders={orders ?? []} />
}
