import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrdersClient from './OrdersClient'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/orders')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(count)')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  return <OrdersClient orders={orders ?? []} />
}
